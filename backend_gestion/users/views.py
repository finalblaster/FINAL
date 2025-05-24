from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.utils import translation
from django.utils.translation import gettext as _
import logging
from django.contrib.auth import get_user_model, authenticate
from djoser.email import ActivationEmail
from djoser.views import UserViewSet
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.urls import path
from djoser import signals
from djoser.views import UserViewSet
from rest_framework.decorators import action
from djoser.serializers import SendEmailResetSerializer
from users.email import TEMP_USER_LANGUAGES, PasswordResetEmail, CustomPasswordChangedConfirmationEmail
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from bs4 import BeautifulSoup
import re

User = get_user_model()
logger = logging.getLogger(__name__)

def extract_subject_from_html(html_content):
    """
    Extrait le sujet de l'email à partir du contenu HTML.
    """
    try:
        # Rechercher d'abord dans la balise title
        title_match = re.search(r'<title>(.*?)</title>', html_content, re.DOTALL)
        if title_match:
            subject_text = title_match.group(1).strip()
            logger.debug(f"Sujet trouvé dans la balise title: {subject_text}")
            return subject_text
        
        # Fallback: rechercher dans le bloc subject
        subject_match = re.search(r'{%\s*block\s+subject\s*%}(.*?){%\s*endblock\s+subject\s*%}', html_content, re.DOTALL)
        if subject_match:
            subject_text = subject_match.group(1).strip()
            subject_text = subject_text.replace("{{ site_name }}", settings.SITE_NAME)
            logger.debug(f"Sujet trouvé dans le bloc subject: {subject_text}")
            return subject_text
        
        logger.debug("Aucun sujet trouvé dans le template, utilisation du sujet par défaut")
        return f"{settings.SITE_NAME} - {_('Confirmez le changement de votre adresse email')}"
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction du sujet: {str(e)}")
        return f"{settings.SITE_NAME} - {_('Confirmez le changement de votre adresse email')}"

