from django.contrib.auth.models import AbstractUser
from django.db import models

ROLE_CHOICES =(
    ("teacher", "Teacher"),
    ("student", "Student"),
)

class User (AbstractUser):
    role = models. CharField(max_length=10, choices=ROLE_CHOICES)
    full_name = models. CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"