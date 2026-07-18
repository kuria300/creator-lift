from django.contrib import admin
from .models import customUsersData

class customusersdataAdmin(admin.ModelAdmin):
    list_display=('id', 'email', 'username', 'role',  'is_superuser')
    list_filter = ('role', 'is_superuser')
    search_fields = ('email', 'username')
    readonly_fields=('id',)

admin.site.register(customUsersData, customusersdataAdmin)


# Register your models here.
