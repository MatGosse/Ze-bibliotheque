<script setup lang="ts">
  import CategoryFormComponent from "~/pages/categories/components/categoryFormComponent.vue";

  const toast = useToast()

  const router = useRouter()
  const route = useRoute()
  const { id } = route.params

  if (isNaN(Number(id))) {
    toast.error({
      message: 'Format de l\'ID incorrect',
      title: "Format incorrecte"
    })
    router.push('/categories') // ou '/index' selon votre route
  }
</script>

<template>
  <CategoryFormComponent
      :category-id="Number(id)"
      :is-edit-mode="true"
  ></CategoryFormComponent>
</template>

<style scoped>

</style>