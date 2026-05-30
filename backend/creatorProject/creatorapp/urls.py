from django.urls import path
from .views import auth_views, user_views

urlpatterns=[
    path('', auth_views.homePage.as_view(), name='home'),
    path('api/google/login',auth_views.GoogleLoginView.as_view(), name='google_callback'),
    path('api/register', auth_views.RegisterPage.as_view(), name='registration'),
    path('api/login', auth_views.normal_loginPage.as_view(), name='normal_login'),
    path('profile', user_views.ProfilePage.as_view(), name='profile')
]