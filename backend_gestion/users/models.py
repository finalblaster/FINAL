from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_("First Name"), max_length = 100)
    last_name = models.CharField(_("Last Name"), max_length = 100)
    email = models.EmailField(_("Email Adress"), max_length=254, unique=True)
    phone = models.CharField(_("Phone Number"), max_length=20, blank=True, null=True, default='')
    profile_image = models.ImageField(_("Profile Image"), upload_to='profile_images/', blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.email

    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_properties(self):
        """
        Retourne toutes les propriétés de l'utilisateur.
        """
        return self.properties.all()

    def get_active_properties(self):
        """
        Retourne les propriétés actives de l'utilisateur.
        """
        return self.properties.filter(is_active=True)

    def add_property(self, **kwargs):
        """
        Ajoute une nouvelle propriété à l'utilisateur.
        """
        from properties.models import Property
        return Property.objects.create(owner=self, **kwargs)

    def has_property(self, property_id):
        """
        Vérifie si l'utilisateur possède une propriété spécifique.
        """
        return self.properties.filter(id=property_id).exists()

    def get_property_info_entries(self, property_id=None):
        """
        Retourne toutes les entrées d'information des propriétés de l'utilisateur.
        Si property_id est spécifié, retourne uniquement les entrées de cette propriété.
        """
        if property_id:
            return self.properties.get(id=property_id).info_entries.all()
        return self.properties.prefetch_related('info_entries').all()