<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const setLang = (lang: string) => {
  locale.value = lang
}
</script>

<template>
  <v-btn size="large" class="mr-0" style="min-width: 0">
    {{ $i18n.locale.toUpperCase() }}
    <v-menu activator="parent">
      <v-list class="py-0">
        <v-list-item @click="setLang('cz')">
          <v-list-item-title>CZ</v-list-item-title>
        </v-list-item>
        <v-list-item @click="setLang('sk')">
          <v-list-item-title>SK</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>
