<template>
    <div>
        <h1>Create Kitt</h1>
        <form @submit.prevent="submitForm">
            <div v-if="errorComponent">
                Error!
            </div>

            <div>
                <textarea id="kitt" v-model="kitt.content" required></textarea>
            </div>

            <button @click="toTop" type="submit">Kitt</button>
        </form>
    </div>
</template>

<script lang="ts">
import { client } from '@/client';
import { CreateKittRequest } from './../../generated/cat';


export default {
    data() {
        return {
            kitt: {} as CreateKittRequest,
            errorComponent: null,
        }
    },
    methods: {
        submitForm() {
            let cook = this.$cookies.get("login");
            this.kitt.catId = parseInt(cook);
            client.CreateKitt(this.kitt)
                // .then(response => {

                // })
                .catch(error => {
                    this.errorComponent = error
                })
        }
        ,

        toTop() {
            this.$emit("update", true);
        }
    }
}
</script>
