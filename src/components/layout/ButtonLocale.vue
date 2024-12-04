<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const appStore = useAppStore()

const languages = computed(() => appStore?.selectedBuilding?.availableLanguages ?? ['sk'])

const setLang = (lang: string) => {
  locale.value = lang
}
</script>

<template>
  <v-btn size="large" class="mr-0" style="min-width: 0">
    {{ $i18n.locale.toUpperCase() }}
    <v-menu activator="parent">
      <v-list class="py-0">
        <v-list-item v-for="lang in languages" @click="setLang(lang)">
          <v-list-item-title>{{ lang.toUpperCase() }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>
