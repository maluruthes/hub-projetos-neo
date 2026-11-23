from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .serializers import UserSerializer, CreateUserSerializer, AdminUserSerializer
from .permissions import IsAdmin
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404


class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class CreateUserView(APIView):

    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)

        if serializer.is_valid():
            usuario = serializer.save()

            return Response(
                UserSerializer(usuario).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class UserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        usuarios = User.objects.all().order_by('username')
        serializer = AdminUserSerializer(usuarios, many=True)

        return Response(serializer.data)


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, pk):
        usuario = get_object_or_404(User, pk=pk)
        serializer = AdminUserSerializer(usuario)

        return Response(serializer.data)

    def patch(self, request, pk):
        usuario = get_object_or_404(User, pk=pk)

        # Impede que o administrador desative ou rebaixe
        # a própria conta pela interface
        if usuario.id == request.user.id:
            if request.data.get('role') == 'users':
                return Response(
                    {'erro': 'Você não pode remover seu próprio perfil de administrador.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if request.data.get('is_active') is False:
                return Response(
                    {'erro': 'Você não pode desativar sua própria conta.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = AdminUserSerializer(
            usuario,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        usuario = get_object_or_404(User, pk=pk)

        if usuario.id == request.user.id:
            return Response(
                {'erro': 'Você não pode excluir sua própria conta.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario.delete()

        return Response(
            {'mensagem': 'Usuário excluído com sucesso.'},
            status=status.HTTP_200_OK
        )
