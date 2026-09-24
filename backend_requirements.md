# CampusFix Backend API Requirements

## 1. Project Overview

CampusFix is a university campus issue reporting and tracking system.

Students can report campus problems such as:

- Wi-Fi issues
- Broken equipment
- Damaged furniture
- Classroom problems
- Maintenance issues
- Dirty areas
- Missing facilities
- Other campus-related problems

Students should be able to track their submitted issues and see whether they are:

- Pending
- In Progress
- Resolved

Students can also comment on issues and upvote existing issues.

University staff can manage reported issues, change their status, assign issues to staff members, and add updates/comments.

---

# 2. Backend Technology

The backend should use:

- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- JWT authentication
- Argon2id or bcrypt for password hashing

Recommended project structure:

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── auth.py
│   │   ├── issues.py
│   │   ├── comments.py
│   │   ├── users.py
│   │   ├── student.py
│   │   └── staff.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── issue.py
│   │   ├── comment.py
│   │   └── upvote.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── issue.py
│   │   ├── comment.py
│   │   └── dashboard.py
│   │
│   ├── services/
│   │   ├── auth.py
│   │   ├── issue.py
│   │   └── storage.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   │
│   └── dependencies.py
│
├── uploads/
│   └── issues/
│
├── .env
├── requirements.txt
└── README.md
```

---

# 3. Base API URL

Development:

```text
http://localhost:8000/api
```

Frontend environment variable:

```env
VITE_API_URL=http://localhost:8000/api
```

---

# 4. Authentication

Authentication must use JWT Bearer tokens.

Protected requests must include:

```http
Authorization: Bearer <access_token>
```

There are two user roles:

```text
student
staff
```

Users must never be able to choose their own role during normal registration.

---

# 5. User Model

The users table should contain:

```text
users
--------------------------------
id
name
email
password_hash
role
created_at
updated_at
```

### Role values

```text
student
staff
```

The email should be unique.

Passwords must never be stored in plaintext.

---

# 6. Authentication Endpoints

## 6.1 Register

### Request

```http
POST /api/auth/register
Content-Type: application/json
```

### Body

```json
{
  "name": "Ali Khan",
  "email": "ali@university.edu",
  "password": "StrongPassword123"
}
```

### Success Response

Status:

```http
201 Created
```

Response:

```json
{
  "id": 1,
  "name": "Ali Khan",
  "email": "ali@university.edu",
  "role": "student",
  "created_at": "2026-09-25T10:30:00Z"
}
```

### Duplicate Email

Status:

```http
409 Conflict
```

Response:

```json
{
  "detail": "An account with this email already exists."
}
```

---

# 7. Login

### Request

```http
POST /api/auth/login
Content-Type: application/json
```

### Body

```json
{
  "email": "ali@university.edu",
  "password": "StrongPassword123"
}
```

### Success Response

Status:

```http
200 OK
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Ali Khan",
    "email": "ali@university.edu",
    "role": "student"
  }
}
```

### Invalid Credentials

Status:

```http
401 Unauthorized
```

Response:

```json
{
  "detail": "Invalid email or password."
}
```

Do not reveal whether an email exists in the database.

---

# 8. Current User

The frontend needs to restore the authenticated user after page refresh.

### Request

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Response

```json
{
  "id": 1,
  "name": "Ali Khan",
  "email": "ali@university.edu",
  "role": "student",
  "created_at": "2026-09-25T10:30:00Z"
}
```

---

# 9. Issue Model

The issues table should contain:

```text
issues
--------------------------------
id
title
description
category
location
image_url
status
created_by
assigned_to
created_at
updated_at
```

Relationships:

```text
created_by  -> users.id
assigned_to -> users.id
```

`assigned_to` can be `NULL`.

---

# 10. Issue Status

The backend should use these exact API values:

```text
pending
in_progress
resolved
```

The frontend will format these for display.

Example:

```text
pending     -> Pending
in_progress -> In Progress
resolved    -> Resolved
```

---

# 11. Issue Categories

Recommended categories:

```text
Wi-Fi
Furniture
Facilities
Classroom
Maintenance
Cleanliness
Other
```

The backend should validate category values.

---

# 12. Create Issue

Students can create issues.

Because an issue can contain an image, this endpoint must accept `multipart/form-data`.

### Request

```http
POST /api/issues
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Form fields

