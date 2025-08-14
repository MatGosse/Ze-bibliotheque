<script lang="ts">
import type {AbstractEntity} from "~/entities/AbstractEntity";
import {onMounted, ref, computed} from "vue";
import {ApiService} from "~/services/api.service";
import type {Books} from "~/entities/Books";

export default {
  props: {
    listName: {
      type: String,
      required: true,
    },
    resource: {
      type: [Function, Object] as PropType<new () => AbstractEntity>,
      required: true,
    },
    bind: {
      type: Object as PropType<{ title: string; author: string; year: string; category: string }>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()

    const items = ref<AbstractEntity[]>([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const totalItems = ref(0);
    const searchQuery = ref('');
    const apiService = new ApiService();

    const fetchItems = async (page: number, query: string = '') => {
      if (query === "") {
       const response = await apiService.getAll(props.resource, page);
        items.value = response.member;
        totalItems.value = response.totalItems || 0;
        return
      }
      const response = await apiService.getAll(props.resource, page, { name: query});
      items.value = response.member;
      totalItems.value = response.totalItems || 0;
    };

    onMounted(async () => {
      await fetchItems(currentPage.value);
    });

    const totalPages = computed(() => {
      return Math.ceil(totalItems.value / itemsPerPage.value);
    });

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
        currentPage.value = page;
        fetchItems(page, searchQuery.value);
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        goToPage(currentPage.value + 1);
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        goToPage(currentPage.value - 1);
      }
    };

    const handleSearch = () => {
      currentPage.value = 1;
      fetchItems(1, searchQuery.value);
    };

    const getNestedProperty = (obj: AbstractEntity, path: string) => {
      const value = path.split('.').reduce((acc, part) => {
        if (acc === null || acc === undefined) return acc;
        return acc[part];
      }, obj);

      if (Array.isArray(value)) {
        return value.map(item=>item.name).join(', ');
      }

      return value;
    }

    const createNewEntity = () => {
      router.push(`/${props.resource.name.toLowerCase()}/create`)
    }

    const editEntity = (id: number) => {
      router.push(`/${props.resource.name.toLowerCase()}/${id}`)
    }

    return {
      items,
      currentPage,
      itemsPerPage,
      totalPages,
      totalItems,
      searchQuery,
      nextPage,
      prevPage,
      goToPage,
      handleSearch,
      getNestedProperty,
      createNewEntity,
      editEntity
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ listName }}</h1>
        <button @click="createNewEntity"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
          Créer un nouveau
        </button>
      </div>

      <div class="mb-6">
        <div class="flex items-center gap-2">
          <div class="relative flex-grow">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                class="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 transition-all duration-200"
                placeholder="Rechercher..."
            />
          </div>
          <button
              @click="handleSearch"
              class="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-colors duration-200 flex items-center"
          >
            <span>Rechercher</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
            v-for="(item, index) in items"
            :key="index"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-800">{{ getNestedProperty(item, bind.title) }}</h2>
            <p class="text-gray-600 mt-2">{{ getNestedProperty(item, bind.author) }}</p>
            <p class="text-gray-500 text-sm mt-1">{{ getNestedProperty(item, bind.year) }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {{ getNestedProperty(item, bind.category) }}
              </span>
              <button
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  @click="editEntity(+item.id)"
              >
                Voir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <button
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              @click="prevPage"
          >
            Previous
          </button>
          <button
              :disabled="currentPage === totalPages"
              class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
              @click="nextPage"
          >
            Next
          </button>
        </div>

        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Montre <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              à <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
              des <span class="font-medium">{{ totalItems }}</span> résultas
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  @click="prevPage"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                </svg>
              </button>

              <template v-for="page in totalPages" :key="page">
                <button
                    v-if="Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages"
                    class="relative inline-flex items-center px-4 py-2 text-sm font-semibold"
                    aria-current="page"
                    :class="{
                      'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600': currentPage === page,
                      'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0': currentPage !== page
                    }"
                    @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <span
                    v-if="(page === currentPage - 3 && page > 1) || (page === currentPage + 3 && page < totalPages)"
                    class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                >
                  ...
                </span>
              </template>

              <button
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                  @click="nextPage"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l4.5 4.25a.75.75 0 11-1.06 1.02z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>