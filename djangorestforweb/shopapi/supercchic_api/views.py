from django.shortcuts import render
from rest_framework import status
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
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


class CartViewSet(viewsets.ModelViewSet):
	queryset = models.Panier.objects.all().order_by('id')
	serializer_class = serializers.CartSerializer
	permission_classes = [permissions.AllowAny]
	http_method_names = ['get']

	


class ReactCartView(APIView):
	permission_classes= [permissions.IsAuthenticated]

	def post(self, request):
		print("got to start of update")
		bodyJson = request.data

		print(request.user)
		cart = models.Panier.objects.filter(owner=request.user).first()
		if (cart is None):
			cart = Panier(
				owner = request.user
			)
			cart.save()
		print(bodyJson['product'])
		product = models.Products.objects.filter(id=bodyJson.product).first()

		print(product)
		if (product is None):
			return Response(status=status.HTTP_404_NOT_FOUND)

		
		cart.rows.append(PanierRow(product, bodyJson.quantity))
		cart.save()
		return Response(status=status.HTTP_202_ACCEPTED)
	