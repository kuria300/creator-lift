from rest_framework.permissions import BasePermission

class IsBrand(BasePermission):
    """ custom permission used to check for brand when creatin or openning convos"""
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "brand"
        )

class IsCreator(BasePermission):
    """ custom permission used to check for creator when creatin or openning convos"""
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "creator"
        )