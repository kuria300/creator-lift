from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from ..serializer import BrandSerializer, Userserializer, CreatorWorkSerializer, OfferSerializer, RequestSerializer, DealSerializer, CreatorOfferSerializer, ProfileCreatorSerializer, PasswordChangeSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from creatorapp.authentication.authentication import JWTAuthentication
from ..models import CreatorsWorks, Offers, Requests, Profiles, Deals, customUsersData, ProfileSpeciality as PS, Speciality
from django.contrib.auth import get_user_model
from django.db.models import Count, Q

User= get_user_model()
authentication= JWTAuthentication()


class creatorDashView(APIView):
    def get(self, request):
        try:
            profile = Profiles.objects.get(usersdata=request.user)

            # django filter, exclude, all return queryset so we pass to serializer to convert to python list of dicts then response() converts to json
            # many=True tells the serializer:I'm giving you multiple model instances, not just one.
            # odrder by mewsest to oldest
            works_queryset = CreatorsWorks.objects.filter(creator=profile).prefetch_related('tags__tag').order_by('-created_at')
            works = list(works_queryset[:5])

            offers_queryset = Offers.objects.filter(creator=profile).prefetch_related('tags__tag').order_by('-created_at')
            offers=list(offers_queryset[:4])

            reqs_queryset = Requests.objects.filter(status ='open').select_related('brand').prefetch_related('tags__tag').order_by('-created_at')
            reqs=list(reqs_queryset[:4])


            #serialization    
            return Response({
                'works': CreatorWorkSerializer(works, many=True).data,
                'offers': OfferSerializer(offers, many=True).data,
                'requests': RequestSerializer(reqs, many=True).data
            })

        except Profiles.DoesNotExist:
            return Response({'error':'Profile not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class CreatorDealView(APIView):
    def get(self, request):
        try:
            profile= Profiles.objects.get(usersdata=request.user)

            deals = Deals.objects.filter(creator=profile).select_related('request', 'brand').order_by('-created_at')
            
            # django passes one deal at a time when many-True
            return Response({'Deals': DealSerializer(deals, many=True).data}, status=200)
        except Profiles.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        
class CreatorOfferView(APIView):
    def get(self, request):
        try:
            profile= Profiles.objects.get(usersdata=request.user)
            offers = Offers.objects.filter(creator=profile).select_related('creator__usersdata').prefetch_related('tags__tag').order_by('-created_at')

            return Response({'offers': CreatorOfferSerializer(offers, many=True).data}, status=200)
        
        except Profiles.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        
class Alloffers(APIView):
     def get(self, request):
        offers = Offers.objects.filter(status='active').order_by('-created_at')
        return Response({'offers': CreatorOfferSerializer(offers, many=True).data})


class ProfileCreator(APIView):
    def get(self, request):
        try:
            profile_data = Profiles.objects.select_related('usersdata').get(usersdata=request.user)

            return Response({"profile": ProfileCreatorSerializer(profile_data).data}, status=200)
        except Profiles.DoesNotExist:
          return Response({'error': 'Profile not found'}, status=404)
        except Exception as e:  
           return Response({'error': str(e)}, status=400)

class ProfileSpeciality(APIView):
    def get(self, request):
        specialities = Speciality.objects.all().order_by('speciality_name')

        return Response({'speciality': [sp.speciality_name for sp in specialities]})


class ProfileUpdateView(APIView):
    def patch(self, request):
        try:
            profile = Profiles.objects.select_related('usersdata').get(usersdata=request.user)
        except Profiles.DoesNotExist:
            return Response({'error': 'profile not found'}, status=404)

        data=request.data #data to be chnaged
        print(data)
        user_obj=profile.usersdata # users table data of that profile
        print(user_obj)

        if 'username' in data:
            user_obj.username = data.get('username')
        if 'email' in data:
            new_email=data.get('email').strip().lower()

            already_taken= customUsersData.objects.exclude(pk=user_obj.pk).filter(email=new_email).exists()

            if already_taken:
                return Response({'error': 'Email already exists!'}, status=400)
            user_obj.email = new_email
        user_obj.save()

        for field in ('bio','avatar_url','tiktok_url', 'instagram_url', 'youtube_url'):
            if field in data:
                # setattr takess (obj, name, value)(obj, age, 25) equivalent obj.age=25
                setattr(profile, field, data[field])
        profile.save()

        if 'speciality_data' in data:
            names = data.get('speciality_data')

            if not isinstance(names, list):
                return Response({'error': 'speciality_data must be a list'}, status=400)
            if len(names) > 5:
                return Response({'error': 'Maximum of 5 specialities allowed'}, status=400)

            profile.specialities.all().delete()

            cleaned_names = [n.strip() for n in names if n.strip()]

            # make sure they exist in speciality master list
            found_names = list(Speciality.objects.filter(speciality_name__in=cleaned_names))

            for speciality_obj in found_names:
                PS.objects.create(profile=profile, speciality=speciality_obj)

        return Response({"profile": ProfileCreatorSerializer(profile).data},status=200)


class ProfileUpdatePassword(APIView):
    def patch(self, request):
        try:
            print(request.data)
            serializer = PasswordChangeSerializer(data=request.data)
           
            # serializer = PasswordChangeSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # serializer.is_valid(raise_exception=True)
            print(serializer.validated_data)
            user_obj= request.user

            currentPassword = serializer.validated_data['currentPassword']
            newPassword = serializer.validated_data['newPassword']

            if not user_obj.check_password(currentPassword):
                return Response({'error':'Invalid Current Password'}, status=status.HTTP_400_BAD_REQUEST)

            user_obj.set_password(newPassword) #built in for hashing password when saving
            user_obj.save()


            return Response({'message':'Password updated successfully'}, status=200)

            
        except customUsersData.DoesNotExist:
            return Response({'error':'user does"t exist'}, status=status.HTTP_400_BAD_REQUEST)


class BrandsList(APIView):
    def get(self, request):
        try:
            brands = customUsersData.objects.filter(role='brand').select_related('profile').prefetch_related('profile__specialities__speciality').annotate(
                active_deals=Count('deals', filter=Q(deals__status='active')) # this is annotation adds a field temporarily to the queryset(each row created) so we can do brand.completed_deals 
            ).order_by('-profile__created_at')
            return Response({'brands': BrandSerializer(brands, many=True).data}, status=status.HTTP_200_OK)
        except customUsersData.DoesNotExist:
            return Response({'error': 'profile not found'}, status=404)







        
        



