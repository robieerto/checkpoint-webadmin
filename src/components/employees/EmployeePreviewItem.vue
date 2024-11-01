<template>
  <v-list-item :class="secondaryColor && 'secondary-color'" rounded="lg" class="mb-2">
    <v-container>
      <v-row>
        <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
          <v-icon class="mr-3">mdi-account</v-icon>
        </v-col>
        <v-col>
          <v-row>
            <v-col class="py-1 pl-1 pr-0">
              <v-list-item-title class="text-h6">{{ employee.username }}</v-list-item-title>
              <!-- <v-chip
                v-for="serviceType in serviceTypes"
                variant="flat"
                rounded="lg"
                color="primary"
                class="mr-1 mb-1"
                >{{ serviceType }}</v-chip
              > -->
              <v-chip
                v-if="employee.phone"
                variant="flat"
                rounded="lg"
                color="yellow"
                prepend-icon="mdi-phone-outline"
                class="mr-1"
              >
                {{ employee.phone }}
              </v-chip>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-list-item>
</template>

<script setup lang="ts">
defineProps<{
  employee?: any
  secondaryColor?: boolean
}>()

// const serviceTypes = computed(
//   () => new Set(props.employee.services.map((service: any) => service.type))
// )
</script>

<style scoped>
:deep(.v-list-item__overlay) {
  background: none !important;
}

.v-list-item.secondary-color {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
