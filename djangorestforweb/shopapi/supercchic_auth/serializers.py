from django.contrib.auth.models import User, update_last_login
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "username"]


class AccountPasswordUpdateSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ['password']

    def update(self, user, validated_data):
        user.set_password(validated_data.get('password', user.password))
        user.save()
        return user


class RegisterSerializer(UserSerializer):
  class Meta:
    model = User
    fields = ["first_name", "last_name", "email", "username", "password"]

  def create(self, validated_data):
    user = User.objects.create_user(**validated_data)
    return user


class TokenSerializer(TokenObtainPairSerializer):  # noqa
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        data['user'] = UserSerializer(self.user, context={'request': self.context['request']}).data

        if api_settings.UPDATE_LAST_LOGIN:
          update_last_login(None, self.user)

        return data