class CustomUserViewSet(UserViewSet):
    """
    Vue personnalisée qui étend la vue UserViewSet de Djoser
    pour inclure la gestion de la langue lors de l'enregistrement
    """
    def __init__(self, *args, **kwargs):
        logger.debug("=== INITIALISATION DE CustomUserViewSet ===")
        super().__init__(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        logger.debug("CustomUserViewSet.create appelé")
        
        # Extraire la langue de la requête
        language = None
        
        # 1. Vérifier dans les données POST
        if 'language' in request.data:
            language = request.data.get('language')
            logger.debug("CustomUserViewSet: langue fournie dans les données: {}".format(language))
            
        # 2. Vérifier dans l'en-tête HTTP
        elif 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip()
            logger.debug("CustomUserViewSet: langue détectée dans l'en-tête HTTP: {}".format(language))
        
        # Normaliser et valider la langue
        if language:
            language = language.lower()[:2]
            supported_languages = ['fr', 'en', 'es', 'de']
            if language not in supported_languages:
                logger.debug("CustomUserViewSet: langue non supportée ({}). Utilisation de la langue par défaut.".format(language))
                language = 'fr'  # Langue par défaut
            
            # Stocker la langue dans la requête pour y accéder plus tard
            setattr(request, '_user_language', language)
            logger.debug("CustomUserViewSet: langue {} attachée à la requête".format(language))
            
            # Activer la langue pour la durée de cette requête
            translation.activate(language)
            request.LANGUAGE_CODE = language
            
        # Appeler la méthode create originale
        response = super().create(request, *args, **kwargs)
        
        # Ajouter la langue aux données de réponse
        if language and response.status_code == 201 and hasattr(response, 'data'):
            response.data['language'] = language
            
        return response
        
    @action(["post"], detail=False)
    def reset_password(self, request, *args, **kwargs):
        """
        Vue personnalisée pour la réinitialisation de mot de passe
        qui ajoute explicitement la langue au dictionnaire temporaire
        """
        logger.debug("CustomUserViewSet.reset_password appelé")
        
        # Détermine et normalise la langue
        language = None
        
        # 1. Essayer de récupérer language du corps de la requête
        if 'language' in request.data:
            language = request.data.get('language')
            logger.debug("CustomUserViewSet.reset_password: langue trouvée dans les données: {}".format(language))
        
        # 2. Sinon, essayer l'en-tête HTTP Accept-Language
        elif 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip()
            logger.debug("CustomUserViewSet.reset_password: langue détectée dans l'en-tête HTTP: {}".format(language))
        
        # Normaliser et valider la langue
        if language:
            language = language.lower()[:2]
            supported_languages = ['fr', 'en', 'es', 'de']
            if language not in supported_languages:
                logger.debug("CustomUserViewSet.reset_password: langue non supportée ({}). Utilisation de la langue par défaut.".format(language))
                language = 'fr'
        else:
            language = 'fr'
        
        logger.debug("CustomUserViewSet.reset_password: langue finale: {}".format(language))
        
        # Stocker la langue dans la requête
        setattr(request, '_user_language', language)
        
        # Activer explicitement la langue
        translation.activate(language)
        request.LANGUAGE_CODE = language
        
        # Si email est dans les données, stocker la langue pour cet email
        if 'email' in request.data:
            email = request.data.get('email')
            TEMP_USER_LANGUAGES[email] = language
            logger.debug("CustomUserViewSet.reset_password: langue {} stockée pour l'email {}".format(language, email))
        
        # Appeler la méthode reset_password originale
        serializer = SendEmailResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Prépare les données utilisateur et le contexte pour l'email
        user = serializer.get_user()
        
        # Passer explicitement la langue dans le contexte de l'email
        context = {
            'user': user, 
            'user_language': language,
            'request': request,  # Ajouter la requête au contexte
            'current_language': language  # Ajouter un attribut supplémentaire
        }
        
        logger.debug("CustomUserViewSet.reset_password: envoi d'email avec contexte: {}".format(context))
        
        # Créer et envoyer l'email manuellement avec translation override
        with translation.override(language):
            email_instance = PasswordResetEmail(context=context)
            
            # Si user est None, retourner un message de confirmation sans envoyer d'email
            if user is None:
                if 'email' in request.data:
                    logger.debug("CustomUserViewSet.reset_password: utilisateur non trouvé pour {}, retour d'un message de confirmation".format(request.data.get('email')))
                    return Response({
                        "detail": _("Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation de mot de passe.")
                    }, status=200)
                else:
                    logger.error("CustomUserViewSet.reset_password: user est None et pas d'email trouvé dans request.data")
                    return Response({"error": "Email non fourni"}, status=400)
            else:
                email_instance.send(to=[user.email])
                logger.debug("CustomUserViewSet.reset_password: email envoyé avec langue forcée à {}".format(language))
                return Response({
                    "detail": _("Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation de mot de passe.")
                }, status=200)
        
    @action(["post"], detail=False)
    def set_password(self, request, *args, **kwargs):
        """
        Vue personnalisée pour le changement de mot de passe
        qui gère explicitement la langue pour l'email de confirmation
        """
        logger.debug("CustomUserViewSet.set_password appelé")
        
        # Détermine et normalise la langue
        language = None
        
        # 1. Essayer de récupérer language du corps de la requête
        if 'language' in request.data:
            language = request.data.get('language')
            logger.debug("CustomUserViewSet.set_password: langue trouvée dans les données: {}".format(language))
        
        # 2. Sinon, essayer l'en-tête HTTP Accept-Language
        elif 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip()
            logger.debug("CustomUserViewSet.set_password: langue détectée dans l'en-tête HTTP: {}".format(language))
        
        # Normaliser et valider la langue
        if language:
            language = language.lower()[:2]
            supported_languages = ['fr', 'en', 'es', 'de']
            if language not in supported_languages:
                logger.debug("CustomUserViewSet.set_password: langue non supportée ({}). Utilisation de la langue par défaut.".format(language))
                language = 'fr'
        else:
            language = 'fr'
        
        logger.debug("CustomUserViewSet.set_password: langue finale: {}".format(language))
        
        # Stocker la langue dans la requête
        setattr(request, '_user_language', language)
        
        # Activer explicitement la langue
        translation.activate(language)
        request.LANGUAGE_CODE = language
        
        # Stocker la langue pour l'utilisateur authentifié si disponible
        if request.user and request.user.is_authenticated and hasattr(request.user, 'email'):
            TEMP_USER_LANGUAGES[request.user.email] = language
            logger.debug("CustomUserViewSet.set_password: langue {} stockée pour l'email {}".format(language, request.user.email))
        
        # Appeler la méthode set_password originale pour changer le mot de passe
        # L'email sera envoyé par la méthode parente grâce au paramètre PASSWORD_CHANGED_EMAIL_CONFIRMATION
        logger.debug("CustomUserViewSet.set_password: Appel de la méthode parent (le mail sera envoyé par la méthode parent)")
        response = super().set_password(request, *args, **kwargs)
        
        # Ne pas envoyer d'email supplémentaire ici, car la méthode parent le fait déjà
        # avec le paramètre PASSWORD_CHANGED_EMAIL_CONFIRMATION=True
        
        return response

    @action(["post"], detail=False)
    def set_email(self, request, *args, **kwargs):
        """
        Vue personnalisée pour le changement d'email (USERNAME_FIELD)
        avec gestion explicite de la langue et meilleur traitement des erreurs
        """
        logger.debug("=== DÉBUT DU PROCESSUS DE CHANGEMENT D'EMAIL ===")
        logger.debug(f"CustomUserViewSet.set_email appelé avec données: {request.data}")
        logger.debug(f"Headers: {request.headers}")
        logger.debug(f"Method: {request.method}")
        logger.debug(f"User: {request.user}")
        logger.debug(f"Auth: {request.auth}")
        
        # Vérifier l'authentification
        if not request.user.is_authenticated:
            logger.warning("Tentative de changement d'email sans authentification")
            return Response({"detail": "Vous devez être connecté pour changer votre email."}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Récupérer les données du formulaire
        new_email = request.data.get('new_email')
        re_new_email = request.data.get('re_new_email')
        current_password = request.data.get('current_password')
        
        logger.debug(f"Données extraites - Nouvel email: {new_email}, Confirmation: {re_new_email}")
        
        # Valider les données
        if not new_email or not re_new_email or not current_password:
            logger.warning("Tentative de changement d'email avec des données manquantes")
            return Response({"detail": "Tous les champs sont obligatoires."}, status=status.HTTP_400_BAD_REQUEST)
        
        if new_email != re_new_email:
            logger.warning("Tentative de changement d'email avec des emails différents")
            return Response({"detail": "Les deux emails doivent être identiques."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier le mot de passe actuel
        user = request.user
        logger.debug(f"Vérification du mot de passe pour l'utilisateur: {user.email}")
        if not user.check_password(current_password):
            logger.warning(f"Tentative de changement d'email avec un mot de passe incorrect pour l'utilisateur {user.email}")
            return Response({"detail": "Votre mot de passe actuel est incorrect."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Détermine et normalise la langue
        language = None
        logger.debug("=== DÉTECTION DE LA LANGUE ===")
        
        # 1. Essayer de récupérer language du corps de la requête
        if 'language' in request.data:
            language = request.data.get('language')
            logger.debug(f"CustomUserViewSet.set_email: langue fournie dans les données: {language}")
        
        # 2. Sinon, essayer l'en-tête HTTP Accept-Language
        elif 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip()
            logger.debug(f"CustomUserViewSet.set_email: langue détectée dans l'en-tête HTTP: {language}")
        
        # Normaliser et valider la langue
        if language:
            language = language.lower()[:2]
            supported_languages = ['fr', 'en', 'es', 'de']
            if language not in supported_languages:
                logger.debug(f"CustomUserViewSet.set_email: langue non supportée ({language}). Utilisation de la langue par défaut.")
                language = 'fr'
        else:
            language = 'fr'
        
        logger.debug(f"CustomUserViewSet.set_email: langue finale: {language}")
        
        # Stocker l'ancienne adresse email
        old_email = user.email
        logger.debug(f"Ancienne adresse email: {old_email}")
        
        # Vérifier si le nouvel email est déjà utilisé
        if User.objects.filter(email=new_email).exclude(id=user.id).exists():
            logger.warning(f"Tentative de changement d'email vers une adresse déjà utilisée: {new_email}")
            return Response({"detail": "Cette adresse email est déjà utilisée par un autre compte."}, status=status.HTTP_400_BAD_REQUEST)
        
        logger.debug("=== GÉNÉRATION DU TOKEN ===")
        # Générer un token pour la confirmation d'email
        from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
        from django.utils.encoding import force_bytes
        from django.contrib.auth.tokens import default_token_generator
        
        try:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            encoded_email = urlsafe_base64_encode(force_bytes(new_email))
            
            logger.debug(f"Token généré - UID: {uid}, Token: {token}, Encoded Email: {encoded_email}")
            
            # Vérifier que le token est valide immédiatement
            if not default_token_generator.check_token(user, token):
                logger.error("Le token généré n'est pas valide immédiatement")
                return Response({"detail": "Erreur lors de la génération du token de confirmation."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Préparer l'URL de confirmation
            confirmation_url = f"email/activate/{uid}/{token}/{encoded_email}"
            logger.debug(f"URL de confirmation générée: {confirmation_url}")
            
            # Envoyer un email de vérification à la nouvelle adresse
            try:
                logger.debug("=== PRÉPARATION DE L'EMAIL ===")
                from django.core.mail import EmailMessage
                from django.template.loader import render_to_string
                from django.utils.translation import gettext as _
                
                # Définir le contexte pour les templates d'email
                context = {
                    'user': user,
                    'site_name': settings.SITE_NAME,
                    'domain': settings.DOMAIN,
                    'protocol': 'https' if request.is_secure() else 'http',
                    'url': confirmation_url,
                    'current_language': language,
                    'user_language': language,
                    'old_email': old_email,
                    'new_email': new_email
                }
                
                logger.debug(f"Contexte pour l'email: {context}")
                
                # Avec l'override de langue, créer et envoyer l'email de vérification
                with translation.override(language):
                    try:
                        # 1. Email de confirmation à la nouvelle adresse
                        logger.debug("Tentative de rendu du template HTML pour la nouvelle adresse")
                        html_body = render_to_string('email/activation_changement_username.html', context)
                        logger.debug("Template HTML rendu avec succès")
                        
                        subject = extract_subject_from_html(html_body)
                        logger.debug(f"Sujet final de l'email: {subject}")
                        
                        from_email = settings.DEFAULT_FROM_EMAIL
                        logger.debug(f"Email sera envoyé depuis: {from_email}")
                        
                        # Email de confirmation à la nouvelle adresse
                        email = EmailMessage(
                            subject=subject,
                            body=html_body,
                            from_email=from_email,
                            to=[new_email],
                        )
                        email.content_subtype = "html"
                        email.send()
                        logger.info(f"Email de vérification pour changement d'adresse envoyé à {new_email}")
                        
                        # 2. Email d'alerte à l'ancienne adresse
                        alert_context = {
                            'user': user,
                            'site_name': settings.SITE_NAME,
                            'domain': settings.DOMAIN,
                            'protocol': 'https' if request.is_secure() else 'http',
                            'current_language': language,
                            'user_language': language,
                            'old_email': old_email,
                            'new_email': new_email
                        }
                        
                        alert_html = render_to_string('email/username_changed_warning.html', alert_context)
                        alert_subject = extract_subject_from_html(alert_html)
                        logger.debug(f"Sujet de l'alerte: {alert_subject}")
                        
                        alert_email = EmailMessage(
                            subject=alert_subject,
                            body=alert_html,
                            from_email=from_email,
                            to=[old_email],
                        )
                        alert_email.content_subtype = "html"
                        alert_email.send()
                        logger.info(f"Email d'alerte de sécurité envoyé à {old_email}")
                        
                    except Exception as template_error:
                        logger.error(f"Erreur lors du rendu du template: {str(template_error)}", exc_info=True)
                        return Response({"detail": "Erreur lors de la préparation des emails."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                        
            except Exception as e:
                logger.error(f"Erreur lors de l'envoi de l'email de vérification: {str(e)}", exc_info=True)
                return Response({"detail": "Erreur lors de l'envoi de l'email de vérification."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            logger.debug("=== FIN DU PROCESSUS DE CHANGEMENT D'EMAIL ===")
            # Retourner une réponse indiquant que le processus de changement a été initié
            return Response({
                "detail": "Un email de vérification a été envoyé à votre nouvelle adresse. Veuillez cliquer sur le lien dans cet email pour confirmer le changement.",
                "pending_email": new_email
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erreur lors de la génération du token: {str(e)}", exc_info=True)
            return Response({"detail": "Erreur lors de la génération du token de confirmation."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(["post"], detail=False)
    def resend_email_change_confirmation(self, request, *args, **kwargs):
        """
        Vue pour renvoyer l'email de confirmation de changement d'email
        """
        logger.debug("=== DÉBUT DU RENVOI DE L'EMAIL DE CONFIRMATION ===")
        
        # Vérifier l'authentification
        if not request.user.is_authenticated:
            logger.warning("Tentative de renvoi d'email sans authentification")
            return Response({"detail": "Vous devez être connecté pour cette action."}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = request.user
        pending_email = request.data.get('pending_email')
        
        if not pending_email:
            logger.warning("Tentative de renvoi d'email sans adresse email en attente")
            return Response({"detail": "Aucune adresse email en attente de confirmation."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Détermine et normalise la langue
        language = None
        if 'language' in request.data:
            language = request.data.get('language')
        elif 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip()
        
        if language:
            language = language.lower()[:2]
            supported_languages = ['fr', 'en', 'es', 'de']
            if language not in supported_languages:
                language = 'fr'
        else:
            language = 'fr'
        
        # Générer un nouveau token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        encoded_email = urlsafe_base64_encode(force_bytes(pending_email))
        
        # Préparer l'URL de confirmation
        confirmation_url = f"email/activate/{uid}/{token}/{encoded_email}"
        
        # Envoyer l'email de confirmation
        try:
            context = {
                'user': user,
                'site_name': settings.SITE_NAME,
                'domain': settings.DOMAIN,
                'protocol': 'https' if request.is_secure() else 'http',
                'url': confirmation_url,
                'current_language': language,
                'user_language': language,
                'old_email': user.email,
                'new_email': pending_email
            }
            
            with translation.override(language):
                html_body = render_to_string('email/activation_changement_username.html', context)
                subject = extract_subject_from_html(html_body)
                
                email = EmailMessage(
                    subject=subject,
                    body=html_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[pending_email],
                )
                email.content_subtype = "html"
                email.send()
                
                logger.info(f"Email de confirmation renvoyé à {pending_email}")
                return Response({
                    "detail": "Un nouvel email de confirmation a été envoyé.",
                    "pending_email": pending_email
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            logger.error(f"Erreur lors du renvoi de l'email de confirmation: {str(e)}", exc_info=True)
            return Response({"detail": "Erreur lors du renvoi de l'email de confirmation."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Create your views here.
class LanguageMiddleware:
    """
    Middleware pour capturer et stocker la langue dans les requêtes
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Essayer différentes sources pour obtenir la langue
        language = None
        
        # Récupérer tous les en-têtes pour le débogage
        headers = {k: v for k, v in request.META.items() if k.startswith('HTTP_')}
        logger.debug(f"LanguageMiddleware: En-têtes HTTP: {headers}")
        
        # Afficher l'URL et la méthode pour le débogage
        path = request.path_info.strip('/')
        logger.debug(f"LanguageMiddleware: URL appelée: {path}, Méthode: {request.method}")
        
        # 1. Vérifier l'en-tête Accept-Language (priorité la plus haute)
        if 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            # Prendre la première langue spécifiée (avant la virgule ou le point-virgule)
            language = accept_lang.split(',')[0].split(';')[0].strip()
            logger.debug(f"LanguageMiddleware: langue détectée dans l'en-tête HTTP: {language} (brut: {accept_lang})")
        
        # 2. Fallback sur les paramètres de requête
        elif 'lang' in request.GET:
            language = request.GET.get('lang')
            logger.debug(f"LanguageMiddleware: langue détectée dans les paramètres de requête: {language}")
        
        # 3. Fallback sur les données POST
        elif request.method == 'POST' and hasattr(request, 'data') and request.data:
            logger.debug(f"LanguageMiddleware: données POST: {request.data}")
            if 'language' in request.data:
                language = request.data.get('language')
                logger.debug(f"LanguageMiddleware: langue détectée dans les données POST: {language}")
        
        # Normaliser la langue
        if language:
            language = language.lower()[:2]
            # Vérifier que c'est une langue supportée
            supported_languages = ['fr', 'en', 'es', 'de']
            if language not in supported_languages:
                logger.debug(f"LanguageMiddleware: langue non supportée ({language}). Utilisation de la langue par défaut.")
                language = 'fr'  # Langue par défaut
        else:
            language = 'fr'  # Langue par défaut

        # Stocker la langue dans la requête
        setattr(request, '_user_language', language)
        request.LANGUAGE_CODE = language
        logger.debug(f"LanguageMiddleware: activation de la langue {language} pour cette requête")
        
        # Vérifier si c'est une demande de réinitialisation de mot de passe
        if path == 'api/v1/auth/users/reset_password/' and request.method == 'POST':
            # Récupérer l'email depuis les données POST pour les demandes de réinitialisation
            if 'email' in request.data:
                email = request.data.get('email')
                # Importer le dictionnaire temporaire depuis le module email
                from users.email import TEMP_USER_LANGUAGES
                # Stocker la langue pour cet email
                TEMP_USER_LANGUAGES[email] = language
                logger.debug(f"LanguageMiddleware: stockage de la langue {language} pour l'email {email} dans TEMP_USER_LANGUAGES")
        
        # Également pour les demandes de changement de mot de passe
        elif path == 'api/v1/auth/users/set_password/' and request.method == 'POST':
            logger.debug(f"LanguageMiddleware: Détection d'une requête de changement de mot de passe")
            if hasattr(request, 'user') and request.user.is_authenticated and hasattr(request.user, 'email'):
                # Stocker la langue pour l'utilisateur authentifié
                from users.email import TEMP_USER_LANGUAGES
                email = request.user.email
                TEMP_USER_LANGUAGES[email] = language
                logger.debug(f"LanguageMiddleware: stockage de la langue {language} pour l'utilisateur authentifié {email} dans TEMP_USER_LANGUAGES")
                logger.debug(f"LanguageMiddleware: contenu de TEMP_USER_LANGUAGES après ajout: {list(TEMP_USER_LANGUAGES.keys())}")
            else:
                logger.warning(f"LanguageMiddleware: Requête de changement de mot de passe sans utilisateur authentifié ou email disponible!")

        # Activer la langue pour cette requête
        translation.activate(language)
        
        response = self.get_response(request)
        return response

@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_email(request):
    """Vue pour renvoyer l'email de vérification avec la langue spécifiée"""
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Récupérer la langue depuis la requête
    language = getattr(request, '_user_language', None)
    logger.debug(f"resend_verification_email: langue de la requête: {language}")
    logger.debug(f"resend_verification_email: en-têtes de la requête: {request.headers}")
    
    if not language:
        # Si la langue n'est pas dans la requête, utiliser la langue par défaut
        language = 'fr'
        logger.debug("resend_verification_email: langue non trouvée dans la requête, utilisation de la langue par défaut")
    
    logger.debug(f"resend_verification_email: envoi d'email de vérification pour {email} en langue {language}")
    
    try:
        user = User.objects.get(email=email)
        
        # Si l'utilisateur est déjà actif
        if user.is_active:
            return Response({'message': 'User is already active'}, status=status.HTTP_200_OK)
        
        # Activer la langue spécifiée avant d'envoyer l'email
        with translation.override(language):
            # Créer et envoyer l'email d'activation
            context = {'user': user, 'user_language': language, 'request': request}
            activation_email = ActivationEmail(context)
            activation_email.send([email])
            
            logger.debug(f"resend_verification_email: email de vérification envoyé à {email} en langue {language}")
            return Response({'message': 'Verification email sent'}, status=status.HTTP_200_OK)
    
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"resend_verification_email: erreur lors du renvoi de l'email de vérification: {str(e)}")
        return Response({'error': 'Failed to send verification email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def change_email(request):
    """Vue pour changer l'email d'un utilisateur"""
    old_email = request.data.get('old_email')
    new_email = request.data.get('new_email')
    if not old_email or not new_email:
        return Response({'error': 'Old email and new email are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Récupérer la langue depuis la requête
    language = getattr(request, '_user_language', None)
    logger.debug(f"change_email: langue de la requête: {language}")
    
    if not language:
        # Si la langue n'est pas dans la requête, utiliser la langue par défaut
        language = 'fr'
        logger.debug("change_email: langue non trouvée dans la requête, utilisation de la langue par défaut")
    
    logger.debug(f"change_email: changement d'email de {old_email} à {new_email} en langue {language}")
    
    try:
        user = User.objects.get(email=old_email)
        
        # Si l'utilisateur est déjà actif
        if user.is_active:
            # Si nécessaire, envoyer un email de confirmation
            if getattr(settings, 'DJOSER', {}).get('USERNAME_CHANGED_EMAIL_CONFIRMATION', False):
                logger.debug(f"Envoi d'un email de confirmation de changement d'email")
                try:
                    # Utiliser directement l'API d'email de Django au lieu de Djoser
                    from django.core.mail import EmailMultiAlternatives
                    from django.template.loader import render_to_string
                    from django.utils.translation import gettext as _
                    
                    # Définir le contexte pour les templates d'email
                    context = {
                        'user': user,
                        'old_email': old_email,
                        'new_email': new_email,
                        'site_name': settings.SITE_NAME,
                        'domain': settings.DOMAIN,
                        'protocol': 'https' if request.is_secure() else 'http',
                        'current_language': language,
                        'user_language': language
                    }
                    
                    # Avec l'override de langue, créer et envoyer l'email
                    with translation.override(language):
                        try:
                            # Rendre le corps HTML
                            html_body = render_to_string('email/username_changed_confirmation_email.html', context)
                            logger.debug("Template HTML rendu avec succès")
                            
                            # Extraire le sujet du template
                            subject = extract_subject_from_html(html_body)
                            
                            # Texte simple pour les clients qui ne supportent pas le HTML
                            text_body = _("Votre adresse email a été modifiée de {0} à {1}").format(old_email, new_email)
                            
                            # Créer le message email
                            from_email = settings.DEFAULT_FROM_EMAIL
                            email = EmailMultiAlternatives(subject, text_body, from_email, to=[new_email])
                            email.attach_alternative(html_body, "text/html")
                            
                            # Envoyer l'email
                            email.send()
                            logger.info(f"Email de confirmation de changement d'adresse envoyé à {new_email}")
                            logger.info(f"Vérifiez MailHog à l'adresse http://localhost:8025 pour voir l'email")
                            
                            # Si l'ancien email est différent, envoyer aussi une notification à l'ancienne adresse
                            if old_email != new_email:
                                email = EmailMultiAlternatives(subject, text_body, from_email, to=[old_email])
                                email.attach_alternative(html_body, "text/html")
                                email.send()
                                logger.info(f"Email de notification de changement d'adresse envoyé à l'ancienne adresse {old_email}")
                                logger.info(f"Vérifiez MailHog à l'adresse http://localhost:8025 pour voir l'email")
                        except Exception as template_error:
                            logger.error(f"Erreur lors du rendu des templates: {str(template_error)}", exc_info=True)
                            # Essayer avec une version simplifiée sans template
                            try:
                                subject = "Confirmation de changement d'adresse email"
                                text_body = f"Votre adresse email a été modifiée de {old_email} à {new_email}"
                                html_body = f"<html><body><h1>Confirmation de changement d'email</h1><p>Votre adresse email a été modifiée de {old_email} à {new_email}</p></body></html>"
                                
                                # Créer le message email
                                from_email = settings.DEFAULT_FROM_EMAIL
                                email = EmailMultiAlternatives(subject, text_body, from_email, to=[new_email])
                                email.attach_alternative(html_body, "text/html")
                                
                                # Envoyer l'email
                                email.send()
                                logger.info(f"Email simplifié de confirmation envoyé à {new_email}")
                                logger.info(f"Vérifiez MailHog à l'adresse http://localhost:8025 pour voir l'email")
                                
                                # Si l'ancien email est différent, envoyer aussi une notification
                                if old_email != new_email:
                                    email = EmailMultiAlternatives(subject, text_body, from_email, to=[old_email])
                                    email.attach_alternative(html_body, "text/html")
                                    email.send()
                                    logger.info(f"Email simplifié envoyé à l'ancienne adresse {old_email}")
                            except Exception as fallback_error:
                                logger.error(f"Échec de l'envoi d'email simplifié: {str(fallback_error)}", exc_info=True)
                except Exception as e:
                    # Capturer l'exception mais ne pas bloquer le processus
                    logger.error(f"Erreur lors de l'envoi de l'email de confirmation: {str(e)}", exc_info=True)
                    # Continuer car le changement d'email lui-même a réussi
            
            return Response({"detail": "Email modifié avec succès."}, status=200)
        
        else:
            return Response({'error': 'User is not active'}, status=status.HTTP_400_BAD_REQUEST)
    
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"change_email: erreur lors du changement d'email: {str(e)}")
        return Response({'error': 'Failed to change email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def activate_email_change(request):
    """
    Vue pour activer le changement d'adresse email après clic sur le lien de confirmation.
    Accepte les paramètres en GET ou en POST.
    """
    logger.debug("=== DÉBUT DE L'ACTIVATION DU CHANGEMENT D'EMAIL ===")
    
    # Récupérer les paramètres en fonction de la méthode HTTP
    if request.method == 'GET':
        uid = request.query_params.get('uid')
        token = request.query_params.get('token')
        encoded_email = request.query_params.get('encoded_email')
        language = request.query_params.get('language')
        logger.debug(f"Paramètres GET reçus - uid: {uid}, token: {token}, encoded_email: {encoded_email}, language: {language}")
    else:  # POST
        uid = request.data.get('uid')
        token = request.data.get('token')
        encoded_email = request.data.get('encoded_email')
        language = request.data.get('language')
        logger.debug(f"Paramètres POST reçus - uid: {uid}, token: {token}, encoded_email: {encoded_email}, language: {language}")
    
    # Récupérer la langue depuis la requête si non spécifiée dans les paramètres
    if not language:
        language = getattr(request, '_user_language', None)
    
    logger.debug(f"activate_email_change: langue demandée: {language}")
    
    if not language:
        # Si aucune langue n'est spécifiée, utiliser la langue par défaut
        language = 'fr'
        logger.debug("activate_email_change: langue non spécifiée, utilisation de la langue par défaut")
    
    # Normaliser la langue
    language = language.lower()[:2]
    supported_languages = ['fr', 'en', 'es', 'de']
    if language not in supported_languages:
        logger.debug(f"activate_email_change: langue non supportée ({language}). Utilisation de la langue par défaut.")
        language = 'fr'
    
    logger.debug(f"activate_email_change: langue finale: {language}")
    
    # Activer la langue pour cette requête
    translation.activate(language)
    request.LANGUAGE_CODE = language
    
    if not uid or not token or not encoded_email:
        logger.error("activate_email_change: paramètres manquants")
        return Response(
            {'error': 'UID, token et encoded_email sont requis'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        from django.utils.encoding import force_str
        from django.utils.http import urlsafe_base64_decode
        from django.contrib.auth.tokens import default_token_generator
        
        # Décoder l'UID et l'email
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            new_email = force_str(urlsafe_base64_decode(encoded_email))
            logger.debug(f"Données décodées - user_id: {user_id}, new_email: {new_email}")
        except Exception as decode_error:
            logger.error(f"Erreur lors du décodage des données: {str(decode_error)}")
            return Response(
                {'error': 'Données de confirmation invalides'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(pk=user_id)
            logger.debug(f"Utilisateur trouvé: {user.email}")
        except User.DoesNotExist:
            logger.error(f"Utilisateur non trouvé avec l'ID: {user_id}")
            return Response(
                {'error': 'Utilisateur non trouvé'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Vérifier le token
        logger.debug(f"Vérification du token pour l'utilisateur {user.email}")
        if not default_token_generator.check_token(user, token):
            logger.error(f"Token invalide pour l'utilisateur {user.email}")
            return Response(
                {'error': 'Le lien de confirmation est invalide ou a expiré'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier si la nouvelle adresse email est déjà utilisée
        if User.objects.filter(email=new_email).exclude(id=user.id).exists():
            logger.error(f"Email {new_email} déjà utilisé par un autre utilisateur")
            return Response(
                {'error': 'Cette adresse email est déjà utilisée par un autre compte.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Stocker l'ancienne adresse pour la notification
        old_email = user.email
        logger.debug(f"Changement d'email de {old_email} à {new_email}")
        
        # Appliquer le changement d'email
        user.email = new_email
        user.save()
        logger.info(f"Email changé avec succès pour l'utilisateur {user.id}")
        
        # Mettre à jour le USERNAME_FIELD si c'est 'email'
        if User.USERNAME_FIELD == 'email':
            setattr(user, User.USERNAME_FIELD, new_email)
            user.save(update_fields=[User.USERNAME_FIELD])
            logger.debug(f"USERNAME_FIELD mis à jour pour l'utilisateur {user.id}")
        
        # Envoyer un email de confirmation finale à la nouvelle adresse
        try:
            from django.core.mail import EmailMultiAlternatives
            from django.template.loader import render_to_string
            from django.utils.translation import gettext as _
            
            context = {
                'user': user,
                'old_email': old_email,
                'new_email': new_email,
                'site_name': settings.SITE_NAME,
                'domain': settings.DOMAIN,
                'protocol': 'https' if request.is_secure() else 'http',
                'current_language': language,
                'user_language': language
            }
            
            with translation.override(language):
                html_body = render_to_string('email/username_changed_confirmation_email.html', context)
                subject = extract_subject_from_html(html_body)
                logger.debug(f"Sujet de la confirmation finale: {subject}")
                
                email = EmailMultiAlternatives(subject, "", settings.DEFAULT_FROM_EMAIL, to=[new_email])
                email.attach_alternative(html_body, "text/html")
                email.send()
                logger.info(f"Email de confirmation finale envoyé à {new_email}")
        
        except Exception as email_error:
            logger.error(f"Erreur lors de l'envoi de l'email de confirmation finale: {str(email_error)}")
            # Ne pas bloquer le processus si l'envoi d'email échoue
        
        logger.debug("=== FIN DE L'ACTIVATION DU CHANGEMENT D'EMAIL ===")
        return Response({
            'message': 'Email modifié avec succès',
            'email': new_email
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Erreur lors de l'activation du changement d'email: {str(e)}", exc_info=True)
        return Response(
            {'error': 'Erreur lors de l\'activation du changement d\'email'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    print('LOGIN VIEW CALLED', request.data)
    logger.debug(f'LOGIN VIEW CALLED - data: {request.data}')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'detail': _('Veuillez fournir un email et un mot de passe.')},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
        
        # Vérifier si l'utilisateur existe mais n'est pas actif
        if not user.is_active:
            # NE PAS envoyer l'email d'activation automatiquement !
            return Response(
                {
                    'detail': _("Votre compte n'est pas encore activé. Veuillez vérifier vos emails (y compris les spams)."),
                    'status': 'INACTIVE_ACCOUNT'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Si l'utilisateur est actif, laisser JWT gérer l'authentification
        return Response(
            {'detail': _('Veuillez utiliser l\'endpoint JWT pour l\'authentification.')},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    except User.DoesNotExist:
        # Message générique pour ne pas révéler si le compte existe
        return Response(
            {'detail': _('Adresse email ou mot de passe incorrect.')},
            status=status.HTTP_401_UNAUTHORIZED
        )