```text
title
description
category
location
image
```

`image` is optional.

Example:

```text
title:
Wi-Fi not working in CS Lab 3

description:
The Wi-Fi keeps disconnecting during our lab.

category:
Wi-Fi

location:
CS Block — Lab 3

image:
<uploaded image>
```

The backend must determine `created_by` from the authenticated JWT user.

The frontend must not be allowed to provide `created_by`.

---

# 13. Create Issue Response

Status:

```http
201 Created
```

Response:

```json
{
  "id": 25,
  "title": "Wi-Fi not working in CS Lab 3",
  "description": "The Wi-Fi keeps disconnecting during our lab.",
  "category": "Wi-Fi",
  "location": "CS Block — Lab 3",
  "image_url": "http://localhost:8000/uploads/issues/25.jpg",
  "status": "pending",
  "upvotes": 0,
  "created_by": {
    "id": 1,
    "name": "Ali Khan"
  },
  "assigned_to": null,
  "created_at": "2026-09-25T10:30:00Z",
  "updated_at": "2026-09-25T10:30:00Z",
  "comment_count": 0,
  "has_upvoted": false
}
```

---

# 14. Image Upload Requirements

Allowed formats:

```text
jpg
jpeg
png
webp
```

Maximum file size:

```text
10 MB
```

The backend should reject unsupported file types.

For an oversized image:

```http
413 Payload Too Large
```

Example:

```json
{
  "detail": "Image must be smaller than 10MB."
}
```

Images should be stored under:

```text
/uploads/issues/
```

FastAPI should expose uploaded images as static files.

---

# 15. Get Issues

### Request

```http
GET /api/issues
Authorization: Bearer <token>
```

This endpoint should return issues visible to the authenticated user.

Staff should be able to see all reported issues.

---

# 16. Issue Filtering

The `/api/issues` endpoint must support:

```text
status
category
location
search
sort
page
page_size
```

Examples:

```http
GET /api/issues?status=pending
```

```http
GET /api/issues?category=Wi-Fi
```

```http
GET /api/issues?location=CS%20Block
```

```http
GET /api/issues?status=pending&category=Wi-Fi
```

```http
GET /api/issues?search=projector
```

---

# 17. Search

The `search` parameter should search at least:

```text
title
description
location
category
```

Example:

```http
GET /api/issues?search=wifi
```

This allows students to search for an existing issue before creating a duplicate report.

---

# 18. Sorting

The API should support sorting.

Recommended values:

```text
created_at
-upvotes
upvotes
```

Examples:

```http
GET /api/issues?sort=-upvotes
```

This should return the most upvoted issues first.

```http
GET /api/issues?sort=-created_at
```

This should return the newest issues first.

---

# 19. Pagination

The `/api/issues` endpoint must support pagination.

Example:

```http
GET /api/issues?page=1&page_size=20
```

Response:

```json
{
  "items": [
    {
      "id": 25,
      "title": "Wi-Fi not working in CS Lab 3",
      "description": "The Wi-Fi keeps disconnecting.",
      "category": "Wi-Fi",
      "location": "CS Block — Lab 3",
      "image_url": null,
      "status": "pending",
      "upvotes": 47,
      "created_by": {
        "id": 1,
        "name": "Ali Khan"
      },
      "assigned_to": null,
      "created_at": "2026-09-25T10:30:00Z",
      "updated_at": "2026-09-25T10:30:00Z",
      "comment_count": 3,
      "has_upvoted": false
    }
  ],
  "page": 1,
  "page_size": 20,
  "total": 57,
  "total_pages": 3
}
```

---

# 20. Get Single Issue

### Request

```http
GET /api/issues/{issue_id}
Authorization: Bearer <token>
```

Example:

