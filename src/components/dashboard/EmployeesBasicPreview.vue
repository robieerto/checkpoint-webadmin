<template>
  <v-card class="px-5">
    <v-row>
      <v-col class="pb-0 ml-5 mt-2">
        <h3>Zamestnanci</h3>
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
