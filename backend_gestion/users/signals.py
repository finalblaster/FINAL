from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from djoser.signals import user_registered, user_activated
from django.utils import translation
from djoser.email import ActivationEmail
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

# Variable globale pour stocker temporairement la langue entre les requêtes
# (non idéal pour la production, mais utile pour le débogage)
TEMP_USER_LANGUAGES = {}

@receiver(user_registered)
def set_language_for_activation_email(sender, user, request, **kwargs):
    """
    Ce signal est déclenché juste après l'enregistrement d'un utilisateur via Djoser.
    Il permet de récupérer la langue de la requête et de la stocker temporairement
    pour que le service d'envoi d'email puisse y accéder plus tard.
    """
    logger.debug("Signal user_registered déclenché pour %s", user.email)
    logger.debug("Signal user_registered: données de la requête: %s", 
                request.data if hasattr(request, 'data') else 'Pas de données')
    logger.debug("Signal user_registered: en-têtes HTTP: %s", 
                request.META if hasattr(request, 'META') else "Pas d'en-têtes")
    
    # Récupérer la langue depuis plusieurs sources possibles
    language = None
    
    # 1. Vérifier dans les données POST
    if hasattr(request, 'data') and 'language' in request.data:
        language = request.data.get('language')
        logger.debug("Signal user_registered: langue trouvée dans les données POST: %s", language)
    
    # 2. Vérifier dans l'attribut _user_language de la requête
    elif hasattr(request, '_user_language'):
        language = getattr(request, '_user_language')
        logger.debug("Signal user_registered: langue trouvée dans _user_language: %s", language)
    
    # 3. Vérifier dans l'en-tête HTTP
    elif hasattr(request, 'META') and 'HTTP_ACCEPT_LANGUAGE' in request.META:
        accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
        language = accept_lang.split(',')[0].split(';')[0].strip().lower()[:2]
        logger.debug("Signal user_registered: langue trouvée dans l'en-tête HTTP: %s", language)
    
    # Normaliser et valider la langue
    if language:
        language = language.lower()[:2]
        supported_languages = ['fr', 'en', 'es', 'de']
        if language not in supported_languages:
            logger.debug("Signal user_registered: langue non supportée (%s). Utilisation de la langue par défaut.", language)
            language = 'fr'
    else:
        language = 'fr'
        logger.debug("Signal user_registered: aucune langue trouvée, utilisation de la langue par défaut")
    
    logger.debug("Signal user_registered: langue finale choisie: %s", language)
    
    # Stocker la langue de plusieurs façons pour s'assurer qu'elle sera disponible
    # 1. Dans les attributs de l'utilisateur
    setattr(user, '_activation_email_language', language)
    logger.debug("Signal user_registered: langue stockée dans les attributs de l'utilisateur: %s", language)
    
    # 2. Dans le dictionnaire temporaire
    TEMP_USER_LANGUAGES[user.email] = language
    logger.debug("Signal user_registered: langue stockée dans TEMP_USER_LANGUAGES: %s", language)
    
    # 3. Dans la requête si elle existe
    if hasattr(request, '_user_language'):
        setattr(request, '_user_language', language)
        logger.debug("Signal user_registered: langue stockée dans la requête: %s", language)
    
    # 4. Dans le contexte de l'email
    if 'context' in kwargs:
        kwargs['context']['user_language'] = language
        logger.debug("Signal user_registered: langue stockée dans le contexte: %s", language)
    
    # Activer la langue pour la durée de la requête
    translation.activate(language)
    logger.debug("Signal user_registered: langue activée: %s", language)
    
    return language  # Retourner la langue pour référence

# Ajouter un autre signal pour les inscriptions
@receiver(post_save, sender=User)
def user_post_save_language(sender, instance, created, **kwargs):
    """
    Signal déclenché après la sauvegarde d'un utilisateur
    (fonctionne même si le signal user_registered ne se déclenche pas)
    """
    if created:
        logger.debug(f"Signal post_save déclenché pour nouvel utilisateur {instance.email}")
        # Vérifier si l'utilisateur a déjà un attribut de langue
        if hasattr(instance, '_activation_email_language'):
            language = getattr(instance, '_activation_email_language')
            logger.debug(f"Signal post_save: utilisateur a déjà une langue attachée: {language}")
        else:
            # Essayer de récupérer depuis notre dictionnaire temporaire
            language = TEMP_USER_LANGUAGES.get(instance.email)
            if language:
                setattr(instance, '_activation_email_language', language)
                logger.debug(f"Signal post_save: langue récupérée depuis TEMP_USER_LANGUAGES: {language}")
            else:
                logger.debug(f"Signal post_save: utilisateur n'a pas de langue attachée") 

