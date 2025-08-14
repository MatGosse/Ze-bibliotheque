<script setup lang="ts">
  import BooksFormComponent from "~/pages/books/components/booksFormComponent.vue";

  const toast = useToast()

  const router = useRouter()
  const route = useRoute()
  const { id } = route.params

  if (isNaN(Number(id))) {
    toast.error({
      message: 'Format de l\'ID incorrect',
      title: "Format incorrecte"
    })
    router.push('/')
  }
</script>

<template>
  <booksFormComponent
      :book-id="Number(id)"
      :is-edit-mode="true"
  />
</template>