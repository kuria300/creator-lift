from django.urls import path
from .views import auth_views, user_views, createor_views, api_view, avatar_views, brand_views

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
    path('api/chat', api_view.ChatView.as_view(), name='chatbot'),
    path('api/chat/history/', api_view.ChatHistoryView.as_view(), name='chathistory'),
    path('api/offers/creator', createor_views.CreatorOfferView.as_view(), name='offerviews'),
    # all offers
    path('api/offers', createor_views.Alloffers.as_view(), name='Allofferviews'),
    path('api/profile', createor_views.ProfileCreator.as_view(), name='creatorprofie'),
    path('api/specialities', createor_views.ProfileSpeciality.as_view(), name='fetchallsp'),
    path('api/profile/update', createor_views.ProfileUpdateView.as_view(), name='updateprofile'),
    path('api/profile/avatar-presign', avatar_views.ProfileAvatarPreSign.as_view(), name='presigned'),
    path('api/profile/avatar', avatar_views.AvatarSaveView.as_view(), name='saveavatar'),
    path('api/profile/password', createor_views.ProfileUpdatePassword.as_view(), name='passupdate'),
    path('api/brands', createor_views.BrandsList.as_view(), name='brandslist'),
    #brands
    path('api/dashboard/brand', brand_views.BrandDashView.as_view(), name='branddashboard'),
    path('api/deal/brand', brand_views.BrandDealView.as_view(), name='branddealviews'),
    
]