// NutriCheck Working Configuration
// Simple, functional configuration that works

// USDA API Key - direct for testing
// Please replace with your actual API key from: https://fdc.nal.usda.gov/api-key-signup
const key = 'nYLm8TmWUTuVDoFUgm94P4FkKnPfgrdEexKnfURV';

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
} else if (CONFIG.USDA_API_KEY === 'nYLm8TmWUTuVDoFUgm94P4FkKnPfgrdEexKnfURV') {
    console.log('API key loaded successfully');
    console.log('Key length:', CONFIG.USDA_API_KEY.length);
    console.log('Ready to connect to USDA API');
} else {
    console.log('Using custom API key');
    console.log('Key length:', CONFIG.USDA_API_KEY.length);
}

// Make available globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
