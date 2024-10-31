<template>
  <v-container class="pr-10" fluid>
    <v-row>
      <v-col class="pb-0 ml-5">
        <h2>{{ $t('employees') }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col style="max-width: 360px">
        <v-list height="80vh" class="py-0" :border="false" :rounded="true">
          <EmployeePreviewItem
            v-for="employee in employees"
            :id="employee.id"
            :key="employee.id"
            :employee="employee"
            @click="selectItem(employee)"
          />
        </v-list>
      </v-col>
      <v-col>
        <Detail v-if="selectedItem !== null" @close="closeDetail">
          <EmployeeDetail :employee="selectedItem" />
        </Detail>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const { employees } = storeToRefs(useAppStore())

const selectedItem = ref(null)
const detailVisible = ref(false)

const selectItem = (item: any) => {
  selectedItem.value = item
  detailVisible.value = true
}

const closeDetail = () => {
  selectedItem.value = null
}
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
