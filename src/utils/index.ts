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

export function translateActionState(actionState: string): string {
  switch (actionState) {
    case 'created':
      return 'žiadosť'
    case 'workStarted':
      return 'začatá práca'
    case 'completelyFixed':
      return 'dokončené'
    case 'partiallyFixed':
      return 'nedokončené'
    case 'checkOk':
      return 'kontrola v poriadku'
    case 'checkFailed':
      return 'nedostatok pri kontrole'
    default:
      return actionState
  }
}
