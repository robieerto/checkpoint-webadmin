<template>
  <v-container class="pr-10" fluid>
    <v-row>
      <v-col class="pb-0 ml-5">
        <h2>Hostia</h2>
      </v-col>
    </v-row>
    <v-row v-if="pending">
      <v-col style="max-width: 370px" justify="center" align="center">
        <v-progress-circular indeterminate :size="70" color="primary" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col style="max-width: 370px">
        <v-list height="80vh" class="py-0" :border="false" :rounded="true">
          <ExtUserActionPreviewItem
            v-for="extUserAction in extUserActions"
            :id="extUserAction.id"
            :key="extUserAction.id"
            :extUserAction="extUserAction"
            @click="selectItem(extUserAction)"
          />
        </v-list>
      </v-col>
      <v-col>
        <Detail v-if="selectedItem !== null" @close="closeDetail">
          <ExtOrderDetail v-if="selectedItem?.type === 'order'" :extUserAction="selectedItem" />
          <ExtQuestionDetail
            v-if="selectedItem?.type === 'question'"
            :extUserAction="selectedItem"
          />
          <ExtReviewDetail v-if="selectedItem?.type === 'review'" :extUserAction="selectedItem" />
          <ExtOccurrenceDetail
            v-if="selectedItem?.type === 'occurrence'"
            :extUserAction="selectedItem"
          />
        </Detail>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useCollection } from 'vuefire'
import { collection, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'

const { extUserActions, selectedBuilding } = storeToRefs(useAppStore())

const extUserActionsPath = computed(
  () => `Buildings/${selectedBuilding.value?.id}/externalUserActions`
)

const { data, pending } = useCollection(() =>
  query(collection(db, extUserActionsPath.value), orderBy('dateTime', 'desc'))
)

extUserActions.value = data

const selectedItem = ref(null) as any
const detailVisible = ref(false)

const selectItem = (item: any) => {
  selectedItem.value = item
  detailVisible.value = true
}

const closeDetail = () => {
  selectedItem.value = null
}
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
