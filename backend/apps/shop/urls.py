from django.urls import path
from .views import PublicShopView, OwnerShopManageView

urlpatterns = [
    path('info/', PublicShopView.as_view(), name='public-shop-info'),
    path('manage/', OwnerShopManageView.as_view(), name='owner-shop-manage'),
]
