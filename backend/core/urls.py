from django.urls import path
from .views import (
    RegisterView,
    TimeSlotListCreateView,
    TimeSlotDetailView,
    AvailableSlotsView,
    BookingCreateView,
    MyBookingsView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("teacher/slots/", TimeSlotListCreateView.as_view(), name="teacher-slots"),
    path("teacher/slots/<int:pk>/", TimeSlotDetailView.as_view(), name="teacher-slot-detail"),

    path("student/slots/", AvailableSlotsView.as_view(), name="available-slots"),
    path("student/book/", BookingCreateView.as_view(), name="book-slot"),
    path("student/bookings/", MyBookingsView.as_view(), name="my-bookings"),
]
