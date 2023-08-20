<template>
  <header>
    <h1>Cat Profile Page</h1>
  </header>

  <section id="profile-container">
    <!-- cat's profile -->
    <Cat :cat="cat" :is-loading="isLoading" />

    <main>

      <Kitt />

    </main>

  </section>
</template>

<script lang="ts">
import type { GetCatResponse } from 'generated/cat';
import { defineComponent } from "vue";

import { client } from "./client";

import Cat from "./components/Cat.vue";
import Kitt from "./components/Kitt.vue";

export default defineComponent({
  data() {
    return {
      cat: {} as GetCatResponse,
      isLoading: false,
    }
  },

  components: {
    Cat,
    Kitt,
  },

  methods: {
    fetchCat() {
      this.isLoading = true

      client.GetCat({ id: 1 })
        .then((m) => {
          this.cat = m;
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  },

  created() {
    this.fetchCat()
  },
});

</script>