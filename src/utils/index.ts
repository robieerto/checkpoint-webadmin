import { useI18n } from 'vue-i18n'

export function formatTimestamp(timestampInSeconds: number): string {
  const date = new Date(timestampInSeconds * 1000) // Convert seconds to milliseconds
  return date
    .toLocaleString('sk-SK', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replaceAll('. ', '.') // Remove space after dot
}

export const getInitial = (username: string) => {
  return username ? username.charAt(0).toUpperCase() : ''
}

export function translateActionState(actionState: string): string {
  const { t } = useI18n()

  switch (actionState) {
    case 'created':
      return t('stateRequest')
    case 'workStarted':
      return t('stateWorkStarted')
    case 'completelyFixed':
      return t('stateWorkDone')
    case 'partiallyFixed':
      return t('stateWorkPartiallyDone')
    case 'checkOk':
      return t('stateCheckOk')
    case 'checkFailed':
      return t('stateCheckFailed')
    default:
      return actionState
  }
}
