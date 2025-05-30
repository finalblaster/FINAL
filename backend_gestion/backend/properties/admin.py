from django.contrib import admin
from .models import Property, PropertyInfoEntry, PropertyInfoFile

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'address', 'owner', 'created_at')
    list_filter = ('type', 'has_garden', 'has_balcony', 'is_accessible')
    search_fields = ('name', 'address', 'description')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Informations générales', {
            'fields': ('owner', 'name', 'type', 'address', 'description')
        }),
        ('Caractéristiques', {
            'fields': ('floor', 'surface_m2', 'has_garden', 'has_balcony', 'is_accessible')
        }),
        ('Informations pratiques', {
            'fields': (
                'wifi_name', 'wifi_password', 'access_code',
                'checkin_method', 'arrival_notes',
                'public_transport_notes', 'surroundings'
            )
        }),
        ('Localisation', {
            'fields': ('location',),
            'classes': ('collapse',)
        }),
        ('Métadonnées', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

@admin.register(PropertyInfoEntry)
class PropertyInfoEntryAdmin(admin.ModelAdmin):
    list_display = ('property', 'category', 'importance', 'effective_score', 'is_valid', 'visible_to_guest', 'created_at')
    list_filter = ('importance', 'category', 'valid_until', 'visible_to_guest')
    search_fields = ('content', 'category', 'tags')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Informations principales', {
            'fields': ('property', 'content', 'category', 'tags')
        }),
        ('Importance et validité', {
            'fields': ('importance', 'score_override', 'valid_until', 'visible_to_guest')
        }),
        ('Métadonnées', {
            'fields': ('author', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(PropertyInfoFile)
class PropertyInfoFileAdmin(admin.ModelAdmin):
    list_display = ('info_entry', 'file', 'description', 'created_at')
    search_fields = ('description', 'file')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Informations principales', {
            'fields': ('info_entry', 'file', 'description')
        }),
        ('Métadonnées', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    ) 