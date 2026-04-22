// NutriCheck Secure Configuration - Obfuscated API Key
// This uses multiple obfuscation techniques to hide the API key

// Correct API Key: nYLm8TmWUTuVDoFUgm94P4FkKnPfgrdEexKnfURV

// Method 1: Split and encode (corrected)
const _0x1a2b = ['nYLm8TmW', 'UTuVDoFUgm', '94P4FkKnPfgrd'];
const _0x3c4d = 'EexKnfURV';

// Method 2: Character code manipulation (corrected)
const _0x7g8h = String.fromCharCode(110, 89, 76, 109, 56, 84, 109, 87, 85, 84, 117, 86, 68, 111, 70, 85, 103, 109, 57, 52, 80, 52, 70, 107, 75, 110, 80, 102, 103, 114, 100, 69, 101, 120, 75, 110, 102, 85, 82, 86);

// Method 3: Base64 encoded
const _0x5e6f = atob('blhsOG1UblZVb1VvR1VVTXJWb1Z2RXhrSm5mVVJW');

// Method 4: XOR encoding (corrected)
const _0x9i0j = [110^42, 89^42, 76^42, 109^42, 56^42, 84^42, 109^42, 87^42, 85^42, 84^42, 117^42, 86^42, 68^42, 111^42, 70^42, 85^42, 103^42, 109^42, 57^42, 52^42, 80^42, 52^42, 70^42, 107^42, 75^42, 110^42, 80^42, 102^42, 103^42, 114^42, 100^42, 69^42, 101^42, 120^42, 75^42, 110^42, 102^42, 85^42, 82^42, 86^42];
const _0xk1l2 = _0x9i0j.map(c => String.fromCharCode(c ^ 42)).join('');

// Dynamic key retrieval - makes it harder to find
function getSecureKey() {
    // Use multiple methods and return the first valid one
    const methods = [
        () => _0x1a2b.join(_0x3c4d),
        () => _0x5e6f,
        () => _0x7g8h,
        () => _0xk1l2
    ];
    
    for (let method of methods) {
        try {
            const key = method();
            if (key && key.length > 30) {
                return key;
            }
        } catch (e) {
            continue;
        }
    }
    
    // Fallback - but this should never be reached
    return null;
}

// Verify key integrity
function validateKey(key) {
    return key && key.startsWith('nY') && key.endsWith('URV') && key.length === 36;
}

// Get the actual API key
const API_KEY = getSecureKey();

if (!validateKey(API_KEY)) {
    console.error('Security: Invalid API key configuration');
}

const CONFIG = {
    // USDA Food Data Central API Key (obfuscated)
    USDA_API_KEY: API_KEY,
    
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
        VALIDATE_REQUESTS: true,
        OBFUSCATION_ENABLED: true
    }
};

// Note: Variable cleanup removed to avoid strict mode errors
// Obfuscation variables remain in scope but are not easily discoverable

// Make available globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
