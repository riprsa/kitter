<template>
    <Navigation></Navigation>

    <section v-if="isLogin" id="profile-container">

        <Cat :cat="cat" :is-loading="isLoading" />

        <main>
            <CreateKitt ref="fetchAll" @update="fetchAll()">
            </CreateKitt>
            <div>
                <div v-for="(kitt, index) in kitts" :key="index" :kitt="kitt">
                    <Kitt :is-loading="isLoading" :kitt="kitt" />
                </div>
            </div>
        </main>

    </section>
    <section v-else>
        <main>Please Login!</main>
    </section>
</template>

<script lang="ts">

import Cat from "@/components/Cat.vue";
import Kitt from "@/components/Kitt.vue";

import { client } from "@/client";
import type { TwirpError } from "twirp-ts";
import CreateKitt from "./../components/CreateKitt.vue";
import Navigation from "./../components/Navigation.vue";
import type { GetCatResponse, GetKittResponse } from "./../generated/cat";

export default {
    data() {
        return {
            cat: {} as GetCatResponse,
            kitts: {} as GetKittResponse[],
            kitt: {} as GetKittResponse,
            isLoading: false,

            isLogin: false,

            error: null,
        }
    }, // TODO: this component will be on /$USERNAME request

    components: {
        Cat,
        Kitt,
        CreateKitt,
        Navigation
    },

    methods: {
        fetchAll() {
            this.isLoading = true

            // TODO: fix the problem with waiting for http requests

            if (!this.$cookies.isKey("login")) {
                return
            }

            this.isLogin = true;
            let d = this.$cookies.get("login");
            let id = Number(d)

            client.GetCat({ id: id })
                .then((m) => {
                    this.cat = m;
                })
                .catch((error: TwirpError) => {
                    console.log("cat error:", error);
                })

            client.ListKitts({ catId: id })
                .then((kitts) => {
                    console.log(kitts);

                    this.kitts = kitts.kitts;
                })
                .catch((error: TwirpError) => {
                    console.log("kitt error", error);
                })
                .finally(() => {
                    this.isLoading = false
                })
        }
    },

    created() {
        this.fetchAll()
    },
}
</script>../generated/cat