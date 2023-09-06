<template>
    <Navigation></Navigation>

    <section v-if="isLogin">

        <main>
            <CreateKitt @update="fetchKitts(currentCatID)">
            </CreateKitt>
            <div v-for="(kitt, index) in kitts" :key="index" :kitt="kitt">
                <Kitt :kitt="kitt" />
            </div>
        </main>

    </section>

    <section v-else>
        <div class="hero bg-base-200" style="min-height: 70vh;">
            <div class="hero-content flex-col lg:flex-row">
                <img src="../assets/cat.jpg" class="max-w-sm rounded-lg shadow-2xl" />
                <div>
                    <h1 class="text-5xl font-bold">Welcome on Kitter!</h1>
                    <p class="py-6">This is the place, where your cat will finally get a social network expirience</p>
                    <router-link to="/login" class="btn btn-primary">Login</router-link>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">

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

            isLogin: false,

            currentCatID: 0,

            error: null,
        }
    },

    components: {
        Kitt,
        CreateKitt,
        Navigation
    },

    methods: {
        fetchKitts(id: number) {
            client.ListKitts({ catId: id })
                .then((kitts) => {
                    this.kitts = kitts.kitts;
                })
                .catch((error: TwirpError) => {
                    console.log("kitt error", error);
                })
        },

        fetchCat(id: number) {
            client.GetCat({ id: id })
                .then((m) => {
                    this.cat = m;
                })
                .catch((error: TwirpError) => {
                    console.log("cat error:", error);
                })
        }
    },

    created() {
        if (!this.$cookies.isKey("login")) {
            return
        }
        this.isLogin = true;

        let d = this.$cookies.get("login");

        this.currentCatID = Number(d);

        this.fetchCat(this.currentCatID);
        this.fetchKitts(this.currentCatID);
    },
}
</script>../generated/cat