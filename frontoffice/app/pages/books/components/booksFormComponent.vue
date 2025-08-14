<script lang="ts">
import {ApiService} from "~/services/api.service";
import {Books} from "~/entities/Books";
import {Categories} from "~/entities/Categories";
import {Authors} from "~/entities/Authors";

export default defineComponent({
  props: {
    isEditMode: {
      type: Boolean,
      default: false
    },
    bookId: {
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

    const authors = ref<Authors[]>([]);
    const categories = ref<Categories[]>([]);

    const book = reactive<Partial<Books>>({
      name: '',
      author: '',
      categories: [] as string[]
    });

    async function fetchBook(id: number) {
      const bookData = (await apiService.get(Books, id));
      book.name = bookData.name;
      book.author = (bookData.author as Authors)["@id"];
      book.categories = (bookData.categories as Categories[]).map(category => (category['@id'] as string)) || [];
    }

    async function fetchAuthors() {
      authors.value = (await apiService.getAll(Authors)).member;
    }

    async function fetchCategories() {
      categories.value = (await apiService.getAll(Categories)).member;
    }

    const submit = () => {
      if (props.isEditMode && props.bookId) {
        apiService.patch(Books, props.bookId, toRaw(book));
        toast.success({
          title: 'Livre Modifié',
          message: `Votre livre a été modifié avec succès`
        });
      } else {
        apiService.post(Books, toRaw(book)).then(async (book) => {
          toast.success({
            title: 'Livre créé',
            message: `Le nouveau livre a été créé avec l'identifiant ${book.id}`
          });
          await navigateTo(`/books/${book.id}`);
        });
      }
    };

    const deleteBook =  () => {
      if (props.isEditMode && props.bookId) {
        apiService.delete(Books, props.bookId).then(async ()=>{
            toast.success({
              title: 'Livre supprimé',
              message: 'Le livre a été supprimé avec succès'
            });
            await router.push('/');
        });
      }
    };

    onMounted(async () => {
      await fetchAuthors();
      await fetchCategories();
      if (props.isEditMode && props.bookId) {
        await fetchBook(props.bookId);
      }
    });

    return {
      book,
      authors,
      categories,
      submit,
      deleteBook,
      isDisabled
    };
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
      <h1 v-if="!isDisabled" class="text-2xl font-bold text-gray-800 mb-6 text-center">
        {{ isEditMode ? 'Modifier un livre' : 'Créer un nouveau livre' }}
      </h1>
      <h1 v-else class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Informations sur votre livre
      </h1>

      <form @submit.prevent="submit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nom du livre</label>
          <input
              v-model="book.name"
              type="text"
              id="name"
              required
              :disabled="isDisabled"
              class="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="author" class="block text-sm font-medium text-gray-700">Auteur</label>
          <select
              v-model="book.author"
              id="author"
              required
              :disabled="isDisabled"
              class="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          >
            <option v-if="!isDisabled" value="">Sélectionnez un auteur</option>
            <template v-for="author in authors" :key="author['@id']">
              <option v-if="!isDisabled || book.author === author['@id']" :value="author['@id']">
                {{ author.name }}
              </option>
            </template>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Catégories</label>
          <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <template v-for="category in categories" :key="category['@id']">
              <div v-if="!isDisabled || book.categories.includes(category['@id'])" class="flex items-center bg-gray-50 rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <input
                    :id="`category-${category.id}`"
                    v-model="book.categories"
                    type="checkbox"
                    :value="category['@id']"
                    :disabled="isDisabled"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label :for="`category-${category.id}`" class="ml-3 text-sm text-gray-700">
                  {{ category.name }}
                </label>
              </div>
            </template>
          </div>
        </div>

        <div class="flex justify-between items-center pt-4">
          <button
              type="button"
              class="inline-flex justify-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click="$router.push('/')"
          >
            Retour à l'accueil
          </button>

          <div class="flex space-x-2" v-if="!isDisabled">
            <button
                v-if="isEditMode"
                type="button"
                @click="deleteBook"
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