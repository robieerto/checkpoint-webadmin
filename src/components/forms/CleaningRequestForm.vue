<template>
  <v-sheet class="checkpoint-form h-75" rounded="xl">
    <v-card
      append-icon="$close"
      class="mx-auto h-100 d-flex flex-column"
      elevation="16"
      rounded="xl"
      title="Žiadosť o upratanie"
    >
      <template v-slot:append>
        <!-- <v-card-title class="text-h6 mr-9"></v-card-title> -->
        <v-btn icon="$close" variant="text" @click="closeForm"></v-btn>
      </template>

      <div class="px-5 d-flex flex-column flex-grow-1" style="width: 700px">
        <v-row class="flex-grow-0">
          <v-col class="w-100 d-flex align-start justify-center pb-0">
            <v-select
              v-model="selectedItemId"
              :items="checkpoints"
              item-title="name"
              item-value="id"
              label="Vyberte Checkpoint"
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row v-if="selectedItem" class="flex-grow-1">
          <v-col class="w-100 d-flex align-start justify-center pt-0">
            <v-list class="w-100" :border="false" :rounded="true">
              <CheckpointPreviewItem
                :id="selectedItem.id"
                :key="selectedItem.id"
                :checkpoint="selectedItem"
                @click="checkpointDialog = true"
              />
            </v-list>
          </v-col>
        </v-row>
        <v-row class="flex-grow-1">
          <v-col class="w-100 d-flex align-end justify-start">
            <v-textarea
              v-model="note"
              label="Poznámka"
              hint="Sem môžeš pridať poznámku"
              rows="8"
              no-resize
            ></v-textarea>
          </v-col>
        </v-row>
      </div>

      <div class="pa-4 text-end mt-auto">
        <v-btn
          class="secondary-btn mr-2"
          color="brown"
          min-width="92"
          variant="text"
          rounded
          @click="closeForm"
        >
          Zrušiť
        </v-btn>
        <v-btn
          :loading="sending"
          :disabled="!selectedItem"
          color="brown"
          min-width="92"
          variant="flat"
          rounded
          @click="saveForm"
        >
          Uložiť
        </v-btn>
      </div>
    </v-card>
  </v-sheet>
  <v-snackbar v-model="error" :timeout="3000" color="error">Zatiaľ neimplementované</v-snackbar>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()

const { checkpoints, selectedCheckpoint } = storeToRefs(useAppStore())

const sending = ref(false)
const checkpointDialog = ref(false)
const selectedItem = ref(selectedCheckpoint.value)
const selectedItemId = ref(selectedCheckpoint.value?.id)
const note = ref('')
const error = ref(false)

watch(selectedItemId, () => {
  selectedItem.value = checkpoints.value.find(
    (checkpoint: any) => checkpoint.id === selectedItemId.value
  )
})

const closeForm = () => {
  emit('close')
}

const saveForm = () => {
  sending.value = true
  error.value = true
  sending.value = false
}
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-secondary)) !important;
}

.v-list-item {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
