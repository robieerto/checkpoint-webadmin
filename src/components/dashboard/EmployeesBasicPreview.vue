<template>
  <v-card class="px-5" rounded="xl" style="min-width: 300px">
    <v-row>
      <v-col class="pb-0 ml-5 mt-5">
        <h2>Zamestnanci</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list height="80vh" class="py-0" :border="false" :rounded="true">
          <EmployeePreviewItem
            v-for="employee in employees"
            :id="employee.id"
            :key="employee.id"
            :employee="employee"
            :secondaryColor="true"
            @click=""
          />
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
const { employees } = storeToRefs(useAppStore())
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-secondary)) !important;
}
</style>
