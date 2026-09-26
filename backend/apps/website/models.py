from django.db import models
import uuid

class HomepageContent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hero_badge = models.CharField(max_length=100, default='New Arrivals & Trending')
    hero_title = models.CharField(max_length=255, default='Discover Authentic Quality & Modern Elegance')
    hero_description = models.TextField(
        default='Explore our curated collections of premium fashion, accessories, and essentials. Order directly with the shop owner via WhatsApp.'
    )
    hero_image = models.TextField(blank=True, default='') # URL / Base64 / media path
    hero_button_text = models.CharField(max_length=50, default='Shop Now')

    about_title = models.CharField(max_length=255, default='About Shaddas')
    about_description = models.TextField(
        default='Welcome to Shaddas. We are dedicated to bringing you top-tier quality products and a seamless, personalized shopping journey. With our direct WhatsApp ordering system, you get direct communication, custom support, and prompt delivery across Ghana.'
    )
    about_image = models.TextField(blank=True, default='')
    about_points = models.JSONField(
        default=list, 
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'homepage_content'
        verbose_name = 'Homepage Content'
        verbose_name_plural = 'Homepage Content'

    def __str__(self):
        return f"Homepage Content (Updated: {self.updated_at.strftime('%Y-%m-%d %H:%M')})"
