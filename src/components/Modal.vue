<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits(['close'])

const target = ref(null)
onClickOutside(target, () => emit('close'))
</script>

<template>
  <Teleport to="body">
    <v-container class="fill-height popup" fluid>
      <v-row class="fill-height" align="center" @click.self="emit('close')">
        <v-col @click.self="emit('close')">
          <div class="modal-container mx-auto" style="max-width: 1000px">
            <slot></slot>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </Teleport>
</template>

<style scoped>
.popup {
  position: fixed;
  z-index: 1500;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  align-items: center;
  justify-content: center;
  margin: auto;
}
</style>