```http
GET /api/issues/25
```

### Response

```json
{
  "id": 25,
  "title": "Wi-Fi not working in CS Lab 3",
  "description": "The Wi-Fi keeps disconnecting during our lab.",
  "category": "Wi-Fi",
  "location": "CS Block — Lab 3",
  "image_url": "http://localhost:8000/uploads/issues/25.jpg",
  "status": "pending",
  "upvotes": 47,
  "created_by": {
    "id": 1,
    "name": "Ali Khan"
  },
  "assigned_to": {
    "id": 7,
    "name": "Usman"
  },
  "created_at": "2026-09-25T10:30:00Z",
  "updated_at": "2026-09-25T11:30:00Z",
  "comment_count": 4,
  "has_upvoted": true,
  "comments": [
    {
      "id": 101,
      "user": {
        "id": 4,
        "name": "Hamza"
      },
      "text": "Facing the same problem.",
      "created_at": "2026-09-25T11:00:00Z"
    }
  ]
}
```

---

# 21. Get My Issues

Students need an endpoint to retrieve their own submitted issues.

### Request

```http
GET /api/issues/my
Authorization: Bearer <token>
```

### Response

```json
{
  "items": [
    {
      "id": 25,
      "title": "Wi-Fi not working in CS Lab 3",
      "description": "The Wi-Fi keeps disconnecting.",
      "category": "Wi-Fi",
      "location": "CS Block — Lab 3",
      "image_url": null,
      "status": "pending",
      "upvotes": 47,
      "created_by": {
        "id": 1,
        "name": "Ali Khan"
      },
      "assigned_to": null,
      "created_at": "2026-09-25T10:30:00Z",
      "updated_at": "2026-09-25T10:30:00Z",
      "comment_count": 2,
      "has_upvoted": false
    }
  ],
  "page": 1,
  "page_size": 20,
  "total": 1,
  "total_pages": 1
}
```

---

# 22. Update Issue

Only staff can change issue status or assignment.

### Request

```http
PATCH /api/issues/{issue_id}
Authorization: Bearer <staff_token>
Content-Type: application/json
```

The endpoint should support updating:

```text
status
assigned_to
```

Example:

```json
{
  "status": "in_progress"
}
```

Response:

```json
{
  "id": 25,
  "status": "in_progress",
  "assigned_to": null,
  "updated_at": "2026-09-25T12:30:00Z"
}
```

---

# 23. Assign Issue

Example:

```http
PATCH /api/issues/25
Authorization: Bearer <staff_token>
Content-Type: application/json
```

Body:

```json
{
  "assigned_to": 7
}
```

Response:

```json
{
  "id": 25,
  "status": "pending",
  "assigned_to": {
    "id": 7,
    "name": "Usman"
  },
  "updated_at": "2026-09-25T12:35:00Z"
}
```

---

# 24. Update Status and Assignment Together

The API should support:

```json
{
  "status": "in_progress",
  "assigned_to": 7
}
```

Response:

```json
{
  "id": 25,
  "status": "in_progress",
  "assigned_to": {
    "id": 7,
    "name": "Usman"
  },
  "updated_at": "2026-09-25T12:35:00Z"
}
```

---

# 25. Authorization Rules for Issues

Students must NOT be able to:

```text
change issue status
assign issues
assign themselves as staff
change another user's issue
```

If a student attempts a staff-only action:

```http
403 Forbidden
```

Response:

```json
{
  "detail": "Staff access required."
}
```

---

# 26. Comments

Both students and staff can comment on issues.

## Get Comments

```http
GET /api/issues/{issue_id}/comments
Authorization: Bearer <token>
```

Response:

```json
{
  "items": [
    {
      "id": 101,
      "user": {
        "id": 4,
        "name": "Hamza",
        "role": "student"
      },
      "text": "Facing the same problem during every lab.",
      "created_at": "2026-09-25T11:00:00Z"
    },
    {
      "id": 102,
      "user": {
        "id": 7,
        "name": "Usman",
        "role": "staff"
      },
      "text": "Maintenance team has been notified.",
      "created_at": "2026-09-25T12:00:00Z"
    }
  ]
}
```

