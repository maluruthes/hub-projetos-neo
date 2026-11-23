from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

    def get_role(self, obj):
        if obj.groups.filter(name='admin').exists():
            return 'admin'

        return 'users'


class CreateUserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        from django.contrib.auth.models import Group

        usuario = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )

        grupo_users = Group.objects.get(name='users')
        usuario.groups.add(grupo_users)

        return usuario

class AdminUserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=['users', 'admin'],
        write_only=True,
        required=False
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_active']
        read_only_fields = ['id']

    def update(self, instance, validated_data):
        from django.contrib.auth.models import Group

        role = validated_data.pop('role', None)

        instance = super().update(instance, validated_data)

        if role is not None:
            grupo, criado = Group.objects.get_or_create(name=role)

            instance.groups.clear()
            instance.groups.add(grupo)

        return instance

    def to_representation(self, instance):
        dados = super().to_representation(instance)

        if instance.groups.filter(name='admin').exists():
            dados['role'] = 'admin'
        else:
            dados['role'] = 'users'

        return dados
