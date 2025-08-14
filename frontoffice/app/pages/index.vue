<script lang="ts">
  import { ref } from 'vue'
  import { Books } from '~/entities/Books'

  export default {
    setup() {
      const books = ref<Array<Books>>([])
      const bind = ref({
        title: 'name',
        author: 'author.name',
        year: '',
        category: 'categories'
      })
      return {
        books,
        Books,
        bind
      }
    }
  }
</script>

<template>
  <div>
    <ListComponent
        :resource="Books"
        :bind="bind"
        :items="books"
        list-name="Livres"
    />
  </div>
</template>