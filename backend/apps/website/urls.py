from django.urls import path
from .views import PublicHomepageContentView, OwnerHomepageContentManageView

urlpatterns = [
    path('homepage/', PublicHomepageContentView.as_view(), name='public-homepage-content'),
    path('manage/homepage/', OwnerHomepageContentManageView.as_view(), name='owner-homepage-manage'),
]
