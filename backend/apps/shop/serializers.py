from rest_framework import serializers
from .models import Shop

class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = [
            'id', 'name', 'logo', 'description', 'whatsapp_number',
            'phone', 'email', 'location', 'instagram', 'facebook',
            'currency', 'currency_code', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PublicShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = [
            'id', 'name', 'logo', 'description', 'whatsapp_number',
            'phone', 'email', 'location', 'instagram', 'facebook',
            'currency', 'currency_code'
        ]
