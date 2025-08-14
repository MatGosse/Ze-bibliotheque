<script lang="ts">
  import { ref } from 'vue'
  import { Authors } from "~/entities/Authors";

  export default {
    setup() {
      const authors = ref<Array<Authors>>([])
      const bind = ref({
        title: 'name',
        author: '',
        year: '',
        category: ''
      })
      return {
        authors,
        Authors,
        bind
      }
    }
  }
</script>

<template>
  <div>
    <ListComponent
        :resource="Authors"
        :bind="bind"
        :items="authors"
        list-name="Auteurs"
    />
  </div>
</template>