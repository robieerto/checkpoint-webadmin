<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <ActionsPreview />
      </v-col>
      <v-col cols="4">
        <CheckpointsBasicPreview />
      </v-col>
      <v-col cols="4">
        <EmployeesBasicPreview />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
definePage({
  meta: {
    icon: 'mdi-monitor-dashboard',
    title: 'Aktuálny prehľad',
    drawerIndex: 1,
  },
})
</script>
