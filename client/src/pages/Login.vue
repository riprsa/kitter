<template>
    <Navigation></Navigation>

    <div class="hero bg-base-200" style="min-height: 70vh;">
        <div class="hero-content flex-col lg:flex-row-reverse">
            <div class="text-center lg:text-left">
                <h1 class="text-5xl font-bold">Login now!</h1>
                <p class="py-6">If you have a Kitter account</p>
            </div>
            <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Username</span>
                            </label>
                            <input type="text" placeholder="username" class="input input-bordered" v-model="cat.username"
                                required />
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Password</span>
                            </label>
                            <input type="text" placeholder="password" class="input input-bordered" v-model="cat.password"
                                required />
                            <label class="label">
                                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                    class="label-text-alt link link-hover">Forgot password? Not a problem :)</a>
                            </label>
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
import { LoginCatRequest } from './../generated/cat';


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