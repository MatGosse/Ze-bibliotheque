<script lang="ts">
  import { ref } from 'vue'
  import { Categories } from "~/entities/Categories";

  export default {
    setup() {
      const categories = ref<Array<Categories>>([])
      const bind = ref({
        title: 'name',
        author: '',
        year: '',
        category: ''
      })
      return {
        categories,
        Categories,
        bind
      }
    }
  }
</script>

<template>
  <div>
    <ListComponent
        :resource="Categories"
        :bind="bind"
        :items="categories"
        list-name="Catégories"
    />
  </div>
</template>