from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Permite acesso somente para usuários do grupo admin.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.groups.filter(name='admin').exists()
        )