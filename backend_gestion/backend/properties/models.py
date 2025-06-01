from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone
from users.models import User
from django.contrib.gis.db import models as gis_models

class PropertyType(models.TextChoices):
    STUDIO = 'studio', 'Studio'
    ONE_BEDROOM = 'one_bedroom', '1 Bedroom'
    TWO_BEDROOMS = 'two_bedrooms', '2 Bedrooms'
    THREE_BEDROOMS = 'three_bedrooms', '3 Bedrooms'
    FOUR_BEDROOMS = 'four_bedrooms', '4 Bedrooms'
    FIVE_BEDROOMS = 'five_bedrooms', '5 Bedrooms'
    LOFT = 'loft', 'Loft'
    HOUSE = 'house', 'House'
    VILLA = 'villa', 'Villa'
    PENTHOUSE = 'penthouse', 'Penthouse'
    TOWNHOUSE = 'townhouse', 'Townhouse'
    BUNGALOW = 'bungalow', 'Bungalow'
    COTTAGE = 'cottage', 'Cottage'
    DUPLEX = 'duplex', 'Duplex'
    TRIPLEX = 'triplex', 'Triplex'
    CONDO = 'condo', 'Condo'
    OTHER = 'other', 'Other'

class LivingSpaceType(models.TextChoices):
    ENTIRE_PROPERTY = 'entire_property', 'Entire Property'
    PRIVATE_ROOM = 'private_room', 'Private Room'
    SHARED_ROOM = 'shared_room', 'Shared Room'
    BASEMENT = 'basement', 'Basement'
    ATTIC = 'attic', 'Attic'
    ANNEX = 'annex', 'Annex'

class InfoCategory(models.TextChoices):
    ARRIVAL_DEPARTURE = 'arrival_departure', 'Arrival & Departure'
    HOUSE_RULES = 'house_rules', 'House Rules & Policies'
    AMENITIES = 'amenities', 'Amenities & Equipment'
    TRANSPORT = 'transport', 'Transport & Access'
    EMERGENCY = 'emergency', 'Emergency & Safety'
    LOCAL_INFO = 'local_info', 'Local Information'
    MAINTENANCE = 'maintenance', 'Maintenance & Support'

