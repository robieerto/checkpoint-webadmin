<template>
  <v-list-item :class="secondaryColor && 'secondary-color'" rounded="none" class="pa-0">
    <v-container class="pr-0 py-0">
      <v-row style="position: relative">
        <div class="vl" :class="secondaryColor && 'secondary-color'"></div>
        <v-col cols="1" style="max-width: 50px" class="pl-0 py-0" align-self="center">
          <slot></slot>
        </v-col>
        <v-col cols="9">
          <v-row>
            <v-col class="ma-0 pa-0">
              <v-card
                class="list-card py-1 my-6"
                :class="secondaryColor && 'secondary-color'"
                style="max-width: 350px"
                flat
                rounded="lg"
                border="lg"
              >
                <v-col class="py-1">
                  <v-list-item-subtitle>{{ subtitle }}</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-medium">{{ title }}</v-list-item-title>
                  <v-list-item-subtitle style="max-width: 246px">{{ note }}</v-list-item-subtitle>
                  <div class="text-left">
                    <v-chip
                      v-if="user"
                      class="pl-1 mt-1 mr-1"
                      variant="flat"
                      rounded="lg"
                      color="background"
                    >
                      <span class="material-symbols-outlined mx-1">account_circle</span>
                      {{ user }}</v-chip
                    >
                    <v-chip
                      v-else
                      class="pl-1 mt-1 mr-1"
                      variant="flat"
                      rounded="lg"
                      color="yellow"
                    >
                      <span class="material-symbols-outlined mx-1">hot_tub</span> Hosť</v-chip
                    >
                    <v-chip
                      v-if="checkpoint"
                      class="mt-1 mr-1"
                      variant="flat"
                      rounded="lg"
                      color="blue"
                    >
                      <img class="mr-1" src="@/assets/checkpoint-logo.png" width="15" />
                      {{ checkpoint }}</v-chip
                    >
                  </div>
                </v-col>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-list-item>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  note?: string
  secondaryColor?: boolean
  checkpoint?: string
  user?: string
}>()
</script>

<style scoped>
.v-list-item__overlay {
  background: none !important;
}

.v-list-item.secondary-color {
  background-color: rgb(var(--v-theme-background)) !important;
}

.list-card {
  background: none !important;
  box-shadow: none !important;
  border-color: #efe2bb !important;
}

.list-card.secondary-color {
  border-color: #705d0d !important;
}

.vl {
  position: absolute;
  height: 100%;
  top: 0px;
  left: 7.2px;
  border-left: 6px solid #efe2bb;
}

.vl.secondary-color {
  border-left: 6px solid #705d0d;
}
</style>
