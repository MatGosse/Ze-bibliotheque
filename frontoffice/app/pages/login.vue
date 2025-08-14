<script lang="ts">
  import {LoginService} from "~/services/login.service";
  import {User} from "~/entities/User";

  export default {
    setup() {
      const loginService = new LoginService();

      const isLoginMode = ref(true);
      const form = reactive({
        email: '',
        password: '',
      });

      const toggleMode = () => {
        isLoginMode.value = !isLoginMode.value;
      };

      const handleSubmit = () => {
        const user = new User({...form});
        if (isLoginMode.value) {
          loginService.login(user);
        } else {
          loginService.register(user)
          isLoginMode.value = true;
        }
      };

      return  {
        isLoginMode,
        form,
        toggleMode,
        handleSubmit
      }
    }
  }




</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ isLoginMode ? 'Connectez-vous à votre compte' : 'Créez un nouveau compte' }}
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Adresse email</label>
            <div class="mt-1">
              <input
                  id="email"
                  v-model="form.email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div class="mt-1">
              <input
                  id="password"
                  v-model="form.password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <div>
            <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {{ isLoginMode ? 'Se connecter' : 'S\'inscrire' }}
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <button
              class="font-medium text-indigo-600 hover:text-indigo-500"
              @click="toggleMode"
          >
            {{ isLoginMode ? 'Pas de compte ? Créez-en un' : 'Déjà un compte ? Connectez-vous' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>