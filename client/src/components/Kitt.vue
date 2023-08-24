<template>
    <div class="tweet">
        <img src="/src/assets/example-pfp.jpg" alt="Profile Picture">
        <div class="tweet-content">
            <div class="user-info">
                <span>{{ cat.name }}</span> {{ cat.username }} {{ kitt.createdAt }}
            </div>
            <p>{{ kitt.content }}</p>
        </div>
    </div>
    <!-- ... -->
</template>

<script lang="ts">
import { client } from '@/client';
import type { TwirpError } from 'twirp-ts';
import type { PropType } from 'vue';
import type { GetCatResponse, GetKittResponse } from './../../generated/cat';

export default {
    props: {
        kitt: {
            type: Object as PropType<GetKittResponse>,
            required: true
        },
    },

    data() {
        return {
            cat: {} as GetCatResponse,
            isLoading: false,

            error: null,
        }
    },

    methods: {
        fetchCat() {
            client.GetCat({ id: this.kitt.catId })
                .then((m) => {
                    this.cat = m;
                })
                .catch((error: TwirpError) => {
                    console.log("cat error:", error);
                })
        },
    },

    created() {
        this.fetchCat()
    },
}
</script>
