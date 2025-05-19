# users/email.py
from djoser.email import ActivationEmail as BaseActivationEmail
from djoser.email import ConfirmationEmail as BaseConfirmationEmail
from djoser.email import PasswordResetEmail as BasePasswordResetEmail
from djoser.email import PasswordChangedConfirmationEmail as BasePasswordChangedConfirmationEmail
from django.utils import translation
from django.utils.encoding import force_str
from django.template import loader
from django.utils.translation import gettext as _
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

# Dictionnaire temporaire pour stocker les langues des utilisateurs
TEMP_USER_LANGUAGES = {}

class CustomEmailMixin:
    def get_context_data(self):
        """
        Surcharge get_context_data pour s'assurer que la langue est correctement définie dans le contexte
        et pour gérer le cas où l'utilisateur est None
        """
        # Pour les emails de réinitialisation de mot de passe avec un utilisateur inexistant,
        # nous devons gérer spécialement le contexte
        if self.__class__.__name__ == 'PasswordResetEmail' and ('user' not in self.context or self.context['user'] is None):
            # Créer un contexte minimal sans appeler super().get_context_data()
            # qui génèrerait une erreur avec un utilisateur None
            context = {}
            for key, value in self.context.items():
                context[key] = value
                
            # Ajouter des valeurs par défaut nécessaires pour les templates de réinitialisation
            context['site_name'] = settings.SITE_NAME
            context['domain'] = self.context.get('domain', settings.DOMAIN)
            context['protocol'] = self.context.get('protocol', 'https')
            
            # Ne pas inclure uid/token puisqu'il n'y a pas d'utilisateur
            logger.debug(f"{self.__class__.__name__}.get_context_data: Utilisateur None, création d'un contexte minimal")
        else:
            # Si l'utilisateur existe, appeler la méthode parent normalement
            context = super().get_context_data()
            logger.debug(f"{self.__class__.__name__}.get_context_data: Contexte initial: {list(self.context.keys())}")
        
        request = self.context.get('request')
        
        # Récupérer la langue depuis la requête
        language = None
        if request:
            language = getattr(request, '_user_language', None)
            logger.debug(f"{self.__class__.__name__}.get_context_data: Requête disponible, langue dans la requête: {language}")
            
            # Vérifier les en-têtes HTTP si pas de langue dans la requête
            if not language and hasattr(request, 'META') and 'HTTP_ACCEPT_LANGUAGE' in request.META:
                accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
                language = accept_lang.split(',')[0].split(';')[0].strip().lower()[:2]
                logger.debug(f"{self.__class__.__name__}.get_context_data: Langue détectée dans l'en-tête HTTP: {language}")
        
        # Vérifier la langue dans TEMP_USER_LANGUAGES
        if not language and 'user' in self.context and self.context['user'] is not None and hasattr(self.context['user'], 'email') and self.context['user'].email in TEMP_USER_LANGUAGES:
            language = TEMP_USER_LANGUAGES[self.context['user'].email]
            logger.debug(f"{self.__class__.__name__}.get_context_data: Langue trouvée dans TEMP_USER_LANGUAGES: {language}")
        
        # Utiliser la langue par défaut si aucune langue n'est déterminée
        if not language:
            language = 'fr'  # Langue par défaut
            logger.debug(f"{self.__class__.__name__}.get_context_data: Aucune langue trouvée, utilisation de la langue par défaut: {language}")
        
        # Vérifier que la langue est dans les langues supportées
        supported_languages = ['fr', 'en', 'es', 'de']
        if language.lower()[:2] not in supported_languages:
            logger.debug(f"{self.__class__.__name__}.get_context_data: Langue non supportée ({language}). Utilisation de la langue par défaut.")
            language = 'fr'  # Langue par défaut
        
        # Activer la langue pour l'email
        translation.activate(language)
        current_lang = translation.get_language()
        logger.debug(f"{self.__class__.__name__}.get_context_data: Langue activée: {current_lang}")
        
        # Ajouter la langue au contexte
        context['user_language'] = language
        context['current_language'] = language
        
        return context
    
    def get_language_verbose_log(self, language, method_name):
        """
        Génère des logs détaillés sur la langue utilisée et le contexte actuel
        """
        current_translation = translation.get_language()
        logger.debug(f"{self.__class__.__name__}.{method_name}: Langue actuelle dans translation.get_language(): {current_translation}")
        logger.debug(f"{self.__class__.__name__}.{method_name}: Langue identifiée à utiliser: {language}")
        logger.debug(f"{self.__class__.__name__}.{method_name}: Contexte de l'email a une langue? {'current_language' in self.context}")
        if 'current_language' in self.context:
            logger.debug(f"{self.__class__.__name__}.{method_name}: Langue dans le contexte: {self.context.get('current_language')}")
        
        # Vérifier si le contexte a une langue utilisateur
        if 'user_language' in self.context:
            logger.debug(f"{self.__class__.__name__}.{method_name}: user_language dans le contexte: {self.context.get('user_language')}")
        
        # Vérifier si l'instance a un attribut de langue
        if hasattr(self, 'language'):
            logger.debug(f"{self.__class__.__name__}.{method_name}: Attribut 'language' sur l'instance: {self.language}")
        
        return language

