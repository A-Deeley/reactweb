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
		fields='__all__'