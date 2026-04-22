// Example configuration file - DO NOT commit actual API keys
// Copy this file to config.js and add your actual API key

const CONFIG = {
    // USDA Food Data Central API Key
    // Get your free API key from: https://fdc.nal.usda.gov/api-key-signup
    USDA_API_KEY: 'YOUR_API_KEY_HERE',
    
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

// Export for use in application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