class CustomActivationEmail(CustomEmailMixin, BaseActivationEmail):
    template_name = 'email/activation_email.html'
    
    def get_language_from_context(self):
        """
        Extrait la langue à partir du contexte
        """
        if 'current_language' in self.context:
            return self.context['current_language']
        elif 'user_language' in self.context:
            return self.context['user_language']
        elif hasattr(self, 'language'):
            return self.language
        return 'fr'  # Fallback à la langue par défaut
    
    def get_email_context(self):
        """
        Surcharge la méthode get_email_context pour s'assurer que la langue est activée
        avant le rendu du sujet et du corps et que site_name est correctement défini
        """
        # Récupérer la langue depuis les différentes sources
        language = self._determine_language()
        
        # Stocker la langue pour l'instance
        self.language = language
        self.context['current_language'] = language
        self.context['user_language'] = language
        
        # S'assurer que site_name est dans le contexte
        if "site_name" not in self.context:
            self.context["site_name"] = settings.SITE_NAME
            logger.debug(f"CustomActivationEmail.get_email_context: Ajout manuel de site_name={settings.SITE_NAME} au contexte")
        
        # Activer la langue avant de générer le contexte
        with translation.override(language):
            return super().get_email_context()
    
    def _determine_language(self):
        """
        Détermine la langue à utiliser en vérifiant toutes les sources possibles
        """
        language = None
        request = self.context.get('request', None)
        
        # 1. D'abord vérifier si la langue a été explicitement ajoutée au contexte
        if 'user_language' in self.context:
            language = self.context['user_language']
            logger.debug(f"_determine_language: langue trouvée dans le contexte: {language}")
        
        # 2. Ensuite vérifier dans la requête
        elif request and hasattr(request, '_user_language'):
            language = request._user_language
            logger.debug(f"_determine_language: langue trouvée dans la requête: {language}")
        
        # 3. Vérifier dans les attributs de l'utilisateur
        elif 'user' in self.context and hasattr(self.context['user'], '_activation_email_language'):
            language = getattr(self.context['user'], '_activation_email_language')
            logger.debug(f"_determine_language: langue trouvée dans les attributs de l'utilisateur: {language}")
        
        # 4. Vérifier dans le dictionnaire temporaire
        elif 'user' in self.context and self.context['user'] is not None and hasattr(self.context['user'], 'email') and self.context['user'].email in TEMP_USER_LANGUAGES:
            language = TEMP_USER_LANGUAGES[self.context['user'].email]
            logger.debug(f"_determine_language: langue trouvée dans TEMP_USER_LANGUAGES: {language}")
        
        # 5. Enfin, vérifier dans les en-têtes HTTP
        elif request and 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip().lower()[:2]
            logger.debug(f"_determine_language: langue détectée dans l'en-tête HTTP: {language}")
        
        # Normaliser la langue
        if language:
            language = language.lower()[:2]
            # Vérifier que c'est une langue supportée
            supported_languages = ['fr', 'en', 'es', 'de']
            if language not in supported_languages:
                logger.debug(f"_determine_language: langue non supportée ({language}). Utilisation de la langue par défaut.")
                language = 'fr'  # Langue par défaut
        else:
            language = 'fr'  # Langue par défaut si rien n'est trouvé
            
        logger.debug(f"_determine_language: langue finale choisie: {language}")
        return language
    
    def render_subject(self):
        """
        Surcharge la méthode render_subject pour s'assurer que la traduction est appliquée
        et que site_name est correctement défini
        """
        language = self.get_language_from_context()
        language = self.get_language_verbose_log(language, "render_subject")
        
        with translation.override(language):
            current_lang = translation.get_language()
            logger.debug(f"CustomActivationEmail.render_subject: Langue activée dans le bloc translation.override: {current_lang}")
            
            # S'assurer que site_name est dans le contexte
            if "site_name" not in self.context:
                self.context["site_name"] = settings.SITE_NAME
                logger.debug(f"CustomActivationEmail.render_subject: Ajout manuel de site_name={settings.SITE_NAME} au contexte")
            
            subject = super().render_subject()
            logger.debug(f"CustomActivationEmail.render_subject: Sujet rendu: {subject}")
            return subject
    
    def render(self):
        """
        Surcharge la méthode render pour s'assurer que la traduction est appliquée
        lors du rendu du contenu de l'email
        """
        language = self.get_language_from_context()
        logger.debug(f"CustomActivationEmail.render: Langue identifiée: {language}")
        
        with translation.override(language):
            return super().render()
    
    def send(self, to, *args, **kwargs):
        # Récupérer la langue de l'utilisateur
        language = self._determine_language()
            
        # Stocker la langue dans le dictionnaire temporaire pour une utilisation ultérieure
        if 'user' in self.context:
            TEMP_USER_LANGUAGES[self.context['user'].email] = language
        
        logger.debug(f"ActivationEmail: début de l'envoi d'email à {to}")
        logger.debug(f"ActivationEmail: contexte disponible: {list(self.context.keys())}")
        logger.debug(f"ActivationEmail: langue finale choisie: {language}")
        
        # Ajouter la langue au contexte du template
        self.context['current_language'] = language
        self.context['user_language'] = language
        self.language = language  # Stocker également sur l'instance
        
        # S'assurer que site_name est dans le contexte
        if "site_name" not in self.context:
            self.context["site_name"] = settings.SITE_NAME
            logger.debug(f"ActivationEmail.send: Ajout manuel de site_name={settings.SITE_NAME} au contexte")
        
        # Activer la langue choisie pendant tout le processus d'envoi de l'email
        with translation.override(language):
            # Vérifier que la langue est correctement activée
            current_lang = translation.get_language()
            logger.debug(f"ActivationEmail.send: Langue activée pour l'envoi: {current_lang}")
            
            # Préparation du sujet avant l'envoi pour le log
            try:
                subject = self.render_subject()
                logger.debug(f"ActivationEmail.send: Sujet qui sera utilisé: {subject}")
            except Exception as e:
                logger.error(f"ActivationEmail.send: Erreur lors du rendu du sujet: {str(e)}")
            
            logger.debug(f"ActivationEmail: envoi de l'email en langue {language}")
            # Appeler la méthode send de la classe parent à l'intérieur du bloc translation.override
            super().send(to, *args, **kwargs)
            logger.debug(f"ActivationEmail: email envoyé avec succès en langue {language}")

