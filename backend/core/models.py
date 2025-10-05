from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

ROLE_CHOICES = (
    ("teacher", "Teacher"),
    ("student", "Student"),
)

class User(AbstractUser):
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    full_name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

class TimeSlot(models.Model):
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    topic = models.CharField(max_length=200, blank=True, null=True)
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.teacher.username} - {self.date} {self.start_time}-{self.end_time}"

class Booking(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE, related_name='bookings')
    purpose = models.TextField()
    meeting_link = models.URLField(blank=True, null=True)
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} booked {self.slot}"
