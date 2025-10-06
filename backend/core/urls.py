from django.urls import path
from .views import (
    RegisterView,
    TimeSlotListCreateView,
    TimeSlotDetailView,
    AvailableSlotsView,
    BookingCreateView,
    MyBookingsView,
    CurrentUserView,
    StudentTeachersView,
    NotificationsView,
    TeacherBookingsView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Auth
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Teacher: Manage slots
    path("teacher/slots/", TimeSlotListCreateView.as_view(), name="teacher-slots"),
    path("teacher/slots/<int:pk>/", TimeSlotDetailView.as_view(), name="teacher-slot-detail"),

    # Teacher: View bookings for their slots
    path("teacher/bookings/", TeacherBookingsView.as_view(), name="teacher-bookings"),

    # Student: Available slots & booking
    path("student/slots/", AvailableSlotsView.as_view(), name="available-slots"),
    path("student/book/", BookingCreateView.as_view(), name="book-slot"),
    path("student/bookings/", MyBookingsView.as_view(), name="my-bookings"),

    # Student: Teachers list
    path("student/teachers/", StudentTeachersView.as_view(), name="student-teachers"),

    # Notifications
    path("student/notifications/", NotificationsView.as_view(), name="student-notifications"),
    path("notifications/", NotificationsView.as_view(), name="notifications"),

    # Current user info
    path("me/", CurrentUserView.as_view(), name="current-user"),
]
