<template>
    <div class="auth-container">
        <form @submit.prevent="handleResetPassword" class="form-container" novalidate>
            <p class="text-sm text-gray-600 mb-4">Enter your new password below.</p>
            <div class="form-group">
                <input
                    type="password"
                    class="form-input"
                    placeholder="NEW PASSWORD"
                    v-model="resetForm.newPassword"
                    required
                />
                <div v-if="errors.newPassword" class="error-message">
                    <span>⚠️</span>
                    <span>{{ errors.newPassword }}</span>
                </div>
            </div>
            <div class="form-group">
                <input
                    type="password"
                    class="form-input"
                    placeholder="CONFIRM PASSWORD"
                    v-model="resetForm.confirmPassword"
                    required
                />
                <div v-if="errors.confirmPassword" class="error-message">
                    <span>⚠️</span>
                    <span>{{ errors.confirmPassword }}</span>
                </div>
            </div>
            
            <div v-if="errors.general" class="error-message mb-4">
                <span>⚠️</span>
                <span>{{ errors.general }}</span>
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
                {{ isLoading ? 'Resetting...' : 'Reset Password' }}
            </button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { useRoute } from 'vue-router';

export default {
    name: 'ResetPassword',
    setup() {
        const route = useRoute();
        return { route };
    },
    data() {
        return {
            isLoading: false,
            errors: {
                newPassword: '',
                confirmPassword: '',
                general: '' // Added for general server-side errors
            },
            resetForm: {
                newPassword: '',
                confirmPassword: '',
                token: null
            },
        };
    },
    mounted() {
        // Correctly get the query parameter from the URL
        const token = this.route.query.token;
        if (token) {
            this.resetForm.token = token;
        } else {
            // If no token is present, redirect to the sign-in page
            this.$router.push('/sign');
        }
    },
    methods: {
        ...mapActions(['resetPassword']),

        clearErrors() {
            this.errors = {
                newPassword: '',
                confirmPassword: '',
                general: '' // Reset all errors
            };
        },

        async handleResetPassword() {
            this.clearErrors();
            this.isLoading = true;

            let valid = true;
            if (!this.resetForm.newPassword) {
                this.errors.newPassword = 'New password is required.';
                valid = false;
            } else if (this.resetForm.newPassword.length < 8) {
                this.errors.newPassword = 'Password must be at least 8 characters.';
                valid = false;
            }

            if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
                this.errors.confirmPassword = 'Passwords do not match.';
                valid = false;
            }
            
            if (valid) {
                try {
                    const payload = {
                        token: this.resetForm.token,
                        newPassword: this.resetForm.newPassword
                    };
                    const message = await this.resetPassword(payload);
                    
                    // Display success message and redirect
                    alert(message + ' You can now log in with your new password.');
                } catch (e) {
                    console.error('Password reset failed:', e);
                    // Display server error message to the user
                    this.errors.general = e.response?.data?.message || 'Password reset failed. Please check your token or try again.';
                }
            }
            this.isLoading = false;
        },
    }
}
</script>

<style scoped>
/*
    The CSS is perfectly fine and requires no changes.
    It provides a clean, professional look for your form.
*/
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

.form-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 30px;
    padding: 50px 40px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15), 0 10px 40px rgba(139, 90, 60, 0.2);
    max-width: 500px;
    width: 100%;
    border: 2px solid rgba(222, 184, 135, 0.3);
    margin: 40px auto;
}

.form-group {
    margin-bottom: 25px;
}

.form-input {
    width: 100%;
    padding: 15px 20px;
    border: 2px solid rgba(139, 90, 60, 0.2);
    border-radius: 15px;
    font-size: 16px;
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

.submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #DEB887 0%, #CD853F 100%);
    color: #4A4A4A;
    padding: 16px 20px;
    border: none;
    border-radius: 50px;
    font-size: 16px;
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

@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
        gap: 15px;
    }
}
</style>