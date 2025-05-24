from django.urls import path, include
from .views import resend_verification_email, activate_email_change, login, CustomUserViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', CustomUserViewSet)

urlpatterns = [
    path('users/login/', login, name='custom-login'),
    path('resend-verification/', resend_verification_email, name='resend-verification'),
    path('activate_email_change/', activate_email_change, name='activate-email-change'),
    path('resend-email-change-confirmation/', CustomUserViewSet.as_view({'post': 'resend_email_change_confirmation'}), name='resend-email-change-confirmation'),
    path('', include(router.urls)),
    path('', include('djoser.urls.jwt')),
] 