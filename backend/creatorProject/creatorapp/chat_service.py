
from .models import Conversations
from rest_framework import exceptions

def start_conversation(brand, creator, deal=None, proposal=None):
    """
    this is the only door for creating a chat it first checks if creator and brand not brand or brand or vice versa
    every creation of a conversation or return passes here
    """
    if brand.role != "brand" or creator.usersdata.role != "creator":
        raise exceptions.ValidationError('Not acceptable participants')

    # defaults is only used when chat is new the deal you pass in is ignored and the old chat is returned as it was
    conv, _ = Conversations.objects.get_or_create(
        brand=brand, creator=creator, defaults={"proposal": proposal,"deal": deal}
    )
    return conv