// Farmer Advisory Application JavaScript

class FarmerAdvisoryApp {
    constructor() {
        this.currentLanguage = 'en';
        this.currentLocation = { state: '', district: '' };
        this.currentModule = 'dashboard';
        this.isVoiceActive = false;
        this.cropData = null;
        
        // Initialize app
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.populateStateDropdown();
        this.showSetupModal();
    }

    async loadData() {
        // Load data from the provided JSON asset
        try {
            const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/c71179a3e4b6f540d1497ce442581845/40094aa0-ffca-4ae9-a63a-568ce6da7683/8202b3b8.json');
            this.cropData = await response.json();
        } catch (error) {
            console.log('Loading fallback data');
            // Fallback data if external loading fails
            this.cropData = {
                crops: {
                    rice: {
                        name_hindi: "चावल",
                        season: "Kharif",
                        sowing: "June-July",
                        harvest: "October-November",
                        soil_types: ["alluvial", "clay", "sandy"],
                        water_requirement: "High",
                        fertilizer: { N: 120, P: 60, K: 40 },
                        market_price: { current: 2850, change: "-1.2%" }
                    },
                    wheat: {
                        name_hindi: "गेहूं",
                        season: "Rabi",
                        sowing: "October-December",
                        harvest: "March-April",
                        soil_types: ["alluvial", "loamy"],
                        water_requirement: "Moderate",
                        fertilizer: { N: 120, P: 60, K: 40 },
                        market_price: { current: 2150, change: "+2.5%" }
                    },
                    cotton: {
                        name_hindi: "कपास",
                        season: "Kharif",
                        sowing: "April-June",
                        harvest: "October-January",
                        soil_types: ["black_soil", "alluvial"],
                        water_requirement: "Moderate",
                        fertilizer: { N: 150, P: 75, K: 75 },
                        market_price: { current: 6700, change: "+3.8%" }
                    }
                }
            };
        }
    }

