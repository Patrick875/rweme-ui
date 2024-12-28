<template>
    <div class="otp-confirm-container">
        <div class="otp-confirm-header">
            <p class="otp-header">Verification Code</p>
            <p class="otp-description">
                To confirm farmer agreement, input the verification code sent to the
                farmer's mobile number
            </p>
            <div class="otp-input-group">
                <input v-for="(_, index) in 6" :key="index" :ref="el => setInputRef(el, index)"
                    v-model="otpModel[`value${index + 1}`]" type="text" maxlength="1" pattern="\d*" inputmode="numeric"
                    @input="handleInput(index)" @keydown="handleKeyDown(index)" class="otp-input" />
            </div>
            <a-button class="submit-btn" @click="submitOtp" :loading="loading" :disabled="!isOtpComplete">
                SUBMIT
            </a-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import instance from "../api";
import { notify } from '../utils/notify';

// OTP Model Interface
interface OtpModel {
    value1: string | null
    value2: string | null
    value3: string | null
    value4: string | null
    value5: string | null
    value6: string | null
}

const props = defineProps({
    cancelButton: {
        type: Function,
        default: () => { }
    },
    next: {
        type: Function,
        default: () => { }
    }
})
const otpModel = reactive<OtpModel>({
    value1: null,
    value2: null,
    value3: null,
    value4: null,
    value5: null,
    value6: null
})


const loading = ref<boolean>(false)

// Refs for input elements
const inputRefs = ref<(HTMLInputElement | null)[]>([])

// Set input refs
const setInputRef = (el: HTMLInputElement | null, index: number) => {
    inputRefs.value[index] = el
}

// Computed property to check if OTP is complete
const isOtpComplete = computed(() => {
    return Object.values(otpModel).every(value => value !== null && value !== '')
})

// Handle input change
const handleInput = (index: number) => {
    const currentKey = `value${index + 1}` as keyof OtpModel
    const currentValue = otpModel[currentKey]

    // Validate numeric input
    if (currentValue && !/^\d$/.test(currentValue)) {
        otpModel[currentKey] = null
        return
    }

    // Move to next input if current input is filled
    if (currentValue && index < 5) {
        inputRefs.value[index + 1]?.focus()
    }
}

// Handle keydown (especially backspace)
const handleKeyDown = (index: number) => {
    const event = window.event as KeyboardEvent
    const currentKey = `value${index + 1}` as keyof OtpModel

    // Move to previous input on backspace if current input is empty
    if (event.key === 'Backspace' && !otpModel[currentKey] && index > 0) {
        inputRefs.value[index - 1]?.focus()
    }
}

// Submit OTP
const submitOtp = async () => {
    loading.value = true
    const otpCode = Object.values(otpModel)
        .map(value => value || '')
        .join('')
    if (otpCode.length === 6 && /^\d{6}$/.test(otpCode)) {
        try {
            const response = await instance.post('/farmers/otpconfirm', { otp: otpCode })
            notify('success', 'Success', response.data.message)
            setTimeout(() => {
                props.cancelButton()
                props.next()
            }, 3500)

        } catch (error) {
            console.error('OTP Confirmation Failed:', error)
            notify('error', 'OTP Confirmation Failed', '')
            setTimeout(() => {
                props.cancelButton()
            }, 3500)
        } finally {

        }
    } else {
        console.error('Invalid OTP')
    }
    loading.value = false
}


</script>

<style lang="scss" scoped>
.otp-confirm-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
}

.otp-confirm-header {
    text-align: center;
    width: 100%;

    .otp-header {
        font-weight: bold;
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
    }

    .otp-description {
        color: #666;
        margin-bottom: 1rem;
    }
}

.otp-input-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 1rem;
}

.otp-input {
    width: 32px;
    height: 32px;
    text-align: center;
    border: none;
    border-bottom: 1.5px solid #d2d2d2;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-bottom-color: #007bff;
    }
}

.submit-btn {
    width: 100%;
    height: 34px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background-color: #0056b3;
        color: white;
    }
}
</style>