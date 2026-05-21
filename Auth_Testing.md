Use these test payloads in Postman for your auth APIs.

---

# BASE URL

```txt id="nhdj7z"
http://localhost:5000/api/v1/auth
```

---

# 1. REGISTER

## Endpoint

```txt id="vjlwm0"
POST /register
```

## Full URL

```txt id="f2x2my"
http://localhost:5000/api/v1/auth/register
```

## Body → JSON

```json id="pdby1f"
{
  "name": "Moonlit Optics",
  "email": "moonlit@example.com",
  "phone": "9876543210",
  "password": "12345678"
}
```

---

# Expected Response

```json id="eq3kqs"
{
  "success": true,
  "message": "Registration successful. Verify your email."
}
```

---

# 2. VERIFY EMAIL OTP

## Endpoint

```txt id="18sl1f"
POST /verify-email
```

## Full URL

```txt id="u0n10q"
http://localhost:5000/api/v1/auth/verify-email
```

## Body

```json id="w4pv5o"
{
  "email": "moonlit@example.com",
  "otp": "123456"
}
```

IMPORTANT:
Use actual OTP generated in DB.

Check MongoDB:

* `otps` collection

---

# 3. LOGIN

## Endpoint

```txt id="ynh2cg"
POST /login
```

## Full URL

```txt id="o0v5po"
http://localhost:5000/api/v1/auth/login
```

## Body

```json id="hhvgwy"
{
  "email": "moonlit@example.com",
  "password": "12345678"
}
```

---

# Expected Response

```json id="q5yit4"
{
  "success": true,
  "message": "Login successful",
  "accessToken": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Moonlit Optics",
    "email": "moonlit@example.com",
    "role": "USER"
  }
}
```

Also:

* refreshToken cookie automatically set

---

# IMPORTANT POSTMAN SETTING

For refresh token cookie testing:

## Turn ON

```txt id="o1ks02"
Cookies Enabled
```

Postman usually handles automatically.

---

# 4. GET CURRENT USER

## Endpoint

```txt id="esjlwm"
GET /me
```

## Full URL

```txt id="g91zqy"
http://localhost:5000/api/v1/auth/me
```

---

# Headers

```txt id="u3s74k"
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Example:

```txt id="pwl0rq"
Authorization: Bearer eyJhbGciOiJIUz...
```

---

# Expected Response

```json id="mjlwmf"
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Moonlit Optics",
    "email": "moonlit@example.com",
    "role": "USER"
  }
}
```

---

# 5. REFRESH TOKEN

## Endpoint

```txt id="mx6j8r"
POST /refresh-token
```

## Full URL

```txt id="v3d7po"
http://localhost:5000/api/v1/auth/refresh-token
```

NO body needed.

Cookie automatically sent.

---

# Expected Response

```json id="cwxm4e"
{
  "success": true,
  "accessToken": "new_access_token"
}
```

---

# 6. LOGOUT

## Endpoint

```txt id="i4tmcf"
POST /logout
```

## Full URL

```txt id="0rzxjw"
http://localhost:5000/api/v1/auth/logout
```

---

# Headers

```txt id="kjlwm3"
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# Expected Response

```json id="1b7frg"
{
  "success": true,
  "message": "Logout successful"
}
```

Also:

* refresh cookie cleared
* session revoked

---

# IMPORTANT POSTMAN FLOW

## Correct Testing Order

```txt id="uw7k1d"
1. Register
2. Verify Email
3. Login
4. Copy access token
5. Test /me
6. Test /refresh-token
7. Test /logout
```

---

# RECOMMENDED POSTMAN COLLECTION STRUCTURE

```txt id="r6jlwm"
Auth
 ├── Register
 ├── Verify Email
 ├── Login
 ├── Refresh Token
 ├── Me
 └── Logout
```

---

# VERY IMPORTANT DEBUGGING TIPS

---

# If Login Fails

Check:

```txt id="3fz6lp"
user.verified === true
```

---

# If Refresh Token Fails

Check:

* cookie exists
* cookie-parser installed
* credentials enabled in CORS

---

# If /me Fails

Check:

```txt id="c4n8kt"
Authorization: Bearer token
```

---

# Recommended Postman Environment Variables

Create:

| Variable     | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| BASE_URL     | [http://localhost:5000/api/v1](http://localhost:5000/api/v1) |
| ACCESS_TOKEN | paste token                                                  |

Then use:

```txt id="lsjlwm"
{{BASE_URL}}/auth/login
```

Cleaner workflow.
