Use these payloads in Postman to test your Doctor APIs.

---

# BASE URL

```txt id="8x2vpm"
http://localhost:5000/api/v1/doctors
```

---

# IMPORTANT

Protected routes require:

```txt id="4m7qwc"
Authorization: Bearer ACCESS_TOKEN
```

Login as:

* OWNER
  OR
* DEVELOPER

---

# 1. CREATE DOCTOR

## Endpoint

```http id="7k1vxp"
POST /api/v1/doctors
```

---

# TEST DATA 1

```json id="2w8mqr"
{
  "name": "Dr. Arindam Sen",

  "specialization": "Eye Specialist",

  "qualification": "MBBS, MS Ophthalmology",

  "experience": 12,

  "bio": "Experienced ophthalmologist specializing in cataract and vision correction.",

  "phone": "9876543210",

  "email": "arindam.sen@example.com",

  "profileImage": "https://example.com/doctor1.jpg",

  "consultationFee": 500,

  "availableDays": [
    "MONDAY",
    "WEDNESDAY",
    "FRIDAY"
  ],

  "availableSlots": [
    {
      "startTime": "10:00 AM",
      "endTime": "11:00 AM"
    },

    {
      "startTime": "05:00 PM",
      "endTime": "06:00 PM"
    }
  ],

  "maxPatientsPerSlot": 5,

  "allowPreBookingDiscount": true,

  "preBookingDiscountPercentage": 10
}
```

---

# TEST DATA 2

```json id="5v2qxm"
{
  "name": "Dr. Priya Mukherjee",

  "specialization": "Pediatric Eye Care",

  "qualification": "MBBS, DNB Ophthalmology",

  "experience": 8,

  "bio": "Specialist in children's eye health and corrective vision treatment.",

  "phone": "9123456780",

  "email": "priya.m@example.com",

  "profileImage": "https://example.com/doctor2.jpg",

  "consultationFee": 700,

  "availableDays": [
    "TUESDAY",
    "THURSDAY",
    "SATURDAY"
  ],

  "availableSlots": [
    {
      "startTime": "11:00 AM",
      "endTime": "01:00 PM"
    }
  ],

  "maxPatientsPerSlot": 3,

  "allowPreBookingDiscount": false
}
```

---

# EXPECTED RESPONSE

```json id="8r4vpm"
{
  "success": true,
  "message": "Doctor created successfully",
  "doctor": {}
}
```

---

# 2. GET ALL DOCTORS

## Endpoint

```http id="0x7mwc"
GET /api/v1/doctors
```

---

# SEARCH TEST

```http id="6k2qvp"
GET /api/v1/doctors?search=arindam
```

---

# FILTER TEST

```http id="1n8vqr"
GET /api/v1/doctors?specialization=eye
```

---

# PAGINATION TEST

```http id="3v9xpm"
GET /api/v1/doctors?page=1&limit=5
```

---

# EXPECTED RESPONSE

```json id="5m1qwr"
{
  "success": true,
  "total": 2,
  "currentPage": 1,
  "totalPages": 1,
  "doctors": []
}
```

---

# 3. GET SINGLE DOCTOR

Copy:

```txt id="7v2qmx"
doctor._id
```

---

## Endpoint

```http id="2k8vpc"
GET /api/v1/doctors/DOCTOR_ID
```

---

# EXPECTED

Single doctor object.

---

# 4. UPDATE DOCTOR

## Endpoint

```http id="4x9mqp"
PATCH /api/v1/doctors/DOCTOR_ID
```

---

# TEST BODY

```json id="9r1vwc"
{
  "consultationFee": 900,

  "experience": 15,

  "bio": "Updated doctor profile."
}
```

---

# EXPECTED RESPONSE

```json id="6m3qxp"
{
  "success": true,
  "message": "Doctor updated successfully"
}
```

---

# 5. TOGGLE AVAILABILITY

## Endpoint

```http id="1v7qmk"
PATCH /api/v1/doctors/DOCTOR_ID/toggle-availability
```

---

# EXPECTED RESULT

```txt id="8n2vpr"
true → false
false → true
```

---

# EXPECTED RESPONSE

```json id="5k9qwm"
{
  "success": true,
  "message": "Doctor is now unavailable"
}
```

---

# 6. DELETE DOCTOR

Login as:

* DEVELOPER

---

## Endpoint

```http id="2r8vqx"
DELETE /api/v1/doctors/DOCTOR_ID
```

---

# EXPECTED RESPONSE

```json id="7x1mwc"
{
  "success": true,
  "message": "Doctor deleted successfully"
}
```

---

# IMPORTANT EDGE TESTS

---

# INVALID SPECIALIZATION

```json id="0v4qmp"
{
  "specialization": ""
}
```

Should fail validation later.

---

# NEGATIVE FEES

```json id="4n7qwp"
{
  "consultationFee": -100
}
```

Should fail.

---

# INVALID DAY

```json id="8v2mqr"
{
  "availableDays": ["HOLIDAY"]
}
```

Should fail enum validation.

---

# NEXT STEP

After Doctor System:

Build:

# appointment.model.js

Because now:

* doctors exist
* schedules exist
* slots exist

Perfect foundation for appointment booking logic.
