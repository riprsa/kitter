<template>
    <div v-if="!isLoading" class="cat-profile">
        <h2 class="cat-name">{{ cat.name }}</h2>
        <p class="cat-bio">{{ cat.bio }}</p>
    </div>
    <div v-else class="cat-profile">
        Loading cat data...
    </div>
</template>

<script lang="ts">
import type { GetCatResponse } from 'generated/cat';
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
