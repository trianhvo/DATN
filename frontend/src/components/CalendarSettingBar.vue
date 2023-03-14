<template>
  <div>
    <v-app-bar class="appBar" elevation="0">
      <v-app-bar-nav-icon @click="setIsSidebarActive"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-btn @click.native="$router.push('/calendar-search')" icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn @click.native="$router.push('/user-settings')" icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>

      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<style scoped lang="scss">
.appBar {
  background-color: white !important;
  border-bottom: 1px solid $color-bg-secondary !important;
}
</style>

<script>
export default {
  computed: {},
  methods: {

  }
};
</script>