class CustomConfirmationEmail(CustomEmailMixin, BaseConfirmationEmail):
    template_name = 'email/confirmation_email.html'
    
    def get_email_context(self):
        """
        Surcharge la méthode get_email_context pour s'assurer que la langue est activée
        avant le rendu du sujet et du corps et que site_name est correctement défini
        """
        # Récupérer la langue depuis les différentes sources
        language = self._determine_language()
        
        # Stocker la langue pour l'instance
        self.language = language
        self.context['current_language'] = language
        self.context['user_language'] = language
        
        # S'assurer que site_name est dans le contexte
        if "site_name" not in self.context:
            self.context["site_name"] = settings.SITE_NAME
            logger.debug(f"CustomConfirmationEmail.get_email_context: Ajout manuel de site_name={settings.SITE_NAME} au contexte")
        
        # Activer la langue avant de générer le contexte
        with translation.override(language):
            return super().get_email_context()
    
    def _determine_language(self):
        """
        Détermine la langue à utiliser en vérifiant toutes les sources possibles
        """
        language = None
        request = self.context.get('request', None)
        
        # Vérifier dans le dictionnaire temporaire
        if 'user' in self.context and self.context['user'] is not None and hasattr(self.context['user'], 'email') and self.context['user'].email in TEMP_USER_LANGUAGES:
            language = TEMP_USER_LANGUAGES[self.context['user'].email]
            logger.debug(f"CustomConfirmationEmail._determine_language: langue trouvée dans TEMP_USER_LANGUAGES: {language}")
        
        # Vérifier dans le contexte
        elif 'user_language' in self.context:
            language = self.context['user_language']
            logger.debug(f"CustomConfirmationEmail._determine_language: langue trouvée dans le contexte: {language}")
        
        # Vérifier dans la requête
        elif request and hasattr(request, '_user_language'):
            language = request._user_language
            logger.debug(f"CustomConfirmationEmail._determine_language: langue trouvée dans la requête: {language}")
            
        # Enfin, vérifier dans les en-têtes HTTP
        elif request and 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip().lower()[:2]
            logger.debug(f"CustomConfirmationEmail._determine_language: langue détectée dans l'en-tête HTTP: {language}")
        
        # Si toujours pas de langue, utiliser la langue par défaut
        if not language:
            language = 'fr'
            logger.debug("CustomConfirmationEmail._determine_language: langue non trouvée, utilisation de la langue par défaut")
        
        # Normaliser la langue
        language = language.lower()[:2]
        # Vérifier que c'est une langue supportée
        supported_languages = ['fr', 'en', 'es', 'de']
        if language not in supported_languages:
            logger.debug(f"CustomConfirmationEmail._determine_language: langue non supportée ({language}). Utilisation de la langue par défaut.")
            language = 'fr'  # Langue par défaut
            
        logger.debug(f"CustomConfirmationEmail._determine_language: langue finale choisie: {language}")
        return language
    
    def get_language_from_context(self):
        """
        Extrait la langue à partir du contexte
        """
        if 'current_language' in self.context:
            return self.context['current_language']
        elif 'user_language' in self.context:
            return self.context['user_language']
        elif hasattr(self, 'language'):
            return self.language
        return 'fr'  # Fallback à la langue par défaut
    
    def render_subject(self):
        """
        Surcharge la méthode render_subject pour s'assurer que la traduction est appliquée
        """
        language = self.get_language_from_context()
        logger.debug(f"CustomConfirmationEmail.render_subject: Langue identifiée: {language}")
        
        with translation.override(language):
            subject = super().render_subject()
            logger.debug(f"CustomConfirmationEmail.render_subject: Sujet rendu: {subject}")
            return subject
    
    def render(self):
        """
        Surcharge la méthode render pour s'assurer que la traduction est appliquée
        lors du rendu du contenu de l'email
        """
        language = self.get_language_from_context()
        logger.debug(f"CustomConfirmationEmail.render: Langue identifiée: {language}")
        
        with translation.override(language):
            return super().render()
    
    def send(self, to, *args, **kwargs):
        # Récupérer la langue de l'utilisateur
        language = self._determine_language()
        
        logger.debug(f"CustomConfirmationEmail.send: envoi d'email à {to} en langue {language}")
        
        # Ajouter la langue au contexte du template
        self.context['current_language'] = language
        self.context['user_language'] = language
        self.language = language  # Stocker également sur l'instance
        
        # Activer la langue choisie pendant tout le processus d'envoi de l'email
        with translation.override(language):
            super().send(to, *args, **kwargs)
            logger.debug(f"CustomConfirmationEmail.send: email envoyé avec succès en langue {language}")

