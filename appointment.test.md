Use these payloads in Postman to fully test your Appointment System.

---

# BASE URL

```txt
http://localhost:5000/api/v1/appointments
```

---

# IMPORTANT

Protected routes require:

```txt
Authorization: Bearer ACCESS_TOKEN
```

---

# BEFORE TESTING

You need:

```txt
1. existing user
2. existing doctor
3. valid access token
```

Copy a real:

```txt
doctor._id
```

from your doctors collection.

Example:

```txt
6a0dd8d4fdaf2dd430a41612
```

---

# 1. CREATE APPOINTMENT

## Endpoint

```http
POST /api/v1/appointments
```

---

# TEST DATA 1 → PRE-BOOKING DISCOUNT

Book 2+ days ahead.

```json
{
  "doctorId": "6a0dd8d4fdaf2dd430a41612",

  "appointmentDate": "2026-05-25T00:00:00.000Z",

  "slot": {
    "startTime": "10:00 AM",
    "endTime": "11:00 AM"
  },

  "symptoms": "Blurred vision and eye strain",

  "paymentMethod": "UPI",

  "paidAmount": 200
}
```

---

# EXPECTED RESULT

If doctor allows discount:

```json
{
  "preBookingDiscountApplied": true
}
```

And:

```txt
discountAmount > 0
```

---

# TEST DATA 2 → FULL PAYMENT

```json
{
  "doctorId": "6a0dd8d4fdaf2dd430a41612",

  "appointmentDate": "2026-05-26T00:00:00.000Z",

  "slot": {
    "startTime": "05:00 PM",
    "endTime": "06:00 PM"
  },

  "symptoms": "Frequent headaches while reading",

  "paymentMethod": "CASH",

  "paidAmount": 500
}
```

---

# EXPECTED RESULT

```json
{
  "paymentStatus": "PAID"
}
```

---

# TEST DATA 3 → PARTIAL PAYMENT

```json
{
  "doctorId": "6a0dd8d4fdaf2dd430a41612",

  "appointmentDate": "2026-05-27T00:00:00.000Z",

  "slot": {
    "startTime": "11:00 AM",
    "endTime": "12:00 PM"
  },

  "symptoms": "Dry eyes",

  "paymentMethod": "CARD",

  "paidAmount": 100
}
```

---

# EXPECTED RESULT

```json
{
  "paymentStatus": "PARTIAL",
  "dueAmount": 400
}
```

(depends on consultation fee)

---

# EXPECTED SUCCESS RESPONSE

```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "appointmentCode": "APT-4821",
    "appointmentStatus": "PENDING",
    "paymentStatus": "PARTIAL"
  }
}
```

---

# 2. GET MY APPOINTMENTS

## Endpoint

```http
GET /api/v1/appointments/my-appointments
```

---

# EXPECTED RESPONSE

```json
{
  "success": true,
  "total": 3,
  "appointments": []
}
```

---

# 3. GET ALL APPOINTMENTS

OWNER / DEVELOPER only.

## Endpoint

```http
GET /api/v1/appointments
```

---

# FILTER BY STATUS

```http
GET /api/v1/appointments?status=PENDING
```

---

# FILTER BY PAYMENT STATUS

```http
GET /api/v1/appointments?paymentStatus=PAID
```

---

# PAGINATION

```http
GET /api/v1/appointments?page=1&limit=5
```

---

# EXPECTED RESPONSE

```json
{
  "success": true,
  "total": 10,
  "currentPage": 1,
  "appointments": []
}
```

---

# 4. UPDATE APPOINTMENT STATUS

OWNER / DEVELOPER only.

## Endpoint

```http
PATCH /api/v1/appointments/APPOINTMENT_ID/status
```

---

# TEST BODY

```json
{
  "appointmentStatus": "CONFIRMED"
}
```

---

# OTHER STATUS VALUES

```txt
COMPLETED
CANCELLED
NO_SHOW
```

---

# EXPECTED RESPONSE

```json
{
  "success": true,
  "message": "Appointment status updated successfully"
}
```

---

# 5. CANCEL APPOINTMENT

User can cancel own appointment.

## Endpoint

```http
PATCH /api/v1/appointments/APPOINTMENT_ID/cancel
```

---

# EXPECTED RESULT

```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

---

# IMPORTANT EDGE CASE TESTS

---

# DOUBLE BOOKING TEST

Try SAME:

```txt
doctor
date
slot
```

again.

Should fail:

```json
{
  "success": false,
  "message": "This slot is already booked"
}
```

---

# INVALID DOCTOR TEST

```json
{
  "doctorId": "123"
}
```

Should fail.

---

# UNAVAILABLE DOCTOR TEST

Set:

```txt
doctor.isAvailable = false
```

Then try booking.

Should fail:

```json
{
  "message": "Doctor is currently unavailable"
}
```

---

# ZERO PAYMENT TEST

```json
{
  "paidAmount": 0
}
```

Should become:

```txt
paymentStatus = PENDING
```

---

# NEXT BEST STEP

Now build:

# Dashboard Analytics APIs

Because now you already have:

* products
* orders
* invoices
* doctors
* appointments
* payments

Enough business data for:

* monthly income
* daily patients
* sales analytics
* appointment analytics
* revenue tracking
* top selling products
* doctor performance

That should be your next major module.
