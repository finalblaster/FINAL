from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'
    
    def ready(self):
        # Importer les signaux au démarrage de l'application
        import users.signals
        
        # Compiler les traductions
        try:
            from .translation import compile_translations
            logger.info("Compilation des fichiers de traduction au démarrage...")
            if compile_translations():
                logger.info("Compilation des traductions réussie !")
            else:
                logger.warning("Problème lors de la compilation des traductions.")
        except Exception as e:
            logger.error(f"Erreur lors de la compilation des traductions: {e}")
