from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ModelViewSet, GenericViewSet, ViewSet
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from supercchic_auth.serializers import \
  AccountPasswordUpdateSerializer, \
  RegisterSerializer, \
  UserSerializer, \
  TokenSerializer


class AccountPasswordUpdateViewSet(ModelViewSet):
  serializer_class = AccountPasswordUpdateSerializer
  permission_classes = [IsAuthenticated]
  http_method_names = ['put']

  def update(self, request, *args, **kwargs):
    user = User.objects.get(pk=request.user.pk)
    serializer = self.get_serializer(user, data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    updated_user = serializer.save()

    return Response(
      UserSerializer(updated_user, context={'request': request}).data,
      status=status.HTTP_200_OK)


class AccountUpdateViewSet(ModelViewSet):
  serializer_class = UserSerializer
  permission_classes = [IsAuthenticated]
  http_method_names = ['post', 'put']

  @action(detail=False, methods=["post"], url_path='get-current-user')
  def get_current_user(self, request):
      user = User.objects.get(pk=self.request.user.pk)
      return Response(
          UserSerializer(user, context={'request': request}).data,
          status=status.HTTP_200_OK)

  def update(self, request, *args, **kwargs):
      username = request.data['username']
      existing_user = User.objects.exclude(pk=request.user.pk).filter(username=username).first()
      if existing_user is not None:
          return Response('username_already_exists', status=status.HTTP_400_BAD_REQUEST)

      email = request.data['email']
      existing_user = User.objects.exclude(pk=request.user.pk).filter(email=email).first()
      if existing_user is not None:
          return Response('email_already_exists', status=status.HTTP_400_BAD_REQUEST)

      user = User.objects.get(pk=self.request.user.pk)
      serializer = self.get_serializer(user, data=request.data, context={'request': request})
      serializer.is_valid(raise_exception=True)
      updated_user = serializer.save()

      return Response(
          UserSerializer(updated_user, context={'request': request}).data,
          status=status.HTTP_200_OK)


class RegisterViewSet(ModelViewSet):
  serializer_class = RegisterSerializer
  permission_classes = (AllowAny,)
  http_method_names = ['post']

  def create(self, request, *args, **kwargs):
    username = request.data['username']
    existing_user = User.objects.filter(username=username).first()
    if existing_user is not None:
      return Response('username_already_exists', status=status.HTTP_400_BAD_REQUEST)

    email = request.data['email']
    existing_user = User.objects.filter(email=email).first()
    if existing_user is not None:
      return Response('email_already_exists', status=status.HTTP_400_BAD_REQUEST)

    serializer = self.get_serializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    created_user = serializer.save()

    return Response(
      UserSerializer(created_user, context={'request': request}).data,
      status=status.HTTP_201_CREATED)


class TokenViewSet(ModelViewSet, TokenObtainPairView):
  serializer_class = TokenSerializer
  permission_classes = (AllowAny,)
  http_method_names = ['post']

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data, context={'request': request})

    try:
      serializer.is_valid(raise_exception=True)
    except AuthenticationFailed:
      return Response('no_active_account', status=status.HTTP_401_UNAUTHORIZED)
    except TokenError as e:
      raise InvalidToken(e.args[0])

    return Response(serializer.validated_data, status=status.HTTP_200_OK)


class TokenRefreshViewSet(ViewSet, TokenRefreshView):
  permission_classes = (AllowAny,)
  http_method_names = ['post']

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data, context={'request': request})

    try:
      serializer.is_valid(raise_exception=True)
    except TokenError as e:
      raise InvalidToken(e.args[0])

    return Response(serializer.validated_data, status=status.HTTP_200_OK)


class UserViewSet(RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
  serializer_class = UserSerializer
  queryset = User.objects.all()
  lookup_field = "username"

  def get_queryset(self, *args, **kwargs):
      return self.queryset.filter(id=self.request.user.id)

  @action(detail=False, methods=["get"])
  def me(self, request):
      serializer = UserSerializer(request.user, context={"request": request})
      return Response(serializer.data, status=status.HTTP_200_OK)
