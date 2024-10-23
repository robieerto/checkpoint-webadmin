<template>
  <v-container fluid>
    <!-- style="min-width: 900px; white-space: nowrap; overflow-x: auto; overflow-y: hidden" -->
    <v-row>
      <v-col cols="auto">
        <ActionsPreview />
      </v-col>
      <v-col cols="auto">
        <CheckpointsBasicPreview />
      </v-col>
      <!-- <v-col cols="4">
        <EmployeesBasicPreview />
      </v-col> -->
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
