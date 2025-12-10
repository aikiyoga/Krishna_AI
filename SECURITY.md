# Security Implementation

This document outlines the security measures implemented in the Krishna AI application.

## Critical Security Fixes Applied

### 1. API Key Protection
- **REMOVED** API key exposure from `next.config.ts`
- API keys are now only used server-side in API routes
- **ACTION REQUIRED**: You must manually revoke and rotate your OpenAI API key:
  1. Go to https://platform.openai.com/api-keys
  2. Revoke the old key: `sk-proj-aOt-IxLwiD-wFKQUS57x...`
  3. Generate a new key
  4. Update your `.env.local` file with the new key
  5. NEVER commit `.env.local` to version control

### 2. Rate Limiting
All API endpoints now have rate limiting to prevent abuse and cost overruns:

- **Chat API** (`/api/chat`): 10 requests per minute per IP
- **Chapter Summary** (`/api/chapter-summary`): 20 requests per minute per IP
- **Daily Verse** (`/api/daily-verse`): 30 requests per minute per IP

Rate limits are enforced using IP-based identification. When limits are exceeded, clients receive a 429 status code with `Retry-After` headers.

**Note**: The current implementation uses in-memory storage. For production at scale, consider using a distributed solution like Upstash Redis.

### 3. Input Validation
The chat endpoint now validates all incoming requests:

- Messages must be an array (max 50 messages)
- Each message must have valid `role` ('user' or 'assistant') and `content`
- Message content limited to 4000 characters
- Language must be 'en' or 'jp'

### 4. Security Headers
The following security headers are now set globally:

- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts access to camera, microphone, geolocation

### 5. Image Security
Restricted `next/image` to only allow images from:
- `images.unsplash.com`
- `via.placeholder.com`

Add additional trusted domains as needed.

### 6. Markdown Sanitization
ReactMarkdown now:
- Disallows dangerous elements: `script`, `iframe`, `object`, `embed`, `form`
- Adds `rel="noopener noreferrer"` to all links
- Opens external links in new tabs safely

## Remaining Security Recommendations

### High Priority

1. **Add Authentication**
   - Implement user authentication using NextAuth.js or similar
   - Protect API routes with authentication middleware
   - Track usage per authenticated user

2. **Add Content Security Policy (CSP)**
   - Add stricter CSP headers to prevent XSS attacks
   - Consider using `next-secure-headers` package

3. **Implement CORS Policy**
   - Define allowed origins for API requests
   - Use Next.js middleware to enforce CORS

### Medium Priority

4. **Add Request Logging**
   - Log all API requests for security monitoring
   - Track failed authentication attempts
   - Monitor for unusual patterns

5. **Add Error Boundaries**
   - Implement React error boundaries
   - Ensure errors don't leak sensitive information

6. **Validate Chapter/Verse Parameters**
   - Add comprehensive validation for all query parameters
   - Sanitize inputs to prevent injection attacks

### Low Priority

7. **Add Security Testing**
   - Implement automated security testing
   - Run periodic dependency audits
   - Consider adding OWASP ZAP or similar tools

8. **Add Monitoring**
   - Set up alerting for rate limit violations
   - Monitor OpenAI API usage and costs
   - Track error rates

## Environment Variables

Required environment variables:
```
OPENAI_API_KEY=your-api-key-here
```

**IMPORTANT**: Never commit `.env.local` or any file containing secrets to version control.

## Security Contacts

If you discover a security vulnerability, please email: [your-email-here]

## Regular Maintenance

- Run `npm audit` regularly to check for dependency vulnerabilities
- Keep Next.js, React, and all dependencies up to date
- Review security headers and CSP policies quarterly
- Rotate API keys annually or when exposed
