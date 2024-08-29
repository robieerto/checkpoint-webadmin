<template>
  <h2>Checkpoint: {{ checkpoint?.name }}</h2>
  <h3 class="pt-3">Poschodie: {{ floor?.name }}</h3>
  <h3 class="pt-3">Stav: {{ checkpoint?.state }}</h3>
</template>

<script setup lang="ts">
import { _RefFirestore, useDocument } from 'vuefire'
import { doc, DocumentData } from 'firebase/firestore'
import { db } from '@/firebase'

const props = defineProps<{
  itemId: string
}>()

const appStore = useAppStore()
const path = `Buildings/${appStore.selectedBuilding.id}/checkpoints`
var checkpoint = null as _RefFirestore<DocumentData | undefined> | null
var floor = null as _RefFirestore<DocumentData | undefined> | null

watch(
  () => props.itemId,
  () => {
    attachCheckpointListener()
  }
)

const attachCheckpointListener = () => {
  checkpoint?.stop()
  floor?.stop()

  console.log(props.itemId)

  checkpoint = useDocument(doc(db, path, props.itemId))

  watch(checkpoint, () => {
    if (checkpoint && checkpoint.value?.floor) {
      floor = useDocument(doc(db, checkpoint.value?.floor))
    }
  })
}

attachCheckpointListener()
</script>
