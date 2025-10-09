# Student-Teacher Slot Booking System

A web application that allows students to book time slots with teachers, and teachers to manage their schedules efficiently. Built with **React**, **React Router**, **Axios**, and **JWT-based authentication**.

---

## Features

### User Authentication
- **Registration**: Users sign up as **teacher** or **student** password, full name, usename and role. 
- **Login**: Users log in with credentials. Role-based dashboard redirect.
- **Session Management**: JWT tokens maintain user session across pages.

### Teacher Dashboard
Teachers have full control over their teaching schedule:

1. **View Schedule**  
   - Display calendar or list of time slots (available/booked/past)  
   - Filter by date or status

2. **Update Schedule**  
   - Add new time slots with date, time, duration (30–60 minutes), and optional topics

3. **Change Schedule**  
   - Edit or cancel existing slots  
   - Notify students via email or in-app notifications if a booked slot changes

4. **View Bookings**  
   - List of student bookings with names, interaction details, and upcoming meetings

5. **Notifications**  
   - Alerts for new bookings, cancellations, or student requests

### Student Dashboard
Students can browse teachers and book sessions:

1. **View Teachers and Schedules**  
   - Browse teachers with available time slots  
   - Filter by teacher name, subject, or date

2. **Book Time Slot**  
   - Select a specific slot  
   - Fill meeting details:
    
3. **View My Bookings**  
   - Personal calendar of confirmed sessions  
   - Cancel or reschedule (if allowed)

4. **Notifications**  
   - Booking confirmations  
   - Reminders 24 hours before the meeting  
   - Updates if teacher changes schedule

---

## Application Flow

1. **User Onboarding**:  
   - Registration/Login → Role Check → Dashboard Redirect

2. **Teacher Actions**:  
   - Login → View/Update Schedule → Slot Becomes Available → Wait for Bookings

3. **Student Actions**:  
   - Login → Browse Teachers/Schedules → Select Slot → Submit Details → Booking Confirmed

4. **Shared Interactions**:  
   - Booking updates schedule → Notifications sent → Meeting occurs → Optional feedback

5. **Error Handling**:  
   - Slot unavailability  
   - Invalid form inputs  
   - Logout and session expiration handling

---

## Technology Stack
- **Frontend**: React, React Router, CSS3 (with modern UI/UX design)
- **Backend**: Django REST Framework (or similar API backend)
- **Authentication**: JWT Tokens
- **State Management**: React useState & useEffect
- **HTTP Requests**: Axios
- **Notifications**: In-app alerts, optional email integration

---

## UI/UX Highlights
- Modern **glassmorphism style** for login, registration, and dashboards  
- Responsive layout for desktops and mobiles  
- Smooth **animations** and **fade-in effects**  
- Collapsible sidebar for teacher dashboard  
- Top navigation bar with profile, notifications, and logout

---

## How to Run Locally

1. Clone the repository:
```bash
git clone https://github.com/yourusername/student-teacher-slot-booking.git
