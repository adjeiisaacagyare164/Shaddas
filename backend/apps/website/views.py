from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import HomepageContent
from .serializers import HomepageContentSerializer

class PublicHomepageContentView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        content = HomepageContent.objects.first()
        if not content:
            content = HomepageContent.objects.create(
                hero_badge='New Arrivals & Trending',
                hero_title='Discover Authentic Quality & Modern Elegance',
                hero_description='Explore our curated collections of premium fashion, accessories, and essentials. Order directly with the shop owner via WhatsApp.',
                hero_image='https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
                hero_button_text='Shop Now',
                about_title='About Shaddas',
                about_description='Welcome to Shaddas. We are dedicated to bringing you top-tier quality products and a seamless, personalized shopping journey. With our direct WhatsApp ordering system, you get direct communication, custom support, and prompt delivery across Ghana.',
                about_image='https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
                about_points=[
                    'Direct & instant WhatsApp ordering',
                    'Prompt delivery across Ghana',
                    'Premium quality verified products',
                    'Direct personalized customer care'
                ]
            )
        return Response(HomepageContentSerializer(content).data, status=status.HTTP_200_OK)


class OwnerHomepageContentManageView(APIView):
    permission_classes = [IsAuthenticated]

    def get_content(self):
        content = HomepageContent.objects.first()
        if not content:
            content = HomepageContent.objects.create(
                hero_badge='New Arrivals & Trending',
                hero_title='Discover Authentic Quality & Modern Elegance',
                hero_description='Explore our curated collections of premium fashion, accessories, and essentials. Order directly with the shop owner via WhatsApp.',
                hero_image='https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
                hero_button_text='Shop Now',
                about_title='About Shaddas',
                about_description='Welcome to Shaddas. We are dedicated to bringing you top-tier quality products and a seamless, personalized shopping journey. With our direct WhatsApp ordering system, you get direct communication, custom support, and prompt delivery across Ghana.',
                about_image='https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
                about_points=[
                    'Direct & instant WhatsApp ordering',
                    'Prompt delivery across Ghana',
                    'Premium quality verified products',
                    'Direct personalized customer care'
                ]
            )
        return content

    def get(self, request):
        content = self.get_content()
        return Response(HomepageContentSerializer(content).data, status=status.HTTP_200_OK)

    def patch(self, request):
        content = self.get_content()
        serializer = HomepageContentSerializer(content, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
