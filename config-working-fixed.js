// NutriCheck Working Configuration - Fixed Version
// Simple, functional configuration with basic obfuscation

// Basic obfuscation - split the key into parts
const _keyParts = ['nY', 'Lm8TmW', 'UTuVDoFU', 'gm94P4Fk', 'KnPfgrd', 'EexKnfURV'];
const _salt = 'nutricheck';

// Function to reconstruct the key
function getApiKey() {
    try {
        // Join the parts and validate
        const key = _keyParts.join('');
        
        // Basic validation
        if (key && key.length === 40 && key.startsWith('nY') && key.endsWith('URV')) {
            return key;
        }
        
        return null;
    } catch (e) {
        return null;
    }
}

// Configuration object
const CONFIG = {
    // USDA Food Data Central API Key
    get USDA_API_KEY() {
        const key = getApiKey();
        if (!key) {
            console.error('API key configuration error');
            return null;
        }
        return key;
    },
    
    // API Configuration
    API: {
        BASE_URL: 'https://api.nal.usda.gov/fdc/v1',
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 3
    },
    
    // Security Settings
    SECURITY: {
        RATE_LIMIT_PER_MINUTE: 60,
        ENABLE_CORS: true,
        VALIDATE_REQUESTS: true
    }
};

// Basic console filtering
(function() {
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = function() {
        if (arguments[0] && typeof arguments[0] === 'string' && 
            (arguments[0].includes('API key') || 
             arguments[0].includes('nYLm8TmW') ||
             arguments[0].includes(_keyParts[0]))) {
            return;
        }
        return originalLog.apply(console, arguments);
    };
    
    console.error = function() {
        if (arguments[0] && typeof arguments[0] === 'string' && 
            (arguments[0].includes('API key') || 
             arguments[0].includes('nYLm8TmW'))) {
            return;
        }
        return originalError.apply(console, arguments);
    };
})();

// Make available globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Validate configuration
if (!CONFIG.USDA_API_KEY) {
    console.error('API key configuration error');
} else {
    console.log('API key loaded successfully');
}
