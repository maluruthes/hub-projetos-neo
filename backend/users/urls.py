from django.urls import path
from .views import (
    MeView,
    CreateUserView,
    UserListView,
    UserDetailView,
)

urlpatterns = [
    path('me/', MeView.as_view(), name='me'),
    path('create/', CreateUserView.as_view(), name='create-user'),
    path('', UserListView.as_view(), name='user-list'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
