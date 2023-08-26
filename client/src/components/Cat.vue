<template>
    <div class="profile">
        <img src="/src/assets/example-pfp.jpg" alt="Profile Picture">
        <h2>{{ cat.name }}</h2> @{{ cat.username }}
        <p class="user-info">{{ cat.bio }}</p>
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { GetCatResponse } from './../../generated/cat';

export default {
    props: {
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
