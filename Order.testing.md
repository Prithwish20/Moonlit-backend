Use these payloads in Postman to fully test your Order System.

---

# IMPORTANT BEFORE TESTING

You MUST:

✅ Login first
✅ Add items to cart first
✅ Use:

```txt id="9x2vpm"
Authorization: Bearer ACCESS_TOKEN
```

---

# BASE URL

```txt id="4m7qwc"
http://localhost:5000/api/v1/orders
```

---

# 1. CREATE ORDER / CHECKOUT

## Endpoint

```http id="7k1vxp"
POST /api/v1/orders/checkout
```

---

# Headers

```txt id="2w8mqr"
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

---

# TEST DATA 1 → PARTIAL PAYMENT

```json id="5v2qxm"
{
  "prescription": {
    "leftEye": {
      "sph": -2.5,
      "cyl": -1.25,
      "axis": 180
    },

    "rightEye": {
      "sph": -3,
      "cyl": -0.75,
      "axis": 90
    },

    "pd": 63,

    "notes": "Blue cut recommended"
  },

  "discountAmount": 200,

  "taxAmount": 100,

  "advanceAmount": 3000,

  "paymentMethod": "UPI",

  "notes": "Customer requested fast delivery"
}
```

---

# EXPECTED LOGIC

Example:

```txt id="8r4vpm"
Cart subtotal = 12400

12400
- 200
+ 100

= 12300 grandTotal
```

Advance:

```txt id="0x7mwc"
3000 paid
```

Due:

```txt id="6k2qvp"
12300 - 3000
= 9300
```

Payment status:

```txt id="1n8vqr"
PARTIAL
```

---

# EXPECTED RESPONSE

```json id="3v9xpm"
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "orderNumber": "ORD-123456-7890",
    "paymentStatus": "PARTIAL",
    "paidAmount": 3000,
    "dueAmount": 9300
  }
}
```

---

# IMPORTANT

After successful checkout:

```txt id="5m1qwr"
cart should become empty
```

Test it immediately.

---

# 2. GET MY ORDERS

## Endpoint

```http id="7v2qmx"
GET /api/v1/orders/my-orders
```

---

# Expected Response

```json id="2k8vpc"
{
  "success": true,
  "total": 1,
  "orders": []
}
```

---

# 3. GET SINGLE ORDER

Copy:

```txt id="4x9mqp"
order._id
```

---

## Endpoint

```http id="9r1vwc"
GET /api/v1/orders/ORDER_ID
```

---

# Expected

Full order snapshot.

---

# 4. UPDATE ORDER STATUS

Login as:

* OWNER
  OR
* DEVELOPER

---

## Endpoint

```http id="6m3qxp"
PATCH /api/v1/orders/ORDER_ID/status
```

---

# Body

```json id="1v7qmk"
{
  "orderStatus": "PROCESSING"
}
```

---

# TEST OTHER STATUSES

```txt id="8n2vpr"
CONFIRMED
READY
DELIVERED
CANCELLED
```

---

# Expected Response

```json id="5k9qwm"
{
  "success": true,
  "message": "Order status updated"
}
```

---

# 5. ADD PAYMENT TO EXISTING ORDER

Useful for:

* due payment collection
* shop counter payment

---

## Endpoint

```http id="2r8vqx"
PATCH /api/v1/orders/ORDER_ID/payment
```

---

# Body

```json id="7x1mwc"
{
  "amount": 9300,
  "method": "CASH",
  "note": "Remaining amount paid at delivery"
}
```

---

# EXPECTED RESULT

```txt id="0v4qmp"
paidAmount = full amount
dueAmount = 0
paymentStatus = PAID
```

---

# EXPECTED RESPONSE

```json id="3m9vqx"
{
  "success": true,
  "message": "Payment added successfully"
}
```

---

# IMPORTANT TEST CASES

---

# TEST 1 → EMPTY CART CHECKOUT

Clear cart.

Then try:

```http id="4n7qwp"
POST /checkout
```

Expected:

```json id="8v2mqr"
{
  "success": false,
  "message": "Cart is empty"
}
```

---

# TEST 2 → OVERPAYMENT

Try:

```json id="1x8qvp"
{
  "amount": 999999
}
```

You SHOULD later validate:

* payment cannot exceed due amount

Currently your controller allows it.

You should fix later.

---

# TEST 3 → INVALID ORDER ID

Expected:

* Order not found

---

# TEST 4 → ROLE SECURITY

Login as USER.

Try:

```http id="9k1vpm"
PATCH /status
```

Expected:

* Forbidden

---

# VERY IMPORTANT NEXT STEP

After order system works:

Build:

# Invoice System

Because now you already have:

* stable order snapshot
* payment tracking
* due amount
* customer prescription
* business transaction history

Perfect foundation for:

* PDF invoice
* email invoice
* owner dashboard
* analytics system
