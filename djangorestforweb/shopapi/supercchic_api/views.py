from django.shortcuts import render
from rest_framework import viewsets, permissions
from . import models, serializers


# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
	queryset = models.Products.objects.all().order_by('id')
	serializer_class = serializers.ProductSerializer
	permission_classes = [permissions.AllowAny]
	
	
	def post(self, request, *args, **kwargs):
		departments = request.data
		queryset = models.Products.objects.filter(department_id__in=departments)
		return queryset


class DepartmentViewSet(viewsets.ModelViewSet):
	queryset = models.Departments.objects.all().order_by('id')
	serializer_class = serializers.DepartmentSerializer
	permission_classes = [permissions.AllowAny]


class CompanyViewSet(viewsets.ModelViewSet):
	queryset = models.Companies.objects.all().order_by('id')
	serializer_class = serializers.CompanySerializer
	permission_classes = [permissions.AllowAny]


class CartViewSet(viewsets.ModelViewSet):
	queryset = models.Panier.objects.all().order_by('id')
	serializer_class = serializers.CartSerializer
	permission_classes = [permissions.AllowAny]