# Ajouter un signal pour l'activation d'utilisateur
@receiver(user_registered)
def store_language_in_temp_dict(sender, user, request, **kwargs):
    """
    Signal pour stocker la langue dans TEMP_USER_LANGUAGES lors de l'inscription
    """
    from users.email import TEMP_USER_LANGUAGES
    
    # Déterminer la langue
    language = None
    
    # 1. Vérifier dans les données POST
    if hasattr(request, 'data') and 'language' in request.data:
        language = request.data.get('language')
        logger.debug(f"store_language_in_temp_dict: langue trouvée dans les données POST: {language}")
    
    # 2. Vérifier dans l'attribut _user_language de la requête
    elif hasattr(request, '_user_language'):
        language = getattr(request, '_user_language')
        logger.debug(f"store_language_in_temp_dict: langue trouvée dans _user_language: {language}")
    
    # 3. Vérifier dans l'en-tête HTTP
    elif hasattr(request, 'META') and 'HTTP_ACCEPT_LANGUAGE' in request.META:
        accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
        language = accept_lang.split(',')[0].split(';')[0].strip().lower()[:2]
        logger.debug(f"store_language_in_temp_dict: langue trouvée dans l'en-tête HTTP: {language}")
    
    # Normaliser et valider la langue
    if language:
        language = language.lower()[:2]
        supported_languages = ['fr', 'en', 'es', 'de']
        if language not in supported_languages:
            logger.debug(f"store_language_in_temp_dict: langue non supportée ({language}). Utilisation de la langue par défaut.")
            language = 'fr'
    else:
        language = 'fr'
        logger.debug(f"store_language_in_temp_dict: aucune langue trouvée, utilisation de la langue par défaut")
    
    # Stocker la langue dans le dictionnaire temporaire
    TEMP_USER_LANGUAGES[user.email] = language
    logger.debug(f"store_language_in_temp_dict: langue {language} stockée pour {user.email}")

# Signal pour gérer l'activation d'utilisateur et transmettre la langue à l'email de confirmation
@receiver(user_activated)
def set_language_for_confirmation_email(sender, user, request, **kwargs):
    """
    Signal qui s'exécute après l'activation d'un utilisateur
    Utilisé pour attacher la langue à l'email de confirmation
    """
    from users.email import TEMP_USER_LANGUAGES
    
    logger.debug(f"Signal user_activated déclenché pour {user.email}")
    
    # 1. Vérifier si l'utilisateur a une langue stockée dans TEMP_USER_LANGUAGES
    language = TEMP_USER_LANGUAGES.get(user.email)
    if language:
        logger.debug(f"set_language_for_confirmation_email: langue trouvée dans TEMP_USER_LANGUAGES: {language}")
    else:
        # 2. Vérifier dans la requête
        if hasattr(request, '_user_language'):
            language = getattr(request, '_user_language')
            logger.debug(f"set_language_for_confirmation_email: langue trouvée dans la requête: {language}")
        # 3. Vérifier dans l'en-tête HTTP
        elif hasattr(request, 'META') and 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip().lower()[:2]
            logger.debug(f"set_language_for_confirmation_email: langue détectée dans l'en-tête HTTP: {language}")
        else:
            # 4. Utiliser la langue par défaut
            language = 'fr'
            logger.debug(f"set_language_for_confirmation_email: aucune langue trouvée, utilisation par défaut")
    
    # Normaliser et valider la langue
    if language:
        language = language.lower()[:2]
        supported_languages = ['fr', 'en', 'es', 'de']
        if language not in supported_languages:
            logger.debug(f"set_language_for_confirmation_email: langue non supportée ({language}). Utilisation de la langue par défaut.")
            language = 'fr'
    
    logger.debug(f"set_language_for_confirmation_email: langue finale choisie: {language}")
    
    # Stocker la langue dans la requête pour la méthode send de l'email
    setattr(request, '_user_language', language)
    logger.debug(f"set_language_for_confirmation_email: langue {language} stockée dans la requête")
    
    # Stocker à nouveau dans TEMP_USER_LANGUAGES pour s'assurer qu'elle est disponible
    TEMP_USER_LANGUAGES[user.email] = language
    logger.debug(f"set_language_for_confirmation_email: langue {language} stockée dans TEMP_USER_LANGUAGES")
    
    # Activer la langue pour le traitement actuel
    translation.activate(language)
    logger.debug(f"set_language_for_confirmation_email: langue {language} activée pour la requête") 