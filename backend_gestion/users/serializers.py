from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import check_password
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

# Serializer pour la création d'utilisateur
class CreateUserSerializer(UserCreateSerializer):
    language = serializers.CharField(required=False, write_only=True)
    
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 'language']
    
    def create(self, validated_data):
        # Extraire la langue si elle est présente
        language = validated_data.pop('language', None)
        request = self.context.get('request', None)
        
        # Log des données et des en-têtes pour déboguer
        if request:
            headers = {k: v for k, v in request.META.items() if k.startswith('HTTP_')}
            logger.debug(f"CreateUserSerializer: En-têtes HTTP: {headers}")
            logger.debug(f"CreateUserSerializer: Données POST: {request.data}")
        
        # Enregistrer la langue dans le contexte de la requête pour l'utiliser plus tard
        if language:
            logger.debug(f"CreateUserSerializer: langue spécifiée: {language}")
            if request:
                setattr(request, '_user_language', language)
        elif request and 'HTTP_ACCEPT_LANGUAGE' in request.META:
            accept_lang = request.META.get('HTTP_ACCEPT_LANGUAGE')
            language = accept_lang.split(',')[0].split(';')[0].strip().lower()[:2]
            logger.debug(f"CreateUserSerializer: langue détectée dans l'en-tête HTTP: {language}")
            setattr(request, '_user_language', language)
        
        # Créer l'utilisateur normalement
        user = super().create(validated_data)
        
        # Stocker la langue dans les attributs de l'utilisateur pour référence future
        # N'est disponible que pendant cette requête
        if language:
            setattr(user, '_preferred_language', language)
            logger.debug(f"CreateUserSerializer: langue {language} associée à l'utilisateur {user.email}")
        
        return user

# Sérialiseur pour la mise à jour du profil utilisateur
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_image']
        read_only_fields = ['id', 'email']  # L'email ne peut pas être modifié
        
    def validate_first_name(self, value):
        """Valide que le prénom contient uniquement des lettres et a une longueur minimale."""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Le prénom doit contenir au moins 2 caractères.")
        if not all(c.isalpha() or c.isspace() or c == '-' for c in value):
            raise serializers.ValidationError("Le prénom doit contenir uniquement des lettres, espaces ou tirets.")
        return value.strip()
        
    def validate_last_name(self, value):
        """Valide que le nom contient uniquement des lettres et a une longueur minimale."""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Le nom doit contenir au moins 2 caractères.")
        if not all(c.isalpha() or c.isspace() or c == '-' for c in value):
            raise serializers.ValidationError("Le nom doit contenir uniquement des lettres, espaces ou tirets.")
        return value.strip()
        
    def validate_phone(self, value):
        """Valide le format du numéro de téléphone."""
        if value and not value.strip():
            return None  # Autorise une valeur vide
        
        # Enlever les espaces et caractères non numériques pour validation
        cleaned = ''.join(filter(lambda x: x.isdigit() or x in ['+', '-'], value))
        
        # Valider la longueur minimale après nettoyage
        if len(cleaned) < 6:
            raise serializers.ValidationError("Le numéro de téléphone doit contenir au moins 6 chiffres.")
            
        return cleaned
        
    def update(self, instance, validated_data):
        """Mise à jour de l'instance utilisateur avec les données validées."""
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone = validated_data.get('phone', instance.phone)
        if 'profile_image' in validated_data:
            instance.profile_image = validated_data.get('profile_image')
        instance.save()
        
        logger.debug(f"Profil utilisateur mis à jour: {instance.email}, phone: {instance.phone}")
        return instance

# Serializer pour la réinitialisation de mot de passe
class CustomPasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    re_new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        re_new_password = attrs.get('re_new_password')

        # Vérifie que les deux mots de passe correspondent
        if new_password != re_new_password:
            raise serializers.ValidationError({"re_new_password": "Les mots de passe ne correspondent pas."})

        # Récupère l'utilisateur concerné
        user = self.context['user']

        # Vérifie que le nouveau mot de passe est différent de l'ancien
        if check_password(new_password, user.password):
            raise serializers.ValidationError({"new_password": "Le nouveau mot de passe doit être différent de l'ancien."})

        # Applique les validateurs de mots de passe définis dans settings.py
        validate_password(new_password, user=user)

        return attrs