---

# 27. Add Comment

### Request

```http
POST /api/issues/{issue_id}/comments
Authorization: Bearer <token>
Content-Type: application/json
```

Body:

```json
{
  "text": "I am also experiencing this problem."
}
```

### Response

Status:

```http
201 Created
```

```json
{
  "id": 103,
  "issue_id": 25,
  "user": {
    "id": 1,
    "name": "Ali Khan",
    "role": "student"
  },
  "text": "I am also experiencing this problem.",
  "created_at": "2026-09-25T13:00:00Z"
}
```

---

# 28. Comment Validation

Comments must:

- Not be empty
- Be trimmed
- Have a maximum length of 2000 characters

Example:

```text
"     hello     "
```

should be stored as:

```text
"hello"
```

---

# 29. Upvote System

Students should be able to upvote an existing issue.

The purpose is to allow multiple students experiencing the same problem to support one existing report instead of creating duplicate reports.

Example:

```text
Wi-Fi not working in CS Lab 3
📍 CS Block — Lab 3
🔼 47 upvotes
🔴 Pending
```

---

# 30. Upvote Database Model

Create an `upvotes` table:

```text
upvotes
--------------------------------
id
issue_id
user_id
created_at
```

Add a unique constraint:

```text
UNIQUE(issue_id, user_id)
```

This prevents one user from upvoting the same issue multiple times.

---

# 31. Add Upvote

### Request

```http
POST /api/issues/{issue_id}/upvote
Authorization: Bearer <token>
```

### Response

```json
{
  "issue_id": 25,
  "upvoted": true,
  "upvotes": 48
}
```

---

# 32. Remove Upvote

### Request

```http
DELETE /api/issues/{issue_id}/upvote
Authorization: Bearer <token>
```

### Response

```json
{
  "issue_id": 25,
  "upvoted": false,
  "upvotes": 47
}
```

---

# 33. Upvote Rules

A user can only have one upvote per issue.

Example:

```text
Ali -> Issue 25 -> upvote
```

should increase:

```text
47 -> 48
```

Calling the upvote endpoint again must not create another upvote record.

The frontend can use:

```text
has_upvoted
```

to determine whether the current user has already upvoted an issue.

---

# 34. Staff List

Staff need to be selectable when assigning an issue.

### Request

```http
GET /api/users/staff
Authorization: Bearer <staff_token>
```

### Response

```json
{
  "items": [
    {
      "id": 7,
      "name": "Usman",
      "email": "usman@university.edu",
      "role": "staff"
    },
    {
      "id": 8,
      "name": "Bilal",
      "email": "bilal@university.edu",
      "role": "staff"
    },
    {
      "id": 9,
      "name": "Fatima",
      "email": "fatima@university.edu",
      "role": "staff"
    }
  ]
}
```

Only staff users should be returned.

---

# 35. Student Dashboard

### Request

```http
GET /api/student/dashboard
Authorization: Bearer <student_token>
```

### Response

```json
{
  "stats": {
    "my_issues": 4,
    "pending": 2,
    "in_progress": 1,
    "resolved": 1
  },
  "popular_issues": [
    {
      "id": 25,
      "title": "Wi-Fi not working in CS Lab 3",
      "location": "CS Block — Lab 3",
      "category": "Wi-Fi",
      "status": "pending",
      "upvotes": 47
    }
  ],
  "campus_hotspots": [
    {
      "location": "CS Block",
      "issue_count": 18
    },
    {
      "location": "Engineering Block",
      "issue_count": 13
    }
  ]
}
```

---

# 36. Staff Dashboard

### Request

```http
GET /api/staff/dashboard
Authorization: Bearer <staff_token>
```

### Response

