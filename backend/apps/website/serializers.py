from rest_framework import serializers
from .models import HomepageContent

class HomepageContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomepageContent
        fields = [
            'id', 'hero_badge', 'hero_title', 'hero_description',
            'hero_image', 'hero_button_text', 'about_title',
            'about_description', 'about_image', 'about_points',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
