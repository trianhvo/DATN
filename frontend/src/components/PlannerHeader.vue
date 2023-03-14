<template>
  <div>
    <v-app-bar class="appBar" elevation="0">
      <v-title class="title">Event Planner</v-title>
      <v-spacer></v-spacer>

      <v-btn @click="logout" icon>
        <v-icon color="white">mdi-power</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/planner/login");
      });
    },
  },
};
</script>
<style scoped lang="scss">
.appBar {
  background-color: #536dfe !important;
  border-bottom: 1px solid rgb(204, 204, 204) !important;
}
.title {
  color: white;
}
</style>
