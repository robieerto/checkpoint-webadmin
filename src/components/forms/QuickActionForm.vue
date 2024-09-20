<template>
  <v-sheet class="checkpoint-form" rounded="xl">
    <v-card
      append-icon="$close"
      class="mx-auto"
      elevation="16"
      max-width="600"
      rounded="xl"
      title="Rýchla akcia"
    >
      <template v-slot:append>
        <!-- <v-card-title class="text-h6 mr-9"></v-card-title> -->
        <v-btn icon="$close" variant="text" @click="closeForm"></v-btn>
      </template>

      <v-form v-model="form" @submit.prevent="onSubmit">
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
            <v-col style="max-width: 60px" class="ml-3 pl-0" align-self="start">
              <v-img src="@/assets/occurrence-logo.png" width="45"></v-img>
            </v-col>
            <v-col>
              <v-text-field
                v-model="errorDescription"
                :rules="[required]"
                label="Popis úkonu"
                hint="Krátky popis úkonu"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="my-1">
            <v-col>
              <v-list-item-title class="mb-2">Priradiť pre servis:</v-list-item-title>
              <v-btn-toggle v-model="selectedService" divided color="background">
                <v-btn
                  base-color="secondary"
                  style="width: 180px"
                  v-for="service in selectedBuildingServices"
                  >{{ service.name }}</v-btn
                >
              </v-btn-toggle>
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
            :disabled="!selectedItem || !form"
            color="brown"
            min-width="92"
            variant="flat"
            rounded
            type="submit"
          >
            Uložiť
          </v-btn>
        </div>
      </v-form>
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

const { checkpoints, selectedCheckpoint, selectedBuildingServices } = storeToRefs(useAppStore())

const form = ref(false)
const sending = ref(false)
const checkpointDialog = ref(false)
const selectedItem = ref(selectedCheckpoint.value)
const selectedService = ref(null as any)
const errorDescription = ref('')
const note = ref('')
const error = ref(false)

const required = (value: string) => !!value || 'Povinnné'

const onSubmit = async () => {
  sending.value = true
  error.value = true
  sending.value = false
}

const closeForm = () => {
  emit('close')
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
