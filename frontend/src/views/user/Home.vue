<template>
  <v-app>
      <h1>Home page</h1>
  </v-app>
</template>

<style scoped lang="scss">
  h1 {
    background-color: red !important;
    color: blue !important;
  }
</style>

<script>
export default {
  data: () => ({
    step: 1,
  }),
  props: {
    source: String,
  },
};
</script>
