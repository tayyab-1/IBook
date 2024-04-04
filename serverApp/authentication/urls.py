from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register_user"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('profile/',  ProfileView.as_view(), name="user_profile"),
    path('findusers/<str:search>', SearchUserView.as_view(), name='find-users')
]
