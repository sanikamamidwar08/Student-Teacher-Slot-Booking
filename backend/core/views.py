from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import (
    RegisterSerializer,
    TimeSlotSerializer,
    BookingSerializer,
    UserSerializer,
    NotificationSerializer,
)
from .models import TimeSlot, Booking, Notification
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

# -------------------------
# Custom JWT login with role
# -------------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claim for role
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# -------------------------
# Register
# -------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


# -------------------------
# Teacher: Manage slots
# -------------------------
class TimeSlotListCreateView(generics.ListCreateAPIView):
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TimeSlot.objects.filter(teacher=self.request.user)

    def perform_create(self, serializer):
        slot = serializer.save(teacher=self.request.user)
        # Notify all students
        students = User.objects.filter(role='student')
        for student in students:
            Notification.objects.create(
                user=student,
                message=f"📢 New lecture by {self.request.user.full_name or self.request.user.username} "
                        f"on {slot.date} ({slot.start_time}-{slot.end_time})"
            )

class TimeSlotDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TimeSlotSerializer
    queryset = TimeSlot.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        slot = serializer.save()
        students = User.objects.filter(role='student')
        for student in students:
            Notification.objects.create(
                user=student,
                message=f"✏️ Lecture updated by {self.request.user.full_name or self.request.user.username} "
                        f"on {slot.date} ({slot.start_time}-{slot.end_time})"
            )

    def perform_destroy(self, instance):
        students = User.objects.filter(role='student')
        for student in students:
            Notification.objects.create(
                user=student,
                message=f"❌ Lecture by {self.request.user.full_name or self.request.user.username} "
                        f"on {instance.date} ({instance.start_time}-{instance.end_time}) was deleted"
            )
        instance.delete()


# -------------------------
# Student: Available slots
# -------------------------
class AvailableSlotsView(generics.ListAPIView):
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TimeSlot.objects.filter(is_booked=False, is_available=True)


# -------------------------
# Student: Book slot
# -------------------------
class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        booking = serializer.save(student=self.request.user)
        slot = booking.slot
        slot.is_booked = True
        slot.save()
        # Notify teacher
        Notification.objects.create(
            user=slot.teacher,
            message=f"📅 New booking by {self.request.user.full_name or self.request.user.username} "
                    f"on {slot.date} ({slot.start_time}-{slot.end_time})"
        )


# -------------------------
# Student: My bookings
# -------------------------
class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(student=self.request.user).select_related('slot', 'student')


# -------------------------
# Student: Cancel booking
# -------------------------
class MyBookingDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(student=self.request.user)

    def perform_destroy(self, instance):
        slot = instance.slot
        teacher = slot.teacher
        student = instance.student
        Notification.objects.create(
            user=teacher,
            message=f"❌ {student.full_name or student.username} cancelled booking on {slot.date} "
                    f"({slot.start_time}-{slot.end_time})"
        )
        slot.is_booked = False
        slot.save()
        instance.delete()


# -------------------------
# Teacher: View bookings
# -------------------------
class TeacherBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(slot__teacher=self.request.user).select_related('slot', 'student')


# -------------------------
# Student: List all teachers
# -------------------------
class StudentTeachersView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(role='teacher')


# -------------------------
# Notifications
# -------------------------
class NotificationsView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-timestamp')


# -------------------------
# Current logged-in user
# -------------------------
class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
