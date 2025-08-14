<script setup lang="ts">
  import AuthorsFormComponent from "~/pages/authors/components/authorsFormComponent.vue";

  const toast = useToast()

  const router = useRouter()
  const route = useRoute()
  const { id } = route.params

  if (isNaN(Number(id))) {
    toast.error({
      message: 'Format de l\'ID incorrect',
      title: "Format incorrecte"
    })
    router.push('/authors') // ou '/index' selon votre route
  }
</script>

<template>
  <authorsFormComponent
    :author-id="Number(id)"
    :is-edit-mode="true"
  />
</template>

<style scoped>

</style>