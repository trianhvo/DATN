<template>
  <div>
    <v-app-bar class="appBar" elevation="0">
      <v-app-bar-nav-icon color="white" @click="setIsSidebarActive(!getIsSidebarActive)"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-btn @click.native="$router.push('/calendar-search')" icon>
        <v-icon color="white">mdi-magnify</v-icon>
      </v-btn>
      <v-btn @click.native="$router.push('/user-settings')" icon>
        <v-icon color="white">mdi-account</v-icon>
      </v-btn>
      <v-btn @click="logout" icon>
        <v-icon color="white">mdi-power</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<style scoped lang="scss">
.appBar {
  background-color: rgb(5,159,253) !important;
  border-bottom: 1px solid rgb(204, 204, 204) !important;
}
</style>

<script>
import { mapMutations,mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getIsSidebarActive"]),
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    isSidebarActive() {
      return this.$store.state.isSidebarActive;
    },
  },
  methods: {
    ...mapMutations(['setIsSidebarActive']),
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    }
  },
  mounted: async function () {
    await this.setIsSidebarActive(true);
  },
  created: async function() {
    if (this.getIsSidebarActive){
      await this.setIsSidebarActive(true);
    }

    this.$http.interceptors.response.use(undefined, function(err) {
      return new Promise(function() {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("logout");
        }
        throw err;
      });
    });
  },
};
</script>
