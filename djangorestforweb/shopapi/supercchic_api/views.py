from django.shortcuts import render
from rest_framework import status
from rest_framework import viewsets, permissions
from rest_framework.response import Response
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
	permission_classes= [permissions.AllowAny]

	def post(self, request):
		print("got to start of update")
		bodyJson = request.data


		cart = models.Panier.objects.filter(owner=request.user).first()
		if (cart is None):
			cart = models.Panier(
				owner = request.user
			)
		
		product = models.Products.objects.filter(id=bodyJson['product']).first()

		
		if (product is None):
			return Response(status=status.HTTP_404_NOT_FOUND)


		existingRow = cart.rows.filter(panier_id=cart.id, product_id=product).first()
		
		if (existingRow is None):
			print("adding non-existing row")
			existingRow = models.PanierRow(
				panier = cart,
				product_id = product.id,
				quantity = bodyJson['quantity']
			)
		else:
			print("updating existing row")
			existingRow.quantity += bodyJson['quantity']

		existingRow.save()
		cart.save()
		return Response(status=status.HTTP_202_ACCEPTED)

	def get(self, request):

		cart = models.Panier.objects.filter(owner=request.user).first()
		if (cart is None):
			cart = models.Panier(
				owner = request.user
			)

		cartRows = cart.rows.all()
		serializer = serializers.CartRowSerializer(cartRows.all().order_by('-quantity'), many=True)
		#products = models.Products.objects.filter(id__in=product_ids)

		return Response(serializer.data, status=status.HTTP_200_OK)

		

