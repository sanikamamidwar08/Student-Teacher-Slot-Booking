from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import TimeSlot, Booking, Notification  

User = get_user_model()

# -------------------------
# Register
# -------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('username', 'email', 'full_name', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            full_name=validated_data.get('full_name', ''),
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


# -------------------------
# Notifications
# -------------------------
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'message', 'timestamp')


# -------------------------
# User Serializer
# -------------------------
class UserSerializer(serializers.ModelSerializer):
    slots = serializers.SerializerMethodField()
    notifications = NotificationSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'role', 'slots', 'notifications')

    def get_slots(self, obj):
        if obj.role == 'teacher':
            slots = TimeSlot.objects.filter(teacher=obj)
            return [{
                'id': slot.id,
                'date': slot.date,
                'start_time': slot.start_time,
                'end_time': slot.end_time,
                'topic': slot.topic,
                'is_booked': slot.is_booked,
                'is_available': slot.is_available,
            } for slot in slots]
        return []


# -------------------------
# TimeSlot Serializer
# -------------------------
class TimeSlotSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = TimeSlot
        fields = (
            'id',
            'date',
            'start_time',
            'end_time',
            'topic',
            'is_booked',
            'is_available',
            'student_name',
            'status',
        )
        read_only_fields = ('id', 'is_booked')

    def get_student_name(self, obj):
        booking = Booking.objects.filter(slot=obj).first()
        if booking:
            return booking.student.full_name or booking.student.username
        return None

    def get_status(self, obj):
        if obj.is_booked:
            return "Booked"
        elif obj.is_available:
            return "Available"
        return "Unavailable"


# -------------------------
# Booking Serializer
# -------------------------
class BookingSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    teacher_name = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    start_time = serializers.SerializerMethodField()
    end_time = serializers.SerializerMethodField()
    topic = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = (
            'id',
            'student',
            'student_name',
            'slot',
            'purpose',
            'meeting_link',
            'booked_at',
            'teacher_name',
            'date',
            'start_time',
            'end_time',
            'topic',
            'status'
        )

    def get_teacher_name(self, obj):
        return obj.slot.teacher.full_name or obj.slot.teacher.username

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def get_date(self, obj):
        return obj.slot.date

    def get_start_time(self, obj):
        return obj.slot.start_time

    def get_end_time(self, obj):
        return obj.slot.end_time

    def get_topic(self, obj):
        return obj.slot.topic or "N/A"

    def get_status(self, obj):
        if obj.slot.is_booked:
            return "Booked"
        elif obj.slot.is_available:
            return "Available"
        return "Unavailable"
