<template>
    <nav v-if="!isLoading">
        <img src="/src/assets/example-pfp.jpg" alt="Profile Picture">
        <h2>{{ cat.name }}</h2>
        <p>{{ cat.bio }}</p>
    </nav>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { GetCatResponse } from './../../generated/cat';

export default {
    props: {
        isLoading: {
            type: Boolean,
            required: true,
        },
        cat: {
            type: Object as PropType<GetCatResponse>,
            required: true,
            default() {
                return { name: "no cat", bio: "no bio" }
            }
        },
    },
}
</script>
