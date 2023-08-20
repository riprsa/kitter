<template>
    <div>
        <h1>Register new cat</h1>
        <form @submit.prevent="submitForm">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="cat.name" required>
            </div>
            <div>
                <label for="age">Username:</label>
                <input type="text" id="username" v-model="cat.username" required>
            </div>
            <div>
                <label for="bio">Bio:</label>
                <input type="text" id="bio" v-model="cat.bio" required>
            </div>
            <button type="submit">Register Cat</button>
        </form>
    </div>
</template>

<script lang="ts">
import { client } from '@/client';
import { CreateCatRequest } from 'generated/cat';

export default {
    data() {
        return {
            cat: {} as CreateCatRequest,
        }
    },
    methods: {
        submitForm() {
            client.RegisterCat(this.cat)
                .then(response => {
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
}
</script>
