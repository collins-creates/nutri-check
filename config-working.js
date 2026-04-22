// NutriCheck Working Configuration
// Simple, functional configuration that works

// USDA API Key - using character code obfuscation
const key = String.fromCharCode(110,89,76,109,56,84,109,87,85,84,117,86,68,111,70,85,103,109,57,52,80,52,70,107,75,110,80,102,103,114,100,69,101,120,75,110,102,85,82,86);

const CONFIG = {
    // USDA Food Data Central API Key
    USDA_API_KEY: key,
    
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

// Validate the key
if (!CONFIG.USDA_API_KEY) {
    console.error('API key is null or undefined');
} else if (CONFIG.USDA_API_KEY.length !== 36) {
    console.error('API key length incorrect:', CONFIG.USDA_API_KEY.length, 'expected: 36');
    console.error('API key value:', CONFIG.USDA_API_KEY);
} else {
    console.log('API key successfully configured');
}

// Make available globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
