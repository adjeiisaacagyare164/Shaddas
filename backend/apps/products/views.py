from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from .models import Category, Product
from .serializers import (
    CategorySerializer, 
    OwnerCategorySerializer, 
    ProductSerializer, 
    PublicProductSerializer
)

class PublicCategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all().order_by('name')
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PublicProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Only published products are visible to the public
        queryset = Product.objects.filter(status='published').select_related('category')

        # Filter by category slug or id
        category_param = request.query_params.get('category', '').strip()
        if category_param:
            queryset = queryset.filter(
                Q(category__slug__iexact=category_param) | Q(category__id__iexact=category_param)
            )

        # Search query
        search_param = request.query_params.get('search', '').strip()
        if search_param:
            queryset = queryset.filter(
                Q(name__icontains=search_param) | 
                Q(description__icontains=search_param) |
                Q(category__name__icontains=search_param)
            )

        # Filter by featured
        featured_param = request.query_params.get('featured', '').strip().lower()
        if featured_param in ['true', '1']:
            queryset = queryset.filter(is_featured=True)

        # Filter by availability
        in_stock_param = request.query_params.get('in_stock', '').strip().lower()
        if in_stock_param in ['true', '1']:
            queryset = queryset.filter(availability=True)

        # Ordering
        sort_param = request.query_params.get('sort', 'newest').strip().lower()
        if sort_param == 'price_asc':
            queryset = queryset.order_by('price')
        elif sort_param == 'price_desc':
            queryset = queryset.order_by('-price')
        elif sort_param == 'name_asc':
            queryset = queryset.order_by('name')
        else: # newest
            queryset = queryset.order_by('-created_at')

        # Limit if requested (e.g. limit=8 for home page sections)
        limit_param = request.query_params.get('limit')
        if limit_param and limit_param.isdigit():
            queryset = queryset[:int(limit_param)]

        serializer = PublicProductSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PublicProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk_or_slug):
        try:
            # Try UUID/id first or slug
            product = Product.objects.select_related('category').get(
                Q(id=pk_or_slug) | Q(slug=pk_or_slug),
                status='published'
            )
        except (Product.DoesNotExist, ValueError):
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PublicProductSerializer(product)
        data = serializer.data

        # Fetch up to 4 related products from the same category
        related_qs = Product.objects.filter(
            status='published',
            category=product.category
        ).exclude(id=product.id).order_by('-created_at')[:4]
        data['related_products'] = PublicProductSerializer(related_qs, many=True).data

        return Response(data, status=status.HTTP_200_OK)


# =======================================================================
# OWNER ENDPOINTS (Authentication required)
# =======================================================================

class OwnerProductListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Product.objects.all().select_related('category')

        # Filter by status (draft, published, hidden, all)
        status_param = request.query_params.get('status', '').strip()
        if status_param and status_param != 'all':
            queryset = queryset.filter(status=status_param)

        # Filter by category
        category_param = request.query_params.get('category', '').strip()
        if category_param and category_param != 'all':
            queryset = queryset.filter(category_id=category_param)

        # Search filter
        search_param = request.query_params.get('search', '').strip()
        if search_param:
            queryset = queryset.filter(
                Q(name__icontains=search_param) | 
                Q(description__icontains=search_param)
            )

        queryset = queryset.order_by('-created_at')
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OwnerProductDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Product.objects.select_related('category').get(pk=pk)
        except Product.DoesNotExist:
            return None

    def get(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response({'detail': 'Product deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class OwnerCategoryListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.all().order_by('name')
        serializer = OwnerCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = OwnerCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OwnerCategoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return None

    def get(self, request, pk):
        cat = self.get_object(pk)
        if not cat:
            return Response({'detail': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = OwnerCategorySerializer(cat)
        # Also return products under this category
        products = Product.objects.filter(category=cat).order_by('-created_at')
        data = serializer.data
        data['products'] = ProductSerializer(products, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        cat = self.get_object(pk)
        if not cat:
            return Response({'detail': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = OwnerCategorySerializer(cat, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        cat = self.get_object(pk)
        if not cat:
            return Response({'detail': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)
        cat.delete()
        return Response({'detail': 'Category deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class OwnerDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_products = Product.objects.count()
        published_products = Product.objects.filter(status='published').count()
        hidden_products = Product.objects.filter(status='hidden').count()
        draft_products = Product.objects.filter(status='draft').count()
        total_categories = Category.objects.count()

        recent_products = Product.objects.select_related('category').order_by('-created_at')[:6]

        return Response({
            'stats': {
                'total_products': total_products,
                'published_products': published_products,
                'hidden_products': hidden_products,
                'draft_products': draft_products,
                'total_categories': total_categories,
            },
            'recent_products': ProductSerializer(recent_products, many=True).data
        }, status=status.HTTP_200_OK)