    populateStateDropdown() {
        const stateSelect = document.getElementById('stateSelect');
        const states = [
            { value: 'punjab', text: 'Punjab' },
            { value: 'up', text: 'Uttar Pradesh' },
            { value: 'bihar', text: 'Bihar' },
            { value: 'wb', text: 'West Bengal' },
            { value: 'gujarat', text: 'Gujarat' },
            { value: 'maharashtra', text: 'Maharashtra' },
            { value: 'karnataka', text: 'Karnataka' },
            { value: 'telangana', text: 'Telangana' }
        ];

        // Clear existing options except the first one
        stateSelect.innerHTML = '<option value="">Select State</option>';
        
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state.value;
            option.textContent = state.text;
            stateSelect.appendChild(option);
        });
    }

    setupEventListeners() {
        // Setup modal
        const setupCompleteBtn = document.getElementById('setupComplete');
        if (setupCompleteBtn) {
            setupCompleteBtn.addEventListener('click', () => {
                this.completeSetup();
            });
        }

        // Language selection
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
            });
        }

        // State selection
        const stateSelect = document.getElementById('stateSelect');
        if (stateSelect) {
            stateSelect.addEventListener('change', (e) => {
                this.currentLocation.state = e.target.value;
                this.updateDistricts(e.target.value);
            });
        }

        // District selection
        const districtSelect = document.getElementById('districtSelect');
        if (districtSelect) {
            districtSelect.addEventListener('change', (e) => {
                this.currentLocation.district = e.target.value;
            });
        }

        // Action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const module = e.currentTarget.dataset.module;
                this.showModule(module);
            });
        });

        // Bottom navigation
        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const module = e.currentTarget.dataset.module;
                if (module === 'dashboard') {
                    this.showDashboard();
                } else {
                    this.showModule(module);
                }
                this.updateNavigation(module);
            });
        });

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showDashboard();
            });
        });

        // Voice interface
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                this.toggleVoiceModal();
            });
        }

        const closeVoice = document.getElementById('closeVoice');
        if (closeVoice) {
            closeVoice.addEventListener('click', () => {
                this.toggleVoiceModal();
            });
        }

        const startVoice = document.getElementById('startVoice');
        if (startVoice) {
            startVoice.addEventListener('click', () => {
                this.startVoiceRecognition();
            });
        }

        const stopVoice = document.getElementById('stopVoice');
        if (stopVoice) {
            stopVoice.addEventListener('click', () => {
                this.stopVoiceRecognition();
            });
        }

        // Crop selection
        const cropSelect = document.getElementById('cropSelect');
        if (cropSelect) {
            cropSelect.addEventListener('change', (e) => {
                this.showCropDetails(e.target.value);
            });
        }

        // Disease detection
        const uploadBtn = document.getElementById('uploadBtn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                document.getElementById('imageInput').click();
            });
        }

        const cameraBtn = document.getElementById('cameraBtn');
        if (cameraBtn) {
            cameraBtn.addEventListener('click', () => {
                this.simulateCameraCapture();
            });
        }

        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files[0]);
            });
        }

        // Drag and drop
        const uploadZone = document.getElementById('uploadZone');
        if (uploadZone) {
            uploadZone.addEventListener('click', () => {
                document.getElementById('imageInput').click();
            });

            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });

            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                if (e.dataTransfer.files.length > 0) {
                    this.handleImageUpload(e.dataTransfer.files[0]);
                }
            });
        }

        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSetupModal();
            });
        }
    }

    showSetupModal() {
        const setupModal = document.getElementById('setupModal');
        const mainApp = document.getElementById('mainApp');
        if (setupModal) setupModal.classList.remove('hidden');
        if (mainApp) mainApp.classList.add('hidden');
    }

    completeSetup() {
        const state = document.getElementById('stateSelect').value;
        const district = document.getElementById('districtSelect').value;
        
        // Allow completion even without district for demo purposes
        if (!state) {
            alert('Please select at least a state to continue');
            return;
        }

        // Use state as district if district not selected
        this.currentLocation = { 
            state, 
            district: district || 'main-district'
        };
        
        const setupModal = document.getElementById('setupModal');
        const mainApp = document.getElementById('mainApp');
        
        if (setupModal) setupModal.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        
        this.updateLocationDisplay();
        this.showDashboard();
        
        // Initialize chart after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.initializePriceChart();
        }, 100);
    }

    updateDistricts(state) {
        const districts = {
            'punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala'],
            'up': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
            'bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur'],
            'wb': ['Kolkata', 'Hooghly', 'Bardhaman', 'Murshidabad'],
            'gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
            'maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
            'karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
            'telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam']
        };

        const districtSelect = document.getElementById('districtSelect');
        if (!districtSelect) return;
        
        districtSelect.innerHTML = '<option value="">Select District</option>';
        
        if (districts[state]) {
            districts[state].forEach(district => {
                const option = document.createElement('option');
                option.value = district.toLowerCase();
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    }

    updateLocationDisplay() {
        const locationElement = document.getElementById('currentLocation');
        if (locationElement) {
            const stateName = this.getStateName(this.currentLocation.state);
            const districtName = this.currentLocation.district === 'main-district' ? 
                'Main Area' : this.currentLocation.district;
            locationElement.textContent = `📍 ${districtName}, ${stateName}`;
        }
    }

    getStateName(stateValue) {
        const stateNames = {
            'punjab': 'Punjab',
            'up': 'Uttar Pradesh',
            'bihar': 'Bihar',
            'wb': 'West Bengal',
            'gujarat': 'Gujarat',
            'maharashtra': 'Maharashtra',
            'karnataka': 'Karnataka',
            'telangana': 'Telangana'
        };
        return stateNames[stateValue] || stateValue;
    }

    showDashboard() {
        const moduleContent = document.getElementById('moduleContent');
        if (moduleContent) moduleContent.classList.add('hidden');
        
        document.querySelectorAll('.module').forEach(module => {
            module.classList.add('hidden');
        });
        this.currentModule = 'dashboard';
        this.updateNavigation('dashboard');
    }

    showModule(moduleName) {
        const moduleContent = document.getElementById('moduleContent');
        if (moduleContent) moduleContent.classList.remove('hidden');
        
        // Hide all modules
        document.querySelectorAll('.module').forEach(module => {
            module.classList.add('hidden');
        });
        
        // Show selected module
        const targetModule = document.getElementById(moduleName);
        if (targetModule) {
            targetModule.classList.remove('hidden');
            this.currentModule = moduleName;
            this.updateNavigation(moduleName);
        }
    }

    updateNavigation(activeModule) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.module === activeModule) {
                item.classList.add('active');
            }
        });
    }

    showCropDetails(cropType) {
        const cropDetails = document.getElementById('cropDetails');
        if (!cropType || !this.cropData.crops[cropType] || !cropDetails) {
            if (cropDetails) cropDetails.classList.add('hidden');
            return;
        }

        const crop = this.cropData.crops[cropType];
        cropDetails.classList.remove('hidden');

        // Season info
        const seasonInfo = document.getElementById('seasonInfo');
        if (seasonInfo) {
            seasonInfo.innerHTML = `
                <p><strong>Season:</strong> ${crop.season}</p>
                <p><strong>Sowing:</strong> ${crop.sowing}</p>
                <p><strong>Harvest:</strong> ${crop.harvest}</p>
            `;
        }

        // Soil info
        const soilInfo = document.getElementById('soilInfo');
        if (soilInfo) {
            soilInfo.innerHTML = `
                <p><strong>Suitable Soil:</strong> ${crop.soil_types?.join(', ') || 'Various'}</p>
                <p><strong>Water Requirement:</strong> ${crop.water_requirement}</p>
            `;
        }

        // Price info
        const priceInfo = document.getElementById('priceInfo');
        if (priceInfo) {
            const priceChange = crop.market_price?.change || '0%';
            const changeClass = priceChange.startsWith('+') ? 'positive' : 'negative';
            priceInfo.innerHTML = `
                <p><strong>Current Price:</strong> ₹${crop.market_price?.current || 'N/A'}/quintal</p>
                <p class="price-change ${changeClass}">${priceChange}</p>
            `;
        }

        // Fertilizer info
        const fertilizerInfo = document.getElementById('fertilizerInfo');
        if (fertilizerInfo && crop.fertilizer) {
            fertilizerInfo.innerHTML = `
                <p><strong>NPK Ratio:</strong></p>
                <p>Nitrogen: ${crop.fertilizer.N} kg/ha</p>
                <p>Phosphorus: ${crop.fertilizer.P} kg/ha</p>
                <p>Potassium: ${crop.fertilizer.K} kg/ha</p>
            `;
        }
    }

    simulateCameraCapture() {
        // Simulate camera capture
        this.showLoadingState();
        setTimeout(() => {
            this.hideLoadingState();
            this.showDiseaseDetectionResult();
        }, 2000);
    }

    handleImageUpload(file) {
        if (file) {
            this.showLoadingState();
            setTimeout(() => {
                this.hideLoadingState();
                this.showDiseaseDetectionResult();
            }, 1500);
        }
    }

    showDiseaseDetectionResult() {
        const diseases = [
            {
                name: 'Leaf Blast',
                confidence: '92%',
                treatment: 'Apply Tricyclazole fungicide. Remove affected leaves.',
                prevention: 'Ensure proper drainage and avoid overhead irrigation.'
            },
            {
                name: 'Bacterial Blight',
                confidence: '87%',
                treatment: 'Use copper-based bactericide spray.',
                prevention: 'Use resistant varieties and proper field sanitation.'
            }
        ];

        const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
        
        const diseaseInfo = document.getElementById('diseaseInfo');
        if (diseaseInfo) {
            diseaseInfo.innerHTML = `
                <div class="status status--error">
                    <strong>Disease Detected: ${randomDisease.name}</strong>
                    <p>Confidence: ${randomDisease.confidence}</p>
                </div>
            `;
        }

        const treatmentInfo = document.getElementById('treatmentInfo');
        if (treatmentInfo) {
            treatmentInfo.innerHTML = `
                <div style="margin-top: 16px;">
                    <h4>🩺 Treatment:</h4>
                    <p>${randomDisease.treatment}</p>
                    
                    <h4>🛡️ Prevention:</h4>
                    <p>${randomDisease.prevention}</p>
                    
                    <button class="btn btn--primary" style="margin-top: 12px;">
                        📞 Consult Expert
                    </button>
                </div>
            `;
        }

        const detectionResult = document.getElementById('detectionResult');
        if (detectionResult) detectionResult.classList.remove('hidden');
    }

    initializePriceChart() {
        const ctx = document.getElementById('priceChart');
        if (!ctx || !window.Chart) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Rice (₹/quintal)',
                        data: [2800, 2820, 2850, 2900, 2880, 2850],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Wheat (₹/quintal)',
                        data: [2100, 2120, 2150, 2180, 2160, 2150],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Cotton (₹/quintal)',
                        data: [6500, 6550, 6600, 6650, 6700, 6700],
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Crop Price Trends (Last 6 Months)'
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Price (₹/quintal)'
                        }
                    }
                }
            }
        });
    }

    toggleVoiceModal() {
        const modal = document.getElementById('voiceModal');
        if (modal) {
            modal.classList.toggle('hidden');
            if (!modal.classList.contains('hidden')) {
                this.resetVoiceInterface();
            }
        }
    }

    resetVoiceInterface() {
        const voiceStatus = document.getElementById('voiceStatus');
        const voiceResult = document.getElementById('voiceResult');
        if (voiceStatus) voiceStatus.textContent = 'Tap to speak...';
        if (voiceResult) voiceResult.classList.add('hidden');
        this.isVoiceActive = false;
    }

    startVoiceRecognition() {
        if (this.isVoiceActive) return;
        
        this.isVoiceActive = true;
        const voiceStatus = document.getElementById('voiceStatus');
        if (voiceStatus) voiceStatus.textContent = 'Listening... 🔴';
        
        // Simulate voice recognition
        setTimeout(() => {
            this.simulateVoiceResponse();
        }, 3000);
    }

    stopVoiceRecognition() {
        this.isVoiceActive = false;
        const voiceStatus = document.getElementById('voiceStatus');
        if (voiceStatus) voiceStatus.textContent = 'Tap to speak...';
    }

    simulateVoiceResponse() {
        const responses = [
            {
                input: "What should I plant in kharif season?",
                output: "For kharif season, you can plant rice, cotton, sugarcane, or maize. Rice is suitable for your region with high water availability."
            },
            {
                input: "How to control pests in rice?",
                output: "Use integrated pest management. Apply neem oil for brown planthopper and Trichogramma bio-agent for stem borer control."
            },
            {
                input: "Current wheat price?",
                output: "Current wheat price is ₹2,150 per quintal, up by 2.5% from last week."
            }
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const spokenText = document.getElementById('spokenText');
        const voiceResponse = document.getElementById('voiceResponse');
        const voiceResult = document.getElementById('voiceResult');
        const voiceStatus = document.getElementById('voiceStatus');
        
        if (spokenText) spokenText.textContent = randomResponse.input;
        if (voiceResponse) voiceResponse.textContent = randomResponse.output;
        if (voiceResult) voiceResult.classList.remove('hidden');
        if (voiceStatus) voiceStatus.textContent = 'Response ready';
        
        this.isVoiceActive = false;
        
        // Simulate text-to-speech
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(randomResponse.output);
            utterance.lang = this.currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    showLoadingState() {
        const moduleContent = document.getElementById('moduleContent');
        if (moduleContent) moduleContent.classList.add('loading');
    }

    hideLoadingState() {
        const moduleContent = document.getElementById('moduleContent');
        if (moduleContent) moduleContent.classList.remove('loading');
    }

    // Weather simulation
    updateWeather() {
        const weatherConditions = [
            { icon: '☀️', temp: '28°C', condition: 'Sunny', humidity: '45%', wind: '8 km/h' },
            { icon: '⛅', temp: '26°C', condition: 'Partly Cloudy', humidity: '65%', wind: '12 km/h' },
            { icon: '🌧️', temp: '24°C', condition: 'Rainy', humidity: '80%', wind: '15 km/h' },
            { icon: '☁️', temp: '22°C', condition: 'Cloudy', humidity: '70%', wind: '10 km/h' }
        ];

        const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        
        const weatherIcon = document.querySelector('.weather-icon');
        const temperature = document.querySelector('.temperature');
        const condition = document.querySelector('.condition');
        const weatherDetails = document.querySelector('.weather-details');
        
        if (weatherIcon) weatherIcon.textContent = weather.icon;
        if (temperature) temperature.textContent = weather.temp;
        if (condition) condition.textContent = weather.condition;
        if (weatherDetails) {
            weatherDetails.innerHTML = `
                <span>💧 Humidity: ${weather.humidity}</span>
                <span>💨 Wind: ${weather.wind}</span>
            `;
        }
    }

    // Periodic updates
    startPeriodicUpdates() {
        // Update weather every 5 minutes
        setInterval(() => {
            this.updateWeather();
        }, 300000);

        // Show random alerts
        setInterval(() => {
            this.showRandomAlert();
        }, 600000);
    }

    showRandomAlert() {
        const alerts = [
            {
                type: 'warning',
                title: 'Weather Alert',
                message: 'Heavy rainfall expected in next 24 hours. Postpone spraying operations.'
            },
            {
                type: 'info',
                title: 'Market Update', 
                message: 'Rice prices have increased by 2% in local mandis.'
            },
            {
                type: 'success',
                title: 'Scheme Alert',
                message: 'New PM-KISAN payment has been credited to eligible farmers.'
            }
        ];

        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        this.showNotification(alert.title, alert.message, alert.type);
    }

    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert--${type}`;
        notification.innerHTML = `
            <span class="alert-icon">${type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
            <div class="alert-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        `;

        // Add to alerts section
        const alertsSection = document.getElementById('alertsSection');
        if (alertsSection) {
            alertsSection.appendChild(notification);

            // Remove after 10 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 10000);
        }
    }

    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }

    getLocalizedText(key) {
        // Simple localization - in a real app, this would load from language files
        const translations = {
            en: {
                dashboard: 'Dashboard',
                crops: 'Crops', 
                prices: 'Prices',
                expert: 'Expert'
            },
            hi: {
                dashboard: 'डैशबोर्ड',
                crops: 'फसलें',
                prices: 'कीमतें', 
                expert: 'विशेषज्ञ'
            }
        };

        return translations[this.currentLanguage]?.[key] || key;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.farmerApp = new FarmerAdvisoryApp();
    
    // Start periodic updates after 5 seconds
    setTimeout(() => {
        window.farmerApp.startPeriodicUpdates();
    }, 5000);
});

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add some global utility functions
window.utils = {
    // Debounce function for search inputs
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format date for Indian locale
    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },

    // Check if device is mobile
    isMobile: () => {
        return window.innerWidth <= 768;
    }
};