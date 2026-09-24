from django.db import models
from django.conf import settings
import uuid

class Shop(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='shops')
    name = models.CharField(max_length=255, default='Shadas')
    logo = models.TextField(blank=True, default='') # Can store URL or base64
    description = models.TextField(default='Discover premium quality products with direct WhatsApp ordering.')
    whatsapp_number = models.CharField(max_length=50, default='+233 53 558 9099')
    phone = models.CharField(max_length=50, default='+233 53 558 9099')
    email = models.EmailField(default='contact@shadas.com')
    location = models.CharField(max_length=255, default='Accra, Ghana')
    instagram = models.CharField(max_length=100, blank=True, default='@shadas_official')
    facebook = models.CharField(max_length=100, blank=True, default='shadas.store')
    currency = models.CharField(max_length=10, default='GH₵')
    currency_code = models.CharField(max_length=10, default='GHS')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shops'
        verbose_name = 'Shop'
        verbose_name_plural = 'Shops'

    def __str__(self):
        return self.name
