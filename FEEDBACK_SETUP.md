# Feedback Feature Setup

The feedback feature allows users to send feedback directly from the website to your backend API.

## How It Works

1. User clicks the "Feedback" button in the footer
2. A modal opens with two feedback types:
   - **Anonymous**: No email required, feedback sent anonymously
   - **Replyable**: User provides their email, allowing you to reply directly
3. User writes their feedback and clicks "Send Feedback"
4. The feedback is sent to your backend API at `POST /api/feedback`
5. Your backend can then process, store, or email the feedback as needed

## Backend API Integration

The frontend sends a POST request to `${NEXT_PUBLIC_API_BASE}/api/feedback` with the following payload:

```json
{
  "message": "User's feedback message",
  "email": "user@example.com", // null for anonymous feedback
  "type": "replyable", // or "anonymous"
  "timestamp": "2026-01-14T12:34:56.789Z"
}
```

### Backend Implementation Example

Your backend should implement a `POST /api/feedback` endpoint that:

1. Accepts the feedback data
2. Validates the input
3. Stores it in a database or sends it via email
4. Returns a success response

Example response:
```json
{
  "message": "Feedback received successfully"
}
```

## Configuration

The feedback endpoint uses the same `NEXT_PUBLIC_API_BASE` environment variable as your other API calls. This is already configured in `.env.example`:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

No additional environment variables are needed for the feedback feature.

## Features

- ✅ Two feedback types (anonymous & replyable)
- ✅ Beautiful modal UI with smooth animations
- ✅ Form validation
- ✅ Loading states and error handling
- ✅ Success confirmation
- ✅ Integrates with your existing backend API

## Troubleshooting

### Feedback not being sent

1. Check that your backend API is running and accessible
2. Verify `NEXT_PUBLIC_API_BASE` is correctly set
3. Ensure your backend has a `POST /api/feedback` endpoint implemented
4. Check the browser console and server logs for error messages
5. Check CORS settings if your frontend and backend are on different domains
