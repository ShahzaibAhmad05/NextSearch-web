# Backend Admin API Implementation Guide

This document describes the admin authentication and authorization system that needs to be implemented in the backend API for the NextSearch application.

## Overview

The admin system provides secure access to protected endpoints using JWT (JSON Web Token) authentication with 1-hour token expiry. When a user successfully authenticates with the admin password, they receive a JWT token that must be included in subsequent requests to admin-protected endpoints.

## Authentication Flow

1. User enters admin password in frontend
2. Frontend sends password to `/api/admin/login`
3. Backend validates password and returns JWT token
4. Frontend stores JWT token in localStorage
5. Frontend includes JWT token in `Authorization` header for protected requests
6. Backend validates token on each protected request
7. Token expires after 1 hour

## Required API Endpoints

### 1. Admin Login

**Endpoint:** `POST /api/admin/login`

**Description:** Authenticate with admin password and receive JWT token

**Request Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
  "password": "string"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

**Error Responses:**

- **401 Unauthorized** - Invalid password
  ```json
  {
    "error": "Invalid admin password"
  }
  ```

- **400 Bad Request** - Missing or invalid request body
  ```json
  {
    "error": "Password is required"
  }
  ```

**Implementation Notes:**
- Validate the password against the configured admin password (should be stored securely, e.g., as an environment variable)
- Generate a JWT token with 1-hour expiration
- Token should include any necessary claims (e.g., `role: "admin"`, `exp` timestamp)
- Use a secure signing key (should be stored as an environment variable)

---

### 2. Admin Logout

**Endpoint:** `POST /api/admin/logout`

**Description:** Invalidate the current JWT token (optional token blacklisting)

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Accept: application/json
```

**Success Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**

- **401 Unauthorized** - Missing or invalid token
  ```json
  {
    "error": "Unauthorized"
  }
  ```

**Implementation Notes:**
- This endpoint is primarily for token blacklisting (optional)
- If implementing token blacklisting, add the token to a blacklist/denylist with TTL matching the token expiry
- If not implementing blacklisting, can simply return success (frontend already clears token)

---

### 3. Verify Token

**Endpoint:** `GET /api/admin/verify`

**Description:** Verify if the current JWT token is still valid

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Accept: application/json
```

**Success Response (200 OK):**
```json
{
  "valid": true,
  "expires_at": 1736950800000
}
```

**Error Responses:**

- **401 Unauthorized** - Invalid or expired token
  ```json
  {
    "valid": false
  }
  ```

**Implementation Notes:**
- Validate the JWT token signature and expiration
- Return the expiration timestamp in milliseconds since epoch
- Check token blacklist if implementing token revocation

---

## Protected Endpoints

The following endpoints should require a valid JWT token in the `Authorization: Bearer <token>` header:

### 1. Add Document (Index)

**Endpoint:** `POST /api/add_document`

**Authorization:** Required (admin token)

**Implementation Notes:**
- Validate JWT token before processing the request
- Return 401 Unauthorized if token is missing, invalid, or expired
- Return 403 Forbidden if token is valid but user doesn't have admin role

---

### 2. AI Overview

**Endpoint:** `GET /api/ai_overview`

**Authorization:** Required (admin token)

**Implementation Notes:**
- Validate JWT token before processing the request
- Return 401 Unauthorized if token is missing, invalid, or expired

---

### 3. AI Summary

**Endpoint:** `GET /api/ai_summary`

**Authorization:** Required (admin token)

**Implementation Notes:**
- Validate JWT token before processing the request
- Return 401 Unauthorized if token is missing, invalid, or expired

---

### 4. Statistics

**Endpoint:** `GET /api/stats`

**Authorization:** Required (admin token)

**Expected Response:**
```json
{
  "total_documents": 150000,
  "total_segments": 5,
  "index_size_bytes": 5368709120,
  "last_indexed": "2026-01-15T10:30:00Z",
  "search_stats": {
    "total_searches": 25000,
    "avg_latency_ms": 45.2,
    "cache_hit_rate": 0.75
  }
}
```

**Implementation Notes:**
- Validate JWT token before processing the request
- Return statistics about the search index, documents, and system performance
- All fields are optional - return what's available in your system

---

## JWT Token Specification

### Token Claims

The JWT token should include the following claims:

```json
{
  "role": "admin",
  "iat": 1736946000,
  "exp": 1736949600
}
```

- `role`: User role (always "admin" for this use case)
- `iat`: Issued at timestamp (seconds since epoch)
- `exp`: Expiration timestamp (seconds since epoch, should be iat + 3600)

