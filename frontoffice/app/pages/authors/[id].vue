<script setup lang="ts">

  import AuthorsFormComponent from "~/pages/authors/components/authorsFormComponent.vue";

  const route = useRoute()
  const { id } = route.params
</script>

<template>
  <authorsFormComponent
    :author-id="id"
    :is-edit-mode="true"
  />
</template>

<style scoped>

</style>