<template>
    <Navigation></Navigation>

    <div>
        <h1>Login</h1>
        <form @submit.prevent="submitForm">
            <div v-if="errorComponent">
                Error!
            </div>

            <div>
                <label for="age">Username:</label>
                <input type="text" id="username" v-model="cat.username" required>
            </div>
            <div>
                <label for="bio">Password:</label>
                <input type="text" id="password" v-model="cat.password" required>
            </div>

            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script lang="ts">
import { client } from '@/client';
import { LoginCatRequest } from './../../generated/cat';
import Navigation from "./../components/Navigation.vue";


export default {
    data() {
        return {
            cat: {} as LoginCatRequest,
            errorComponent: null,
        }
    },
    components: {
        Navigation
    },
    methods: {
        submitForm() {
            client.Login(this.cat)
                .then(response => {
                    this.$cookies.set("login", response.id);
                })
                .catch(error => {
                    this.errorComponent = error
                })
            location.replace("/");
        }
    }
}
</script>
