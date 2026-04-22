// NutriCheck Public Configuration
// This file needs to be updated with your USDA API key
// Instructions: Replace 'YOUR_API_KEY_HERE' with your actual API key

const CONFIG = {
    // USDA Food Data Central API Key
    // Get your free API key from: https://fdc.nal.usda.gov/api-key-signup
    USDA_API_KEY: 'nYLm8TmWUTuVDoFUgm94P4FkKnPfgrdEexKnfURV',
    
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

// Make available globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
