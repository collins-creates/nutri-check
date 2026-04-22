# NutriCheck Security Guide

## Protecting API Keys and Sensitive Data

This guide explains how to secure your NutriCheck application and protect API keys from unauthorized access.

## 1. API Key Security

### Why API Keys Need Protection
- **Rate Limiting**: Exceeding API limits can cause service disruption
- **Cost**: Some APIs charge per request
- **Privacy**: API keys can reveal usage patterns
- **Security**: Compromised keys can be used maliciously

### Secure Implementation Options

#### Option 1: Server-Side Proxy (Recommended for Production)
```bash
# Deploy the API proxy server
npm install express cors express-rate-limit helmet http-proxy-middleware
node api-proxy.js
```

**Benefits:**
- API key never exposed to client
- Rate limiting and security headers
- Request validation and monitoring
- CORS protection

#### Option 2: Environment Variables (Server-Side)
```bash
# Set environment variable
export USDA_API_KEY="your_api_key_here"
```

#### Option 3: Configuration File (Development Only)
```bash
# Copy example file
cp config.example.js config.js
# Edit config.js with your actual API key
```

## 2. File Protection

### .gitignore Configuration
The `.gitignore` file prevents sensitive files from being committed:

```
# Environment variables
.env
.env.local
config.js
secrets.json

# API keys
*.key
api-key.txt
credentials.txt
```

### Files to Never Commit
- API keys or secrets
- Configuration files with credentials
- Environment files
- Private certificates
- Database connection strings

## 3. GitHub Pages Security

### Limitations
- **No Server-Side Code**: Cannot run proxy servers
- **Public Repository**: All files are visible
- **No Environment Variables**: Cannot store secrets

### Recommended Solutions

#### Option A: Private Repository + GitHub Pages
1. Create private repository
2. Enable GitHub Pages
3. Use GitHub Actions for deployment
4. Store secrets in GitHub Secrets

#### Option B: External API Service
1. Deploy proxy server to Heroku/Vercel
2. Use external service for API calls
3. Keep API keys on server only

#### Option C: Client-Side Protection (Limited)
1. Use obfuscation techniques
2. Implement rate limiting client-side
3. Add request validation
4. Monitor usage patterns

## 4. Deployment Security

### Production Deployment Steps

#### For Server-Side Deployment:
```bash
# 1. Set environment variables
export USDA_API_KEY="your_production_key"
export NODE_ENV="production"

# 2. Install dependencies
npm install --production

# 3. Start secure server
node api-proxy.js
```

#### For GitHub Pages:
```bash
# 1. Remove API key from client code
# 2. Use external API service
# 3. Deploy static files only
git add .
git commit -m "Deploy secure version"
git push origin main
```

## 5. Monitoring and Protection

### Rate Limiting
```javascript
// Client-side rate limiting
const RATE_LIMIT = 60; // requests per minute
let requestCount = 0;
let lastReset = Date.now();

function checkRateLimit() {
    const now = Date.now();
    if (now - lastReset > 60000) {
        requestCount = 0;
        lastReset = now;
    }
    return requestCount < RATE_LIMIT;
}
```

### Request Validation
```javascript
// Validate requests before sending
function validateRequest(query) {
    // Check for malicious input
    const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+=/i
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(query));
}
```

### Error Handling
```javascript
// Secure error messages
function handleApiError(error) {
    // Don't expose API details
    if (error.status === 401) {
        return "Service temporarily unavailable";
    }
    return "An error occurred. Please try again.";
}
```

## 6. Best Practices

### Development
- Use placeholder API keys in code
- Never commit real credentials
- Use environment-specific configurations
- Test with limited API keys

### Production
- Use server-side proxy when possible
- Implement rate limiting
- Monitor API usage
- Rotate API keys regularly
- Use HTTPS everywhere

### Code Security
```javascript
// Obfuscate API key (limited protection)
const API_KEY = atob('blhsOG1UblZVb1VvR1VVTXJWb1Z2'); // Not real key

// Split and combine (limited protection)
const KEY_PARTS = ['nYLm8TmW', 'UTuVDoFUgm', '94P4FkKnPfgrd'];
const API_KEY = KEY_PARTS.join('EexKnfURV');
```

## 7. Security Checklist

### Before Deployment
- [ ] Remove all API keys from client code
- [ ] Add sensitive files to .gitignore
- [ ] Set up server-side proxy
- [ ] Configure rate limiting
- [ ] Add security headers
- [ ] Test with invalid API keys
- [ ] Monitor for unusual activity

### Regular Maintenance
- [ ] Rotate API keys every 90 days
- [ ] Monitor API usage and costs
- [ ] Update dependencies regularly
- [ ] Review access logs
- [ ] Test security measures

## 8. Emergency Procedures

### If API Key is Compromised
1. Immediately revoke the compromised key
2. Generate a new API key
3. Update all configurations
4. Monitor for unusual activity
5. Review access logs

### If Sensitive Data is Exposed
1. Remove sensitive files from repository
2. Force push to remove from history
3. Rotate all affected credentials
4. Notify users if necessary
5. Review security procedures

## 9. Tools and Services

### Security Tools
- **GitHub Secret Scanning**: Detects committed secrets
- **GitGuardian**: Scans for sensitive data
- **TruffleHog**: Finds credentials in repositories

### Monitoring Services
- **USDA API Dashboard**: Monitor usage
- **Google Analytics**: Track user behavior
- **Server Logs**: Monitor requests and errors

### API Management
- **API Gateway**: Rate limiting and authentication
- **CDN**: DDoS protection and caching
- **Web Application Firewall**: Request filtering

## 10. Legal and Compliance

### Data Protection
- Comply with GDPR/CCPA if applicable
- Implement data retention policies
- Provide privacy policy
- Handle user data securely

### API Terms of Service
- Review USDA API terms
- Ensure compliance with usage limits
- Attribute data sources properly
- Respect licensing requirements

This security guide helps protect your NutriCheck application and ensure safe deployment to production environments.
