<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div class="container mx-auto px-6 py-3 flex justify-between items-center">
        <h1 class="text-xl font-bold tracking-wide">Ze biblihothéque</h1>

        <div class="hidden md:flex gap-6">
            <NuxtLink to="/" class="block px-3 py-2 rounded-lg hover:bg-white/20 transition">
              Livres
            </NuxtLink>
            <NuxtLink to="/authors" class="block px-3 py-2 rounded-lg hover:bg-white/20 transition">
              Auteurs
            </NuxtLink>
            <NuxtLink to="/categories" class="block px-3 py-2 rounded-lg hover:bg-white/20 transition">
              Catégories
            </NuxtLink>
            <NuxtLink v-if="!authToken" to="/login" class="block px-3 py-2 rounded-lg hover:bg-white/20 transition">
              Connexion
            </NuxtLink>
            <NuxtLink v-else @click="disconnect()" class="block px-3 py-2 rounded-lg hover:bg-white/20 transition">
              déconnexion
            </NuxtLink>
        </div>

        <button
            class="md:hidden p-2 rounded-lg hover:bg-white/20 transition"
            @click="isMenuOpen = !isMenuOpen"
        >
          <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
          v-if="isMenuOpen"
          class="md:hidden bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pb-4 space-y-2"
      >
        <NuxtLink to="/" class="block px-3 py-2 rounded-lg hover:bg-white/20 transition">
          Livres
        </NuxtLink>
        <NuxtLink to="/authors" class="block px-3 py-2 rounded-lg hover:bg-white/20 transition">
          Auteurs
        </NuxtLink>
        <NuxtLink to="/categories" class="block px-3 py-2 rounded-lg hover:bg-white/20 transition">
          Catégories
        </NuxtLink>
        <NuxtLink v-if="!authToken" to="/login" class="block px-3 py-2 rounded-lg hover:bg-white/20 transition">
          connexion
        </NuxtLink>
        <p @click="disconnect()" v-else class="block px-3 py-2 rounded-lg hover:bg-white/20 transition">
          déconnexion
        </p>
      </div>
    </nav>

    <!-- Page content -->
    <main class="pt-20 container mx-auto px-6">
      <NuxtRouteAnnouncer/>
      <NuxtPage/>
    </main>
  </div>
</template>

<script setup lang="ts">
  import {ref} from 'vue'
  import {useAuthStore} from "~/stores/auth";

  const isMenuOpen = ref(false)

  const storeToken= useAuthStore()
  const authToken = computed(() => storeToken.isAuthenticated)

  function disconnect() {
    storeToken.clearToken()
  }
</script>

<style>
@import "tailwindcss";
</style>
