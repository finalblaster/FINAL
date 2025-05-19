from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, resend_verification_email, activate_email_change

# Créer un routeur pour les vues REST
router = DefaultRouter()
router.register("users", CustomUserViewSet)

# URL patterns pour les vues utilisateur personnalisées
urlpatterns = [
    # Inclure notre vue personnalisée
    path("", include(router.urls)),
    
    # Ajouter des endpoints spécifiques
    path("resend-verification/", resend_verification_email, name="resend-verification"),
    path("activate_email_change/", activate_email_change, name="activate-email-change"),
    
    # Inclure les autres URLs standards de Djoser (login, JWT, etc.)
    path("", include("djoser.urls.jwt")),
    
    # Redirections pour les URLs de Djoser que nous ne surchargeons pas
    re_path(r"^jwt/", include("djoser.urls.jwt")),
    re_path(r"^token/", include("djoser.urls.authtoken")),
] 