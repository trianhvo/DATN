<template>
  <v-app id="app">
    <router-view name="header">
    </router-view>
    <v-main class="pt-2 pt-md-0">
      <v-container  fluid style="margin: 0px; padding: 0px; width: 100%" class="fill-height fluid">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {

};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,400;0,500;1,300&display=swap');

#app {
// font-family: 'Work Sans', sans-serif;  -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: $color-text-primary;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
}
#nav a:hover {
  text-decoration: underline;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  a { text-decoration: none; }
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
