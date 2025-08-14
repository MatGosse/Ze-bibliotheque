<template>
    <booksFormComponent
        :book-id="id"
        :is-edit-mode="true"
    />
</template>

<script setup lang="ts">

import BooksFormComponent from "~/pages/books/components/booksFormComponent.vue";

const route = useRoute()
const { id } = route.params

</script>