```json
{
  "stats": {
    "total_issues": 57,
    "pending": 18,
    "in_progress": 14,
    "resolved": 25,
    "total_upvotes": 1247
  },
  "popular_issues": [
    {
      "id": 25,
      "title": "Wi-Fi not working in CS Lab 3",
      "location": "CS Block — Lab 3",
      "category": "Wi-Fi",
      "status": "pending",
      "upvotes": 47
    },
    {
      "id": 31,
      "title": "Projector not working",
      "location": "Business Block — Room 101",
      "category": "Classroom",
      "status": "in_progress",
      "upvotes": 39
    }
  ]
}
```

---

# 37. Complete API Endpoint List

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create student account |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Authenticated | Get current user |
| GET | `/api/issues` | Authenticated | List issues |
| GET | `/api/issues/my` | Student | Get student's issues |
| POST | `/api/issues` | Student | Create issue |
| GET | `/api/issues/{id}` | Authenticated | Get issue details |
| PATCH | `/api/issues/{id}` | Staff | Update status/assignment |
| GET | `/api/issues/{id}/comments` | Authenticated | Get comments |
| POST | `/api/issues/{id}/comments` | Authenticated | Add comment |
| POST | `/api/issues/{id}/upvote` | Student | Upvote issue |
| DELETE | `/api/issues/{id}/upvote` | Student | Remove upvote |
| GET | `/api/users/staff` | Staff | Get staff members |
| GET | `/api/student/dashboard` | Student | Student dashboard |
| GET | `/api/staff/dashboard` | Staff | Staff dashboard |

---

# 38. Database Schema

## Users

```text
users
--------------------------------
id              INTEGER PK
name            VARCHAR
email           VARCHAR UNIQUE
password_hash   VARCHAR
role            ENUM
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## Issues

```text
issues
--------------------------------
id              INTEGER PK
title           VARCHAR
description     TEXT
category        VARCHAR
location        VARCHAR
image_url       VARCHAR NULL
status          ENUM
created_by      FK -> users.id
assigned_to     FK -> users.id NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## Comments

```text
comments
--------------------------------
id              INTEGER PK
issue_id        FK -> issues.id
user_id         FK -> users.id
text            TEXT
created_at      TIMESTAMP
```

---

## Upvotes

```text
upvotes
--------------------------------
id              INTEGER PK
issue_id        FK -> issues.id
user_id         FK -> users.id
created_at      TIMESTAMP
```

Constraint:

```text
UNIQUE(issue_id, user_id)
```

---

# 39. Database Relationships

```text
User
 │
 ├── creates ───────> Issue
 │
 ├── writes ────────> Comment
 │
 └── upvotes ───────> Issue
                         │
                         └── has many Comments
```

An issue:

```text
has one creator
has zero or one assigned staff member
has many comments
has many upvotes
```

---

# 40. Issue Response Standard

All issue-related endpoints should use a consistent issue object.

```json
{
  "id": 25,
  "title": "Wi-Fi not working in CS Lab 3",
  "description": "The Wi-Fi connection keeps disconnecting.",
  "category": "Wi-Fi",
  "location": "CS Block — Lab 3",
  "image_url": "http://localhost:8000/uploads/issues/25.jpg",
  "status": "pending",
  "upvotes": 47,
  "created_by": {
    "id": 1,
    "name": "Ali Khan"
  },
  "assigned_to": {
    "id": 7,
    "name": "Usman"
  },
  "created_at": "2026-09-25T10:30:00Z",
  "updated_at": "2026-09-25T12:30:00Z",
  "comment_count": 4,
  "has_upvoted": true
}
```

When there is no assigned staff:

```json
"assigned_to": null
```

When there is no image:

```json
"image_url": null
```

---

# 41. Error Response Format

All API errors should use the same format:

```json
{
  "detail": "Error message"
}
```

Do not create different formats such as:

```json
{
  "error": "..."
}
```

or:

```json
{
  "message": "..."
}
```

Use FastAPI's standard `detail` format consistently.

---

# 42. HTTP Status Codes

Use the following status codes:

| Status | Meaning |
|---|---|
| `200` | Successful request |
| `201` | Resource successfully created |
| `400` | Bad request |
| `401` | Missing/invalid authentication |
| `403` | Authenticated but not authorized |
| `404` | Resource not found |
| `409` | Conflict |
| `413` | Uploaded file too large |
| `422` | Validation error |
| `500` | Unexpected server error |

