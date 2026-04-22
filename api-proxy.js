// Secure API Proxy Service
// This file should be deployed on a server (not GitHub Pages)
// GitHub Pages doesn't support server-side code

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.nal.usda.gov"]
        }
    }
}));

// CORS configuration
app.use(cors({
    origin: ['https://nutricheck.github.io', 'https://localhost:8000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// API Configuration
const USDA_API_KEY = process.env.USDA_API_KEY || 'YOUR_API_KEY_HERE';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// Request validation middleware
app.use('/api/', (req, res, next) => {
    // Validate request origin
    const origin = req.headers.origin;
    const allowedOrigins = ['https://nutricheck.github.io', 'https://localhost:8000'];
    
    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: 'Origin not allowed' });
    }
    
    // Validate request size
    if (req.get('content-length') > 10000) {
        return res.status(413).json({ error: 'Request too large' });
    }
    
    next();
});

// USDA API Proxy
app.use('/api/fdc', createProxyMiddleware({
    target: USDA_BASE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/fdc': '',
    },
    onProxyReq: (proxyReq, req, res) => {
        // Add API key to all requests
        const url = new URL(proxyReq.path, USDA_BASE_URL);
        url.searchParams.set('api_key', USDA_API_KEY);
        proxyReq.path = url.pathname + url.search;
        
        // Remove any sensitive headers
        proxyReq.removeHeader('authorization');
        proxyReq.removeHeader('cookie');
        
        // Add security headers
        proxyReq.setHeader('User-Agent', 'NutriCheck-Proxy/1.0');
    },
    onProxyRes: (proxyRes, req, res) => {
        // Remove sensitive response headers
        proxyRes.headers['set-cookie'] && delete proxyRes.headers['set-cookie'];
        proxyRes.headers['server'] && delete proxyRes.headers['server'];
        proxyRes.headers['x-powered-by'] && delete proxyRes.headers['x-powered-by'];
        
        // Add security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Unable to process request'
        });
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`API Proxy Server running on port ${PORT}`);
    console.log('Health check: http://localhost:' + PORT + '/health');
});

module.exports = app;