class InfoTag(models.TextChoices):
    # Arrival & Departure
    CHECKIN_INSTRUCTIONS = 'checkin_instructions', 'Check-in Instructions'
    CHECKOUT_INSTRUCTIONS = 'checkout_instructions', 'Check-out Instructions'
    KEY_COLLECTION = 'key_collection', 'Key Collection'
    ACCESS_CODES = 'access_codes', 'Access Codes'
    PARKING_INSTRUCTIONS = 'parking_instructions', 'Parking Instructions'
    LUGGAGE_STORAGE = 'luggage_storage', 'Luggage Storage'
    EARLY_ARRIVAL = 'early_arrival', 'Early Arrival'
    LATE_DEPARTURE = 'late_departure', 'Late Departure'

    # House Rules & Policies
    QUIET_HOURS = 'quiet_hours', 'Quiet Hours'
    SMOKING_POLICY = 'smoking_policy', 'Smoking Policy'
    PET_POLICY = 'pet_policy', 'Pet Policy'
    GUEST_POLICY = 'guest_policy', 'Guest Policy'
    CLEANING_RULES = 'cleaning_rules', 'Cleaning Rules'
    RECYCLING = 'recycling', 'Recycling'
    ENERGY_SAVING = 'energy_saving', 'Energy Saving'
    SECURITY_RULES = 'security_rules', 'Security Rules'

    # Amenities & Equipment
    WIFI_DETAILS = 'wifi_details', 'WiFi Details'
    KITCHEN_EQUIPMENT = 'kitchen_equipment', 'Kitchen Equipment'
    LAUNDRY = 'laundry', 'Laundry'
    HEATING = 'heating', 'Heating'
    AIR_CONDITIONING = 'air_conditioning', 'Air Conditioning'
    TV_ENTERTAINMENT = 'tv_entertainment', 'TV & Entertainment'
    WORKSPACE = 'workspace', 'Workspace'
    GYM_ACCESS = 'gym_access', 'Gym Access'

    # Transport & Access
    PUBLIC_TRANSPORT = 'public_transport', 'Public Transport'
    PARKING = 'parking', 'Parking'
    BIKE_STORAGE = 'bike_storage', 'Bike Storage'
    TAXI_SERVICES = 'taxi_services', 'Taxi Services'
    AIRPORT_TRANSPORT = 'airport_transport', 'Airport Transport'
    CAR_RENTAL = 'car_rental', 'Car Rental'
    WALKING_ROUTES = 'walking_routes', 'Walking Routes'
    ACCESSIBILITY = 'accessibility', 'Accessibility'

    # Emergency & Safety
    EMERGENCY_CONTACTS = 'emergency_contacts', 'Emergency Contacts'
    FIRST_AID = 'first_aid', 'First Aid'
    FIRE_SAFETY = 'fire_safety', 'Fire Safety'
    SECURITY_CODES = 'security_codes', 'Security Codes'
    INSURANCE_INFO = 'insurance_info', 'Insurance Information'
    MEDICAL_SERVICES = 'medical_services', 'Medical Services'
    POLICE_STATION = 'police_station', 'Police Station'
    EVACUATION_ROUTES = 'evacuation_routes', 'Evacuation Routes'

    # Local Information
    RESTAURANTS = 'restaurants', 'Restaurants'
    SUPERMARKETS = 'supermarkets', 'Supermarkets'
    ATTRACTIONS = 'attractions', 'Attractions'
    SHOPPING = 'shopping', 'Shopping'
    NIGHTLIFE = 'nightlife', 'Nightlife'
    PARKS = 'parks', 'Parks'
    BEACHES = 'beaches', 'Beaches'
    CULTURAL_SITES = 'cultural_sites', 'Cultural Sites'

    # Maintenance & Support
    CLEANING_SERVICE = 'cleaning_service', 'Cleaning Service'
    MAINTENANCE_CONTACT = 'maintenance_contact', 'Maintenance Contact'
    GARBAGE_COLLECTION = 'garbage_collection', 'Garbage Collection'
    RECYCLING_SCHEDULE = 'recycling_schedule', 'Recycling Schedule'
    PEST_CONTROL = 'pest_control', 'Pest Control'
    GARDENING = 'gardening', 'Gardening'
    POOL_MAINTENANCE = 'pool_maintenance', 'Pool Maintenance'
    TECHNICAL_SUPPORT = 'technical_support', 'Technical Support'

class InfoImportance(models.TextChoices):
    ANNOUNCEMENT = 'announcement', 'Announcement'
    CRITICAL = 'critical', 'Critical'
    IMPORTANT = 'important', 'Important'
    OPTIONAL = 'optional', 'Optional'

# Importance weights for each level
IMPORTANCE_WEIGHTS = {
    InfoImportance.ANNOUNCEMENT: 1.0,
    InfoImportance.CRITICAL: 0.9,
    InfoImportance.IMPORTANT: 0.6,
    InfoImportance.OPTIONAL: 0.3,
}

class Property(models.Model):
    """
    Main property model containing core information about the property.
    """
    # Basic Information
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='properties',
        verbose_name="Owner"
    )
    name = models.CharField(
        max_length=100,
        verbose_name="Property Name"
    )
    type = models.CharField(
        max_length=20,
        choices=PropertyType.choices,
        default=PropertyType.OTHER,
        verbose_name="Property Type"
    )
    description = models.TextField(
        blank=True,
        verbose_name="Description"
    )

    # Location Information
    address = models.TextField(
        verbose_name="Full Address"
    )
    city = models.CharField(
        max_length=100,
        verbose_name="City"
    )
    postal_code = models.CharField(
        max_length=10,
        verbose_name="Postal Code"
    )
    country = models.CharField(
        max_length=100,
        default="France",
        verbose_name="Country"
    )
    neighborhood = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Neighborhood"
    )
    location = gis_models.PointField(
        null=True,
        blank=True,
        verbose_name="Location"
    )

    # Building Characteristics
    total_floors = models.IntegerField(
        default=1,
        verbose_name="Total Floors"
    )
    floor = models.IntegerField(
        default=0,
        verbose_name="Floor"
    )
    surface_m2 = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Surface Area (m²)"
    )
    year_built = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="Year Built"
    )
    has_elevator = models.BooleanField(
        default=False,
        verbose_name="Elevator"
    )
    has_garden = models.BooleanField(
        default=False,
        verbose_name="Garden"
    )
    has_balcony = models.BooleanField(
        default=False,
        verbose_name="Balcony"
    )
    has_terrace = models.BooleanField(
        default=False,
        verbose_name="Terrace"
    )
    has_parking = models.BooleanField(
        default=False,
        verbose_name="Parking"
    )
    is_accessible = models.BooleanField(
        default=False,
        verbose_name="Wheelchair Accessible"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At"
    )

    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"

