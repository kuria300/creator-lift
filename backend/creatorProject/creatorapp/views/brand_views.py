from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from ..serializer import CreatorListSerializers, DealBrandSerializer, OffersBrandSerializer, RequestsBrandSerializer, ProposalsBrandSerializer, ProfileBrandSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from creatorapp.authentication.authentication import JWTAuthentication
from ..models import CreatorsWorks, Offers, Requests, Profiles, Deals, customUsersData, ProfileSpeciality as PS, Speciality, Proposals
from django.contrib.auth import get_user_model
from django.db.models import Count, Q, Sum

User= get_user_model()
authentication= JWTAuthentication()


class BrandDashView(APIView):
    def get(self, request):
        try:
            profile = Profiles.objects.get(usersdata=request.user)

            brand_tags = list( 
                profile.specialities.values_list('speciality_id', flat=True)
            )

            total_brand_count = len(brand_tags)

            deal_stats = Deals.objects.filter(brand=profile.usersdata).aggregate(
                total_deals=Count('id'),
                active_deals=Count('id', filter=Q(status='active')),
                completed_deals=Count('id', filter=Q(status='completed')),
                cancelled_deals=Count('id', filter=Q(status ='cancelled')),
                total_spent=Sum('agreed_price', filter=Q(status__in=['active', 'completed'])),
            )

            deal_stats['total_spent'] = deal_stats['total_spent'] if deal_stats['total_spent'] is not None else 0

            # django filter, exclude, all return queryset so we pass to serializer to convert to python list of dicts then response() converts to json
            # many=True tells the serializer:I'm giving you multiple model instances, not just one.
            # odrder by mewsest to oldest
            requests_queryset = Requests.objects.filter(brand=profile.usersdata).select_related('brand').prefetch_related('tags__tag').annotate(
              num_proposals=Count('proposals', filter=Q(proposals__status='pending'))
            ).order_by('-created_at')
            works = list(requests_queryset[:5])

            proposals_queryset = Proposals.objects.filter(creator=profile).select_related('request', 'creator').prefetch_related('request__tags__tag').order_by('-created_at')
            offers=list(proposals_queryset[:4])

            creators_queryset = Profiles.objects.exclude(id=profile.id).filter(usersdata__role='creator').annotate(matching_tags=Count('specialities', filter=Q(specialities__speciality_id__in=brand_tags), distinct=True)).prefetch_related('specialities__speciality').order_by('-matching_tags', '-created_at')
            reqs=list(creators_queryset[:4])


            #serialization    
            return Response({
                'stats': deal_stats,
                'works': RequestsBrandSerializer(works, many=True).data,
                'offers': ProposalsBrandSerializer(offers, many=True).data,
                'requests': ProfileBrandSerializer(reqs, many=True, context={'total_brand_tags': total_brand_count }).data
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

class OffersBrandView(APIView):
    def get(self,request):
        try:
            profile = Profiles.objects.get(usersdata=request.user)
            offers = Offers.objects.filter(creator=profile).select_related('creator__usersdata').prefetch_related('tags__tag').order_by('-created_at')

            return Response({'offers': OffersBrandSerializer(offers, many=True).data}, status=200)
        except Profiles.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class CreatorBrandView(APIView):
    def get(self,request):

        brand_profile= Profiles.objects.get(usersdata=request.user)
        # this is the list of all ids of the tags that brand has
        # values_list returns a list of tuples, flat=True flattens it to a list of values instead of tuples example: [(1,), (2,), (3,)] → [1, 2, 3]
        brand_tags = list( 
            brand_profile.specialities.values_list('speciality_id', flat=True)
        )

        total_brand_count = len(brand_tags)
        try:
            creators = customUsersData.objects.filter(role='creator').select_related('profile').prefetch_related('profile__specialities__speciality').annotate(
                num_deals_done =Count('deals', filter=Q(deals__status='completed')),
                matching_tags=Count('profile__specialities', filter=Q(profile__specialities__speciality_id__in=brand_tags), distinct=True )
            ) .order_by('-profile__created_at')

            # ref_tag_count this passes context to serializer thus it gets reused by all creators many=trus 1/4 2/4 3/4
            serializer = CreatorListSerializers(
                creators,
                many=True,
                context={'ref_tag_count': total_brand_count}
            )

            return Response({'creators': serializer.data}, status=status.HTTP_200_OK)
        except customUsersData.DoesNotExist:
            return Response({'error':'creatos not found'}, status=404)
