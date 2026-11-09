from django.db import models

# Create your models here.

class Project(models.Model):
    name = models.CharField(max_length=150)
    partner_company = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    members = models.ManyToManyField('members.Member', related_name='projects', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
