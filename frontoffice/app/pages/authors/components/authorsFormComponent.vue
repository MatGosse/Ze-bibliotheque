<script lang="ts">
import { ApiService } from "~/services/api.service";
import { Books } from "~/entities/Books";
import { Authors } from "~/entities/Authors";
import { computed, ref } from "vue";

export default defineComponent({
  props: {
    isEditMode: {
      type: Boolean,
      default: false
    },
    authorId: {
      type: Number,
      required: false
    },
  },
  setup(props) {
    const authToken = useCookie('auth_token').value;
    const isDisabled = computed(() => !authToken);
    const router = useRouter();

    const apiService = new ApiService(authToken || '');
    const toast = useToast();

    const books = ref<Books[]>([]);
    const currentPage = ref(1);
    const totalBooks = ref(0);
    const itemsPerPage = 10; // Nombre d'éléments par page

    const author = reactive<Partial<Authors>>({
      name: '',
    });

    async function fetchAuthor(id: number) {
      const authorData = await apiService.get(Authors, id);
      author.name = authorData.name;
    }

    async function fetchBooks(page = 1) {
      const response = await apiService.getAll(Books, page, {
        author: props.authorId || 1,
        perPage: itemsPerPage
      });
      books.value = response.member;
      totalBooks.value = response.totalItems;
      currentPage.value = page;
    }

    const totalPages = computed(() => {
      return Math.ceil(totalBooks.value / itemsPerPage);
    });

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        fetchBooks(page);
      }
    };

    const submit = () => {
      if (props.isEditMode && props.authorId) {
        apiService.patch(Authors, props.authorId, toRaw(author));
        toast.success({ title: 'Auteur Modifié', message: `Votre auteur a été modifié avec succès` });
      } else {
        apiService.post(Authors, toRaw(author)).then(async (author) => {
          toast.success({
            title: 'Auteur créé',
            message: `Le nouvel auteur a été créé avec l'identifiant ${author.id}`
          });
          await navigateTo(`/authors/${author.id}`);
        });
      }
    };

    const deleteAuthor = () => {
      if (props.isEditMode && props.authorId) {
        apiService.delete(Authors, props.authorId).then(async () => {
          toast.success({ title: 'Auteur supprimé', message: 'L\'auteur a été supprimé avec succès' });
          await router.push('/');
        });
      }
    };

    onMounted(async () => {
      if (props.authorId) {
        await fetchBooks(1);
        if (props.isEditMode) {
          await fetchAuthor(props.authorId);
        }
      }
    });

    return {
      author,
      books,
      submit,
      deleteAuthor,
      isDisabled,
      currentPage,
      totalPages,
      goToPage
    };
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
      <!-- Titre -->
      <h1 v-if="!isDisabled" class="text-2xl font-bold text-gray-800 mb-6 text-center">
        {{ isEditMode ? 'Modifier un auteur' : 'Créer un nouvel auteur' }}
      </h1>
      <h1 v-else class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Informations sur l'auteur
      </h1>
      <form @submit.prevent="submit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nom de l'auteur</label>
          <input
              v-model="author.name"
              type="text"
              id="name"
              required
              :disabled="isDisabled"
              class="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <template v-if="isEditMode">
          <div v-if="books.length" class="mb-6">
            <h2 class="text-lg font-semibold mb-2">Livres :</h2>
            <ul class="list-disc list-inside text-gray-700">
              <li v-for="(book, index) in books" :key="book.id" class="py-1">
                {{ book.name }}

              </li>
            </ul>
            <div class="mt-4 flex justify-between items-center">
              <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <span class="text-gray-700">Page {{ currentPage }} / {{ totalPages }}</span>
              <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
          <div v-else class="mb-6 text-gray-500 text-center">
            Aucun livre trouvé pour cet auteur.
          </div>
        </template>


        <div class="flex justify-between items-center pt-4">
          <button
              type="button"
              class="inline-flex justify-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click="$router.push('/authors')"
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