// StudyBuddy JavaScript - Main Application Logic

class StudyBuddy {
    constructor() {
        this.currentTheme = 'light';
        this.currentPage = 'dashboard';
        this.sidebarCollapsed = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.initializeSidebar();
        this.initializeNavigation();
        this.initializeAuth();
        this.initializeChat();
        this.initializeCalendar();
        this.initializeTaskBoard();
        this.initializeFileUpload();
        this.initializeSettings();
    }

    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem('studybuddy-theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('studybuddy-theme', theme);
        
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    // Sidebar Management
    initializeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.sidebarCollapsed = !this.sidebarCollapsed;
                sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
            });
        }
    }

    // Navigation Management
    initializeNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        const pages = document.querySelectorAll('.page');

        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = item.getAttribute('data-page');
                this.navigateToPage(targetPage);
            });
        });
    }

    navigateToPage(pageName) {
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        // Update active page
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageName).classList.add('active');

        this.currentPage = pageName;
    }

    // Authentication System
    initializeAuth() {
        const authModal = document.getElementById('authModal');
        const closeAuth = document.getElementById('closeAuth');
        const signupLink = document.getElementById('signupLink');
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');

        // Show auth modal (for demo purposes)
        setTimeout(() => {
            if (!localStorage.getItem('studybuddy-authenticated')) {
                this.showAuthModal();
            }
        }, 1000);

        if (closeAuth) {
            closeAuth.addEventListener('click', () => {
                this.hideAuthModal();
            });
        }

        if (signupLink) {
            signupLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignupForm();
            });
        }

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordForm();
            });
        }

        // Handle form submissions
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    showAuthModal() {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.style.display = 'flex';
            authModal.classList.add('show');
        }
    }

    hideAuthModal() {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.remove('show');
            setTimeout(() => {
                authModal.style.display = 'none';
            }, 300);
        }
    }

    showSignupForm() {
        const authContent = document.getElementById('authContent');
        const authTitle = document.getElementById('authTitle');
        
        authTitle.textContent = 'Join StudyBuddy';
        authContent.innerHTML = `
            <form class="auth-form" id="signupForm">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" required>
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" required>
                </div>
                <button type="submit" class="btn-primary">Create Account</button>
                <div class="auth-links">
                    <a href="#" id="loginLink">Already have an account? Sign in</a>
                </div>
            </form>
        `;

        // Add event listener for new form
        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        document.getElementById('loginLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
    }

    showForgotPasswordForm() {
        const authContent = document.getElementById('authContent');
        const authTitle = document.getElementById('authTitle');
        
        authTitle.textContent = 'Reset Password';
        authContent.innerHTML = `
            <form class="auth-form" id="forgotPasswordForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" required>
                </div>
                <button type="submit" class="btn-primary">Send Reset Link</button>
                <div class="auth-links">
                    <a href="#" id="backToLoginLink">Back to Sign In</a>
                </div>
            </form>
        `;

        document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        document.getElementById('backToLoginLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
    }

    showLoginForm() {
        const authContent = document.getElementById('authContent');
        const authTitle = document.getElementById('authTitle');
        
        authTitle.textContent = 'Welcome to StudyBuddy';
        authContent.innerHTML = `
            <form class="auth-form" id="loginForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" required>
                </div>
                <button type="submit" class="btn-primary">Sign In</button>
                <div class="auth-links">
                    <a href="#" id="forgotPasswordLink">Forgot Password?</a>
                    <a href="#" id="signupLink">Don't have an account? Sign up</a>
                </div>
            </form>
        `;

        // Re-initialize event listeners
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPasswordForm();
        });
        document.getElementById('signupLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSignupForm();
        });
    }

    handleLogin() {
        // Simulate login
        localStorage.setItem('studybuddy-authenticated', 'true');
        this.hideAuthModal();
        this.showNotification('Welcome back! 🌸', 'success');
    }

    handleSignup() {
        // Simulate signup
        localStorage.setItem('studybuddy-authenticated', 'true');
        this.hideAuthModal();
        this.showNotification('Account created successfully! 🎉', 'success');
    }

    handleForgotPassword() {
        this.showNotification('Password reset link sent to your email! 📧', 'info');
    }

    // Chat System
    initializeChat() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const chatMessages = document.getElementById('chatMessages');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Quick response buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.textContent;
                this.handleQuickAction(action);
            });
        });
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const chatMessages = document.getElementById('chatMessages');
        
        if (!messageInput.value.trim()) return;

        const userMessage = messageInput.value;
        this.addMessage(userMessage, 'user');
        messageInput.value = '';

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = this.generateAIResponse(userMessage);
            this.addMessage(aiResponse, 'ai');
        }, 1000);
    }

    addMessage(content, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
        const avatarColor = sender === 'user' ? 'var(--warm-pink)' : 'var(--soft-purple)';
        
        messageDiv.innerHTML = `
            <div class="message-avatar" style="background: ${avatarColor}">
                <i class="${avatar}"></i>
            </div>
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateAIResponse(userMessage) {
        const responses = [
            "That's a great question! Let me help you understand this concept better.",
            "I can see you're working hard on this topic. Here's what I think might help...",
            "Excellent! You're on the right track. Let me provide some additional insights.",
            "I understand your confusion. Let me break this down into simpler terms.",
            "That's a thoughtful approach! Here are some tips to make it even better."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    handleQuickAction(action) {
        const actions = {
            'Generate Notes': 'I\'ll help you create comprehensive notes on this topic. What subject are you studying?',
            'Create Quiz': 'Great! I can create a personalized quiz for you. Which chapter or topic would you like to focus on?',
            'Study Tips': 'Here are some effective study tips: 1) Use the Pomodoro Technique, 2) Create mind maps, 3) Practice active recall, 4) Take regular breaks!'
        };
        
        this.addMessage(actions[action] || 'I\'m here to help! What would you like to work on?', 'ai');
    }

    // Calendar System
    initializeCalendar() {
        this.currentDate = new Date();
        this.generateCalendar();
        
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.generateCalendar();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.generateCalendar();
            });
        }
    }

    generateCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonth = document.getElementById('currentMonth');
        
        if (!calendarGrid || !currentMonth) return;
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        currentMonth.textContent = this.currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Add calendar days
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            if (date.getMonth() === month) {
                dayElement.classList.add('current-month');
            }
            
            if (date.toDateString() === new Date().toDateString()) {
                dayElement.classList.add('today');
            }
            
            dayElement.textContent = date.getDate();
            calendarGrid.appendChild(dayElement);
        }
    }

    // Task Board System
    initializeTaskBoard() {
        // Add drag and drop functionality
        const taskCards = document.querySelectorAll('.task-card');
        taskCards.forEach(card => {
            card.draggable = true;
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', card.outerHTML);
            });
        });

        const taskLists = document.querySelectorAll('.task-list');
        taskLists.forEach(list => {
            list.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            list.addEventListener('drop', (e) => {
                e.preventDefault();
                const data = e.dataTransfer.getData('text/plain');
                const newCard = document.createElement('div');
                newCard.innerHTML = data;
                list.appendChild(newCard.firstElementChild);
            });
        });
    }

    // File Upload System
    initializeFileUpload() {
        const uploadZone = document.getElementById('uploadZone');
        
        if (uploadZone) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('drag-over');
            });
            
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('drag-over');
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('drag-over');
                this.handleFileUpload(e.dataTransfer.files);
            });
            
            uploadZone.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.addEventListener('change', (e) => {
                    this.handleFileUpload(e.target.files);
                });
                input.click();
            });
        }
    }

    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            this.showNotification(`File "${file.name}" uploaded successfully! ✨`, 'success');
            // Here you would typically upload the file to a server
        });
    }

    // Settings System
    initializeSettings() {
        // Color theme options
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                const color = option.getAttribute('data-color');
                this.updateThemeColor(color);
            });
        });

        // Toggle switches
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const setting = e.target.id;
                const value = e.target.checked;
                this.updateSetting(setting, value);
            });
        });
    }

    updateThemeColor(color) {
        // Update CSS custom properties based on selected color
        const root = document.documentElement;
        const colorMap = {
            pink: { primary: '#FDECEC', secondary: '#F4A6A6' },
            lavender: { primary: '#EDE9FE', secondary: '#B8A9E9' },
            cream: { primary: '#FFFCFA', secondary: '#C78B7B' }
        };
        
        if (colorMap[color]) {
            root.style.setProperty('--bg-secondary', colorMap[color].primary);
            root.style.setProperty('--rose-gold', colorMap[color].secondary);
        }
    }

    updateSetting(setting, value) {
        localStorage.setItem(`studybuddy-${setting}`, value);
        this.showNotification('Setting updated! ⚙️', 'info');
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // View toggles
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Quick access tiles
        document.querySelectorAll('.access-tile').forEach(tile => {
            tile.addEventListener('click', () => {
                const action = tile.querySelector('span').textContent;
                this.handleQuickAccess(action);
            });
        });
    }

    handleQuickAccess(action) {
        const actions = {
            'Continue Study Session': () => this.navigateToPage('ai-assistant'),
            'Ask AI': () => this.navigateToPage('ai-assistant'),
            'Check Reminders': () => this.navigateToPage('study-planner')
        };
        
        if (actions[action]) {
            actions[action]();
        }
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudyBuddy();
});

// Add notification styles
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    background: linear-gradient(135deg, #4CAF50, #45a049);
}

.notification-info {
    background: linear-gradient(135deg, #2196F3, #1976D2);
}

.notification-error {
    background: linear-gradient(135deg, #f44336, #d32f2f);
}
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
