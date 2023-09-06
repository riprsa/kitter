<template>
    <nav class="navbar bg-base-100">
        <div class="navbar-start">
            <router-link to="/" class="btn btn-ghost normal-case text-xl">Kitter</router-link>
        </div>

        <!-- <div class="navbar-center">
            <ul class="menu menu-horizontal px-1">
                <li><a>Item 1</a></li>
                <li><a>Item 2</a></li>
            </ul>
        </div> -->

        <div class="navbar-end" v-if="!isLogin">
            <router-link to="/register" class="btn">Register</router-link>
            <router-link to="/login" class="btn btn-primary">Login</router-link>
        </div>

        <div class="navbar-end" v-else>
            <router-link to="/profile" class="btn">Your Cat</router-link>
            <a class="btn btn-primary" @:click="removeCookies()">Logout</a>
        </div>
    </nav>
</template>

<script lang="ts">
export default { // TODO: here we need to do a request to get Cat's profile, if the cat is logged in
    data() {
        return {
            isLogin: false,
        }
    },
    methods: {
        checkLogin() {
            this.isLogin = this.$cookies.isKey("login");
        },
        removeCookies() {
            this.$cookies.remove("login");

            // to reload page
            location.reload();
        },
    },
    created() {
        this.checkLogin();
    },
}
</script>