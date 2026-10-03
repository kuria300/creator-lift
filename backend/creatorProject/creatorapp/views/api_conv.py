
from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle
from ..permissions import IsBrand
from rest_framework.throttling import ScopedRateThrottle
from ..serializer import StartConversationSerializer, StartConvoFromProposalSerializer, StartConvoFromDealSerializer
from ..models import Profiles, Proposals, Deals, Conversations
from rest_framework.response import Response
from rest_framework import exceptions
from ..chat_service import start_conversation
from rest_framework import status

class StartConversationView(APIView):
    """
    the view for creating the chat or returning as it add orm to talk to db and make chnages

    also added rate limit to this api here we scope it to my view and apply throttle called chat begin
    """
    permission_classes=[IsBrand]
    throttle_classes=[ScopedRateThrottle]
    throttle_scope= "start_chat"

    def post(self, request):
        s = StartConversationSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        try:
            creator = Profiles.objects.select_related("usersdata").get(usersdata_id=s.validated_data["creator_id"])
        except Profiles.DoesNotExist:
            raise exceptions.NotFound('creator not found')

        conv = start_conversation(request.user, creator)
        return Response({"data": {"id": str(conv.id)}}, status=status.HTTP_200_OK)



class StartConvoFromProposalView(APIView):
    """
    check proposal_id against database to make sure the conversation started is valid and the proposal is valid and the brand is the owner of the proposal

    a brand can start a conversation with a creator only if the proposal is valid and the brand is the owner of the proposal

    a brand can fake a conversation with a creator if the proposal is not valid or the brand is not the owner of the proposal

    Without that ownership check, a brand could open chats through someone else's proposals
    """
    permission_classes=[IsBrand]
    throttle_classes=[ScopedRateThrottle]
    throttle_scope= "start_chat"

    def post(self, request):
        s = StartConvoFromProposalSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        proposal_id = s.validated_data["proposal_id"]

        try:
            proposal = Proposals.objects.select_related('brand', 'creator').get(pk=proposal_id)
        except Proposals.DoesNotExist:
            raise exceptions.NotFound('proposal not found')

        if proposal.brand != request.user:
            raise exceptions.PermissionDenied('You do not have permission to start a conversation for this proposal')
        if proposal.creator is None:
            raise exceptions.ValidationError('Proposal does not have a valid creator')

        conv = start_conversation(request.user, proposal.creator, proposal=proposal)
        return Response({"data": {"id": str(conv.id)}}, status=status.HTTP_200_OK)


class AcceptProposalView(APIView):
    """
    Accept a proposal turn the proposal into a deal and attach an existing conversation to the deal if it exists.
    """
    permission_classes = [IsBrand]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "proposal_accept"

    def post(self, request, proposal_id):
        try:
            proposal = Proposals.objects.select_related('brand', 'creator').get(pk=proposal_id)
        except Proposals.DoesNotExist:
            raise exceptions.NotFound('proposal not found')

        if proposal.brand != request.user:
            raise exceptions.PermissionDenied('You do not have permission to accept this proposal')
        if proposal.creator is None:
            raise exceptions.ValidationError('Proposal does not have a valid creator')

        # create deal from the proposal after acceptance from proposal to a deal
        deal = Deals.objects.create(
            brand=proposal.brand,
            creator=proposal.creator,
            title=proposal.title,
            description=proposal.description,
            price=proposal.price,
            status='active'
        )

        # we update proposal to accepted
        proposal.status = 'accepted'
        proposal.save(update_fields=['status'])

        # check if a conversation already exists between the brand and creator
        conv = Conversations.objects.filter(brand=request.user, creator=proposal.creator).first()

        if conv:
            # if a conversation exists we attach the deal to it
            conv.deal = deal
            conv.save(update_fields=['deal'])

        return Response({"data": {"deal_id": str(deal.id), "conversation_id": str(conv.id) if conv else None}}, status=status.HTTP_200_OK)


class StartConvoFromDealView(APIView):
    """
    check deal_id against database to make sure the conversation started is valid and the deal is valid and the brand is the owner of the deal

    a brand can start a conversation with a creator only if the deal is valid and the brand is the owner of the deal

    a brand can fake a conversation with a creator if the deal is not valid or the brand is not the owner of the deal

    Without that ownership check, a brand could open chats through someone else's deals
    """
    permission_classes=[IsBrand]
    throttle_classes=[ScopedRateThrottle]
    throttle_scope= "chat begin"

    def post(self, request):
        s = StartConvoFromDealSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        deal_id = s.validated_data["deal_id"]

        try:
            deal = Deals.objects.select_related('brand', 'creator').get(pk=deal_id)
        except Deals.DoesNotExist:
            raise exceptions.NotFound('deal not found')

        if deal.brand != request.user:
            raise exceptions.PermissionDenied('You do not have permission to start a conversation for this deal')
        if deal.creator is None:
            raise exceptions.ValidationError('Deal does not have a valid creator')

        conv = start_conversation(request.user, deal.creator, proposal=deal.proposal, deal=deal)
        return Response({"data": {"id": str(conv.id)}}, status=status.HTTP_200_OK)