### Token Format

- **Algorithm:** HS256 (HMAC with SHA-256) or RS256 (RSA with SHA-256)
- **Expiration:** 3600 seconds (1 hour)
- **Header:** `Authorization: Bearer <token>`

---

## Security Recommendations

1. **Password Storage:**
   - Store admin password as an environment variable
   - Use a strong, randomly generated password
   - Consider using bcrypt or similar for password hashing if storing in database

2. **JWT Signing Key:**
   - Use a strong, randomly generated signing key
   - Store as an environment variable
   - Never commit signing key to version control
   - Rotate keys periodically

3. **Token Security:**
   - Use HTTPS in production to protect tokens in transit
   - Set appropriate CORS headers
   - Consider implementing token refresh mechanism for longer sessions
   - Implement rate limiting on login endpoint to prevent brute force attacks

4. **Error Messages:**
   - Don't leak sensitive information in error messages
   - Use generic messages like "Invalid credentials" instead of "Invalid password"

5. **Token Blacklist (Optional):**
   - For logout functionality, consider maintaining a token blacklist
   - Use Redis or similar with TTL matching token expiry
   - Check blacklist on each protected endpoint

---

## Environment Variables

Recommended environment variables for the backend:

```bash
# Admin password (change this!)
ADMIN_PASSWORD=your-secure-admin-password-here

# JWT signing key (generate a strong random key)
JWT_SECRET=your-jwt-signing-secret-here

# JWT expiration in seconds (default 3600 = 1 hour)
JWT_EXPIRATION=3600
```

---

## Testing

### Login Flow
```bash
# 1. Login
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "your-admin-password"}'

# Response: {"token": "eyJ...", "expires_in": 3600}

# 2. Use token in protected request
curl http://localhost:8080/api/stats \
  -H "Authorization: Bearer eyJ..."

# 3. Verify token
curl http://localhost:8080/api/admin/verify \
  -H "Authorization: Bearer eyJ..."

# 4. Logout
curl -X POST http://localhost:8080/api/admin/logout \
  -H "Authorization: Bearer eyJ..."
```

---

## Error Handling

All endpoints should return appropriate HTTP status codes:

- **200 OK** - Successful request
- **400 Bad Request** - Invalid request body or parameters
- **401 Unauthorized** - Missing, invalid, or expired token
- **403 Forbidden** - Valid token but insufficient permissions
- **500 Internal Server Error** - Server-side error

Error responses should follow this format:
```json
{
  "error": "Error message here"
}
```

---

## Frontend Integration

The frontend already implements:

- Token storage in localStorage with keys:
  - `nextsearch-admin-token`: The JWT token
  - `nextsearch-admin-token-expiry`: Expiration timestamp in milliseconds

- Automatic token inclusion in requests:
  - `Authorization: Bearer <token>` header added to all protected endpoints
  - AI Overview (`/api/ai_overview`)
  - AI Summary (`/api/ai_summary`)
  - Add Document (`/api/add_document`)
  - Statistics (`/api/stats`)

- Token expiry management:
  - Checks expiry before each request
  - Clears expired tokens automatically
  - Shows appropriate UI state based on authentication status

---

## Implementation Checklist

- [ ] Set up environment variables for admin password and JWT secret
- [ ] Implement POST `/api/admin/login` endpoint
- [ ] Implement POST `/api/admin/logout` endpoint
- [ ] Implement GET `/api/admin/verify` endpoint
- [ ] Create JWT token generation utility
- [ ] Create JWT token validation middleware
- [ ] Apply authentication middleware to protected endpoints:
  - [ ] `/api/add_document`
  - [ ] `/api/ai_overview`
  - [ ] `/api/ai_summary`
  - [ ] `/api/stats`
- [ ] Implement proper error handling with appropriate status codes
- [ ] Add rate limiting to login endpoint
- [ ] Test all endpoints with valid and invalid tokens
- [ ] Test token expiration behavior
- [ ] Configure CORS if frontend and backend are on different domains

---

## Questions or Issues?

If you have questions about the implementation or need clarification on any endpoint, please refer to the frontend code in:
- `lib/services/admin.ts` - Admin service implementation
- `lib/services/ai.ts` - AI services with auth
- `lib/services/document.ts` - Document service with auth
- `lib/services/stats.ts` - Stats service with auth
- `components/SettingsMenu.tsx` - Admin login UI
- `hooks/useAdminAccess.ts` - Admin authentication state management
