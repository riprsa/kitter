<template>
    <Navigation></Navigation>

    <section v-if="isLogin" id="profile-container">

        <main>
            <CreateKitt @update="fetchKitts(currentCatID)">
            </CreateKitt>
            <div v-for="(kitt, index) in kitts" :key="index" :kitt="kitt">
                <Kitt :kitt="kitt" />
            </div>
        </main>

    </section>
    <section v-else id="profile-container">
        <main>Please Login!</main>
    </section>
</template>

<script lang="ts">

import Kitt from "@/components/Kitt.vue";

import { client } from "@/client";
import type { TwirpError } from "twirp-ts";
import type { GetCatResponse, GetKittResponse } from "./../../generated/cat";
import CreateKitt from "./../components/CreateKitt.vue";
import Navigation from "./../components/Navigation.vue";

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
</script>