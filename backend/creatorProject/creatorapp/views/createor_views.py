from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from ..serializer import Userserializer, CreatorWorkSerializer, OfferSerializer, RequestSerializer, DealSerializer, CreatorOfferSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from creatorapp.authentication.authentication import JWTAuthentication
from ..models import CreatorsWorks, Offers, Requests, Profiles, Deals
from django.contrib.auth import get_user_model

User= get_user_model()
authentication= JWTAuthentication()


class creatorDashView(APIView):
    def get(self, request):
        try:
            profile = Profiles.objects.get(usersdata=request.user)

            # django filter, exclude, all return queryset so we pass to serializer to convert to python list of dicts then response() converts to json
            # many=True tells the serializer:I'm giving you multiple model instances, not just one.
            # odrder by mewsest to oldest
            works = CreatorsWorks.objects.filter(creator=profile).order_by('-created_at')[:5]
            offers = Offers.objects.filter(creator=profile).order_by('-created_at')[:4]
            reqs = Requests.objects.filter(status ='open').order_by('-created_at')[:4]

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


            deals = Deals.objects.filter(creator=profile).select_related('request', 'brand')
            
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

            offers = Offers.objects.filter(creator=profile).order_by('-created_at')

            return Response({'offers': CreatorOfferSerializer(offers, many=True)}, status=200)
        
        except Profiles.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        
class Alloffers(APIView):
     def get(self, request):
        offers = Offers.objects.filter(status='active').order_by('-created_at')
        return Response({'offers': CreatorOfferSerializer(offers, many=True).data})

        




        
        