---

# 43. Authorization Matrix

| Action | Student | Staff |
|---|---:|---:|
| Register | Yes | No |
| Login | Yes | Yes |
| View issues | Yes | Yes |
| View issue details | Yes | Yes |
| Create issue | Yes | No |
| Change issue status | No | Yes |
| Assign issue | No | Yes |
| Comment | Yes | Yes |
| Upvote | Yes | Optional |
| Remove upvote | Yes | Optional |
| View staff list | No | Yes |
| Student dashboard | Yes | No |
| Staff dashboard | No | Yes |

---

# 44. Security Requirements

The backend must never trust sensitive data received from the React frontend.

For example, do not allow the frontend to create an issue with:

```json
{
  "created_by": 7
}
```

Instead:

```text
created_by = current_authenticated_user.id
```

must be determined by the backend.

Similarly, the frontend must never be trusted for:

```text
role
permissions
assigned_to authorization
status change authorization
```

The backend must verify all permissions using the authenticated user's identity and role.

---

# 45. Password Security

Never store plaintext passwords.

Bad:

```text
password = "Ali123456"
```

Good:

```text
password_hash = "<hashed password>"
```

Use a secure password hashing algorithm such as:

```text
Argon2id
```

or:

```text
bcrypt
```

---

# 46. JWT Requirements

JWT should contain at least:

```json
{
  "sub": "1",
  "role": "student",
  "exp": 1790000000
}
```

The backend must validate:

- JWT signature
- JWT expiration
- User existence
- User role

---

# 47. CORS

During development, allow the React frontend:

```text
http://localhost:5173
```

FastAPI CORS configuration should allow this origin.

Do not use:

```python
allow_origins=["*"]
```

in production.

---

# 48. Date and Time Format

All API timestamps should use ISO 8601.

Correct:

```text
2026-09-25T12:30:00Z
```

Do not return formatted display strings such as:

```text
25/09/2026
```

or:

```text
September 25, 2026
```

The React frontend will format dates for display.

---

# 49. Image URLs

The backend should return a usable URL:

```json
{
  "image_url": "http://localhost:8000/uploads/issues/25.jpg"
}
```

Do not return only a filesystem path such as:

```text
/uploads/issues/25.jpg
```

unless the frontend is explicitly configured to resolve it.

---

# 50. Duplicate Issue Handling

The backend does not need to automatically detect duplicate issues.

The intended flow is:

```text
Student searches for issue
        ↓
Existing issue found
        ↓
Student opens issue
        ↓
Student clicks Upvote
        ↓
POST /api/issues/{id}/upvote
```

The search functionality is therefore important.

---

# 51. Frontend API Mapping

The React frontend can use the following API methods:

