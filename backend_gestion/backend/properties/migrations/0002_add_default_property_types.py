from django.db import migrations

def create_default_property_types(apps, schema_editor):
    PropertyType = apps.get_model('properties', 'PropertyType')
    
    default_types = [
        {
            'code': 'studio',
            'name': 'Studio',
            'description': 'A single room that serves as living room, bedroom, and kitchen',
            'icon': 'home',
            'order': 1
        },
        {
            'code': 'one_bedroom',
            'name': 'One Bedroom',
            'description': 'Apartment with one separate bedroom',
            'icon': 'bed',
            'order': 2
        },
        {
            'code': 'two_bedrooms',
            'name': 'Two Bedrooms',
            'description': 'Apartment with two separate bedrooms',
            'icon': 'bed',
            'order': 3
        },
        {
            'code': 'three_bedrooms',
            'name': 'Three Bedrooms',
            'description': 'Apartment with three separate bedrooms',
            'icon': 'bed',
            'order': 4
        },
        {
            'code': 'four_bedrooms',
            'name': 'Four Bedrooms',
            'description': 'Apartment with four separate bedrooms',
            'icon': 'bed',
            'order': 5
        },
        {
            'code': 'five_bedrooms',
            'name': 'Five Bedrooms',
            'description': 'Apartment with five separate bedrooms',
            'icon': 'bed',
            'order': 6
        },
        {
            'code': 'loft',
            'name': 'Loft',
            'description': 'Open space with high ceilings, often converted from industrial buildings',
            'icon': 'building',
            'order': 7
        },
        {
            'code': 'house',
            'name': 'House',
            'description': 'Standalone residential building',
            'icon': 'home',
            'order': 8
        },
        {
            'code': 'villa',
            'name': 'Villa',
            'description': 'Luxury house, often with garden and pool',
            'icon': 'home',
            'order': 9
        },
        {
            'code': 'apartment',
            'name': 'Apartment',
            'description': 'Unit in a multi-unit building',
            'icon': 'building',
            'order': 10
        },
        {
            'code': 'condo',
            'name': 'Condo',
            'description': 'Individually owned unit in a multi-unit building',
            'icon': 'building',
            'order': 11
        },
        {
            'code': 'other',
            'name': 'Other',
            'description': 'Other type of property',
            'icon': 'question',
            'order': 12
        }
    ]
    
    for type_data in default_types:
        PropertyType.objects.get_or_create(
            code=type_data['code'],
            defaults=type_data
        )

def remove_default_property_types(apps, schema_editor):
    PropertyType = apps.get_model('properties', 'PropertyType')
    PropertyType.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('properties', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(
            create_default_property_types,
            remove_default_property_types
        ),
    ] 