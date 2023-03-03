from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'departments', views.DepartmentViewSet)
router.register(r'companies', views.CompanyViewSet)

urlpatterns = [
	path('', include(router.urls)),
	path('/shop/products/getCategories', views.
]