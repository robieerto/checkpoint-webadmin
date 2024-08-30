import { _RefFirestore, useCollection } from 'vuefire'
import { collection, DocumentData } from 'firebase/firestore'
import { db } from '@/firebase'

const collectionRefs = {
  checkpoints: null as _RefFirestore<DocumentData | undefined> | null,
}

export const stopAllListeners = () => {
  Object.values(collectionRefs).forEach((ref) => {
    ref?.stop()
  })
}

export const attachCheckpointsListener = (buildingId: string) => {
  const appStore = useAppStore()
  const path = `Buildings/${buildingId}/checkpoints`
  collectionRefs.checkpoints?.stop() // Stop the previous listener
  collectionRefs.checkpoints = useCollection(collection(db, path))
  watch(collectionRefs.checkpoints, (checkpointsCollection) => {
    appStore.checkpoints = checkpointsCollection
  })
}
