<template>
  <nav>
    <Cat :cat="cat" :is-loading="isLoading" />
  </nav>
</template>

<script lang="ts">
import type { GetCatResponse } from 'generated/cat';
import { FetchRPC } from 'twirp-ts';
import { defineComponent } from "vue";
import { CatterClientJSON } from './../generated/cat.twirp';

import Cat from "./components/Cat.vue";

let client: CatterClientJSON;

export default defineComponent({
  data() {
    return {
      cat: {} as GetCatResponse,
      isLoading: false,
    }
  },

  components: {
    Cat,
  },

  setup() {
    client = new CatterClientJSON(FetchRPC({
      baseUrl: "http://localhost:8080/api"
    }))
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