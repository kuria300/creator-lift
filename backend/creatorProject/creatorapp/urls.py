from django.urls import path
from .views import auth_views, user_views, createor_views

urlpatterns=[
    path('', auth_views.homePage.as_view(), name='home'),
    path('api/google/login',auth_views.GoogleLoginView.as_view(), name='google_callback'),
    path('api/register', auth_views.RegisterPage.as_view(), name='registration'),
    path('api/login', auth_views.normal_loginPage.as_view(), name='normal_login'),
    path('api/logout', auth_views.LogoutPage.as_view(), name='logout'),
    path('profile', user_views.ProfilePage.as_view(), name='profile'),
    path('api/me', user_views.MeView.as_view(), name='storesession'),
    path('api/dashboard/creator', createor_views.creatorDashView.as_view(), name='creatordashboard'),
    path('api/deal/creator', createor_views.CreatorDealView.as_view(), name='dealviews'),
    path('api/offers/creator', createor_views.CreatorOfferView.as_view(), name='offerviews'),
    # all offers
    path('api/offers', createor_views.Alloffers.as_view(), name='Allofferviews')
    
]