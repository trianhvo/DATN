<template>
  <v-card color="grey lighten-4" min-width="350px" flat>
    <v-toolbar :color="selectedEvent.color" dark>
      <v-btn icon>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-share</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <span v-html="selectedEvent.details"></span>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="secondary" @click="selectedOpen = false">
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style>
</style>

<script>
export default {
    
}
</script>
