from django.shortcuts import render
from rest_framework.settings import api_settings
from rest_framework import status
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from . import models, serializers


# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
	def get_queryset(self):
		requestIds = self.request.query_params.get('id')
		requestPromos = self.request.query_params.get('promo')
		requestMinPrice = self.request.query_params.get('min')
		requestMaxPrice = self.request.query_params.get('max')

		queryset = models.Products.objects.all()
		if (requestIds is not None):
			deptIds = requestIds.split(',')
			print("got the following ids: " + str(deptIds))
			queryset = queryset.filter(department_id__in=deptIds)

		if (requestPromos is not None):
			filterPromos = requestPromos == "1"
			if (filterPromos):
				print("got filter promos")
				queryset = queryset.filter(discount_type__gt=0)

		if (requestMinPrice is not None):
			try:
				minPrice = float(requestMinPrice)
				print("(" + str(requestMinPrice) + ") got min price: " + str(minPrice))
				queryset = queryset.filter(price__gte=minPrice)
			except:
				print("invalid min price received")

		if (requestMaxPrice is not None):
			try:
				maxPrice = float(requestMaxPrice)
				print("(" + str(requestMaxPrice) + ") got max price: " + str(maxPrice))
				queryset = queryset.filter(price__lte=maxPrice)
			except:
				print("invalid max price received")

		
		return queryset

	serializer_class = serializers.ProductSerializer
	permission_classes = [permissions.AllowAny]	


class DepartmentViewSet(viewsets.ModelViewSet):
	queryset = models.Departments.objects.all().order_by('id')
	serializer_class = serializers.DepartmentSerializer
	permission_classes = [permissions.AllowAny]
	pagination_class = None

	def paginate_queryset(self, queryset):
		"""
		Return a single page of results, or `None` if pagination is disabled.
		"""

		if 'page' not in self.request.query_params:
			return None
		
		return super().paginate_queryset(queryset)


class CompanyViewSet(viewsets.ModelViewSet):
	queryset = models.Companies.objects.all().order_by('id')
	serializer_class = serializers.CompanySerializer
	permission_classes = [permissions.AllowAny]


class CartViewSet(viewsets.ModelViewSet):
	queryset = models.Panier.objects.all().order_by('id')
	serializer_class = serializers.CartSerializer
	permission_classes = [permissions.AllowAny]
	http_method_names = ['get']


class ReactApiView(APIView):

	def getUserCart(self, request):
		cart = models.Panier.objects.filter(owner=request.user).first()
		if (cart is None):
			cart = models.Panier(
				owner = request.user
			)
			cart.save()

		return cart
	

class ReactCartUpdateRow(ReactApiView):
	permission_classes= [permissions.AllowAny]

	def post(self, request):
		print("got to start of update")
		bodyJson = request.data

		cart = self.getUserCart(request)		
		
		product = models.Products.objects.filter(id=bodyJson['product']).first()
		existingRow = cart.rows.filter(panier_id=cart.id, product_id=product).first()

		
		if (product is None):
			return Response(status=status.HTTP_404_NOT_FOUND)
		


		
		if (existingRow is None):
			print("adding non-existing row")
			existingRow = models.PanierRow(
				panier = cart,
				product_id = product.id,
				quantity = 0
			)


		if (product.qty <= 0 or product.qty < bodyJson['quantity'] + existingRow.quantity):
			print('not enough stock')
			return Response(status=status.HTTP_406_NOT_ACCEPTABLE, data='not enough stock')
		
		existingRow.quantity += bodyJson['quantity']

		existingRow.save()
		cart.save()
		return Response(status=status.HTTP_202_ACCEPTED)


class ReactGetAllRows(ReactApiView):
	def get(self, request):

		cart = self.getUserCart(request)
		cartRows = cart.rows.all()
		print(cartRows)
		serializer = serializers.CartRowSerializer(cartRows.all().order_by('-quantity'), many=True)

		return Response(serializer.data, status=status.HTTP_200_OK)


class ReactCartDeleteRow(ReactApiView):

	def post(self, request):
		rowId = request.data['row']

		cart = models.Panier.objects.get(owner=request.user)

		if (cart is None):
			cart = models.Panier(
				owner = request.user
			)
			cart.save()
			return Response(status=status.HTTP_200_OK)

		cartRow = cart.rows.get(id=rowId)
		print(cartRow)

		cartRow.delete()
		
		serializer = serializers.CartRowSerializer(cart.rows.all(), many=True)

		return Response(serializer.data ,status=status.HTTP_200_OK)
	

class ReactCartUpdateCart(ReactApiView):

	def post(self, request):
		rowQuantities = request.data

		cart = self.getUserCart(request)

		for rowQty in rowQuantities:
			row = cart.rows.get(id=rowQty['id'])
			if (rowQty['qty'] <= 0):
				row.delete()
			else:
				row.quantity = rowQty['qty']
				row.save()
		
		cart.save()

		serializer = serializers.CartRowSerializer(cart.rows.all(), many=True)

		return Response(serializer.data ,status=status.HTTP_200_OK)

