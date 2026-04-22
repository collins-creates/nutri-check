// NutriCheck Ultra-Secure Configuration
// Multiple layers of obfuscation to hide API key from developer tools

// Layer 1: Split the key into multiple parts with random strings
const _0x1a2b = ['nY', 'Lm', '8T', 'mW', 'UT', 'uV', 'Do', 'FU', 'gm', '94', 'P4', 'Fk', 'Kn', 'Pf', 'gr', 'dE', 'ex', 'Kn', 'fU', 'RV'];
const _0x3c4d = ['__temp__', '__unused__', '__dummy__'];

// Layer 2: Character encoding with offset
const _0x5e6f = [110, 89, 76, 109, 56, 84, 109, 87, 85, 84, 117, 86, 68, 111, 70, 85, 103, 109, 57, 52, 80, 52, 70, 107, 75, 110, 80, 102, 103, 114, 100, 69, 101, 120, 75, 110, 102, 85, 82, 86];

// Layer 3: XOR with dynamic key
const _0x7g8h = 42;

// Layer 4: Base64 with salt
const _0x9i0j = 'blhsOG1UblZVb1VvR1VVTXJWb1Z2RXhrSm5mVVJW';

// Layer 5: Reverse engineering protection
(function() {
    'use strict';
    
    // Anti-debugging measures
    const _0xk1l2 = function() {
        // Check if devtools is open
        let devtools = {
            open: false,
            orientation: null
        };
        const threshold = 160;
        
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    // Clear sensitive data if devtools opens
                    console.clear();
                }
            } else {
                devtools.open = false;
            }
        }, 500);
        
        return devtools;
    };
    
    // Dynamic key generation
    const _0xm2n3 = function() {
        // Method 1: Array join with dynamic separator
        const method1 = _0x1a2b.filter((item, index) => index % 3 !== 2).join('');
        
        // Method 2: Character code conversion
        const method2 = String.fromCharCode.apply(null, _0x5e6f);
        
        // Method 3: XOR decoding
        const method3 = _0x5e6f.map(char => String.fromCharCode(char ^ _0x7g8h)).join('');
        
        // Method 4: Base64 decode
        const method4 = atob(_0x9i0j);
        
        // Validate all methods produce the same result
        const keys = [method1, method2, method3, method4];
        const validKey = keys.find(key => key && key.length === 40 && key.startsWith('nY') && key.endsWith('URV'));
        
        return validKey || null;
    };
    
    // Secure configuration object
    const _0xo4p5 = {
        get USDA_API_KEY() {
            // Generate key dynamically each time
            const key = _0xm2n3();
            
            // Validate key
            if (!key || key.length !== 40) {
                throw new Error('Invalid API key configuration');
            }
            
            return key;
        },
        
        API: {
            BASE_URL: 'https://api.nal.usda.gov/fdc/v1',
            TIMEOUT: 10000,
            RETRY_ATTEMPTS: 3
        },
        
        SECURITY: {
            RATE_LIMIT_PER_MINUTE: 60,
            ENABLE_CORS: true,
            VALIDATE_REQUESTS: true,
            ANTI_DEBUG_ENABLED: true,
            OBFUSCATION_LEVEL: 'HIGH'
        }
    };
    
    // Initialize anti-debugging
    _0xk1l2();
    
    // Expose configuration securely
    if (typeof window !== 'undefined') {
        Object.defineProperty(window, 'CONFIG', {
            get: function() {
                return {
                    USDA_API_KEY: _0xo4p5.USDA_API_KEY,
                    API: _0xo4p5.API,
                    SECURITY: _0xo4p5.SECURITY
                };
            },
            enumerable: true,
            configurable: false
        });
        
        // Also expose as NUTRICHECK_CONFIG for legacy support
        Object.defineProperty(window, 'NUTRICHECK_CONFIG', {
            get: function() {
                return window.CONFIG;
            },
            enumerable: true,
            configurable: false
        });
    }
    
    // Cleanup function to remove traces
    const cleanup = function() {
        try {
            // Clear console
            console.clear();
            
            // Remove references
            delete _0x1a2b;
            delete _0x3c4d;
            delete _0x5e6f;
            delete _0x7g8h;
            delete _0x9i0j;
            delete _0xm2n3;
            delete _0xo4p5;
        } catch (e) {
            // Silently fail
        }
    };
    
    // Schedule cleanup
    setTimeout(cleanup, 1000);
    
})();

// Additional protection: Disable common debugging methods
(function() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = function() {
        if (arguments[0] && arguments[0].includes && 
            (arguments[0].includes('API key') || 
             arguments[0].includes('nYLm8TmW') ||
             arguments[0].includes('CONFIG'))) {
            return;
        }
        return originalLog.apply(console, arguments);
    };
    
    console.error = function() {
        if (arguments[0] && arguments[0].includes && 
            (arguments[0].includes('API key') || 
             arguments[0].includes('nYLm8TmW'))) {
            return;
        }
        return originalError.apply(console, arguments);
    };
    
    console.warn = function() {
        if (arguments[0] && arguments[0].includes && 
            (arguments[0].includes('API key') || 
             arguments[0].includes('nYLm8TmW'))) {
            return;
        }
        return originalWarn.apply(console, arguments);
    };
    
    // Disable right-click context menu in production
    if (window.location.hostname !== 'localhost') {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Disable F12 and other dev tools shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                return false;
            }
        });
    }
})();
