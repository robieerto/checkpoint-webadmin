<template>
  <Teleport to="body">
    <v-sheet class="checkpoint-form h-75 fab-form" rounded="xl" style="max-height: 800px">
      <v-card
        append-icon="$close"
        class="mx-auto h-100 d-flex flex-column"
        elevation="16"
        rounded="xl"
        :title="$t('cleaningRequest')"
      >
        <template v-slot:append>
          <!-- <v-card-title class="text-h6 mr-9"></v-card-title> -->
          <v-btn icon="$close" variant="text" @click="closeForm"></v-btn>
        </template>

        <div class="px-5 d-flex flex-column flex-grow-1" style="width: 450px">
          <v-row class="flex-grow-0">
            <v-col class="w-100 d-flex align-start justify-center pb-0">
              <v-select
                v-model="selectedItemId"
                :items="checkpoints"
                item-title="name"
                item-value="id"
                :label="$t('selectCheckpoint')"
              >
              </v-select>
            </v-col>
          </v-row>
          <v-row v-if="selectedItem">
            <v-col class="w-100 d-flex align-start justify-center py-0">
              <v-list class="w-100" :border="false" :rounded="true" style="max-width: 360px">
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
            <v-col class="w-100 d-flex align-start justify-start">
              <v-textarea
                v-model="note"
                :label="noteFocused || note.length ? $t('note') : noteText"
                :hint="noteText"
                rows="3"
                no-resize
                maxlength="1000"
                @update:focused="(e: any) => (noteFocused = e)"
              ></v-textarea>
            </v-col>
          </v-row>
        </div>

        <div id="bottom-bar" class="pa-4 text-end mt-auto">
          <v-btn
            class="secondary-btn mr-2"
            color="brown"
            min-width="92"
            variant="text"
            rounded
            @click="closeForm"
          >
            {{ $t('cancel') }}
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
            {{ $t('save') }}
          </v-btn>
        </div>
      </v-card>
    </v-sheet>
    >
  </Teleport>
</template>

<script setup lang="ts">
import { useCurrentUser } from 'vuefire'
import { functions } from '@/firebase'
import { httpsCallable } from 'firebase/functions'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  close: []
}>()

const noteText = t('noteText')

const user = useCurrentUser()
const { checkpoints, selectedCheckpoint, selectedBuilding, selectedBuildingServices, snackbar } =
  storeToRefs(useAppStore())

const sending = ref(false)
const checkpointDialog = ref(false)
const selectedItem = ref(selectedCheckpoint.value)
const selectedItemId = ref(selectedCheckpoint.value?.id)
const note = ref('')
const noteFocused = ref(false)

watch(selectedItemId, () => {
  selectedItem.value = checkpoints.value.find(
    (checkpoint: any) => checkpoint.id === selectedItemId.value
  )
})

const createCleaningRequest = httpsCallable(functions, 'createCleaningRequest')

const closeForm = () => {
  emit('close')
}

const saveForm = () => {
  sending.value = true
  const cleaningService = selectedBuildingServices.value.find(
    (service: any) => service.type === 'cleaning'
  )
  createCleaningRequest({
    buildingID: selectedBuilding.value?.id,
    checkpointID: selectedItemId.value,
    serviceID: cleaningService?.id,
    userID: user.value?.uid,
    description: note.value,
  })
    .then(() => {
      snackbar.value = { value: true, text: t('requestWasCreated'), color: 'success' }
      closeForm()
    })
    .catch((error) => {
      const errorMessage = `${error.code}, ${error.message}, ${error.details}`
      console.log(errorMessage)
      snackbar.value = { value: true, text: errorMessage, color: 'error' }
      error.value = true
    })
    .finally(() => {
      sending.value = false
    })
}
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-secondary)) !important;
}

.v-list-item {
  background-color: rgb(var(--v-theme-background)) !important;
}

#bottom-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
