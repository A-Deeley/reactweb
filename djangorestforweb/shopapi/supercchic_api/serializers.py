from rest_framework import serializers
from .models import *

class CompanySerializer(serializers.ModelSerializer):
	class Meta:
		model = Companies
		fields='__all__'


class DepartmentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Departments
		fields='__all__'


class ProductSerializer(serializers.ModelSerializer):
	class Meta:
		model = Products
		fields = ('id', 'cup', 'name', 'secondary_name', 'discount_amt', 'discount_type', 'unit_type', 'company', 'department', 'price', 'qty', 'apply_tvq', 'apply_tps', 'image_url')


class CartRowSerializer(serializers.ModelSerializer):
	class Meta:
		model = PanierRow
		fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
	rows = CartRowSerializer(many=True, read_only=True)

	class Meta:
		model = Panier
		fields = ('rows', 'id', 'owner')