import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, AbstractBaseUser, PermissionsMixin
from .managers import customUserManager
from django.utils.translation import gettext_lazy as _
from django.contrib.postgres.functions import RandomUUID 


# Create your models here.    
# AbstractUser give more fields in the database table while AbstractBaseUser, PermissionsMixin gives less fields and permissonmixin lets us keep superuser
# When you define a ForeignKey in Django, it automatically creates the database column with an _id suffix. conversation instead of conversation_id
class customUsersData(AbstractBaseUser, PermissionsMixin):
    class Meta:
        db_table='usersdata'

    id =models.UUIDField(primary_key=True, default=RandomUUID(), editable=False)

    ROLE_CHOICES=(
        ('creator', 'Creator'),
        ('brand', 'Brand'),
        ('admin', 'Admin')
    )
    username=models.CharField(max_length=250, null=True, blank=True)
    email= models.EmailField(_('email address'),max_length=255, unique=True)
    role=models.CharField(max_length=10,choices=ROLE_CHOICES, default='creator' )
    objects= customUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f'CustomUsersData={self.email}'


class Profiles(models.Model):
    id            = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    usersdata     = models.OneToOneField(customUsersData, on_delete=models.CASCADE, related_name='profile')
    avatar_url    = models.TextField(blank=True, null=True)
    bio           = models.TextField(blank=True, null=True)
    tiktok_url    = models.TextField(blank=True, null=True)
    instagram_url = models.TextField(blank=True, null=True)
    youtube_url   = models.TextField(blank=True, null=True)
    updated_at    = models.DateTimeField(auto_now=True)
    created_at    = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed  = True
        db_table = 'profiles'
 
    def __str__(self):
        return f'Profile={self.usersdata.email}'
 
 
 
class Speciality(models.Model):
    id              = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    speciality_name = models.TextField(unique=True)
    created_at      = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed  = True
        db_table = 'speciality'
 
    def __str__(self):
        return self.speciality_name
 
 
class ProfileSpeciality(models.Model):
    id          = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    profile     = models.ForeignKey(Profiles, on_delete=models.CASCADE, related_name='specialities')
    speciality  = models.ForeignKey(Speciality, on_delete=models.CASCADE, related_name='profiles')
    created_at  = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed       = True
        db_table      = 'profile_speciality'
        unique_together = (('profile', 'speciality'),)
 
    def __str__(self):
        return f'{self.profile} — {self.speciality}'
 
 
 
class OfferTags(models.Model):
    id         = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    name       = models.TextField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed  = True
        db_table = 'offer_tags'
 
    def __str__(self):
        return self.name
 
 
 
class Offers(models.Model):
    STATUS_CHOICES = (
        ('active',   'Active'),
        ('paused',   'Paused'),
        ('archived', 'Archived'),
    )

    CONTENT_TYPE_CHOICES = (
        ('video',       'Video'),
        ('photography', 'Photography'),
        ('tutorial',    'Tutorial'),
        ('social',      'Social'),
        ('other',       'Other'),
    )
 
    id            = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    creator       = models.ForeignKey(Profiles, on_delete=models.CASCADE, related_name='offers')
    title         = models.CharField(max_length=255)
    description   = models.TextField(blank=True, null=True)
    amount        = models.DecimalField(max_digits=10, decimal_places=2)
    image_url     = models.TextField(blank=True, null=True) 
    delivery_days = models.SmallIntegerField()
    status        = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    content_type  = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES, blank=True, null=True)
    created_at    = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed  = True
        db_table = 'offers'
 
    def __str__(self):
        return self.title
 
 
class OfferTagJoin(models.Model):
    id         = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    offer      = models.ForeignKey(Offers, on_delete=models.CASCADE, related_name='tags')
    tag        = models.ForeignKey(OfferTags, on_delete=models.CASCADE, related_name='offers')
    created_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed         = True
        db_table        = 'offer_tag_join'
        unique_together = (('offer', 'tag'),)
 

