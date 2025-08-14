import {defineStore} from 'pinia'
import {useCookie} from '#app'

export const useAuthStore = defineStore('auth', () => {
    const authToken = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 1 semaine en secondes
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    })

    const isAuthenticated = computed(() => !!authToken.value)

    const setToken = (token: string) => {
    console.log('kebab');
        authToken.value = token
    }

    const clearToken = () => {
        console.log('kebab 2');
        authToken.value = null
    }

    return {
        authToken: readonly(authToken), // Expose en lecture seule
        isAuthenticated,
        setToken,
        clearToken
    }
})