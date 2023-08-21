<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="submitForm">
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


export default {
    data() {

        return {
            cat: {} as LoginCatRequest,
        }
    },
    methods: {
        submitForm() {
            client.Login(this.cat)
                .then(response => {
                    this.$cookies.set("login", response.id);
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
}
</script>