#  related_name='works' means from a profile you can do profile.works.all() to get all their works." 
class CreatorsWorks(models.Model):
    id            = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    creator       = models.ForeignKey(Profiles, on_delete=models.CASCADE, related_name='works')
    title         = models.CharField(max_length=255)
    description   = models.TextField(blank=True, null=True)
    platform      = models.CharField(max_length=50, blank=True, null=True)
    thumbnail_url = models.TextField(blank=True, null=True)
    created_at    = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed  = True
        db_table = 'creators_works'
 
    def __str__(self):
        return self.title
 
#  "Which work this tag belongs to. If the work is deleted, this tag connection is deleted too. related_name='tags' 
# means you can do work.tags.all() to get all tags on a work."

# related_name='works' means from a tag you can do tag.works.all() to see all works using that tag."
class CreatorsWorkTags(models.Model):
    id           = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    creator_work = models.ForeignKey(CreatorsWorks, on_delete=models.CASCADE, related_name='tags')
    tag          = models.ForeignKey(OfferTags, on_delete=models.CASCADE, related_name='works')
    created_at   = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed         = True
        db_table        = 'creators_work_tags'
        unique_together = (('creator_work', 'tag'),)
 
 

 
class Requests(models.Model):
    STATUS_CHOICES = (
        ('open',        'Open'),
        ('in_progress', 'In Progress'),
        ('closed',      'Closed'),
        ('cancelled',   'Cancelled'),
    )
 
    id           = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    brand        = models.ForeignKey(customUsersData, on_delete=models.CASCADE, related_name='requests')
    title        = models.CharField(max_length=255)
    description  = models.TextField(blank=True, null=True)
    amount       = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    platform     = models.CharField(max_length=50, blank=True, null=True)
    deadline     = models.DateField(blank=True, null=True)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    content_type = models.TextField(blank=True, null=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)
 
    class Meta:
        managed  = True
        db_table = 'requests'
 
    def __str__(self):
        return self.title
 
 
class RequestTags(models.Model):
    id         = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    request    = models.ForeignKey(Requests, on_delete=models.CASCADE, related_name='tags')
    tag        = models.ForeignKey(OfferTags, on_delete=models.CASCADE, related_name='requests')
    created_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed         = True
        db_table        = 'request_tags'
        unique_together = (('request', 'tag'),)
 

 
class Proposals(models.Model):
    STATUS_CHOICES = (
        ('pending',   'Pending'),
        ('accepted',  'Accepted'),
        ('rejected',  'Rejected'),
        ('withdrawn', 'Withdrawn'),
    )
 
    id             = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    request        = models.ForeignKey(Requests, on_delete=models.CASCADE, related_name='proposals')
    creator        = models.ForeignKey(Profiles, on_delete=models.CASCADE, related_name='proposals')
    delivery_days  = models.IntegerField()
    proposed_price = models.DecimalField(max_digits=10, decimal_places=2)
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at     = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed         = True
        db_table        = 'proposals'
        unique_together = (('request', 'creator'),)
 
    def __str__(self):
        return f'Proposal by {self.creator} on {self.request}'
 

 
class Deals(models.Model):
    STATUS_CHOICES = (
        ('active',    'Active'),
        ('completed', 'Completed'),
        ('disputed',  'Disputed'),
        ('cancelled', 'Cancelled'),
    )
 
    id            = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    proposal      = models.OneToOneField(Proposals, on_delete=models.RESTRICT, related_name='deal')
    creator       = models.ForeignKey(Profiles, on_delete=models.RESTRICT, related_name='deals')
    brand         = models.ForeignKey(customUsersData, on_delete=models.RESTRICT, related_name='deals')
    request       = models.ForeignKey(Requests, on_delete=models.RESTRICT, related_name='deals')
    agreed_price  = models.DecimalField(max_digits=10, decimal_places=2)
    deadline      = models.DateTimeField(blank=True, null=True)
    status        = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at    = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed  = True
        db_table = 'deals'
 
    def __str__(self):
        return f'Deal={self.id} status={self.status}'
 
 
 
