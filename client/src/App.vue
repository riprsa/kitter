<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <a aria-disabled="true">About</a> |
    <router-link to="/register">Register</router-link> |
    <router-link to="/login">Login</router-link>
  </nav>
  <main>
    <router-view />
  </main>
</template>