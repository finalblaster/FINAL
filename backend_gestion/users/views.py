from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.utils import translation
from django.utils.translation import gettext as _
import logging
from django.contrib.auth import get_user_model
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

class CustomUserViewSet(UserViewSet):
    """
    Vue personnalisée qui étend la vue UserViewSet de Djoser
    pour inclure la gestion de la langue lors de l'enregistrement
    """
    def create(self, request, *args, **kwargs):
        logger.debug("CustomUserViewSet.create appelé")
        
        # Extraire la langue de la requête
        language = None
        
        # 1. Vérifier dans les données POST
        if 'language' in request.data:
            language = request.data.get('language')
            logger.debug(f"CustomUserViewSet: langue fournie dans les données: {language}")
            
        # 2. Vérifier dans l'en-tête HTTP
        elif 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip()
            logger.debug(f"CustomUserViewSet: langue détectée dans l'en-tête HTTP: {language}")
        
        # Normaliser et valider la langue
        if language:
            language = language.lower()[:2]
            supported_languages = ['fr', 'en', 'es', 'de']
            if language not in supported_languages:
                logger.debug(f"CustomUserViewSet: langue non supportée ({language}). Utilisation de la langue par défaut.")
                language = 'fr'  # Langue par défaut
            
            # Stocker la langue dans la requête pour y accéder plus tard
            setattr(request, '_user_language', language)
            logger.debug(f"CustomUserViewSet: langue {language} attachée à la requête")
            
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
            logger.debug(f"CustomUserViewSet.reset_password: langue trouvée dans les données: {language}")
        
        # 2. Sinon, essayer l'en-tête HTTP Accept-Language
        elif 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip()
            logger.debug(f"CustomUserViewSet.reset_password: langue détectée dans l'en-tête HTTP: {language}")
        
        # Normaliser et valider la langue
        if language:
            language = language.lower()[:2]
            supported_languages = ['fr', 'en', 'es', 'de']
            if language not in supported_languages:
                logger.debug(f"CustomUserViewSet.reset_password: langue non supportée ({language}). Utilisation de la langue par défaut.")
                language = 'fr'
        else:
            language = 'fr'
        
        logger.debug(f"CustomUserViewSet.reset_password: langue finale: {language}")
        
        # Stocker la langue dans la requête
        setattr(request, '_user_language', language)
        
        # Activer explicitement la langue
        translation.activate(language)
        request.LANGUAGE_CODE = language
        
        # Si email est dans les données, stocker la langue pour cet email
        if 'email' in request.data:
            email = request.data.get('email')
            TEMP_USER_LANGUAGES[email] = language
            logger.debug(f"CustomUserViewSet.reset_password: langue {language} stockée pour l'email {email}")
        
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
        
        logger.debug(f"CustomUserViewSet.reset_password: envoi d'email avec contexte: {context}")
        
        # Créer et envoyer l'email manuellement avec translation override
        with translation.override(language):
            email_instance = PasswordResetEmail(context=context)
            
            # Si user est None, retourner un message de confirmation sans envoyer d'email
            if user is None:
                if 'email' in request.data:
                    logger.debug(f"CustomUserViewSet.reset_password: utilisateur non trouvé pour {request.data.get('email')}, retour d'un message de confirmation")
                    return Response({
                        "detail": _("Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation de mot de passe.")
                    }, status=200)
                else:
                    logger.error("CustomUserViewSet.reset_password: user est None et pas d'email trouvé dans request.data")
                    return Response({"error": "Email non fourni"}, status=400)
            else:
                email_instance.send(to=[user.email])
                logger.debug(f"CustomUserViewSet.reset_password: email envoyé avec langue forcée à {language}")
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
            logger.debug(f"CustomUserViewSet.set_password: langue trouvée dans les données: {language}")
        
        # 2. Sinon, essayer l'en-tête HTTP Accept-Language
        elif 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip()
            logger.debug(f"CustomUserViewSet.set_password: langue détectée dans l'en-tête HTTP: {language}")
        
        # Normaliser et valider la langue
        if language:
            language = language.lower()[:2]
            supported_languages = ['fr', 'en', 'es', 'de']
            if language not in supported_languages:
                logger.debug(f"CustomUserViewSet.set_password: langue non supportée ({language}). Utilisation de la langue par défaut.")
                language = 'fr'
        else:
            language = 'fr'
        
        logger.debug(f"CustomUserViewSet.set_password: langue finale: {language}")
        
        # Stocker la langue dans la requête
        setattr(request, '_user_language', language)
        
        # Activer explicitement la langue
        translation.activate(language)
        request.LANGUAGE_CODE = language
        
        # Stocker la langue pour l'utilisateur authentifié si disponible
        if request.user and request.user.is_authenticated and hasattr(request.user, 'email'):
            TEMP_USER_LANGUAGES[request.user.email] = language
            logger.debug(f"CustomUserViewSet.set_password: langue {language} stockée pour l'email {request.user.email}")
        
        # Appeler la méthode set_password originale pour changer le mot de passe
        # L'email sera envoyé par la méthode parente grâce au paramètre PASSWORD_CHANGED_EMAIL_CONFIRMATION
        logger.debug("CustomUserViewSet.set_password: Appel de la méthode parent (le mail sera envoyé par la méthode parent)")
        response = super().set_password(request, *args, **kwargs)
        
        # Ne pas envoyer d'email supplémentaire ici, car la méthode parent le fait déjà
        # avec le paramètre PASSWORD_CHANGED_EMAIL_CONFIRMATION=True
        
        return response

    @action(["get", "put"], detail=False)
    def profile(self, request, *args, **kwargs):
        """
        Vue pour récupérer et mettre à jour le profil utilisateur
        GET: Récupère les données du profil
        PUT: Met à jour les données du profil
        """
        logger.debug("CustomUserViewSet.profile appelé")
        user = request.user
        
        if request.method == 'GET':
            from .serializers import UserProfileSerializer
            serializer = UserProfileSerializer(user)
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            from .serializers import UserProfileSerializer
            
            # Détermine et normalise la langue
            language = None
            if 'language' in request.data:
                language = request.data.get('language')
            elif 'HTTP_ACCEPT_LANGUAGE' in request.META:
                accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
                language = accept_lang.split(',')[0].split(';')[0].strip()
            
            # Normaliser la langue
            if language:
                language = language.lower()[:2]
                supported_languages = ['fr', 'en', 'es', 'de']
                if language not in supported_languages:
                    language = 'fr'
            
            # Activer la langue pour la durée de cette requête
            if language:
                translation.activate(language)
                request.LANGUAGE_CODE = language
            
            serializer = UserProfileSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(["post"], detail=False)
    def set_email(self, request, *args, **kwargs):
        """
        Vue personnalisée pour le changement d'email (USERNAME_FIELD)
        avec gestion explicite de la langue et meilleur traitement des erreurs
        """
        logger.debug("CustomUserViewSet.set_email appelé")
        logger.debug(f"Données reçues: {request.data}")
        
        # Vérifier l'authentification
        if not request.user.is_authenticated:
            logger.warning("Tentative de changement d'email sans authentification")
            return Response({"detail": "Vous devez être connecté pour changer votre email."}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Récupérer les données du formulaire
        new_email = request.data.get('new_email')
        re_new_email = request.data.get('re_new_email')
        current_password = request.data.get('current_password')
        
        # Valider les données
        if not new_email or not re_new_email or not current_password:
            logger.warning("Tentative de changement d'email avec des données manquantes")
            return Response({"detail": "Tous les champs sont obligatoires."}, status=status.HTTP_400_BAD_REQUEST)
        
        if new_email != re_new_email:
            logger.warning("Tentative de changement d'email avec des emails différents")
            return Response({"detail": "Les deux emails doivent être identiques."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier le mot de passe actuel
        user = request.user
        if not user.check_password(current_password):
            logger.warning(f"Tentative de changement d'email avec un mot de passe incorrect pour l'utilisateur {user.email}")
            return Response({"detail": "Votre mot de passe actuel est incorrect."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Détermine et normalise la langue
        language = None
        
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
        
        # Vérifier si le nouvel email est déjà utilisé
        if User.objects.filter(email=new_email).exclude(id=user.id).exists():
            logger.warning(f"Tentative de changement d'email vers une adresse déjà utilisée: {new_email}")
            return Response({"detail": "Cette adresse email est déjà utilisée par un autre compte."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Générer un token pour la confirmation d'email
        from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
        from django.utils.encoding import force_bytes
        from django.contrib.auth.tokens import default_token_generator
        
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        # Encoder également la nouvelle adresse email
        encoded_email = urlsafe_base64_encode(force_bytes(new_email))
        
        # Préparer l'URL de confirmation avec l'email encodé
        confirmation_url = f"email/activate/{uid}/{token}/{encoded_email}"
        
        # Envoyer un email de vérification à la nouvelle adresse
        try:
            from django.core.mail import EmailMultiAlternatives
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
                'user_language': language
            }
            
            # Avec l'override de langue, créer et envoyer l'email de vérification
            with translation.override(language):
                # Rendre le corps HTML en utilisant le template complet
                context['site_name'] = settings.SITE_NAME  # S'assurer que site_name est dans le contexte
                html_body = render_to_string('email/activation_changement_username.html', context)
                logger.debug("Template HTML rendu avec succès")
                
                # Extraire le sujet du template
                def extract_subject_from_html(html_content):
                    try:
                        # Rechercher d'abord dans la balise title
                        title_match = re.search(r'<title>(.*?)</title>', html_content, re.DOTALL)
                        if title_match:
                            subject_text = title_match.group(1).strip()
                            # La variable site_name est déjà intégrée dans le titre
                            return subject_text
                            
                        # Fallback: rechercher dans le bloc subject (pour rétrocompatibilité)
                        subject_match = re.search(r'{%\s*block\s+subject\s*%}(.*?){%\s*endblock\s+subject\s*%}', html_content, re.DOTALL)
                        if subject_match:
                            subject_text = subject_match.group(1).strip()
                            # Remplacer directement les variables connues
                            subject_text = subject_text.replace("{{ site_name }}", settings.SITE_NAME)
                            return subject_text
                            
                        # Deuxième fallback si rien n'est trouvé
                        return f"{settings.SITE_NAME} - {_('Notification')}"
                    except Exception as e:
                        logger.error(f"Erreur lors de l'extraction du sujet: {str(e)}")
                        return f"{settings.SITE_NAME} - {_('Notification')}"
                
                # Extraire le sujet du template HTML
                subject = extract_subject_from_html(html_body)
                
                # Si l'extraction n'a pas fonctionné, utiliser le sujet par défaut avec site_name
                if not subject or "{{ site_name }}" in subject:
                    subject = f"{settings.SITE_NAME} - {_('Confirmez le changement de votre adresse email')}"
                
                logger.debug(f"Sujet de l'email: {subject}")
                
                # Texte simple comme alternative
                text_body = render_to_string('email/activation_changement_email.txt', context)
                
                # Créer le message email
                from_email = settings.DEFAULT_FROM_EMAIL
                
                # Utiliser EmailMessage qui privilégie le contenu HTML
                from django.core.mail import EmailMessage
                email = EmailMessage(
                    subject=subject,
                    body=html_body,
                    from_email=from_email,
                    to=[new_email],
                )
                email.content_subtype = "html"  # Définir le type de contenu comme HTML
                
                # Envoyer l'email
                email.send()
                logger.info(f"Email de vérification pour changement d'adresse envoyé à {new_email}")
                logger.info(f"URL de confirmation: {context['protocol']}://{context['domain']}/{confirmation_url}")
        except Exception as e:
            logger.error(f"Erreur lors de l'envoi de l'email de vérification: {str(e)}", exc_info=True)
            return Response({"detail": "Erreur lors de l'envoi de l'email de vérification."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Retourner une réponse indiquant que le processus de changement a été initié
        return Response({
            "detail": "Un email de vérification a été envoyé à votre nouvelle adresse. Veuillez cliquer sur le lien dans cet email pour confirmer le changement.",
            "pending_email": new_email
        }, status=status.HTTP_200_OK)

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
                            def extract_subject_from_html(html_content):
                                try:
                                    # Rechercher d'abord dans la balise title
                                    title_match = re.search(r'<title>(.*?)</title>', html_content, re.DOTALL)
                                    if title_match:
                                        subject_text = title_match.group(1).strip()
                                        # La variable site_name est déjà intégrée dans le titre
                                        return subject_text
                                        
                                    # Fallback: rechercher dans le bloc subject (pour rétrocompatibilité)
                                    subject_match = re.search(r'{%\s*block\s+subject\s*%}(.*?){%\s*endblock\s+subject\s*%}', html_content, re.DOTALL)
                                    if subject_match:
                                        subject_text = subject_match.group(1).strip()
                                        # Remplacer directement les variables connues
                                        subject_text = subject_text.replace("{{ site_name }}", settings.SITE_NAME)
                                        return subject_text
                                        
                                    # Deuxième fallback si rien n'est trouvé
                                    return f"{settings.SITE_NAME} - {_('Notification')}"
                                except Exception as e:
                                    logger.error(f"Erreur lors de l'extraction du sujet: {str(e)}")
                                    return f"{settings.SITE_NAME} - {_('Notification')}"
                            
                            # Utiliser la méthode d'extraction pour le sujet
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
    Requiert uid, token et encoded_email dans le corps de la requête ou dans les query params.
    """
    # Récupérer les paramètres en fonction de la méthode HTTP
    if request.method == 'GET':
        uid = request.query_params.get('uid')
        token = request.query_params.get('token')
        encoded_email = request.query_params.get('encoded_email')
        language = request.query_params.get('language')
    else:  # POST
        uid = request.data.get('uid')
        token = request.data.get('token')
        encoded_email = request.data.get('encoded_email')
        language = request.data.get('language')
    
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
        return Response(
            {'error': 'UID, token et encoded_email sont requis'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        from django.utils.encoding import force_str
        from django.utils.http import urlsafe_base64_decode
        from django.contrib.auth.tokens import default_token_generator
        
        # Décoder l'UID et l'email
        user_id = force_str(urlsafe_base64_decode(uid))
        new_email = force_str(urlsafe_base64_decode(encoded_email))
        
        user = User.objects.get(pk=user_id)
        
        # Vérifier le token
        if not default_token_generator.check_token(user, token):
            logger.error(f"activate_email_change: token invalide pour l'utilisateur {user_id}")
            return Response(
                {'error': 'Le lien de confirmation est invalide ou a expiré'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier si la nouvelle adresse email est déjà utilisée par un autre utilisateur
        if User.objects.filter(email=new_email).exclude(id=user.id).exists():
            logger.error(f"activate_email_change: email {new_email} déjà utilisé par un autre utilisateur")
            return Response(
                {'error': 'Cette adresse email est déjà utilisée par un autre compte.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Stocker l'ancienne adresse pour la notification
        old_email = user.email
        
        # Appliquer le changement d'email
        user.email = new_email
        user.save()
        
        # Mettre à jour le USERNAME_FIELD si c'est 'email'
        if User.USERNAME_FIELD == 'email':
            setattr(user, User.USERNAME_FIELD, new_email)
            user.save(update_fields=[User.USERNAME_FIELD])
        
        # Envoyer un email de confirmation à l'ancienne et la nouvelle adresse
        if getattr(settings, 'DJOSER', {}).get('USERNAME_CHANGED_EMAIL_CONFIRMATION', False):
            try:
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
                    # 1. Email de confirmation à la nouvelle adresse
                    # Rendre le corps HTML
                    html_body = render_to_string('email/username_changed_confirmation_email.html', context)
                    
                    # Extraire le sujet du template
                    def extract_subject_from_html(html_content):
                        try:
                            # Rechercher d'abord dans la balise title
                            title_match = re.search(r'<title>(.*?)</title>', html_content, re.DOTALL)
                            if title_match:
                                subject_text = title_match.group(1).strip()
                                # La variable site_name est déjà intégrée dans le titre
                                return subject_text
                                
                            # Fallback: rechercher dans le bloc subject (pour rétrocompatibilité)
                            subject_match = re.search(r'{%\s*block\s+subject\s*%}(.*?){%\s*endblock\s+subject\s*%}', html_content, re.DOTALL)
                            if subject_match:
                                subject_text = subject_match.group(1).strip()
                                # Remplacer directement les variables connues
                                subject_text = subject_text.replace("{{ site_name }}", settings.SITE_NAME)
                                return subject_text
                                
                            # Deuxième fallback si rien n'est trouvé
                            return f"{settings.SITE_NAME} - {_('Notification')}"
                        except Exception as e:
                            logger.error(f"Erreur lors de l'extraction du sujet: {str(e)}")
                            return f"{settings.SITE_NAME} - {_('Notification')}"
                    
                    # Utiliser la méthode d'extraction pour le sujet
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
                    
                    # 2. Email d'avertissement à l'ancienne adresse
                    if old_email != new_email:
                        try:
                            # Chemins des templates avec gestion de l'erreur
                            warning_template_path = 'email/username_changed_warning.html'
                            logger.debug(f"Tentative de rendu du template d'avertissement: {warning_template_path}")
                            
                            # Rendre le corps HTML d'avertissement
                            try:
                                html_body = render_to_string(warning_template_path, context)
                                logger.debug("Rendu du template d'avertissement réussi")
                                
                                # Utiliser la même méthode d'extraction pour le sujet
                                subject = extract_subject_from_html(html_body)
                            except Exception as template_error:
                                logger.error(f"Erreur lors du rendu du template d'avertissement: {str(template_error)}")
                                # Fallback en cas d'erreur de template
                                html_body = f"""
                                <html>
                                <body>
                                    <h1>Alerte de sécurité - Changement d'adresse email</h1>
                                    <p>Bonjour {user.first_name} {user.last_name},</p>
                                    <p>Une demande de changement d'adresse email a été effectuée sur votre compte {settings.SITE_NAME}.</p>
                                    <p>Votre adresse email a été modifiée de <strong>{old_email}</strong> à <strong>{new_email}</strong>.</p>
                                    <p>Si vous n'êtes pas à l'origine de cette demande, veuillez réinitialiser votre mot de passe immédiatement 
                                    en cliquant sur ce lien: <a href="{protocol}://{domain}/reset-password">Réinitialiser mon mot de passe</a></p>
                                </body>
                                </html>
                                """
                                # Fallback pour le sujet aussi
                                subject = f"{settings.SITE_NAME} - {_('Alerte de changement d''adresse email')}"
                            
                            # Texte simple pour les clients qui ne supportent pas le HTML
                            text_body = _("Votre adresse email sur {0} a été modifiée de {1} à {2}. Si vous n'êtes pas à l'origine de cette action, veuillez réinitialiser votre mot de passe immédiatement.").format(settings.SITE_NAME, old_email, new_email)
                            
                            # Créer le message email
                            email = EmailMultiAlternatives(subject, text_body, from_email, to=[old_email])
                            email.attach_alternative(html_body, "text/html")
                            
                            # Envoyer l'email
                            email.send()
                            logger.info(f"Email d'avertissement de changement d'adresse envoyé à l'ancienne adresse {old_email}")
                        except Exception as warning_error:
                            logger.error(f"Erreur lors de l'envoi de l'email d'avertissement: {str(warning_error)}", exc_info=True)
            except Exception as e:
                # Logger l'erreur mais ne pas bloquer le processus
                logger.error(f"Erreur lors de l'envoi de l'email de confirmation: {str(e)}", exc_info=True)
        
        # Retourner une réponse de succès
        return Response({
            'message': 'Email modifié avec succès',
            'email': new_email
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        logger.error(f"activate_email_change: utilisateur avec UID {uid} non trouvé")
        return Response(
            {'error': 'Utilisateur non trouvé'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"activate_email_change: erreur lors de l'activation: {str(e)}", exc_info=True)
        return Response(
            {'error': 'Erreur lors de l\'activation du changement d\'email'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