class PasswordResetEmail(CustomEmailMixin, BasePasswordResetEmail):
    template_name = 'email/password_reset_email.html'
    
    def get_email_context(self):
        """
        Surcharge la méthode get_email_context pour s'assurer que la langue est activée
        avant le rendu du sujet et du corps et que site_name est correctement défini
        """
        # Récupérer la langue depuis les différentes sources
        language = self._determine_language()
        
        # Stocker la langue pour l'instance
        self.language = language
        self.context['current_language'] = language
        self.context['user_language'] = language
        
        # S'assurer que site_name est dans le contexte
        if "site_name" not in self.context:
            self.context["site_name"] = settings.SITE_NAME
            logger.debug(f"PasswordResetEmail.get_email_context: Ajout manuel de site_name={settings.SITE_NAME} au contexte")
        
        # Activer la langue avant de générer le contexte
        with translation.override(language):
            current_lang = translation.get_language()
            logger.debug(f"PasswordResetEmail.get_email_context: Langue activée dans le bloc translation.override: {current_lang}")
            return super().get_email_context()
    
    def _determine_language(self):
        """
        Détermine la langue à utiliser en vérifiant toutes les sources possibles
        """
        language = None
        request = self.context.get('request', None)
        
        logger.debug(f"PasswordResetEmail._determine_language: contexte complet: {self.context}")
        logger.debug(f"PasswordResetEmail._determine_language: TEMP_USER_LANGUAGES contient: {list(TEMP_USER_LANGUAGES.keys())}")
        
        # 0. Vérifier d'abord explicitement current_language dans le contexte
        if 'current_language' in self.context:
            language = self.context['current_language']
            logger.debug(f"PasswordResetEmail._determine_language: langue trouvée directement dans le contexte (current_language): {language}")
        
        # 1. Vérifier dans le dictionnaire temporaire
        elif 'user' in self.context and self.context['user'] is not None and hasattr(self.context['user'], 'email') and self.context['user'].email in TEMP_USER_LANGUAGES:
            language = TEMP_USER_LANGUAGES[self.context['user'].email]
            logger.debug(f"PasswordResetEmail._determine_language: langue trouvée dans TEMP_USER_LANGUAGES: {language} pour {self.context['user'].email}")
        
        # 2. Vérifier dans la requête
        elif request:
            logger.debug(f"PasswordResetEmail._determine_language: en-têtes de la requête: {request.headers}")
            language = getattr(request, '_user_language', None)
            logger.debug(f"PasswordResetEmail._determine_language: _user_language dans la requête: {language}")
            
            # Si la langue n'est pas dans la requête, vérifier l'en-tête HTTP
            if not language and 'HTTP_ACCEPT_LANGUAGE' in request.META:
                accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
                language = accept_lang.split(',')[0].split(';')[0].strip().lower()[:2]
                logger.debug(f"PasswordResetEmail._determine_language: langue détectée dans l'en-tête HTTP: {language}")
        
        # 3. Vérifier dans le contexte
        elif 'user_language' in self.context:
            language = self.context['user_language']
            logger.debug(f"PasswordResetEmail._determine_language: langue trouvée dans le contexte (user_language): {language}")
        
        # 4. Utiliser la langue par défaut si aucune n'est trouvée
        if not language:
            language = 'fr'
            logger.debug("PasswordResetEmail._determine_language: langue non trouvée, utilisation de la langue par défaut")
        
        # Normaliser la langue
        if language:
            language = language.lower()[:2]
            # Vérifier que c'est une langue supportée
            supported_languages = ['fr', 'en', 'es', 'de']
            if language not in supported_languages:
                logger.debug(f"PasswordResetEmail._determine_language: langue non supportée ({language}). Utilisation de la langue par défaut.")
                language = 'fr'  # Langue par défaut
        
        logger.debug(f"PasswordResetEmail._determine_language: langue finale choisie: {language}")
        return language
    
    def get_language_from_context(self):
        """
        Extrait la langue à partir du contexte
        """
        if 'current_language' in self.context:
            return self.context['current_language']
        elif 'user_language' in self.context:
            return self.context['user_language']
        elif hasattr(self, 'language'):
            return self.language
        return 'fr'  # Fallback à la langue par défaut
    
    def render_subject(self):
        """
        Surcharge la méthode render_subject pour s'assurer que la traduction est appliquée
        """
        language = self.get_language_from_context()
        language = self.get_language_verbose_log(language, "render_subject")
        
        with translation.override(language):
            current_lang = translation.get_language()
            logger.debug(f"PasswordResetEmail.render_subject: Langue activée dans le bloc translation.override: {current_lang}")
            
            subject_template_name = "email/password_reset_subject.txt"
            subject = super().render_subject()
            logger.debug(f"PasswordResetEmail.render_subject: Sujet rendu: {subject}")
            return subject
    
    def render(self):
        """
        Surcharge la méthode render pour s'assurer que la traduction est appliquée
        lors du rendu du contenu de l'email
        """
        language = self.get_language_from_context()
        logger.debug(f"PasswordResetEmail.render: Langue identifiée: {language}")
        
        # Si l'utilisateur est None, ne pas envoyer d'email
        if 'user' not in self.context or self.context['user'] is None:
            logger.debug("PasswordResetEmail.render: utilisateur None, pas d'envoi d'email")
            return None
        
        # Sinon, utiliser le comportement standard
        with translation.override(language):
            return super().render()
    
    def send(self, to, *args, **kwargs):
        # Récupérer la langue de l'utilisateur
        language = self._determine_language()
        
        # Stocker la langue dans le dictionnaire temporaire pour une utilisation ultérieure
        if 'user' in self.context and self.context['user'] is not None and hasattr(self.context['user'], 'email'):
            TEMP_USER_LANGUAGES[self.context['user'].email] = language
        else:
            email = to[0] if isinstance(to, list) and to else to
            if email:
                TEMP_USER_LANGUAGES[email] = language
        
        logger.debug(f"PasswordResetEmail.send: to={to}, contexte complet: {self.context}")
        logger.debug(f"PasswordResetEmail.send: langue finale choisie: {language}")
        
        # Ajouter la langue au contexte du template
        self.context['current_language'] = language
        self.context['user_language'] = language
        self.language = language  # Stocker également sur l'instance
        
        # Si l'utilisateur n'existe pas, ne pas envoyer d'email
        if 'user' not in self.context or self.context['user'] is None:
            logger.debug(f"PasswordResetEmail.send: utilisateur None, pas d'envoi d'email pour {to}")
            return None
        
        # Activer la langue choisie pendant tout le processus d'envoi de l'email
        with translation.override(language):
            logger.debug(f"PasswordResetEmail.send: langue activée pour envoi: {translation.get_language()}")
            super().send(to, *args, **kwargs)
            logger.debug(f"PasswordResetEmail.send: email envoyé avec succès en langue {language}")

