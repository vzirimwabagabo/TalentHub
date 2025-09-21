# TalentHub REST API Documentation

## Base URL
```
/api/v1/
```

---

## Authentication & User Management

### Register New User
- **POST** `/auth/register`
- **Body:**  
  ```json
  { "name": "John Doe", "email": "user@example.com", "password": "password123" }
  ```
- **Response:**  
  201 Created, user data, JWT token

---

### Login
- **POST** `/auth/login`
- **Body:**  
  ```json
  { "email": "user@example.com", "password": "password123" }
  ```
- **Response:**  
  200 OK, user data, JWT token

---

### Get Own Profile
- **GET** `/auth/me`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, user data

---

### Forgot Password
- **POST** `/auth/forgot-password`
- **Body:**  
  ```json
  { "email": "user@example.com" }
  ```
- **Response:**  
  200 OK, message

---

### Reset Password
- **POST** `/auth/reset-password/:token`
- **Body:**  
  ```json
  { "password": "newpassword123" }
  ```
- **Response:**  
  200 OK, message

---

### Delete a User (Admin Only)
- **DELETE** `/auth/:id`
- **Headers:**  
  `Authorization: Bearer <admin token>`
- **Response:**  
  200 OK, message

---

### Delete All Non-Admins (Admin Only)
- **DELETE** `/auth/all?confirm=YES_DELETE`
- **Headers:**  
  `Authorization: Bearer <admin token>`
- **Response:**  
  200 OK, message

---

## Talent Profiles

### Create Talent Profile
- **POST** `/talents/`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**  
  - Profile fields (see your model)
- **Response:**  
  201 Created, talent profile

---

### Get Own Talent Profile
- **GET** `/talents/me`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, profile

---

### Update Own Talent Profile
- **PUT** `/talents/me`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**  
  - Updated profile fields
- **Response:**  
  200 OK, updated profile

---

### Delete Own Talent Profile
- **DELETE** `/talents/me`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, message

---

### Get All Talent Profiles (Public)
- **GET** `/talents/`
- **Response:**  
  200 OK, list of profiles

---

### Get Talent Profile by ID (Public)
- **GET** `/talents/:id`
- **Response:**  
  200 OK, profile

---

### Delete Any Talent Profile (Admin Only)
- **DELETE** `/talents/:id`
- **Headers:**  
  `Authorization: Bearer <admin token>`
- **Response:**  
  200 OK, message

---

## Volunteer Profiles

### Create Own Volunteer Profile
- **POST** `/volunteers/`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**  
  - Profile data
- **Response:**  
  201 Created, profile

---

### Get Own Volunteer Profile
- **GET** `/volunteers/me`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, profile

---

### Update Own Volunteer Profile
- **PUT** `/volunteers/me`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**  
  - Updated profile data
- **Response:**  
  200 OK, updated profile

---

### Delete Own Volunteer Profile
- **DELETE** `/volunteers/me`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, message

---

### Get All Volunteers (Admin Only)
- **GET** `/volunteers/`
- **Headers:**  
  `Authorization: Bearer <admin token>`
- **Response:**  
  200 OK, list of volunteers

---

### Update Volunteer Status (Admin Only)
- **PUT** `/volunteers/:id/status`
- **Headers:**  
  `Authorization: Bearer <admin token>`
- **Body:**  
  - Status fields
- **Response:**  
  200 OK, updated volunteer

---

### Delete Volunteer (Admin Only)
- **DELETE** `/volunteers/:id`
- **Headers:**  
  `Authorization: Bearer <admin token>`
- **Response:**  
  200 OK, message

---

## Events

### Create Event
- **POST** `/events/`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**  
  - Event details
- **Response:**  
  201 Created, event

---

### Get All Events (Public)
- **GET** `/events/`
- **Response:**  
  200 OK, list of events

---

### Get Event by ID (Public)
- **GET** `/events/:id`
- **Response:**  
  200 OK, event

---

### Update Event
- **PUT** `/events/:id`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**  
  - Updated event details
- **Response:**  
  200 OK, updated event

---

### Delete Event
- **DELETE** `/events/:id`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, message

---

## Portfolio

### Add Portfolio Item
- **POST** `/portfolio/`
- **Headers:**  
  `Authorization: Bearer <token>`
- **FormData:**  
  - `portfolioFile` (file)
  - other fields
- **Response:**  
  201 Created, item

---

### Get Own Portfolio Items
- **GET** `/portfolio/my`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, list of items

---

### Update Portfolio Item
- **PUT** `/portfolio/:id`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**  
  - Updated fields
- **Response:**  
  200 OK, updated item

---

### Delete Portfolio Item
- **DELETE** `/portfolio/:id`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, message

---

## Reviews

### Create Review
- **POST** `/reviews/`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**  
  - Review fields
- **Response:**  
  201 Created, review

---

### Get Own Reviews
- **GET** `/reviews/me`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, reviews

---

### Get All Reviews (Admin Only)
- **GET** `/reviews/`
- **Headers:**  
  `Authorization: Bearer <admin token>`
- **Response:**  
  200 OK, all reviews

---

### Delete Review
- **DELETE** `/reviews/:id`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, message

---

## Donations

### Create Donation
- **POST** `/donations/`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**  
  - Donation details
- **Response:**  
  201 Created, donation

---

### Get Own Donations
- **GET** `/donations/me`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, list of donations

---

### Get All Donations (Admin Only)
- **GET** `/donations/`
- **Headers:**  
  `Authorization: Bearer <admin token>`
- **Response:**  
  200 OK, all donations

---

### Get Donation by ID (Admin Only)
- **GET** `/donations/:id`
- **Headers:**  
  `Authorization: Bearer <admin token>`
- **Response:**  
  200 OK, donation

---

### Delete Donation (Admin Only)
- **DELETE** `/donations/:id`
- **Headers:**  
  `Authorization: Bearer <admin token>`
- **Response:**  
  200 OK, message

---

## Bookmarks

### Add Bookmark
- **POST** `/bookmarks/`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**  
  - Bookmark fields
- **Response:**  
  201 Created, bookmark

---

### Get All Bookmarks
- **GET** `/bookmarks/`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, list of bookmarks

---

### Delete Bookmark
- **DELETE** `/bookmarks/:id`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  200 OK, message

---

## Analytics

### Admin Dashboard Stats
- **GET** `/analytics/dashboard`
- **Headers:**  
  `Authorization: Bearer <admin token>`
- **Response:**  
  200 OK, stats object

---

## Admin (Custom/Admin-only Endpoints)

- Mounted at `/admin/` (see code for details).

---

## Notes

- Some endpoints require authentication:  
  - Provide JWT in `Authorization: Bearer <token>` header.
- Some endpoints are for admin users only.
- Review the models for exact request/response fields and data structure.
- For error handling, standard JSON error responses are returned.

---

## Example: Authorization Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5...
```

---

_This documentation is generated from your current API route structure. For detailed request/response schemas, see the controller/model files._