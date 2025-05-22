from django.urls import path, include
from .views import resend_verification_email, activate_email_change, login

urlpatterns = [
    path('users/login/', login, name='custom-login'),
    path('resend-verification/', resend_verification_email, name='resend-verification'),
    path('activate_email_change/', activate_email_change, name='activate-email-change'),
    path('', include('djoser.urls')),
    path('', include('djoser.urls.jwt')),
] 