class Conversations(models.Model):
    id         = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    creator    = models.ForeignKey(Profiles, on_delete=models.CASCADE, related_name='conversations')  # a creator can have many conversations creator+saf creator+nike
    brand      = models.ForeignKey(customUsersData, on_delete=models.CASCADE, related_name='conversations') # a brand can have many conv bbrand + john brand + mary
    deal       = models.ForeignKey(Deals, null=True, blank=True, on_delete=models.SET_NULL, related_name='conversations') # a deal is optional for conversation a convo can start withous a deal when we delete deal set here deal null dot delete convo
    proposal   = models.ForeignKey( Proposals, null=True, blank=True, on_delete=models.SET_NULL, related_name='conversations') # a proposal is optional for conversation a convo can start withous a proposal when we delete proposal set here proposal null dot delete convo
    created_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed  = True
        db_table = 'conversations'
        constraints = [
            models.UniqueConstraint(fields=['brand', 'creator'], name='one_chat_per_brand_creator'),
        ] # keeps convo saf + creator one conversation when we click from deal incoming proposal open same convo
 
    def __str__(self):
        return f'Conversation for Deal={self.deal_id}'
 
 
class Messages(models.Model):
    id              = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    conversation    = models.ForeignKey(Conversations, on_delete=models.CASCADE, related_name='messages')
    sender          = models.ForeignKey(customUsersData, on_delete=models.CASCADE, related_name='messages')
    message         = models.TextField(blank=True, null=True)
    attachment_url  = models.TextField(blank=True, null=True)
    attachment_type = models.CharField(max_length=100, blank=True, null=True)
    attachment_size = models.BigIntegerField(blank=True, null=True)
    is_read         = models.BooleanField(default=False)
    created_at      = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed  = True
        db_table = 'messages'
 
    def __str__(self):
        return f'Message={self.id} read={self.is_read}'
 

 
class Notifications(models.Model):
    TYPE_CHOICES = (
        ('new_proposal',      'New Proposal'),
        ('proposal_accepted', 'Proposal Accepted'),
        ('proposal_rejected', 'Proposal Rejected'),
        ('deal_started',      'Deal Started'),
        ('deal_completed',    'Deal Completed'),
        ('new_message',       'New Message'),
        ('new_offer',         'New Offer'),
    )
 
    id         = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    user       = models.ForeignKey(customUsersData, on_delete=models.CASCADE, related_name='notifications')
    title      = models.CharField(max_length=255)
    message    = models.TextField(blank=True, null=True)
    type       = models.CharField(max_length=30, choices=TYPE_CHOICES)
    is_read    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed  = True
        db_table = 'notifications'
 
    def __str__(self):
        return f'Notification={self.title} user={self.user_id}'
 

 
class Contactus(models.Model):
    id         = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    username   = models.CharField(max_length=150)
    email      = models.CharField(max_length=255)
    topic      = models.CharField(max_length=100)
    message    = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed  = True
        db_table = 'contactus'
 
    def __str__(self):
        return f'ContactUs={self.username} topic={self.topic}'

class AIConversation(models.Model):
    """
    One conversation thread per user per context.
    A user can have multiple conversations — e.g. one for support,
    one for general questions, one for a specific deal context.
 
    """
 
    id         = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    user       = models.ForeignKey(customUsersData,on_delete=models.CASCADE,related_name='ai_conversations')
    is_active  = models.BooleanField(default=True)    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        managed  = True
        db_table = 'ai_conversations'
        ordering = ['-updated_at']  
 
    def __str__(self):
        return f'AIConversation={self.id} user={self.user.email} context={self.context}'
 
 
class AIMessage(models.Model):
    """
    A single message turn inside an AIConversation.
    Every user message and every AI reply is stored as a row here.
    role = "user"  → message typed by the user
    role = "model" → reply from Gemini
    """
 
    ROLE_CHOICES = (
        ('user',  'User'),    
        ('model', 'Model'),   # reply from Gemini
    )
 
    id           = models.UUIDField(primary_key=True, db_default=RandomUUID(), editable=False)
    conversation = models.ForeignKey(AIConversation,on_delete=models.CASCADE,related_name='messages')
    role         = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content      = models.TextField()
    # # token count returned by Gemini useful for monitoring API costs
    # token_count  = models.IntegerField(blank=True, null=True)
    created_at   = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        managed  = True
        db_table = 'ai_messages'
        ordering = ['created_at']   # oldest first
 
    def __str__(self):
        return f'AIMessage={self.id} role={self.role} conversation={self.conversation_id}'
 