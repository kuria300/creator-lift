from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from ..serializer import DealBrandSerializer, RequestsBrandSerializer, ProposalsBrandSerializer, ProfileBrandSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from creatorapp.authentication.authentication import JWTAuthentication
from ..models import CreatorsWorks, Offers, Requests, Profiles, Deals, customUsersData, ProfileSpeciality as PS, Speciality, Proposals
from django.contrib.auth import get_user_model
from django.db.models import Count, Q

User= get_user_model()
authentication= JWTAuthentication()


class BrandDashView(APIView):
    def get(self, request):
        try:
            profile = Profiles.objects.get(usersdata=request.user)

            # django filter, exclude, all return queryset so we pass to serializer to convert to python list of dicts then response() converts to json
            # many=True tells the serializer:I'm giving you multiple model instances, not just one.
            # odrder by mewsest to oldest
            requests_queryset = Requests.objects.filter(brand=profile.usersdata).select_related('brand').prefetch_related('tags__tag').annotate(
              num_proposals=Count('proposals', filter=Q(proposals__status='pending'))
            ).order_by('-created_at')
            works = list(requests_queryset[:5])

            proposals_queryset = Proposals.objects.filter(creator=profile).select_related('request', 'creator').prefetch_related('request__tags__tag').order_by('-created_at')
            offers=list(proposals_queryset[:4])

            creators_queryset = Profiles.objects.filter(usersdata=profile).prefetch_related('tags__tag').order_by('-created_at')
            reqs=list(creators_queryset[:4])


            #serialization    
            return Response({
                'works': RequestsBrandSerializer(works, many=True).data,
                'offers': ProposalsBrandSerializer(offers, many=True).data,
                'requests': ProfileBrandSerializer(reqs, many=True).data
            })

        except Profiles.DoesNotExist:
            return Response({'error':'Profile not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class BrandDealView(APIView):
    def get(self, request):
        try:
            profile= Profiles.objects.get(usersdata=request.user)

            deals = Deals.objects.filter(brand=request.user).select_related('request', 'creator').prefetch_related('request__tags__tag').order_by('-created_at')
            
            # django passes one deal at a time when many-True
            return Response({'Deals': DealBrandSerializer(deals, many=True).data}, status=200)
        except Profiles.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)