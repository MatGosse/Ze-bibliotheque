<script lang="ts">
import { ApiService } from "~/services/api.service";
import { computed } from "vue";
import { Categories } from "~/entities/Categories";
import {useAuthStore} from "~/stores/auth";

export default defineComponent({
  props: {
    isEditMode: {
      type: Boolean,
      default: false
    },
    categoryId: {
      type: Number,
      required: false
    },
  },
  setup(props) {
    const storeToken= useAuthStore()
    const authToken = computed(() => storeToken.isAuthenticated)

    const isDisabled = computed(() => !authToken.value);
    const router = useRouter();

    const apiService = new ApiService(storeToken.authToken || '');
    const toast = useToast();

    const category = reactive<Partial<Categories>>({
      name: '',
    });

    function fetchCategory(id: number) {
      apiService.get(Categories, id).then(authorData=>{
        category.name = authorData.name;
      }).catch(async ()=>{
        await router.push('/categories')
      });
    }


    const submit = () => {
      if (props.isEditMode && props.categoryId) {
        apiService.patch(Categories, props.categoryId, toRaw(category));
        toast.success({ title: 'Auteur Modifié', message: `Votre auteur a été modifié avec succès` });
      } else {
        apiService.post(Categories, toRaw(category)).then(async (category) => {
          toast.success({
            title: 'Catégorie créé',
            message: `La nouvelle catégorie a été créé avec l'identifiant ${category.id}`
          });
          await navigateTo(`/categories/${category.id}`);
        });
      }
    };

    const deleteCategory = () => {
      if (props.isEditMode && props.categoryId) {
        apiService.delete(Categories, props.categoryId).then(async () => {
          toast.success({ title: 'Categorie supprimée', message: 'la catégorie a été supprimé avec succès' });
          await router.push('/');
        });
      }
    };

    onMounted(async () => {
      if (props.categoryId) {
        if (props.isEditMode) {
          await fetchCategory(props.categoryId);
        }
      }
    });

    return {
      category,
      submit,
      deleteAuthor: deleteCategory,
      isDisabled,
    };
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
      <!-- Titre -->
      <h1 v-if="!isDisabled" class="text-2xl font-bold text-gray-800 mb-6 text-center">
        {{ isEditMode ? 'Modifier une catégorie' : 'Créer une nouvelle catégorie' }}
      </h1>
      <h1 v-else class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Informations sur la catégorie
      </h1>
      <form @submit.prevent="submit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nom de la catégorie</label>
          <input
              v-model="category.name"
              type="text"
              id="name"
              required
              :disabled="isDisabled"
              class="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="flex justify-between items-center pt-4">
          <button
              type="button"
              class="inline-flex justify-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click="$router.push('/categories')"
          >
            Retour à liste
          </button>

          <div class="flex space-x-2" v-if="!isDisabled">
            <button
                v-if="isEditMode"
                type="button"
                @click="deleteAuthor()"
                class="inline-flex justify-center rounded-lg border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Supprimer
            </button>
            <button
                type="submit"
                class="inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {{ isEditMode ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>