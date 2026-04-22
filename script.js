class NutriCheck {
    constructor() {
        // Secure API key management
        this.apiKey = this.getApiKey();
        this.baseURL = this.getApiBaseUrl();
        this.comparisonFoods = [];
        this.init();
    }

    getApiKey() {
        // Try multiple methods to get the API key securely
        // 1. Environment variable (server-side)
        if (typeof process !== 'undefined' && process.env.USDA_API_KEY) {
            return process.env.USDA_API_KEY;
        }
        
        // 2. Configuration file (not committed to git)
        if (typeof window !== 'undefined' && window.CONFIG && window.CONFIG.USDA_API_KEY) {
            return window.CONFIG.USDA_API_KEY;
        }
        
        // 3. Local storage (for development only)
        if (typeof window !== 'undefined') {
            const storedKey = localStorage.getItem('nutricheck_api_key');
            if (storedKey && storedKey !== 'YOUR_API_KEY_HERE') {
                return storedKey;
            }
        }
        
        // 4. Fallback for development (should be removed in production)
        console.warn('API key not found. Please set up secure API key configuration.');
        return null;
    }

    getApiBaseUrl() {
        // Use proxy server if available, otherwise direct API
        if (typeof window !== 'undefined' && window.location) {
            const isGitHubPages = window.location.hostname === 'collins-creates.github.io';
            const isLocalhost = window.location.hostname === 'localhost';
            
            // Use direct API for GitHub Pages (no proxy available)
            if (isGitHubPages) {
                return 'https://api.nal.usda.gov/fdc/v1'; // Direct API
            } else if (isLocalhost) {
                return 'http://localhost:3001/api/fdc'; // Local proxy
            }
        }
        
        return 'https://api.nal.usda.gov/fdc/v1'; // Direct API (development only)
    }

    validateApiKey() {
        if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') {
            console.error('Valid USDA API key is required. Please configure your API key securely.');
            return false;
        }
        return true;
    }

    init() {
        this.initDarkMode();
        this.bindEvents();
    }

    initDarkMode() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('foodSearch');
        const addToCompareBtn = document.getElementById('addToCompare');
        const clearComparisonBtn = document.getElementById('clearComparison');
        const darkModeToggle = document.getElementById('darkModeToggle');

        searchBtn.addEventListener('click', () => this.searchFood());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchFood();
            }
        });

        if (addToCompareBtn) {
            addToCompareBtn.addEventListener('click', () => this.addToComparison());
        }

        if (clearComparisonBtn) {
            clearComparisonBtn.addEventListener('click', () => this.clearComparison());
        }

        // Simple dark mode toggle
        if (darkModeToggle) {
            darkModeToggle.onclick = () => {
                this.toggleDarkMode();
            };
        }

        // Articles navigation
        this.initArticlesNavigation();
        
        // Ultimate search bar functionality
        this.initUltimateSearch();
    }

    toggleDarkMode() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a smooth transition effect
        document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
    }

    initArticlesNavigation() {
        // Navigation between sections
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Article search
        const articleSearch = document.getElementById('articleSearch');
        if (articleSearch) {
            articleSearch.addEventListener('input', (e) => {
                this.filterArticles(e.target.value);
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }

        // Back to articles button
        const backBtn = document.getElementById('backToArticles');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showSection('articles');
            });
        }

        // Load sample articles
        this.loadSampleArticles();
    }

    showSection(sectionName) {
        // Hide all main content sections first
        const mainSections = document.querySelectorAll('.articles-section, .article-detail-section, .comparison-section');
        mainSections.forEach(section => {
            section.classList.add('hidden');
        });

        // Handle different section types
        if (sectionName === 'search') {
            // Show search-related elements
            const searchSection = document.querySelector('.search-section');
            const contentWrapper = document.querySelector('.content-wrapper');
            
            if (searchSection) {
                searchSection.classList.remove('hidden');
            }
            if (contentWrapper) {
                contentWrapper.classList.remove('hidden');
            }
        } else if (sectionName === 'articles') {
            // Hide search and comparison, show articles
            const searchSection = document.querySelector('.search-section');
            const contentWrapper = document.querySelector('.content-wrapper');
            const articlesSection = document.getElementById('articles');
            
            if (searchSection) {
                searchSection.classList.add('hidden');
            }
            if (contentWrapper) {
                contentWrapper.classList.add('hidden');
            }
            if (articlesSection) {
                articlesSection.classList.remove('hidden');
                this.loadSampleArticles();
            }
        } else if (sectionName === 'compare') {
            // Hide search and articles, show comparison
            const searchSection = document.querySelector('.search-section');
            const contentWrapper = document.querySelector('.content-wrapper');
            const comparisonSection = document.querySelector('.comparison-section');
            
            if (searchSection) {
                searchSection.classList.add('hidden');
            }
            if (contentWrapper) {
                contentWrapper.classList.add('hidden');
            }
            if (comparisonSection) {
                comparisonSection.classList.remove('hidden');
            }
        } else if (sectionName === 'article-detail') {
            // Handle article detail view
            const articleDetailSection = document.getElementById('article-detail');
            if (articleDetailSection) {
                articleDetailSection.classList.remove('hidden');
            }
        }
    }

    loadSampleArticles() {
        const articles = [
            {
                id: 1,
                title: "Understanding Macronutrients: Proteins, Carbs, and Fats",
                category: "basics",
                excerpt: "Learn the fundamentals of macronutrients and how they impact your health and fitness goals.",
                content: `
                    <h1>Understanding Macronutrients: Proteins, Carbs, and Fats</h1>
                    <span class="article-category">Nutrition Basics</span>
                    <p>Macronutrients are the nutrients your body needs in large amounts to function properly. They provide energy, support growth, and maintain overall health.</p>
                    
                    <h2>Proteins</h2>
                    <p>Proteins are essential for building and repairing tissues, making enzymes and hormones, and supporting immune function. They're made up of amino acids, which are the building blocks of life.</p>
                    <ul>
                        <li>Complete proteins: Meat, fish, eggs, dairy</li>
                        <li>Plant proteins: Beans, lentils, nuts, seeds</li>
                        <li>Daily recommendation: 0.8g per kg of body weight</li>
                    </ul>
                    
                    <h2>Carbohydrates</h2>
                    <p>Carbohydrates are your body's primary energy source. They're broken down into glucose, which fuels your brain, muscles, and other tissues.</p>
                    <ul>
                        <li>Complex carbs: Whole grains, vegetables, legumes</li>
                        <li>Simple carbs: Fruits, honey, refined sugars</li>
                        <li>Daily recommendation: 45-65% of total calories</li>
                    </ul>
                    
                    <h2>Fats</h2>
                    <p>Healthy fats are crucial for hormone production, vitamin absorption, and brain health. Not all fats are created equal.</p>
                    <ul>
                        <li>Healthy fats: Avocado, nuts, olive oil, fatty fish</li>
                        <li>Limited fats: Saturated fats from animal sources</li>
                        <li>Avoid: Trans fats found in processed foods</li>
                    </ul>
                    
                    <p>Understanding these macronutrients and balancing them properly is key to maintaining optimal health and achieving your fitness goals.</p>
                `,
                date: "2024-01-15",
                readTime: "5 min read"
            },
            {
                id: 2,
                title: "The Power of Vitamin D: Sunshine Vitamin Benefits",
                category: "vitamins",
                excerpt: "Discover why Vitamin D is crucial for bone health, immune function, and overall wellbeing.",
                content: `
                    <h1>The Power of Vitamin D: Sunshine Vitamin Benefits</h1>
                    <span class="article-category">Vitamins & Minerals</span>
                    <p>Vitamin D, often called the sunshine vitamin, plays a crucial role in maintaining overall health. Unlike other vitamins, your body can produce vitamin D when exposed to sunlight.</p>
                    
                    <h2>Why Vitamin D Matters</h2>
                    <p>Vitamin D is essential for numerous bodily functions:</p>
                    <ul>
                        <li>Bone health and calcium absorption</li>
                        <li>Immune system support</li>
                        <li>Mood regulation and mental health</li>
                        <li>Muscle function and strength</li>
                    </ul>
                    
                    <h2>Sources of Vitamin D</h2>
                    <h3>Sunlight Exposure</h3>
                    <p>Just 10-15 minutes of sun exposure on your face, arms, and legs 2-3 times per week can help maintain adequate vitamin D levels.</p>
                    
                    <h3>Food Sources</h3>
                    <ul>
                        <li>Fatty fish (salmon, mackerel, sardines)</li>
                        <li>Fortified dairy products</li>
                        <li>Egg yolks</li>
                        <li>Mushrooms exposed to UV light</li>
                    </ul>
                    
                    <h2>Recommended Daily Intake</h2>
                    <p>The recommended daily intake varies by age and health status:</p>
                    <ul>
                        <li>Adults 19-70 years: 600-800 IU</li>
                        <li>Adults over 70: 800-1000 IU</li>
                        <li>Pregnant/breastfeeding women: 600-800 IU</li>
                    </ul>
                    
                    <p>Consult with your healthcare provider about vitamin D testing and supplementation, especially if you have limited sun exposure or risk factors for deficiency.</p>
                `,
                date: "2024-01-20",
                readTime: "4 min read"
            },
            {
                id: 3,
                title: "Mediterranean Diet: Heart-Healthy Eating Pattern",
                category: "diets",
                excerpt: "Explore the Mediterranean diet and its proven benefits for heart health and longevity.",
                content: `
                    <h1>Mediterranean Diet: Heart-Healthy Eating Pattern</h1>
                    <span class="article-category">Diets & Plans</span>
                    <p>The Mediterranean diet is not just a diet, but a lifestyle approach to eating that's based on the traditional foods of countries bordering the Mediterranean Sea.</p>
                    
                    <h2>What is the Mediterranean Diet?</h2>
                    <p>This eating pattern emphasizes:</p>
                    <ul>
                        <li>Extra virgin olive oil as the primary fat source</li>
                        <li>Abundance of vegetables, fruits, nuts, and legumes</li>
                        <li>Moderate amounts of fish and poultry</li>
                        <li>Limited red meat and sweets</li>
                        <li>Moderate wine consumption (optional)</li>
                    </ul>
                    
                    <h2>Health Benefits</h2>
                    <p>Research has shown numerous health benefits:</p>
                    <ul>
                        <li>Reduced risk of heart disease by 30%</li>
                        <li>Lower rates of certain cancers</li>
                        <li>Improved cognitive function</li>
                        <li>Better blood sugar control</li>
                        <li>Reduced inflammation</li>
                    </ul>
                    
                    <h2>Getting Started</h2>
                    <h3>Breakfast</h3>
                    <p>Start with Greek yogurt with berries and nuts, or whole grain toast with olive oil and tomatoes.</p>
                    
                    <h3>Lunch</h3>
                    <p>Enjoy a large salad with mixed vegetables, chickpeas, and olive oil dressing, with a side of whole grain bread.</p>
                    
                    <h3>Dinner</h3>
                    <p>Grilled fish with roasted vegetables and a small portion of whole grains like quinoa or brown rice.</p>
                    
                    <p>The Mediterranean diet is flexible and can be adapted to your preferences while maintaining its core principles of whole, plant-based foods and healthy fats.</p>
                `,
                date: "2024-01-25",
                readTime: "6 min read"
            },
            {
                id: 4,
                title: "10 Simple Tips for Better Digestion",
                category: "health",
                excerpt: "Improve your digestive health with these easy-to-implement lifestyle changes.",
                content: `
                    <h1>10 Simple Tips for Better Digestion</h1>
                    <span class="article-category">Health Tips</span>
                    <p>Good digestion is the foundation of overall health. These simple tips can help improve your digestive function and enhance nutrient absorption.</p>
                    
                    <h2>1. Eat Mindfully</h2>
                    <p>Take time to chew your food thoroughly and eat slowly. This helps your digestive system break down food more effectively.</p>
                    
                    <h2>2. Stay Hydrated</h2>
                    <p>Drink plenty of water throughout the day, but avoid drinking large amounts during meals as it can dilute digestive enzymes.</p>
                    
                    <h2>3. Include Fiber-Rich Foods</h2>
                    <p>Add fruits, vegetables, whole grains, and legumes to your diet to support regular bowel movements.</p>
                    
                    <h2>4. Manage Stress</h2>
                    <p>Stress can significantly impact digestion. Practice relaxation techniques like deep breathing, meditation, or yoga.</p>
                    
                    <h2>5. Exercise Regularly</h2>
                    <p>Physical activity helps stimulate intestinal contractions and promotes regular digestion.</p>
                    
                    <h2>6. Limit Processed Foods</h2>
                    <p>Reduce your intake of highly processed foods that can be difficult to digest and may cause inflammation.</p>
                    
                    <h2>7. Eat Fermented Foods</h2>
                    <p>Include yogurt, kefir, sauerkraut, and other fermented foods to support healthy gut bacteria.</p>
                    
                    <h2>8. Don't Overeat</h2>
                    <p>Eating smaller, more frequent meals can be easier on your digestive system than large, heavy meals.</p>
                    
                    <h2>9. Get Enough Sleep</h2>
                    <p>Poor sleep can disrupt digestive function. Aim for 7-9 hours of quality sleep per night.</p>
                    
                    <h2>10. Listen to Your Body</h2>
                    <p>Pay attention to how different foods make you feel and avoid those that cause digestive discomfort.</p>
                    
                    <p>Implementing these tips gradually can lead to significant improvements in your digestive health and overall wellbeing.</p>
                `,
                date: "2024-01-30",
                readTime: "5 min read"
            },
            {
                id: 5,
                title: "Quick and Healthy Breakfast Smoothie Recipes",
                category: "recipes",
                excerpt: "Start your day right with these nutritious and delicious smoothie recipes.",
                content: `
                    <h1>Quick and Healthy Breakfast Smoothie Recipes</h1>
                    <span class="article-category">Healthy Recipes</span>
                    <p>Smoothies are an excellent way to pack nutrients into a quick, convenient meal. Here are some delicious recipes to start your day right.</p>
                    
                    <h2>Green Power Smoothie</h2>
                    <p>Packed with vitamins and minerals, this smoothie will give you energy without weighing you down.</p>
                    <ul>
                        <li>1 cup spinach</li>
                        <li>1/2 banana</li>
                        <li>1/2 cup Greek yogurt</li>
                        <li>1 tbsp almond butter</li>
                        <li>1 cup almond milk</li>
                        <li>Ice cubes to taste</li>
                    </ul>
                    
                    <h2>Berry Antioxidant Blast</h2>
                    <p>Berries are rich in antioxidants and fiber, making this smoothie perfect for heart health.</p>
                    <ul>
                        <li>1 cup mixed berries (fresh or frozen)</li>
                        <li>1/2 cup oats</li>
                        <li>1 tbsp chia seeds</li>
                        <li>1 cup water or milk</li>
                        <li>1 tsp honey (optional)</li>
                    </ul>
                    
                    <h2>Protein Power Smoothie</h2>
                    <p>Ideal for post-workout recovery or when you need sustained energy.</p>
                    <ul>
                        <li>1 scoop protein powder</li>
                        <li>1 banana</li>
                        <li>2 tbsp peanut butter</li>
                        <li>1 cup milk</li>
                        <li>1/4 cup rolled oats</li>
                    </ul>
                    
                    <h2>Tropical Paradise Smoothie</h2>
                    <p>Transport yourself to a tropical island with this refreshing and vitamin-rich smoothie.</p>
                    <ul>
                        <li>1 cup pineapple chunks</li>
                        <li>1/2 mango</li>
                        <li>1/2 cup coconut milk</li>
                        <li>1 tbsp flax seeds</li>
                        <li>1/2 cup water</li>
                    </ul>
                    
                    <h2>Tips for Perfect Smoothies</h2>
                    <ul>
                        <li>Freeze fruits beforehand for thicker smoothies</li>
                        <li>Add liquid gradually to achieve desired consistency</li>
                        <li>Include protein, healthy fats, and fiber for balanced nutrition</li>
                        <li>Experiment with spices like cinnamon or nutmeg for extra flavor</li>
                    </ul>
                    
                    <p>These smoothies provide a balanced mix of macronutrients and micronutrients to start your day with energy and nutrition.</p>
                `,
                date: "2024-02-05",
                readTime: "4 min read"
            },
            {
                id: 6,
                title: "Understanding Food Labels: A Complete Guide",
                category: "basics",
                excerpt: "Learn how to read and understand nutrition labels to make healthier food choices.",
                content: `
                    <h1>Understanding Food Labels: A Complete Guide</h1>
                    <span class="article-category">Nutrition Basics</span>
                    <p>Understanding food labels is essential for making informed dietary choices. This guide will help you decode nutrition information and select healthier options.</p>
                    
                    <h2>Serving Size</h2>
                    <p>The serving size is the foundation of all nutrition information. Always check this first, as all other values are based on this amount.</p>
                    
                    <h2>Calories</h2>
                    <p>Calories indicate the energy content of food. General guidelines:</p>
                    <ul>
                        <li>40 calories: Low calorie</li>
                        <li>100 calories: Moderate</li>
                        <li>400+ calories: High calorie</li>
                    </ul>
                    
                    <h2>Nutrients to Limit</h2>
                    <h3>Saturated Fat</h3>
                    <p>Keep saturated fat below 10% of total daily calories. Aim for foods with less than 5g per serving.</p>
                    
                    <h3>Trans Fat</h3>
                    <p>Avoid trans fats completely. Look for "0g trans fat" on labels.</p>
                    
                    <h3>Sodium</h3>
                    <p>Limit sodium to less than 2,300mg per day. Choose foods with less than 140mg per serving.</p>
                    
                    <h3>Added Sugars</h3>
                    <p>Keep added sugars below 10% of total daily calories. Look for foods with minimal added sugars.</p>
                    
                    <h2>Nutrients to Get More Of</h2>
                    <h3>Dietary Fiber</h3>
                    <p>Aim for 25-30g per day. Choose foods with at least 3g per serving.</p>
                    
                    <h3>Protein</h3>
                    <p>Include adequate protein in each meal. Look for foods with at least 5g per serving.</p>
                    
                    <h3>Vitamins and Minerals</h3>
                    <p>Foods providing 20% or more of daily values are considered high in these nutrients.</p>
                    
                    <h2>Ingredient List</h2>
                    <p>Ingredients are listed in descending order by weight. The first few ingredients make up most of the product.</p>
                    
                    <h2>Health Claims</h2>
                    <p>Be cautious of health claims. "Low fat" doesn't always mean healthy, as sugar might be added for flavor.</p>
                    
                    <p>Reading labels becomes easier with practice. Start by focusing on a few key nutrients and gradually expand your understanding.</p>
                `,
                date: "2024-02-10",
                readTime: "6 min read"
            }
        ];

        this.articles = articles;
        this.displayArticles(articles);
    }

    displayArticles(articlesToShow) {
        const articlesGrid = document.getElementById('articlesGrid');
        if (!articlesGrid) return;

        articlesGrid.innerHTML = '';

        articlesToShow.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            articleCard.innerHTML = `
                <span class="article-category">${this.formatCategory(article.category)}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-meta">
                    <span>${article.date}</span>
                    <span>${article.readTime}</span>
                </div>
            `;

            articleCard.addEventListener('click', () => {
                this.showArticle(article);
            });

            articlesGrid.appendChild(articleCard);
        });
    }

    showArticle(article) {
        const articleContent = document.getElementById('articleContent');
        if (!articleContent) return;

        articleContent.innerHTML = article.content;
        this.showSection('article-detail');
    }

    filterArticles(searchTerm) {
        const filtered = this.articles.filter(article => 
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.displayArticles(filtered);
    }

    filterByCategory(category) {
        if (category === 'all') {
            this.displayArticles(this.articles);
        } else {
            const filtered = this.articles.filter(article => article.category === category);
            this.displayArticles(filtered);
        }
    }

    formatCategory(category) {
        const categoryNames = {
            'basics': 'Nutrition Basics',
            'vitamins': 'Vitamins & Minerals',
            'diets': 'Diets & Plans',
            'health': 'Health Tips',
            'recipes': 'Healthy Recipes'
        };
        return categoryNames[category] || category;
    }

    initUltimateSearch() {
        this.searchHistory = this.loadSearchHistory();
        this.popularSearches = [
            'apple', 'banana', 'chicken', 'rice', 'salmon', 'broccoli', 
            'eggs', 'milk', 'bread', 'pasta', 'avocado', 'spinach'
        ];
        this.currentAutocompleteIndex = -1;
        this.isVoiceSearchActive = false;
        
        this.initSearchEvents();
        this.initKeyboardShortcuts();
        this.initVoiceSearch();
        this.initFilters();
        this.initAutocomplete();
    }

    initSearchEvents() {
        const searchInput = document.getElementById('foodSearch');
        const clearBtn = document.getElementById('clearSearchBtn');
        const voiceBtn = document.getElementById('voiceSearchBtn');
        const filterToggle = document.getElementById('filterToggle');
        
        // Search input events
        searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });
        
        searchInput.addEventListener('focus', () => {
            this.showAutocomplete();
        });
        
        searchInput.addEventListener('keydown', (e) => {
            this.handleAutocompleteNavigation(e);
        });
        
        // Clear button
        clearBtn.addEventListener('click', () => {
            this.clearSearch();
        });
        
        // Voice search
        voiceBtn.addEventListener('click', () => {
            this.toggleVoiceSearch();
        });
        
        // Filter toggle
        filterToggle.addEventListener('click', () => {
            this.toggleFilters();
        });
        
        // Click outside to close autocomplete
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-input-wrapper')) {
                this.hideAutocomplete();
            }
        });
    }

    handleSearchInput(value) {
        const clearBtn = document.getElementById('clearSearchBtn');
        
        // Show/hide clear button
        if (value.trim()) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
        
        // Update autocomplete
        this.updateAutocomplete(value);
    }

    clearSearch() {
        const searchInput = document.getElementById('foodSearch');
        const clearBtn = document.getElementById('clearSearchBtn');
        
        searchInput.value = '';
        clearBtn.classList.add('hidden');
        this.hideAutocomplete();
        searchInput.focus();
    }

    initAutocomplete() {
        // Load popular searches and recent searches
        this.updateAutocompleteSections();
    }

    updateAutocomplete(searchTerm = '') {
        const suggestions = this.generateSuggestions(searchTerm);
        this.displayAutocompleteItems(suggestions, searchTerm);
    }

    generateSuggestions(searchTerm) {
        if (!searchTerm) {
            return [];
        }
        
        const allFoods = [
            ...this.popularSearches,
            'orange', 'strawberry', 'blueberry', 'grape', 'watermelon',
            'carrot', 'potato', 'tomato', 'onion', 'garlic',
            'beef', 'pork', 'turkey', 'fish', 'shrimp',
            'quinoa', 'oats', 'barley', 'couscous', 'noodles',
            'cheese', 'yogurt', 'butter', 'cream', 'ice cream',
            'coffee', 'tea', 'juice', 'water', 'soda'
        ];
        
        return allFoods
            .filter(food => food.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 8)
            .map(food => ({
                text: food,
                type: 'suggestion',
                icon: 'search'
            }));
    }

    displayAutocompleteItems(items, searchTerm) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        suggestionsContainer.innerHTML = '';
        
        if (items.length === 0 && searchTerm) {
            suggestionsContainer.innerHTML = `
                <div class="autocomplete-item">
                    <span class="autocomplete-item-text">No results found</span>
                </div>
            `;
            return;
        }
        
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'autocomplete-item';
            itemElement.dataset.index = index;
            
            const icon = this.getAutocompleteIcon(item.type);
            itemElement.innerHTML = `
                <span class="autocomplete-item-icon">${icon}</span>
                <span class="autocomplete-item-text">${this.highlightMatch(item.text, searchTerm)}</span>
            `;
            
            itemElement.addEventListener('click', () => {
                this.selectAutocompleteItem(item.text);
            });
            
            suggestionsContainer.appendChild(itemElement);
        });
        
        this.currentAutocompleteIndex = -1;
    }

    highlightMatch(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    getAutocompleteIcon(type) {
        const icons = {
            'popular': 'star',
            'recent': 'clock',
            'suggestion': 'search'
        };
        return icons[type] || 'search';
    }

    updateAutocompleteSections() {
        // Popular searches
        const popularContainer = document.getElementById('popularSearches');
        popularContainer.innerHTML = this.popularSearches
            .slice(0, 5)
            .map(food => `
                <div class="autocomplete-item" onclick="nutriCheck.selectAutocompleteItem('${food}')">
                    <span class="autocomplete-item-icon">star</span>
                    <span class="autocomplete-item-text">${food}</span>
                </div>
            `).join('');
        
        // Recent searches
        const recentContainer = document.getElementById('recentSearches');
        const recentSearches = this.searchHistory.slice(0, 5);
        
        if (recentSearches.length > 0) {
            recentContainer.innerHTML = recentSearches
                .map(search => `
                    <div class="autocomplete-item" onclick="nutriCheck.selectAutocompleteItem('${search}')">
                        <span class="autocomplete-item-icon">clock</span>
                        <span class="autocomplete-item-text">${search}</span>
                    </div>
                `).join('');
        } else {
            recentContainer.innerHTML = `
                <div class="autocomplete-item">
                    <span class="autocomplete-item-text">No recent searches</span>
                </div>
            `;
        }
    }

    handleAutocompleteNavigation(e) {
        const items = document.querySelectorAll('.autocomplete-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.currentAutocompleteIndex = Math.min(this.currentAutocompleteIndex + 1, items.length - 1);
            this.updateAutocompleteSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.currentAutocompleteIndex = Math.max(this.currentAutocompleteIndex - 1, -1);
            this.updateAutocompleteSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.currentAutocompleteIndex >= 0 && items[this.currentAutocompleteIndex]) {
                const itemText = items[this.currentAutocompleteIndex].querySelector('.autocomplete-item-text').textContent;
                this.selectAutocompleteItem(itemText);
            } else {
                this.searchFood();
            }
        } else if (e.key === 'Escape') {
            this.hideAutocomplete();
        }
    }

    updateAutocompleteSelection(items) {
        items.forEach((item, index) => {
            if (index === this.currentAutocompleteIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    selectAutocompleteItem(text) {
        const searchInput = document.getElementById('foodSearch');
        searchInput.value = text;
        this.hideAutocomplete();
        this.searchFood();
    }

    showAutocomplete() {
        const dropdown = document.getElementById('autocompleteDropdown');
        dropdown.classList.remove('hidden');
        this.updateAutocompleteSections();
    }

    hideAutocomplete() {
        const dropdown = document.getElementById('autocompleteDropdown');
        dropdown.classList.add('hidden');
        this.currentAutocompleteIndex = -1;
    }

    initVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            // Voice search not supported
            document.getElementById('voiceSearchBtn').style.display = 'none';
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        
        this.recognition.onstart = () => {
            this.isVoiceSearchActive = true;
            document.getElementById('voiceSearchBtn').classList.add('listening');
        };
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('foodSearch').value = transcript;
            this.handleSearchInput(transcript);
        };
        
        this.recognition.onend = () => {
            this.isVoiceSearchActive = false;
            document.getElementById('voiceSearchBtn').classList.remove('listening');
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isVoiceSearchActive = false;
            document.getElementById('voiceSearchBtn').classList.remove('listening');
        };
    }

    toggleVoiceSearch() {
        if (this.isVoiceSearchActive) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    initFilters() {
        // Initialize filter states
        this.filters = {
            category: 'all',
            maxCalories: null,
            vegetarian: false,
            vegan: false,
            glutenFree: false
        };
        
        // Add filter change listeners
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filters.category = e.target.value;
        });
        
        document.getElementById('calorieFilter').addEventListener('input', (e) => {
            this.filters.maxCalories = e.target.value ? parseInt(e.target.value) : null;
        });
        
        document.getElementById('vegetarianFilter').addEventListener('change', (e) => {
            this.filters.vegetarian = e.target.checked;
        });
        
        document.getElementById('veganFilter').addEventListener('change', (e) => {
            this.filters.vegan = e.target.checked;
        });
        
        document.getElementById('glutenFreeFilter').addEventListener('change', (e) => {
            this.filters.glutenFree = e.target.checked;
        });
    }

    toggleFilters() {
        const filtersPanel = document.getElementById('advancedFilters');
        filtersPanel.classList.toggle('hidden');
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K: Focus search
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.getElementById('foodSearch').focus();
            }
            
            // Ctrl+/: Show help
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                this.toggleKeyboardHelp();
            }
            
            // Escape: Clear search and close dropdowns
            if (e.key === 'Escape') {
                this.clearSearch();
                document.getElementById('advancedFilters').classList.add('hidden');
                document.getElementById('keyboardHelp').classList.add('hidden');
            }
        });
        
        // Close help when clicking outside
        document.getElementById('keyboardHelp').addEventListener('click', (e) => {
            if (e.target.id === 'keyboardHelp') {
                document.getElementById('keyboardHelp').classList.add('hidden');
            }
        });
    }

    toggleKeyboardHelp() {
        const helpPanel = document.getElementById('keyboardHelp');
        helpPanel.classList.toggle('hidden');
    }

    loadSearchHistory() {
        const saved = localStorage.getItem('nutriCheck_searchHistory');
        return saved ? JSON.parse(saved) : [];
    }

    saveSearchHistory() {
        localStorage.setItem('nutriCheck_searchHistory', JSON.stringify(this.searchHistory));
    }

    addToSearchHistory(searchTerm) {
        if (!searchTerm.trim()) return;
        
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item !== searchTerm);
        
        // Add to beginning
        this.searchHistory.unshift(searchTerm);
        
        // Keep only last 20
        this.searchHistory = this.searchHistory.slice(0, 20);
        
        this.saveSearchHistory();
        this.updateAutocompleteSections();
    }

    buildSearchQuery(query) {
        // For now, just return the query. In a real implementation,
        // this would build a query string with filters
        let searchQuery = query;
        
        if (this.filters.category !== 'all') {
            searchQuery += ` category:${this.filters.category}`;
        }
        
        if (this.filters.maxCalories) {
            searchQuery += ` calories:${this.filters.maxCalories}`;
        }
        
        if (this.filters.vegetarian) {
            searchQuery += ' vegetarian:true';
        }
        
        if (this.filters.vegan) {
            searchQuery += ' vegan:true';
        }
        
        if (this.filters.glutenFree) {
            searchQuery += ' gluten-free:true';
        }
        
        return searchQuery;
    }

    async searchFood() {
        const searchInput = document.getElementById('foodSearch');
        const query = searchInput.value.trim();
        
        if (!query) {
            alert('Please enter a food name');
            return;
        }

        // Validate API key before making requests
        if (!this.validateApiKey()) {
            this.showError('API key not configured. Please check the setup instructions.');
            return;
        }

        // Add to search history
        this.addToSearchHistory(query);
        
        // Hide autocomplete
        this.hideAutocomplete();
        
        // Apply filters if any are set
        const searchQuery = this.buildSearchQuery(query);
        
        this.showLoading(true);
        this.hideResults();

        try {
            const searchResults = await this.fetchFoodSearch(query);
            this.displaySearchResults(searchResults);
        } catch (error) {
            console.error('Error searching for food:', error);
            this.showError('Failed to search for food. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async fetchFoodSearch(query) {
        // Check if we're using direct API (need to add API key) or proxy (API key added server-side)
        let url;
        if (this.baseURL.includes('api.nal.usda.gov')) {
            // Direct API - add API key
            url = `${this.baseURL}/foods/search?query=${encodeURIComponent(query)}&pageSize=10&api_key=${this.apiKey}`;
        } else {
            // Proxy server - API key added server-side
            url = `${this.baseURL}/foods/search?query=${encodeURIComponent(query)}&pageSize=10`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your configuration.');
            } else if (response.status === 429) {
                throw new Error('API rate limit exceeded. Please try again later.');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        
        const data = await response.json();
        return data;
    }

    displaySearchResults(results) {
        const searchResultsDiv = document.getElementById('searchResults');
        const resultsListDiv = document.getElementById('resultsList');
        
        if (!results.foods || results.foods.length === 0) {
            this.showError('No results found. Try a different search term.');
            return;
        }

        resultsListDiv.innerHTML = '';
        
        results.foods.forEach((food, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <h3>${food.description}</h3>
                <p>${food.brandOwner ? food.brandOwner : 'Generic'} - ${food.foodCategory ? food.foodCategory : 'Unknown category'}</p>
                <p>Data Source: ${food.dataSource}</p>
            `;
            
            resultItem.addEventListener('click', () => this.getNutritionDetails(food.fdcId, food.description));
            resultsListDiv.appendChild(resultItem);
        });

        searchResultsDiv.classList.remove('hidden');
    }

    async getNutritionDetails(fdcId, foodName) {
        this.showLoading(true);
        this.hideNutritionDisplay();

        try {
            const nutritionData = await this.fetchNutritionDetails(fdcId);
            this.displayNutritionData(nutritionData, foodName);
        } catch (error) {
            console.error('Error fetching nutrition details:', error);
            this.showError('Failed to fetch nutrition details. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async fetchNutritionDetails(fdcId) {
        const url = `${this.baseURL}/food/${fdcId}?api_key=${this.apiKey}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    }

    displayNutritionData(data, foodName) {
        const nutritionDisplay = document.getElementById('nutritionDisplay');
        const foodNameElement = document.getElementById('foodName');
        const macroNutrientsDiv = document.getElementById('macroNutrients');
        const vitaminsDiv = document.getElementById('vitamins');
        const mineralsDiv = document.getElementById('minerals');
        const otherNutrientsDiv = document.getElementById('otherNutrients');

        foodNameElement.textContent = foodName;

        // Handle different possible data structures
        let nutrients = [];
        if (data.foodNutrients && Array.isArray(data.foodNutrients)) {
            nutrients = data.foodNutrients;
        } else if (data.nutrients && Array.isArray(data.nutrients)) {
            nutrients = data.nutrients;
        } else if (Array.isArray(data)) {
            nutrients = data;
        }
        
        console.log('Nutrition data:', data);
        console.log('Nutrients found:', nutrients.length);
        
        const macroNutrients = this.categorizeNutrients(nutrients, 'macro');
        const vitamins = this.categorizeNutrients(nutrients, 'vitamins');
        const minerals = this.categorizeNutrients(nutrients, 'minerals');
        const otherNutrients = this.categorizeNutrients(nutrients, 'other');

        console.log('Macro nutrients:', macroNutrients.length);
        console.log('Vitamins:', vitamins.length);
        console.log('Minerals:', minerals.length);
        console.log('Other:', otherNutrients.length);

        macroNutrientsDiv.innerHTML = this.formatNutrients(macroNutrients);
        vitaminsDiv.innerHTML = this.formatNutrients(vitamins);
        mineralsDiv.innerHTML = this.formatNutrients(minerals);
        otherNutrientsDiv.innerHTML = this.formatNutrients(otherNutrients);

        nutritionDisplay.classList.remove('hidden');
        
        window.currentFoodData = {
            name: foodName,
            nutrients: nutrients,
            fdcId: data.fdcId
        };
    }

    categorizeNutrients(nutrients, category) {
        const macroNutrientIds = [1008, 1003, 1004, 1005]; // Energy, Protein, Fat, Carbs
        const vitaminIds = [
            1162, 1164, 1165, 1166, 1167, 1170, 1172, 1174, 1175, 1176, 1177, 1178, 1179, 1180
        ];
        const mineralIds = [
            1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109
        ];

        return nutrients.filter(nutrient => {
            const nutrientId = nutrient.nutrientId || nutrient.id || (nutrient.nutrient && nutrient.nutrient.id);
            const nutrientName = (
                nutrient.nutrientName || 
                nutrient.name || 
                (nutrient.nutrient && nutrient.nutrient.name) || 
                ''
            ).toLowerCase();
            
            switch (category) {
                case 'macro':
                    return macroNutrientIds.includes(nutrientId) || 
                           nutrientName.includes('energy') ||
                           nutrientName.includes('protein') ||
                           nutrientName.includes('fat') ||
                           nutrientName.includes('carbohydrate') ||
                           nutrientName.includes('fiber') ||
                           nutrientName.includes('sugar') ||
                           nutrientName.includes('calories');
                case 'vitamins':
                    return vitaminIds.includes(nutrientId) || 
                           nutrientName.includes('vitamin') ||
                           nutrientName.includes('vit') ||
                           nutrientName.includes('ascorbic acid') ||
                           nutrientName.includes('thiamin') ||
                           nutrientName.includes('riboflavin') ||
                           nutrientName.includes('niacin') ||
                           nutrientName.includes('folate');
                case 'minerals':
                    return mineralIds.includes(nutrientId) || 
                           nutrientName.includes('calcium') ||
                           nutrientName.includes('iron') ||
                           nutrientName.includes('magnesium') ||
                           nutrientName.includes('phosphorus') ||
                           nutrientName.includes('potassium') ||
                           nutrientName.includes('sodium') ||
                           nutrientName.includes('zinc') ||
                           nutrientName.includes('copper') ||
                           nutrientName.includes('manganese') ||
                           nutrientName.includes('selenium');
                case 'other':
                    return !macroNutrientIds.includes(nutrientId) && 
                           !vitaminIds.includes(nutrientId) && 
                           !mineralIds.includes(nutrientId) &&
                           !nutrientName.includes('energy') &&
                           !nutrientName.includes('protein') &&
                           !nutrientName.includes('fat') &&
                           !nutrientName.includes('carbohydrate') &&
                           !nutrientName.includes('vitamin') &&
                           !nutrientName.includes('calcium') &&
                           !nutrientName.includes('iron') &&
                           !nutrientName.includes('magnesium') &&
                           !nutrientName.includes('phosphorus') &&
                           !nutrientName.includes('potassium') &&
                           !nutrientName.includes('sodium');
                default:
                    return false;
            }
        });
    }

    formatNutrients(nutrients) {
        if (nutrients.length === 0) {
            return '<p class="nutrient-item">No data available</p>';
        }

        return nutrients.map(nutrient => {
            const value = nutrient.value || nutrient.amount || 0;
            const unit = nutrient.unitName || nutrient.unitName || '';
            // Handle the nested nutrient structure from USDA API
            const name = nutrient.nutrientName || 
                         nutrient.name || 
                         (nutrient.nutrient && nutrient.nutrient.name) ||
                         'Unknown';
            
            return `
                <div class="nutrient-item">
                    <span class="nutrient-name">${name}</span>
                    <span class="nutrient-value">${value.toFixed(2)} ${unit}</span>
                </div>
            `;
        }).join('');
    }

    addToComparison() {
        if (!window.currentFoodData) {
            alert('Please search for a food first');
            return;
        }

        if (this.comparisonFoods.length >= 3) {
            alert('You can compare up to 3 foods at a time');
            return;
        }

        const existingFood = this.comparisonFoods.find(food => food.fdcId === window.currentFoodData.fdcId);
        if (existingFood) {
            alert('This food is already in the comparison list');
            return;
        }

        this.comparisonFoods.push({...window.currentFoodData});
        this.displayComparison();
    }

    displayComparison() {
        const comparisonDisplay = document.getElementById('comparisonDisplay');
        const comparisonList = document.getElementById('comparisonList');

        if (this.comparisonFoods.length === 0) {
            comparisonDisplay.classList.add('hidden');
            return;
        }

        comparisonList.innerHTML = '';

        this.comparisonFoods.forEach(food => {
            const comparisonItem = document.createElement('div');
            comparisonItem.className = 'comparison-item';
            
            const keyNutrients = this.getKeyNutrients(food.nutrients);
            
            comparisonItem.innerHTML = `
                <h4>${food.name}</h4>
                <div class="comparison-nutrients">
                    ${keyNutrients.map(nutrient => `
                        <div class="nutrient-item">
                            <span class="nutrient-name">${nutrient.name}</span>
                            <span class="nutrient-value">${nutrient.value.toFixed(2)} ${nutrient.unit}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            
            comparisonList.appendChild(comparisonItem);
        });

        comparisonDisplay.classList.remove('hidden');
    }

    getKeyNutrients(nutrients) {
        const keyNutrientIds = [1008, 1003, 1004, 1005, 1253, 1258]; // Energy, Protein, Fat, Carbs, Fiber, Sugar
        return nutrients
            .filter(n => {
                const nutrientId = n.nutrientId || n.id || (n.nutrient && n.nutrient.id);
                const nutrientName = (
                    n.nutrientName || 
                    n.name || 
                    (n.nutrient && n.nutrient.name) || 
                    ''
                ).toLowerCase();
                return keyNutrientIds.includes(nutrientId) || 
                       nutrientName.includes('energy') ||
                       nutrientName.includes('protein') ||
                       nutrientName.includes('fat') ||
                       nutrientName.includes('carbohydrate') ||
                       nutrientName.includes('fiber') ||
                       nutrientName.includes('sugar') ||
                       nutrientName.includes('calories');
            })
            .map(n => ({
                name: n.nutrientName || n.name || (n.nutrient && n.nutrient.name) || 'Unknown',
                value: n.value || n.amount || 0,
                unit: n.unitName || n.unit || ''
            }));
    }

    clearComparison() {
        this.comparisonFoods = [];
        this.displayComparison();
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (show) {
            spinner.classList.remove('hidden');
        } else {
            spinner.classList.add('hidden');
        }
    }

    hideResults() {
        document.getElementById('searchResults').classList.add('hidden');
    }

    hideNutritionDisplay() {
        document.getElementById('nutritionDisplay').classList.add('hidden');
    }

    showError(message) {
        const searchResultsDiv = document.getElementById('searchResults');
        const resultsListDiv = document.getElementById('resultsList');
        
        searchResultsDiv.classList.remove('hidden');
        resultsListDiv.innerHTML = `<div class="result-item"><p style="color: #dc3545;">${message}</p></div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NutriCheck();
});
