from django.utils import translation
import logging
import os
from pathlib import Path
import subprocess

logger = logging.getLogger(__name__)

def compile_translations():
    """
    Compile tous les fichiers de traduction PO en fichiers MO.
    Cette fonction peut être appelée manuellement ou pendant le démarrage de l'application.
    """
    try:
        # Déterminer le chemin vers les fichiers de localisation
        base_dir = Path(__file__).resolve().parent.parent
        locale_dir = os.path.join(base_dir, 'locale')
        
        # Vérifier que le répertoire existe
        if not os.path.exists(locale_dir):
            logger.error(f"Le répertoire de localisation n'existe pas: {locale_dir}")
            return False
        
        # Parcourir tous les répertoires de langue
        for lang_dir in os.listdir(locale_dir):
            lang_path = os.path.join(locale_dir, lang_dir, 'LC_MESSAGES')
            if os.path.exists(lang_path):
                po_file = os.path.join(lang_path, 'django.po')
                mo_file = os.path.join(lang_path, 'django.mo')
                
                if os.path.exists(po_file):
                    logger.info(f"Compilation du fichier de traduction pour {lang_dir}")
                    try:
                        # Essayer de compiler avec msgfmt (nécessite gettext)
                        subprocess.run(['msgfmt', '-o', mo_file, po_file], check=True)
                        logger.info(f"Compilation réussie pour {lang_dir}")
                    except subprocess.CalledProcessError as e:
                        logger.error(f"Erreur lors de la compilation pour {lang_dir}: {e}")
                    except FileNotFoundError:
                        logger.error("La commande msgfmt n'est pas disponible. Veuillez installer gettext.")
                else:
                    logger.warning(f"Fichier PO non trouvé pour {lang_dir}")
        
        return True
    except Exception as e:
        logger.error(f"Erreur lors de la compilation des traductions: {e}")
        return False

def set_language_for_template(context, language_code):
    """
    Définit la langue dans le contexte du template.
    
    :param context: Le contexte du template
    :param language_code: Le code de langue (fr, en, es, de)
    :return: Le contexte mis à jour
    """
    # Valider le code de langue
    supported_languages = ['fr', 'en', 'es', 'de']
    if language_code not in supported_languages:
        language_code = 'fr'  # Langue par défaut
    
    # Ajouter la langue au contexte
    context['current_language'] = language_code
    
    # Retourner le contexte mis à jour
    return context

def get_language_from_request(request):
    """
    Extrait la langue préférée de la requête.
    
    :param request: La requête HTTP
    :return: Le code de langue (fr, en, es, de)
    """
    # Langues supportées
    supported_languages = ['fr', 'en', 'es', 'de']
    
    # 1. Vérifier si la langue est stockée dans la requête
    if hasattr(request, '_user_language'):
        language = getattr(request, '_user_language')
        if language in supported_languages:
            return language
    
    # 2. Vérifier les paramètres de requête
    if 'lang' in request.GET:
        language = request.GET.get('lang')
        if language in supported_languages:
            return language
    
    # 3. Vérifier l'en-tête Accept-Language
    if 'HTTP_ACCEPT_LANGUAGE' in request.META:
        accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
        languages = [lang.split(';')[0].lower() for lang in accept_lang.split(',')]
        
        for lang in languages:
            if lang in supported_languages:
                return lang
            # Vérifier juste le code de langue principal (2 lettres)
            lang_prefix = lang[:2]
            if lang_prefix in supported_languages:
                return lang_prefix
    
    # 4. Utiliser la langue par défaut
    return 'fr' 