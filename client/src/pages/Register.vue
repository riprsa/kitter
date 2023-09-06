<template>
    <Navigation></Navigation>

    <div class="hero bg-base-200" style="min-height: 70vh;">
        <div class="hero-content flex-col lg:flex-row-reverse">
            <div class="text-center lg:text-left">
                <h1 class="text-5xl font-bold">Register...</h1>
                <p class="py-6">...if you love your cat!</p>
            </div>
            <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Name</span>
                            </label>
                            <input type="text" placeholder="username" class="input input-bordered" v-model="cat.name"
                                required />
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Username</span>
                            </label>
                            <input type="text" placeholder="username" class="input input-bordered" v-model="cat.username"
                                required />
                        </div>
                        <!-- <div class="form-control"> // TODO: email may be?
                            <label class="label">
                                <span class="label-text">Email</span>
                            </label>
                            <input type="text" placeholder="username" class="input input-bordered" v-model="cat.username"
                                required />
                        </div> -->
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Password</span>
                            </label>
                            <input type="password" placeholder="password" class="input input-bordered"
                                v-model="cat.password" required />
                        </div>
                        <div class="form-control mt-6">
                            <button class="btn btn-primary" type="submit">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { client } from '@/client';
import Navigation from "./../components/Navigation.vue";
import { RegisterCatRequest } from './../generated/cat';

export default {
    data() {
        return {
            cat: {} as RegisterCatRequest,
        }
    },
    components: {
        Navigation
    },
    methods: {
        submitForm() {
            client.Register(this.cat)
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
../generated/cat