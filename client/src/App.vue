<!-- <template>
  <header>
    <h1>Cat Profile Page</h1>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
      </ul>
    </nav>
  </header>

  <div id="app">
    <router-view></router-view> // add router view component
  </div>
</template> -->

<template>
  <nav>
    <router-link to="/">Home</router-link> | <a aria-disabled="true">About</a> |
    <router-link to="/register">Register</router-link>
  </nav>
  <main>
    <router-view />
  </main>
</template>