class LivingConditions(models.Model):
    """
    Model representing the living conditions and access rights for the property.
    """
    property = models.OneToOneField(
        Property,
        on_delete=models.CASCADE,
        related_name='living_conditions',
        verbose_name="Property"
    )
    living_space_type = models.CharField(
        max_length=20,
        choices=LivingSpaceType.choices,
        default=LivingSpaceType.ENTIRE_PROPERTY,
        verbose_name="Available Space Type"
    )
    bedroom_count = models.IntegerField(
        default=1,
        verbose_name="Number of Bedrooms"
    )
    bed_count = models.IntegerField(
        default=1,
        verbose_name="Number of Beds"
    )
    bathroom_count = models.IntegerField(
        default=1,
        verbose_name="Number of Bathrooms"
    )
    max_guests = models.IntegerField(
        default=2,
        verbose_name="Maximum Guests"
    )
    has_private_bathroom = models.BooleanField(
        default=False,
        verbose_name="Private Bathroom"
    )
    has_private_entrance = models.BooleanField(
        default=False,
        verbose_name="Private Entrance"
    )
    has_shared_spaces = models.BooleanField(
        default=False,
        verbose_name="Shared Spaces"
    )
    allowed_areas = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True,
        verbose_name="Allowed Areas"
    )
    restricted_areas = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True,
        verbose_name="Restricted Areas"
    )
    checkin_time = models.TimeField(
        null=True,
        blank=True,
        verbose_name="Check-in Time"
    )
    checkout_time = models.TimeField(
        null=True,
        blank=True,
        verbose_name="Check-out Time"
    )

    class Meta:
        verbose_name = "Living Conditions"
        verbose_name_plural = "Living Conditions"

    def __str__(self):
        return f"Living Conditions for {self.property.name}"

class PropertyInfo(models.Model):
    """
    Model representing dynamic information and instructions for the property.
    """
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='info_entries',
        verbose_name="Property"
    )
    category = models.CharField(
        max_length=20,
        choices=InfoCategory.choices,
        default=InfoCategory.ARRIVAL_DEPARTURE,
        verbose_name="Category"
    )
    tags = ArrayField(
        models.CharField(max_length=50, choices=InfoTag.choices),
        default=list,
        verbose_name="Tags"
    )
    title = models.CharField(
        max_length=200,
        verbose_name="Title"
    )
    content = models.TextField(
        verbose_name="Content"
    )
    importance = models.CharField(
        max_length=20,
        choices=InfoImportance.choices,
        default=InfoImportance.OPTIONAL,
        verbose_name="Importance"
    )
    valid_until = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Valid Until"
    )
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='property_info_entries',
        verbose_name="Author"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At"
    )

    class Meta:
        verbose_name = "Property Information"
        verbose_name_plural = "Property Information"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['valid_until']),
            models.Index(fields=['is_active']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return f"{self.category} - {self.title}"

    def is_valid(self):
        if self.valid_until is None:
            return True
        return timezone.now() <= self.valid_until

class PropertyInfoFile(models.Model):
    """
    Model representing files attached to property information.
    Files can be images, documents, or any other type of file.
    """
    info_entry = models.ForeignKey(
        PropertyInfo,
        on_delete=models.CASCADE,
        related_name='files',
        verbose_name="Information"
    )
    file = models.FileField(
        upload_to='property_info_files/%Y/%m/%d/',
        verbose_name="File"
    )
    file_type = models.CharField(
        max_length=20,
        choices=[
            ('image', 'Image'),
            ('document', 'Document'),
            ('manual', 'Manual'),
            ('map', 'Map'),
            ('other', 'Other')
        ],
        default='other',
        verbose_name="File Type"
    )
    description = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Description"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At"
    )

    class Meta:
        verbose_name = "Property Information File"
        verbose_name_plural = "Property Information Files"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_active']),
            models.Index(fields=['file_type']),
        ]

    def __str__(self):
        return f"{self.file.name} - {self.description[:50]}..." 