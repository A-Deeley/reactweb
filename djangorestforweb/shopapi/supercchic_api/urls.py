from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'departments', views.DepartmentViewSet)
router.register(r'companies', views.CompanyViewSet)
router.register(r'carts', views.CartViewSet)

urlpatterns = [
	path('', include(router.urls)),
	path('react-cart/deleteRow', views.ReactCartDeleteRow.as_view()),
    path('react-cart/updateRow', views.ReactCartUpdateRow.as_view()),
    path('react-cart/getAllRows', views.ReactGetAllRows.as_view()),
	path('react-cart/updateCart', views.ReactCartUpdateCart.as_view()),
]