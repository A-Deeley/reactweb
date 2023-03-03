from django.urls import include, path
from rest_framework import routers
from rest_framework.routers import DefaultRouter

from supercchic_auth.views import \
  AccountPasswordUpdateViewSet, \
  AccountUpdateViewSet, \
  TokenViewSet, \
  RegisterViewSet, \
  TokenRefreshViewSet

# Seulement pour modifier le nom du router (Api Root --> Api Auth)
class AuthRootView(routers.APIRootView):
  def get_view_name(self) -> str:
      return "Api Auth"

class AuthRouter(routers.DefaultRouter):
    APIRootView = AuthRootView

# Create a router and register our viewsets with it.
router = AuthRouter()

# Appeler "account-password-update/me/" (put) pour modifier le mot de passe du compte connecté
router.register(r'account-password-update', AccountPasswordUpdateViewSet, basename='account-password-update'),

# Appeler "account-update/me/" (put) pour modifier le compte connecté
router.register(r'account-update', AccountUpdateViewSet, basename='account-update'),

# Appeler en post
router.register(r'register', RegisterViewSet, basename='register')
router.register(r'token', TokenViewSet, basename='token')
router.register(r'token-refresh', TokenRefreshViewSet, basename='token-refresh')

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browsable API.
urlpatterns = [
  path('', include(router.urls)),
]