class CustomPasswordChangedConfirmationEmail(CustomEmailMixin, BasePasswordChangedConfirmationEmail):
    template_name = 'email/password_changed_confirmation_email.html'
    
    def get_email_context(self):
        """
        Surcharge la méthode get_email_context pour s'assurer que la langue est activée
        avant le rendu du sujet et du corps et que site_name est correctement défini
        """
        # Récupérer la langue depuis les différentes sources
        language = self._determine_language()
        
        # Stocker la langue pour l'instance
        self.language = language
        self.context['current_language'] = language
        self.context['user_language'] = language
        
        # S'assurer que site_name est dans le contexte
        if "site_name" not in self.context:
            self.context["site_name"] = settings.SITE_NAME
            logger.debug(f"CustomPasswordChangedConfirmationEmail.get_email_context: Ajout manuel de site_name={settings.SITE_NAME} au contexte")
        
        # Activer la langue avant de générer le contexte
        with translation.override(language):
            return super().get_email_context()
    
    def _determine_language(self):
        """
        Détermine la langue à utiliser en vérifiant toutes les sources possibles
        """
        language = None
        request = self.context.get('request', None)
        
        # Vérifier dans le dictionnaire temporaire
        if 'user' in self.context and self.context['user'] is not None and hasattr(self.context['user'], 'email') and self.context['user'].email in TEMP_USER_LANGUAGES:
            language = TEMP_USER_LANGUAGES[self.context['user'].email]
            logger.debug(f"CustomPasswordChangedConfirmationEmail._determine_language: langue trouvée dans TEMP_USER_LANGUAGES: {language}")
        
        # Vérifier dans le contexte
        elif 'user_language' in self.context:
            language = self.context['user_language']
            logger.debug(f"CustomPasswordChangedConfirmationEmail._determine_language: langue trouvée dans le contexte: {language}")
        
        # Vérifier dans la requête
        elif request and hasattr(request, '_user_language'):
            language = request._user_language
            logger.debug(f"CustomPasswordChangedConfirmationEmail._determine_language: langue trouvée dans la requête: {language}")
            
        # Enfin, vérifier dans les en-têtes HTTP
        elif request and 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip().lower()[:2]
            logger.debug(f"CustomPasswordChangedConfirmationEmail._determine_language: langue détectée dans l'en-tête HTTP: {language}")
        
        # Si toujours pas de langue, utiliser la langue par défaut
        if not language:
            language = 'fr'
            logger.debug("CustomPasswordChangedConfirmationEmail._determine_language: langue non trouvée, utilisation de la langue par défaut")
        
        # Normaliser la langue
        language = language.lower()[:2]
        # Vérifier que c'est une langue supportée
        supported_languages = ['fr', 'en', 'es', 'de']
        if language not in supported_languages:
            logger.debug(f"CustomPasswordChangedConfirmationEmail._determine_language: langue non supportée ({language}). Utilisation de la langue par défaut.")
            language = 'fr'  # Langue par défaut
            
        logger.debug(f"CustomPasswordChangedConfirmationEmail._determine_language: langue finale choisie: {language}")
        return language
    
    def get_language_from_context(self):
        """
        Extrait la langue à partir du contexte
        """
        if 'current_language' in self.context:
            return self.context['current_language']
        elif 'user_language' in self.context:
            return self.context['user_language']
        elif hasattr(self, 'language'):
            return self.language
        return 'fr'  # Fallback à la langue par défaut
    
    def render_subject(self):
        """
        Surcharge la méthode render_subject pour s'assurer que la traduction est appliquée
        """
        language = self.get_language_from_context()
        logger.debug(f"CustomPasswordChangedConfirmationEmail.render_subject: Langue identifiée: {language}")
        
        with translation.override(language):
            subject = super().render_subject()
            logger.debug(f"CustomPasswordChangedConfirmationEmail.render_subject: Sujet rendu: {subject}")
            return subject
    
    def render(self):
        """
        Surcharge la méthode render pour s'assurer que la traduction est appliquée
        lors du rendu du contenu de l'email
        """
        language = self.get_language_from_context()
        logger.debug(f"CustomPasswordChangedConfirmationEmail.render: Langue identifiée: {language}")
        
        with translation.override(language):
            return super().render()
    
    def send(self, to, *args, **kwargs):
        # Récupérer la langue de l'utilisateur
        language = self._determine_language()
        
        logger.debug(f"CustomPasswordChangedConfirmationEmail.send: envoi d'email à {to} en langue {language}")
        
        # Ajouter la langue au contexte du template
        self.context['current_language'] = language
        self.context['user_language'] = language
        self.language = language  # Stocker également sur l'instance
        
        # Activer la langue choisie pendant tout le processus d'envoi de l'email
        with translation.override(language):
            super().send(to, *args, **kwargs)
            logger.debug(f"CustomPasswordChangedConfirmationEmail.send: email envoyé avec succès en langue {language}")

