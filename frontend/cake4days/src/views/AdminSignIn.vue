<template>
    <div class="main-content">
        <div class="auth-container">
            <div class="auth-header">
                        <div class="auth-tabs">
                <!-- <button
                    class="auth-tab"
                    :class="{ active: activeTab === 'signup' }"
                    @click="activeTab = 'signup'"
                    type="button"
                >
                    SIGN UP
                </button> -->
                <button
                    class="auth-tab"
                    :class="{ active: activeTab === 'login' }"
                    @click="activeTab = 'login'"
                    type="button"
                >
                    LOG IN
                </button>
                </div>
            </div>

            <div v-if="errorMessage" class="error-message-box">
                {{ errorMessage }}
            </div>

            <!-- <form
        v-if="activeTab === 'signup'"
        @submit.prevent="handleSubmit('signup')"
        class="form-container"
        novalidate
      >
        <div class="form-row">
          <div class="form-group">
            <input
              type="text"
              class="form-input"
              placeholder="Full Name"
              v-model.trim="signup.username"
              required
            />
            <div v-if="errors.signup.username" class="error-message">
              <span>⚠️</span>
              <span>{{ errors.signup.username }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <input
            type="email"
            class="form-input"
            placeholder="EMAIL"
            v-model.trim="signup.email"
            required
          />
          <div v-if="errors.signup.email" class="error-message">
            <span>⚠️</span>
            <span>{{ errors.signup.email }}</span>
          </div>
        </div>

        <div class="form-group">
          <input
            type="password"
            class="form-input"
            placeholder="PASSWORD"
            v-model="signup.password"
            required
          />
          <div v-if="errors.signup.password" class="error-message">
            <span>⚠️</span>
            <span>{{ errors.signup.password }}</span>
          </div>
        </div>

        <div class="form-group">
          <input
            type="password"
            class="form-input"
            placeholder="CONFIRM PASSWORD"
            v-model="signup.confirmPassword"
            required
          />
          <div v-if="errors.signup.confirmPassword" class="error-message">
            <span>⚠️</span>
            <span>{{ errors.signup.confirmPassword }}</span>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Creating...' : 'Create Account' }}
        </button>
      </form> -->

            <!-- Login Form -->
            <form v-else @submit.prevent="handleSubmit('login')" class="form-container" novalidate>
                <div class="form-group">
                    <input type="email" class="form-input" placeholder="EMAIL" v-model.trim="loginForm.email"
                        required />
                    <div v-if="errors.login.email" class="error-message">
                        <span>⚠️</span>
                        <span>{{ errors.login.email }}</span>
                    </div>
                </div>

                <div class="form-group">
                    <input type="password" class="form-input" placeholder="PASSWORD" v-model="loginForm.password"
                        required />
                    <div v-if="errors.login.password" class="error-message">
                        <span>⚠️</span>
                        <span>{{ errors.login.password }}</span>
                    </div>
                </div>

                <div class="forgot-password">
                    <a href="#forgot" @click.prevent="forgotPassword">Forgot your password?</a>
                </div>

                <button type="submit" class="submit-btn" :disabled="isLoading">
                    {{ isLoading ? 'Logging in...' : 'Log In' }}
                </button>
            </form>

            <div class="divider">
                <span>OR LOG IN WITH</span>
            </div>

            <div class="social-login">
                <button class="social-btn" @click="socialLogin('google')" type="button">
                    <div class="social-icon google">G</div>
                    <span>Google</span>
                </button>
                <button class="social-btn" @click="socialLogin('facebook')" type="button">
                    <div class="social-icon facebook">f</div>
                    <span>Facebook</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    name: 'AuthPage',
    setup() {
        const router = useRouter();
        return { router };
    },
    data() {
        return {
            activeTab: 'login',
            //   signup: {
            //     username: '',
            //     email: '',
            //     password: '',
            //     confirmPassword: ''
            //   },
            loginForm: {
                email: '',
                password: ''
            },
            errors: {
                signup: {},
                login: {}
            },
            isLoading: false,
            errorMessage: null,
            isAdminLogin: false,
        };
    },
    methods: {
        ...mapActions(['login']),

        validateEmail(email) {
            if (typeof email !== 'string') {
                return false;
            }
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email.trim());
        },

        clearErrors() {
            this.errors.signup = {};
            this.errors.login = {};
            this.errorMessage = null;
        },

        async handleSubmit(formType) {
            this.clearErrors();
            this.isLoading = true;

            let valid = true;
            if (formType === 'loginForm') {
                //     // Validation logic for signup form
                //     if (!this.signup.username) {
                //         this.errors.signup.username = 'Username is required.';
                //         valid = false;
                //     }
                //     if (!this.signup.email) {
                //         this.errors.signup.email = 'Email is required.';
                //         valid = false;
                //     } else if (!this.validateEmail(this.signup.email)) {
                //         this.errors.signup.email = 'Email is invalid.';
                //         valid = false;
                //     }
                //     if (!this.signup.password) {
                //         this.errors.signup.password = 'Password is required.';
                //         valid = false;
                //     }
                //     if (!this.signup.confirmPassword) {
                //         this.errors.signup.confirmPassword = 'Please confirm your password.';
                //         valid = false;
                //     } else if (this.signup.password !== this.signup.confirmPassword) {
                //         this.errors.signup.confirmPassword = 'Passwords do not match.';
                //         valid = false;
                //     }

                //     if (valid) {
                //       try {
                //         await this.register({
                //             username: this.signup.username,
                //             email: this.signup.email,
                //             password: this.signup.password,
                //         });
                //         this.errorMessage = 'Account created successfully! Please log in.';
                //         this.activeTab = 'login';
                //         // Reset form
                //         this.signup.username = '';
                //         this.signup.email = '';
                //         this.signup.password = '';
                //         this.signup.confirmPassword = '';
                //       } catch (e) {
                //         this.errorMessage = e.response?.data?.message || 'Failed to create account.';
                //       }
                //     }
                //   } else {

                // Validation logic for login form
                if (!this.loginForm.email) {
                    this.errors.login.email = 'Email is required.';
                    valid = false;
                } else if (!this.validateEmail(this.loginForm.email)) {
                    this.errors.login.email = 'Email is invalid.';
                    valid = false;
                    // Add this line to see the email being validated
                    console.log('Email to validate:', `"${this.loginForm.email}"`);
                }
                if (!this.loginForm.password) {
                    this.errors.login.password = 'Password is required.';
                    valid = false;
                }

                if (valid) {
                    try {
                        await this.login(this.loginForm);
                        this.router.push('/Users');
                    } catch (e) {
                        this.errorMessage = e.response?.data?.message || 'Login failed. Please check your credentials.';
                    }
                }
            }
            this.isLoading = false;
        },

        forgotPassword() {
            this.errorMessage = 'Password recovery not yet implemented.';
        },

        socialLogin(provider) {
            this.errorMessage = `Social login with ${provider} not yet implemented.`;
        }
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
