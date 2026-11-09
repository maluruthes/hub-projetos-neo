from rest_framework import serializers
from .models import Project
from members.models import Member
from members.serializers import MemberSerializer


class ProjectSerializer(serializers.ModelSerializer):
    members = MemberSerializer(many=True, read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=Member.objects.all(), source='members', write_only=True, required=False)

    class Meta:
        model = Project
        fields = '__all__'