# Classe pour les emails de confirmation de changement d'adresse email (USERNAME_FIELD)
class CustomUsernameChangedConfirmationEmail(CustomEmailMixin, BaseConfirmationEmail):
    template_name = 'email/username_changed_confirmation_email.html'
    
    def get_context_data(self):
        """
        Ensure all required context variables are available
        """
        context = self.context
        
        # Ensure we have default values for required context variables
        if 'site_name' not in context:
            context['site_name'] = settings.SITE_NAME
            logger.debug(f"CustomUsernameChangedConfirmationEmail.get_context_data: Ajout manuel de site_name={settings.SITE_NAME} au contexte")
        
        if 'domain' not in context:
            context['domain'] = settings.DOMAIN
        
        if 'protocol' not in context:
            context['protocol'] = 'http'
            
        return context
    
    def render_subject(self):
        """
        Render the email subject from the template
        """
        template_name = "email/username_changed_confirmation_subject.txt"
        context = self.get_context_data()
        
        # S'assurer que site_name est dans le contexte
        if "site_name" not in context:
            context["site_name"] = settings.SITE_NAME
            logger.debug(f"CustomUsernameChangedConfirmationEmail.render_subject: Ajout manuel de site_name={settings.SITE_NAME} au contexte")
        
        with translation.override(self.context.get('user_language', 'fr')):
            subject = loader.render_to_string(template_name, context).strip()
            logger.debug(f"CustomUsernameChangedConfirmationEmail.render_subject: Sujet rendu: {subject}")
            return subject
