<template>
    <div class="profile" v-if="!isLoading">
        <img src="/src/assets/example-pfp.jpg" alt="Profile Picture">
        <h2>{{ cat.name }}</h2>
        <p>{{ cat.bio }}</p>
    </div>
</template>

<script lang="ts">
import type { GetCatResponse } from '@/generated/cat';
import type { PropType } from 'vue';

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
