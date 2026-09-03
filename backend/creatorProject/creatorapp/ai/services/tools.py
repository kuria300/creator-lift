# Functions the AI can call to take real actions — like searching your database, sending an email, or calling an external API. 
# This is what turns the agent from a chatbot into something that can actually do things in your app.


import requests
from django.conf import settings
from ...models import ProfileSpeciality, Profiles, Speciality
from rest_framework.response import Response



# def get_creator_stats(params):

#     """
#     get creator stats from our own database

#     gemini calls this tool/ function when logged in user asks for creator number

#     """
#     creator_id = params.get('creator_id')

#     if not creator_id:
#         return {"error":"creator_id is required"}
    
#     try:
#         from ...models import customUsersData

#         creator = customUsersData.objects.get(id=creator_id)


def search_creators(params: dict) -> dict:
    """
    Search creators by speciality or username from the DB.
    Gemini calls this when a user asks to find creators.

    Example params: { "niche": "fitness", "limit": 5 }
    """
    niche= params.get("niche", "")
    keyword= params.get("keyword", "")
    limit= params.get("limit", 5)

    try:
        # select_relataed used in onetoonefield where we get profiles all in database with their usersdata_id, email, username, role at one SQL JOIN
        # prefetch_related used for mantomany or one tomany used to fetch all specialities related to a profile
        # profile.specilaities- fetch all specialities for a profile eg alice-1,4,6,9  then __ then go to speciliti fetch row.speciality fetch actual speciality
        queryset = Profiles.objects.select_related('usersdata').prefetch_related(
            'specialities__speciality'
        )

        # filter by speciality name
        if niche:
            queryset = queryset.filter(
                # this gets name video __icontains is case_insensiticve search user types video, videography, it will return 
                specialities__speciality__speciality_name__icontains=niche
            )

        # filter by username keyword
        if keyword:
            queryset = queryset.filter(
                usersdata__username__icontains=keyword
            )

        # only creators
        # didtict specilaities
        queryset = queryset.filter(usersdata__role='creator').distinct()[:limit]

        creators = []
        for profile in queryset:
            creators.append({
                "id":           str(profile.id),
                "username":     profile.usersdata.username,
                "bio":          profile.bio or "",
                "avatar_url":   profile.avatar_url or "",
                "tiktok_url":   profile.tiktok_url or "",
                "instagram_url":profile.instagram_url or "",
                "youtube_url":  profile.youtube_url or "",
                "specialities": [ ps.speciality.speciality_name for ps in profile.specialities.all() ],
            })

        return {"creators": creators}

    except Exception as e:

        return {"error": str(e)}


TOOLS ={
    "search_creators": search_creators,
}


def execute_tool(tool_name, params):
    """
    called by agent.py to call and execute tool by name

    tool_name : caomes from tools named in TOOLS
    params: comes from data passed by gemini

    """

    tool_fn=TOOLS.get(tool_name)

    if tool_fn is None:
        return Response({"error":"tool doesn't exsist"}, status=404)

    return tool_fn(params=params)