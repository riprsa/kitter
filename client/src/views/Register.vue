<template>
    <div>
        <h1>Create a Cat-User</h1>
        <form @submit.prevent="submitForm">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="catUser.name" required>
            </div>
            <div>
                <label for="age">Age:</label>
                <input type="number" id="age" v-model="catUser.age" required>
            </div>
            <div>
                <label for="breed">Breed:</label>
                <input type="text" id="breed" v-model="catUser.breed" required>
            </div>
            <div>
                <label for="color">Color:</label>
                <input type="text" id="color" v-model="catUser.color" required>
            </div>
            <button type="submit">Create Cat-User</button>
        </form>
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            catUser: {
                name: '',
                age: '',
                breed: '',
                color: ''
            }
        }
    },
    methods: {
        submitForm() {
            // Send the catUser data to the server to create a new cat-user
            // You can use axios or any other HTTP client library to make the request
            // Example:
            // axios.post('/api/cat-users', this.catUser)
            //   .then(response => {
            //     console.log(response.data)
            //   })
            //   .catch(error => {
            //     console.log(error)
            //   })
        }
    }
}
</script>
