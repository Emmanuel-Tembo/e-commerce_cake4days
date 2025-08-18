<template>
    <div class="main-content">
        <div class="auth-container">
            <div class="auth-header">
                <div class="auth-tabs">
                    <button
                        class="auth-tab"
                        :class="{ active: activeTab === 'login' }"
                        @click="setActiveTab('login')"
                        type="button"
                    >
                        ADMIN LOGIN
                    </button>
                </div>
            </div>

            <div v-if="errorMessage" class="error-message-box mb-4">
                {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="success-message-box mb-4">
                {{ successMessage }}
            </div>

            <form v-if="activeTab === 'login'" @submit.prevent="handleSubmit" class="form-container" novalidate>
                <div class="form-group">
                    <input
                        type="email"
                        class="form-input"
                        placeholder="EMAIL"
                        v-model.trim="loginForm.email"
                        required
                    />
                    <div v-if="errors.login.email" class="error-message">
                        <span>⚠️</span>
                        <span>{{ errors.login.email }}</span>
                    </div>
                </div>

                <div class="form-group">
                    <input
                        type="password"
                        class="form-input"
                        placeholder="PASSWORD"
                        v-model="loginForm.password"
                        required
                    />
                    <div v-if="errors.login.password" class="error-message">
                        <span>⚠️</span>
                        <span>{{ errors.login.password }}</span>
                    </div>
                </div>

                <div class="forgot-password">
                    <a href="#forgot" @click.prevent="setActiveTab('forgot')">Forgot your password?</a>
                </div>

                <button type="submit" class="submit-btn" :disabled="isLoading">
                    {{ isLoading ? 'Logging in...' : 'Log In' }}
                </button>
            </form>

            <form v-if="activeTab === 'forgot'" @submit.prevent="handleForgotPassword" class="form-container" novalidate>
                <p class="text-sm text-gray-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
                <div class="form-group">
                    <input
                        type="email"
                        class="form-input"
                        placeholder="EMAIL"
                        v-model.trim="forgotForm.email"
                        required
                    />
                    <div v-if="errors.forgot.email" class="error-message">
                        <span>⚠️</span>
                        <span>{{ errors.forgot.email }}</span>
                    </div>
                </div>
                <button type="submit" class="submit-btn" :disabled="isLoading">
                    {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
                </button>
                <div class="text-center mt-4">
                    <a href="#" @click.prevent="setActiveTab('login')" class="text-sm text-blue-500 hover:underline">Back to Login</a>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    name: 'AdminLogin',
    setup() {
        const router = useRouter();
        return { router };
    },
    data() {
        return {
            activeTab: 'login',
            loginForm: {
                email: '',
                password: ''
            },
            forgotForm: {
                email: ''
            },
            errors: {
                login: {},
                forgot: {},
            },
            isLoading: false,
            errorMessage: null,
            successMessage: null, // NEW: for success messages like "email sent"
        };
    },
    
    methods: {
        ...mapActions(['loginAdmin', 'forgotPassword']),

        validateEmail(email) {
            if (typeof email !== 'string') {
                return false;
            }
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email.trim());
        },

        setActiveTab(tab) {
            this.activeTab = tab;
            this.clearMessages();
        },

        clearMessages() {
            this.errors.login = {};
            this.errors.forgot = {};
            this.errorMessage = null;
            this.successMessage = null;
        },

        async handleSubmit() {
            this.clearMessages();
            this.isLoading = true;

            let valid = true;
            if (!this.loginForm.email) {
                this.errors.login.email = 'Email is required.';
                valid = false;
            } else if (!this.validateEmail(this.loginForm.email)) {
                this.errors.login.email = 'Email is invalid.';
                valid = false;
            }
            if (!this.loginForm.password) {
                this.errors.login.password = 'Password is required.';
                valid = false;
            }

            if (valid) {
        try {
            // Assuming your loginAdmin action returns the token
            const response = await this.loginAdmin(this.loginForm);
            
            // Save the token to localStorage
            localStorage.setItem('adminToken', response.token); 

            // Redirect to the dashboard without a query parameter
            this.router.push('/admin/dashboard');
        } catch (e) {
            this.errorMessage = e.response?.data?.message || 'Login failed. Please check your credentials.';
        }
    }
        this.isLoading = false;
        },

        async handleForgotPassword() {
            this.clearMessages();
            this.isLoading = true;

            if (!this.forgotForm.email || !this.validateEmail(this.forgotForm.email)) {
                this.errors.forgot.email = 'Please enter a valid email address.';
                this.isLoading = false;
                return;
            }

            try {
                // The forgotPassword action returns the success message
                const message = await this.forgotPassword(this.forgotForm.email);
                this.successMessage = message; // Store the success message
                this.forgotForm.email = ''; // Clear the input field
            } catch (e) {
                // This catch block will only be reached if the API call fails
                this.errorMessage = e.response?.data?.message || 'An unexpected error occurred. Please try again.';
            } finally {
                this.isLoading = false;
            }
        },
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.main-content {
    min-height: 100vh;
    background:
        linear-gradient(rgba(139, 90, 60, 0.1), rgba(205, 133, 63, 0.1)),
        url('https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1920&h=1080&fit=crop') center/cover no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    font-family: 'Poppins', sans-serif;
}

.error-message-box {
    background-color: #fef2f2;
    color: #ef4444;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #fca5a5;
    margin-bottom: 1rem;
}
.success-message-box {
    background-color: #ecfdf5;
    color: #10b981;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #6ee7b7;
    margin-bottom: 1rem;
}

.auth-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 30px;
    padding: 50px 40px;
    box-shadow:
        0 30px 80px rgba(0, 0, 0, 0.15),
        0 10px 40px rgba(139, 90, 60, 0.2);
    max-width: 500px;
    width: 100%;
    border: 2px solid rgba(222, 184, 135, 0.3);
    position: relative;
    overflow: hidden;
}

.auth-container::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(222, 184, 135, 0.05) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
    pointer-events: none;
    z-index: 0;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.auth-header {
    text-align: center;
    margin-bottom: 40px;
    position: relative;
    z-index: 2;
}

.auth-tabs {
    display: flex;
    background: rgba(249, 214, 213, 0.3);
    border-radius: 50px;
    padding: 6px;
    margin-bottom: 30px;
}

.auth-tab {
    flex: 1;
    padding: 12px 20px;
    text-align: center;
    border-radius: 50px;
    background: transparent;
    border: none;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: #8B5A3C;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
}

.auth-tab.active {
    background: linear-gradient(135deg, #8B5A3C, #A0522D);
    color: white;
    box-shadow: 0 8px 25px rgba(139, 90, 60, 0.3);
}

.form-container {
    position: relative;
    z-index: 2;
}

.form-group {
    margin-bottom: 25px;
}

.form-row {
    display: flex;
    gap: 15px;
}

.form-row .form-group {
    flex: 1;
}

.form-input {
    width: 100%;
    padding: 15px 20px;
    border: 2px solid rgba(139, 90, 60, 0.2);
    border-radius: 15px;
    font-size: 16px;
    font-family: 'Poppins', sans-serif;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
    color: #4A4A4A;
}

.form-input:focus {
    outline: none;
    border-color: #8B5A3C;
    background: white;
    box-shadow: 0 0 20px rgba(139, 90, 60, 0.1);
    transform: translateY(-2px);
}

.form-input::placeholder {
    color: #999;
    font-style: italic;
}

.error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    color: #E74C3C;
    font-size: 14px;
    background: rgba(231, 76, 60, 0.1);
    padding: 8px 12px;
    border-radius: 8px;
    border-left: 4px solid #E74C3C;
}

.forgot-password {
    text-align: right;
    margin-bottom: 25px;
}

.forgot-password a {
    color: #8B5A3C;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s ease;
    cursor: pointer;
}

.forgot-password a:hover {
    color: #A0522D;
    text-decoration: underline;
}

.submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #DEB887 0%, #CD853F 100%);
    color: #4A4A4A;
    padding: 16px 20px;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 15px 40px rgba(222, 184, 135, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;
}

.submit-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
    z-index: 1;
}

.submit-btn:hover::before {
    left: 100%;
}

.submit-btn:hover {
    background: linear-gradient(135deg, #F5DEB3 0%, #DEB887 100%);
    transform: translateY(-3px);
    box-shadow: 0 20px 50px rgba(222, 184, 135, 0.5);
}

.divider {
    text-align: center;
    margin: 30px 0;
    position: relative;
    color: #8B5A3C;
    font-weight: 500;
    user-select: none;
}

.divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(139, 90, 60, 0.3), transparent);
}

.divider span {
    background: rgba(255, 255, 255, 0.9);
    padding: 0 20px;
    position: relative;
}

.social-login {
    display: flex;
    gap: 15px;
}

.social-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 20px;
    border: 2px solid rgba(139, 90, 60, 0.2);
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.8);
    color: #4A4A4A;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
    user-select: none;
}

.social-btn:hover {
    border-color: #8B5A3C;
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 90, 60, 0.15);
}

.social-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    user-select: none;
}

.google {
    background: #DB4437;
}

.facebook {
    background: #4267B2;
}

/* Responsive Design */
@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
        gap: 15px;
    }

    .social-login {
        flex-direction: column;
    }
}
</style>
