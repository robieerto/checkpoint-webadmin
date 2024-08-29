// import { _RefFirestore, useCollection } from 'vuefire'
// import { collection, DocumentData } from 'firebase/firestore'
// import { db } from '@/firebase'

// const detailRef = null as _RefFirestore<DocumentData> | null

// export const attachCheckpointListener = (checkpointId: string) => {
//   const appStore = useAppStore()
//   const path = `Buildings/${appStore.selectedBuilding}/checkpoints/${checkpointId}`
//   detailRef?.stop() // Stop the previous listener
//   detailRef = useCollection(collection(db, path))
//   watch(collectionRefs.checkpoints, (checkpointsCollection) => {
//     appStore.checkpoints = checkpointsCollection
//   })
// }
