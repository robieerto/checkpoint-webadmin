<template>
  <v-container fluid>
    <v-row>
      <v-col class="pb-0 ml-5">
        <h2>Dashboard</h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
definePage({
  meta: {
    icon: 'mdi-monitor-dashboard',
    title: 'Dashboard',
    drawerIndex: 1,
  },
})
</script>
