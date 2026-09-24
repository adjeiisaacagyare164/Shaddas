from django.urls import path
from .views import (
    PublicCategoryListView,
    PublicProductListView,
    PublicProductDetailView,
    OwnerProductListCreateView,
    OwnerProductDetailView,
    OwnerCategoryListCreateView,
    OwnerCategoryDetailView,
    OwnerDashboardStatsView
)

urlpatterns = [
    # Public endpoints
    path('public/categories/', PublicCategoryListView.as_view(), name='public-categories'),
    path('public/products/', PublicProductListView.as_view(), name='public-products'),
    path('public/products/<str:pk_or_slug>/', PublicProductDetailView.as_view(), name='public-product-detail'),

    # Owner endpoints
    path('owner/dashboard/stats/', OwnerDashboardStatsView.as_view(), name='owner-stats'),
    path('owner/products/', OwnerProductListCreateView.as_view(), name='owner-products-list-create'),
    path('owner/products/<uuid:pk>/', OwnerProductDetailView.as_view(), name='owner-product-detail'),
    path('owner/categories/', OwnerCategoryListCreateView.as_view(), name='owner-categories-list-create'),
    path('owner/categories/<uuid:pk>/', OwnerCategoryDetailView.as_view(), name='owner-category-detail'),
]
