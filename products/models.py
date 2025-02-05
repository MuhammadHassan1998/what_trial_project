from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    pass

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    selected = models.BooleanField(default=False)

    def __str__(self):
        return self.name