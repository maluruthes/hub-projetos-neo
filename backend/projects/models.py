from django.db import models
from members.models import Member

# Create your models here.

class Project(models.Model):
    name = models.CharField(max_length=150)
    partner_company = models.CharField(max_length=150)
    description = models.TextField(blank=True)

    members = models.ManyToManyField(
        Member,
        through='Allocation',
        related_name='projects'
        )
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Allocation(models.Model):
    member = models.ForeignKey(
        Member,
        on_delete=models.CASCADE,
        related_name='allocations'
    )

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='allocations'
    )

    def __str__(self):
        return f'{self.member.name} - {self.project.name}'

    class Meta:
        unique_together = ('member', 'project')