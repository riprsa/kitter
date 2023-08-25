<template>
    <nav v-if="!isLogin">
        <router-link to="/home">Home</router-link> |
        <a aria-disabled="true">About</a> |
        <router-link to="/register">Register</router-link> |
        <router-link to="/login">Login</router-link>
    </nav>
    <nav v-else>
        <router-link to="/">Home</router-link> |
        <a aria-disabled="true">About</a> |
        <router-link to="/register">Register</router-link> |
        <router-link to="/?">You</router-link> |
        <a @:click="removeCookies()">Logout</a>
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