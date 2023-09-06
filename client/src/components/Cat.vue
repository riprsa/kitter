<template>
    <div>
        <img src="/src/assets/example-pfp.jpg" alt="Profile Picture">
        <h2>{{ cat.name }}</h2> @{{ cat.username }}
        <p>{{ cat.bio }}</p>
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { GetCatResponse } from './../generated/cat';

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
../generated/cat