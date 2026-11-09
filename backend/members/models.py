from django.db import models

# Create your models here.

class Member(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=100)
    photo_url = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):   #__str__ faz com que o Django apresente o nome do membro
        return self.name

