# Create your views here.
from rest_framework.viewsets import ModelViewSet
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.prefetch_related('members').all()

        name = self.request.query_params.get('name')
        company = self.request.query_params.get('company')
        member = self.request.query_params.get('member')

        if name:
            queryset = queryset.filter(name__icontains=name)
        if company:
            queryset = queryset.filter(partner_company__icontains=company)
        if member:
            queryset = queryset.filter(members__id=member)

        return queryset.distinct() #evita que um mesmo projeto apareça repetido nos resultados