```javascript
export const api = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }),

  register: (data) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () =>
    request("/auth/me"),

  getIssues: (params = "") =>
    request(`/issues${params}`),

  getMyIssues: () =>
    request("/issues/my"),

  getIssue: (id) =>
    request(`/issues/${id}`),

  createIssue: (formData) =>
    request("/issues", {
      method: "POST",
      body: formData,
      isFormData: true,
    }),

  updateIssue: (id, data) =>
    request(`/issues/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getComments: (id) =>
    request(`/issues/${id}/comments`),

  addComment: (id, text) =>
    request(`/issues/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({
        text,
      }),
    }),

  upvoteIssue: (id) =>
    request(`/issues/${id}/upvote`, {
      method: "POST",
    }),

  removeUpvote: (id) =>
    request(`/issues/${id}/upvote`, {
      method: "DELETE",
    }),

  getStaff: () =>
    request("/users/staff"),

  getStudentDashboard: () =>
    request("/student/dashboard"),

  getStaffDashboard: () =>
    request("/staff/dashboard"),
};
```

---

# 52. Important FormData Requirement

When the frontend sends an issue with an image, it will use:

```javascript
const formData = new FormData();

formData.append("title", title);
formData.append("description", description);
formData.append("category", category);
formData.append("location", location);

if (image) {
  formData.append("image", image);
}
```

The frontend must NOT manually set:

```http
Content-Type: application/json
```

for this request.

The browser must automatically set:

```http
Content-Type: multipart/form-data; boundary=...
```

---

# 53. Recommended API Architecture

Final API structure:

```text
/api
│
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   └── GET    /me
│
├── /issues
│   ├── GET    /
│   ├── GET    /my
│   ├── POST   /
│   ├── GET    /{id}
│   ├── PATCH  /{id}
│   │
│   ├── GET    /{id}/comments
│   ├── POST   /{id}/comments
│   │
│   ├── POST   /{id}/upvote
│   └── DELETE /{id}/upvote
│
├── /users
│   └── GET    /staff
│
├── /student
│   └── GET    /dashboard
│
└── /staff
    └── GET    /dashboard
```

---

# 54. Development Environment

Recommended `.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/campusfix

JWT_SECRET_KEY=change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

UPLOAD_DIR=uploads/issues
MAX_UPLOAD_SIZE_MB=10

FRONTEND_URL=http://localhost:5173
```

Do not commit `.env` to Git.

---

# 55. CORS Development Configuration

Allow:

```text
http://localhost:5173
```

Example:

```python
allow_origins=[
    "http://localhost:5173"
]
```

---

# 56. Required Backend Validation

The backend must validate:

### User

```text
name is required
email must be valid
email must be unique
password must satisfy minimum requirements
```

### Issue

```text
title is required
description is required
category must be valid
location is required
image is optional
image type must be valid
image size must be <= 10MB
```

### Comment

```text
text is required
text must not be empty
maximum 2000 characters
```

### Issue update

```text
status must be:
pending
in_progress
resolved

assigned_to must refer to an existing staff user
```

---

# 57. Important Business Rules

The following rules must be enforced on the backend.

## Rule 1

Only authenticated users can access protected endpoints.

## Rule 2

Only students can create issues.

## Rule 3

Only staff can change issue status.

## Rule 4

Only staff can assign issues.

## Rule 5

Both students and staff can comment.

## Rule 6

Students can upvote issues.

## Rule 7

A student can only upvote an issue once.

## Rule 8

The backend determines `created_by` from the JWT.

## Rule 9

The frontend cannot modify user roles.

## Rule 10

Passwords must never be stored in plaintext.

## Rule 11

Issue status must only use:

```text
pending
in_progress
resolved
```

## Rule 12

Uploaded images must be validated for type and size.

---

# 58. Final Endpoint Checklist

Before considering the backend complete, verify that all of these work:

```text
[ ] POST   /api/auth/register
[ ] POST   /api/auth/login
[ ] GET    /api/auth/me

[ ] GET    /api/issues
[ ] GET    /api/issues/my
[ ] POST   /api/issues
[ ] GET    /api/issues/{id}
[ ] PATCH  /api/issues/{id}

[ ] GET    /api/issues/{id}/comments
[ ] POST   /api/issues/{id}/comments

[ ] POST   /api/issues/{id}/upvote
[ ] DELETE /api/issues/{id}/upvote

[ ] GET    /api/users/staff

[ ] GET    /api/student/dashboard
[ ] GET    /api/staff/dashboard
```

---

# 59. Final Integration Flow

The complete application should work like this:

```text
                    ┌─────────────────┐
                    │  React Frontend │
                    │ localhost:5173  │
                    └────────┬────────┘
                             │
                             │ HTTP / JSON / FormData
                             ▼
                    ┌─────────────────┐
                    │ FastAPI Backend │
                    │ localhost:8000  │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
              ┌───────────┐     ┌────────────┐
              │    JWT    │     │ PostgreSQL │
              │   Auth    │     │  Database  │
              └───────────┘     └────────────┘
                                      │
                                      ▼
                                ┌────────────┐
                                │   Issues   │
                                │  Comments  │
                                │  Upvotes   │
                                │   Users    │
                                └────────────┘
```

---

# 60. Frontend Authentication Flow

```text
User enters email/password
          │
          ▼
POST /api/auth/login
          │
          ▼
FastAPI verifies credentials
          │
          ▼
Returns JWT + user
          │
          ▼
React stores authentication state
          │
          ▼
React sends JWT with API requests
          │
          ▼
FastAPI validates JWT
          │
          ▼
Request is authorized
```

---

# 61. Issue Reporting Flow

```text
Student opens "Report Issue"
          │
          ▼
Fills title
description
category
location
image
          │
          ▼
POST /api/issues
          │
          ▼
FastAPI validates request
          │
          ▼
Image saved
          │
          ▼
Issue saved in PostgreSQL
          │
          ▼
Returns issue object
          │
          ▼
React displays new issue
```

---

# 62. Upvote Flow

```text
Student searches for existing problem
          │
          ▼
Finds existing issue
          │
          ▼
Opens issue
          │
          ▼
Clicks Upvote
          │
          ▼
POST /api/issues/{id}/upvote
          │
          ▼
FastAPI checks existing upvote
          │
          ├── Already exists → do not duplicate
          │
          └── Does not exist → create upvote
          │
          ▼
Returns updated count
          │
          ▼
React updates UI
```

---

# 63. Staff Issue Management Flow

```text
Staff logs in
     │
     ▼
GET /api/staff/dashboard
     │
     ▼
Staff sees statistics
     │
     ▼
GET /api/issues
     │
     ▼
Staff filters issues
     │
     ├── Category
     ├── Location
     ├── Status
     └── Search
     │
     ▼
Staff opens issue
     │
     ▼
PATCH /api/issues/{id}
     │
     ├── Change status
     │
     └── Assign staff
     │
     ▼
POST /api/issues/{id}/comments
     │
     ▼
Student sees updated issue
```

---

# 64. Important Frontend Note

The current frontend prototype may contain logic such as:

```javascript
const isStaff = email.toLowerCase().includes("staff");
```

This must be removed when integrating with the real backend.

The frontend must use the role returned by:

```text
POST /api/auth/login
```

or:

```text
GET /api/auth/me
```

Example:

```json
{
  "id": 1,
  "name": "Ali Khan",
  "email": "ali@university.edu",
  "role": "student"
}
```

The backend is the source of truth for authorization.

The React frontend should only use the role to determine which UI to display.

---

# 65. Definition of Done

The backend is considered ready for frontend integration when:

- [ ] PostgreSQL database is configured
- [ ] Database migrations are configured
- [ ] User registration works
- [ ] Login returns JWT
- [ ] JWT authentication works
- [ ] `/auth/me` works
- [ ] Student and staff roles work
- [ ] Students can create issues
- [ ] Image upload works
- [ ] Students can view their issues
- [ ] Students can view community issues
- [ ] Issue filtering works
- [ ] Issue search works
- [ ] Issue pagination works
- [ ] Staff can update issue status
- [ ] Staff can assign issues
- [ ] Students can comment
- [ ] Staff can comment
- [ ] Students can upvote
- [ ] Students cannot duplicate upvotes
- [ ] Upvote removal works
- [ ] Staff list endpoint works
- [ ] Student dashboard endpoint works
- [ ] Staff dashboard endpoint works
- [ ] Authorization rules are enforced server-side
- [ ] CORS is configured
- [ ] Error responses are consistent
- [ ] API documentation is available through FastAPI Swagger
- [ ] `.env` secrets are not committed
- [ ] Uploaded images are validated
- [ ] API timestamps use ISO 8601

---

# 66. Swagger Documentation

FastAPI should expose its automatic API documentation.

Development URLs:

```text
http://localhost:8000/docs
```

and:

```text
http://localhost:8000/redoc
```

The backend developer should make sure every endpoint has:

- Request schema
- Response schema
- Authentication requirements
- Possible status codes
- Description
- Example request/response where useful

This Swagger documentation will be used during frontend integration and testing.
