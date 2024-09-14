<template>
  <v-container class="py-0">
    <v-row>
      <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
        <v-icon class="mr-3">mdi-account</v-icon>
      </v-col>
      <v-col>
        <v-row>
          <v-col class="py-1 pl-1 pr-0">
            <v-list-item-title class="text-h6">{{ employee.username }}</v-list-item-title>
            <v-chip
              v-for="serviceType in serviceTypes"
              variant="flat"
              rounded="lg"
              color="primary"
              class="mr-1"
            >
              {{ serviceType }}
            </v-chip>
            <v-chip
              v-if="employee.phone"
              variant="flat"
              rounded="lg"
              color="button"
              prepend-icon="mdi-phone-outline"
              class="mr-1"
            >
              {{ employee.phone }}
            </v-chip>
            <v-chip
              v-if="employee.email"
              variant="flat"
              rounded="lg"
              color="brown"
              prepend-icon="mdi-email-outline"
            >
              {{ employee.email }}
            </v-chip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const props = defineProps<{
  employee?: any
}>()

const serviceTypes = computed(
  () => new Set(props.employee.services.map((service: any) => service.type))
)
</script>
