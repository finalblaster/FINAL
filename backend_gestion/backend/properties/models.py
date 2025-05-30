from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone
from users.models import User
from django.contrib.gis.db import models as gis_models

class PropertyType(models.TextChoices):
    STUDIO = 'studio', 'Studio'
    T1 = 't1', 'T1'
    T2 = 't2', 'T2'
    T3 = 't3', 'T3'
    T4 = 't4', 'T4'
    T5 = 't5', 'T5'
    LOFT = 'loft', 'Loft'
    HOUSE = 'house', 'Maison'
    VILLA = 'villa', 'Villa'
    OTHER = 'other', 'Autre'

class InfoImportance(models.TextChoices):
    ANNOUNCEMENT = 'announcement', 'Annonce'
    CRITICAL = 'critical', 'Critique'
    IMPORTANT = 'important', 'Important'
    OPTIONAL = 'optional', 'Optionnel'

class PropertyInfoCategory(models.TextChoices):
    WIFI = 'wifi', 'WiFi'
    CHECKIN = 'checkin', 'Arrivée'
    TRANSPORT = 'transport', 'Transport'
    ENVIRONMENT = 'environment', 'Environnement'
    OTHER = 'other', 'Autre'

# Poids d'importance pour chaque niveau
IMPORTANCE_WEIGHTS = {
    InfoImportance.ANNOUNCEMENT: 1.0,
    InfoImportance.CRITICAL: 0.9,
    InfoImportance.IMPORTANT: 0.6,
    InfoImportance.OPTIONAL: 0.3,
}

class Property(models.Model):
    """
    Modèle représentant une propriété immobilière.
    """
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='properties',
        verbose_name="Propriétaire"
    )
    name = models.CharField(
        max_length=100,
        verbose_name="Nom de la propriété"
    )
    address = models.TextField(
        verbose_name="Adresse complète"
    )
    description = models.TextField(
        blank=True,
        verbose_name="Description"
    )
    type = models.CharField(
        max_length=20,
        choices=PropertyType.choices,
        default=PropertyType.OTHER,
        verbose_name="Type de propriété"
    )
    floor = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="Étage"
    )
    surface_m2 = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Surface (m²)"
    )
    has_garden = models.BooleanField(
        default=False,
        verbose_name="Jardin"
    )
    has_balcony = models.BooleanField(
        default=False,
        verbose_name="Balcon"
    )
    is_accessible = models.BooleanField(
        default=False,
        verbose_name="Accessible PMR"
    )

    # Informations pratiques
    wifi_name = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Nom du WiFi"
    )
    wifi_password = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Mot de passe WiFi"
    )
    access_code = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Code d'accès"
    )
    checkin_method = models.TextField(
        blank=True,
        verbose_name="Méthode d'arrivée"
    )
    arrival_notes = models.TextField(
        blank=True,
        verbose_name="Notes d'arrivée"
    )
    public_transport_notes = models.TextField(
        blank=True,
        verbose_name="Notes transports"
    )
    surroundings = models.TextField(
        blank=True,
        verbose_name="Environnement"
    )

    # Localisation
    location = gis_models.PointField(
        null=True,
        blank=True,
        verbose_name="Localisation"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )

    class Meta:
        verbose_name = "Propriété"
        verbose_name_plural = "Propriétés"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"

class PropertyInfoEntry(models.Model):
    """
    Modèle représentant une entrée d'information pratique pour une propriété.
    """
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='info_entries',
        verbose_name="Propriété"
    )
    content = models.TextField(
        verbose_name="Contenu"
    )
    category = models.CharField(
        max_length=20,
        choices=PropertyInfoCategory.choices,
        default=PropertyInfoCategory.OTHER,
        verbose_name="Catégorie"
    )
    tags = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        default=list,
        verbose_name="Tags"
    )
    importance = models.CharField(
        max_length=20,
        choices=InfoImportance.choices,
        default=InfoImportance.OPTIONAL,
        verbose_name="Importance"
    )
    score_override = models.FloatField(
        null=True,
        blank=True,
        verbose_name="Score personnalisé"
    )
    valid_until = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Valide jusqu'au"
    )
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='info_entries',
        verbose_name="Auteur"
    )
    visible_to_guest = models.BooleanField(
        default=True,
        verbose_name="Visible par les locataires"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Actif"
    )
    lang = models.CharField(
        max_length=2,
        default='fr',
        verbose_name="Langue"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Dernière modification"
    )

    class Meta:
        verbose_name = "Information"
        verbose_name_plural = "Informations"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['valid_until']),
            models.Index(fields=['is_active']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return f"{self.category} - {self.content[:50]}..."

    @property
    def effective_score(self):
        """
        Retourne le score effectif de l'entrée.
        Si score_override est défini, le retourne.
        Sinon, retourne le poids d'importance correspondant.
        """
        if self.score_override is not None:
            return self.score_override
        return IMPORTANCE_WEIGHTS[self.importance]

    def is_valid(self):
        """
        Vérifie si l'entrée est toujours valide.
        """
        if self.valid_until is None:
            return True
        return timezone.now() <= self.valid_until

    def as_rag_chunk(self):
        """
        Retourne un dictionnaire contenant les informations importantes
        pour l'indexation RAG/NLP.
        """
        return {
            'property_id': self.property.id,
            'property_name': self.property.name,
            'category': self.get_category_display(),
            'importance': self.get_importance_display(),
            'effective_score': self.effective_score,
            'content': self.content,
            'tags': self.tags,
            'visible_to_guest': self.visible_to_guest,
            'is_active': self.is_active,
            'lang': self.lang,
            'valid_until': self.valid_until.isoformat() if self.valid_until else None,
        }

class PropertyInfoFile(models.Model):
    """
    Modèle représentant un fichier attaché à une entrée d'information.
    """
    info_entry = models.ForeignKey(
        PropertyInfoEntry,
        on_delete=models.CASCADE,
        related_name='files',
        verbose_name="Information"
    )
    file = models.FileField(
        upload_to='property_info_files/%Y/%m/%d/',
        verbose_name="Fichier"
    )
    description = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Description"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Actif"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )

    class Meta:
        verbose_name = "Fichier"
        verbose_name_plural = "Fichiers"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.file.name} - {self.description[:50]}..." 