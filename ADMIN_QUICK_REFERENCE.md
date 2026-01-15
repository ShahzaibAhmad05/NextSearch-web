# Admin Access - Quick Reference

## For Frontend Developers

### How Authentication Works
1. User opens Settings menu → clicks "Admin Access"
2. Enters password → clicks "Authenticate"
3. Password sent to backend `/api/admin/login`
4. Backend returns JWT token (valid for 1 hour)
5. Token stored in localStorage automatically
6. All protected API calls now include token

### Using Admin Authentication in Code

```typescript
// Check if user is authenticated
import { useAdminAccess } from '@/hooks';

const isAdmin = useAdminAccess();
// Returns: true if authenticated, false otherwise

// Get the current token (for manual API calls)
import { getAdminToken } from '@/lib/services/admin';

const token = getAdminToken();
// Returns: JWT token string or null
```

### Protected API Calls (Already Implemented)

```typescript
import { getAIOverview, getResultSummary, addCordSlice, getStats } from '@/lib/api';

// These automatically include Authorization header when user is authenticated:
const overview = await getAIOverview(query);
const summary = await getResultSummary(cordUid);
const result = await addCordSlice(zipFile);
const stats = await getStats();
```

### Manual Login/Logout

```typescript
import { login, logout } from '@/lib/services/admin';

// Login
try {
  const response = await login('admin-password');
  console.log('Token expires in:', response.expires_in, 'seconds');
} catch (error) {
  console.error('Login failed:', error.message);
}

// Logout
await logout();
```

## For Backend Developers

### Required Environment Variables

```bash
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=3600  # 1 hour in seconds
```

### Implement These 3 Endpoints

#### 1. Login
```
POST /api/admin/login
Body: {"password": "string"}
Response: {"token": "jwt...", "expires_in": 3600}
```

#### 2. Logout (Optional)
```
POST /api/admin/logout
Headers: Authorization: Bearer <token>
Response: {"message": "Logged out"}
```

#### 3. Verify
```
GET /api/admin/verify
Headers: Authorization: Bearer <token>
Response: {"valid": true, "expires_at": 1736950800000}
```

### Protect These Endpoints

Add JWT validation middleware to:
- `POST /api/add_document` - Document indexing
- `GET /api/ai_overview` - AI overview generation
- `GET /api/ai_summary` - AI result summaries
- `GET /api/stats` - System statistics

### Validation Middleware Example (Pseudocode)

```python
def validate_jwt(request):
    # Get token from Authorization header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return 401, {"error": "Unauthorized"}
    
    token = auth_header[7:]  # Remove 'Bearer '
    
    # Verify token
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        if payload['exp'] < time.time():
            return 401, {"error": "Token expired"}
        return None  # Token valid
    except:
        return 401, {"error": "Invalid token"}
```

## User Experience

### Before Authentication
- Tools dropdown shows "Index" and "Stats" but they're grayed out
- Clicking them shows tooltip: "Admin access required"
- AI features work for everyone (no auth required)

### After Authentication
- Tools dropdown shows "Index" and "Stats" in full color
- Both tools are clickable and functional
- Admin status shows in Settings > Admin Access
- Green badge: "Authenticated - Admin access is active"

### Token Expiration (1 hour)
- Tools automatically become disabled again
- User can re-authenticate with same password
- No data loss or interruption

## Quick Testing

### Test Login Flow
```bash
# 1. Login
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin"}'

# Save the token from response

# 2. Access protected endpoint
curl http://localhost:8080/api/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 3. Verify token
curl http://localhost:8080/api/admin/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Frontend Testing
1. Start the Next.js dev server: `npm run dev`
2. Open http://localhost:3000
3. Click Settings icon (gear) → "Admin Access"
4. Enter password → "Authenticate"
5. Verify "Index" and "Stats" buttons are enabled
6. Try uploading a document or viewing stats

## Troubleshooting

### "Invalid admin password" error
- Check backend logs for the actual error
- Verify ADMIN_PASSWORD environment variable is set
- Ensure password is being sent correctly in request body

### "Unauthorized" on protected endpoints
- Check if token is being sent in Authorization header
- Verify token hasn't expired (check browser localStorage)
- Check backend JWT validation logic

### Tools still disabled after login
- Open browser DevTools → Application → Local Storage
- Verify `nextsearch-admin-token` exists
- Verify `nextsearch-admin-token-expiry` is in the future
- Refresh the page

### Token not being sent with requests
- Check Network tab in DevTools
- Look for "Authorization: Bearer ..." header
- Verify frontend is calling the correct API functions

## Documentation

- **Complete Backend Guide:** `BACKEND_ADMIN_API.md`
- **Implementation Summary:** `ADMIN_IMPLEMENTATION_SUMMARY.md`
- **This Quick Reference:** `ADMIN_QUICK_REFERENCE.md`

## Support

For questions or issues:
1. Check the documentation files listed above
2. Review the implementation in:
   - `lib/services/admin.ts` - Admin service
   - `components/SettingsMenu.tsx` - UI implementation
   - `hooks/useAdminAccess.ts` - Authentication state
