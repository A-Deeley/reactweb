from django.shortcuts import render
from rest_framework import viewsets, permissions
from . import models, serializers


# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
	queryset = models.Products.objects.all().order_by('id')
	serializer_class = serializers.ProductSerializer
	permission_classes = [permissions.AllowAny]


class DepartmentViewSet(viewsets.ModelViewSet):
	queryset = models.Departments.objects.all().order_by('id')
	serializer_class = serializers.DepartmentSerializer
	permission_classes = [permissions.AllowAny]


class CompanyViewSet(viewsets.ModelViewSet):
	queryset = models.Companies.objects.all().order_by('id')
	serializer_class = serializers.CompanySerializer
	permission_classes = [permissions.AllowAny]