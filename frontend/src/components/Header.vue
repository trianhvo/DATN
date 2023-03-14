<template>
  <div>
    <v-app-bar class="appBar" elevation="0">
      <v-app-bar-nav-icon @click.native="$router.push('/calendar')">
        <v-icon>mdi-keyboard-backspace</v-icon>
      </v-app-bar-nav-icon>
      <v-spacer></v-spacer>
    </v-app-bar>
  </div>
</template>

<style scoped lang="scss">
.appBar {
  background-color: white !important;
  border-bottom: 1px solid rgb(204, 204, 204) !important;
}
</style>
