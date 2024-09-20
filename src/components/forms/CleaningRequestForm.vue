<template>
  <v-sheet class="checkpoint-form" rounded="xl">
    <v-card
      append-icon="$close"
      class="mx-auto"
      elevation="16"
      max-width="600"
      rounded="xl"
      title="Žiadosť o upratanie"
    >
      <template v-slot:append>
        <!-- <v-card-title class="text-h6 mr-9"></v-card-title> -->
        <v-btn icon="$close" variant="text" @click="closeForm"></v-btn>
      </template>

      <div class="px-5">
        <v-row>
          <v-col style="width: 400px">
            <v-list v-if="selectedItem" class="py-0" :border="false" :rounded="true">
              <CheckpointPreviewItem
                :id="selectedItem.id"
                :key="selectedItem.id"
                :checkpoint="selectedItem"
                @click="checkpointDialog = true"
              />
            </v-list>
            <div v-else class="text-center">
              <v-btn
                class="text-none"
                color="brown"
                min-width="92"
                variant="flat"
                rounded
                @click="checkpointDialog = true"
              >
                Vybrať checkpoint
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="note"
              label="Poznámka"
              hint="Sem môžeš pridať poznámku"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div class="pa-4 text-end">
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
  <v-dialog v-model="checkpointDialog" max-width="380">
    <v-card>
      <v-list class="pa-2" color="primary" elevation="12" rounded="lg">
        <CheckpointPreviewItem
          v-for="checkpoint in checkpoints"
          :id="checkpoint.id"
          :key="checkpoint.id"
          :checkpoint="checkpoint"
          @click="selectItem(checkpoint)"
        />
      </v-list>
    </v-card>
  </v-dialog>
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
const note = ref('')
const error = ref(false)

const closeForm = () => {
  emit('close')
}

const saveForm = () => {
  sending.value = true
  error.value = true
  sending.value = false
}

const selectItem = (item: any) => {
  selectedItem.value = item
  checkpointDialog.value = false
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
