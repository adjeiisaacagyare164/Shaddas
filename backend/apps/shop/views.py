from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Shop
from .serializers import ShopSerializer, PublicShopSerializer

class PublicShopView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        shop = Shop.objects.first()
        if not shop:
            shop = Shop.objects.create(
                name='Shadas',
                whatsapp_number='+233 53 558 9099',
                phone='+233 53 558 9099',
                email='info@shadas.com',
                location='Accra, Ghana',
                description='Premium shopping experience with instant WhatsApp ordering.'
            )
        return Response(PublicShopSerializer(shop).data, status=status.HTTP_200_OK)

class OwnerShopManageView(APIView):
    permission_classes = [IsAuthenticated]

    def get_shop(self):
        shop = Shop.objects.first()
        if not shop:
            shop = Shop.objects.create(
                name='Shadas',
                whatsapp_number='+233 53 558 9099',
                phone='+233 53 558 9099',
                email='info@shadas.com',
                location='Accra, Ghana'
            )
        return shop

    def get(self, request):
        shop = self.get_shop()
        return Response(ShopSerializer(shop).data, status=status.HTTP_200_OK)

    def patch(self, request):
        shop = self.get_shop()
        serializer = ShopSerializer(shop, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
