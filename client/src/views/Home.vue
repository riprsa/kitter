<template>
    <section id="profile-container">
        <!-- cat's profile -->
        <Cat :cat="cat" :is-loading="isLoading" />

        <main>
            <Kitt />
        </main>
    </section>
</template>

<script lang="ts">

import Cat from "@/components/Cat.vue";
import Kitt from "@/components/Kitt.vue";

import { client } from "@/client";
import type { GetCatResponse } from "./../../generated/cat";

export default {
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

            let d = this.$cookies.get("login");

            let id = Number(d);

            client.GetCat({ id: id })
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
}
</script>