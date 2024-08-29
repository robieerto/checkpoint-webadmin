import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export const getUser = async (id: string) => {
  const appStore = useAppStore()
  const userDocRef = doc(db, 'Users', id)
  const userDocSnap = await getDoc(userDocRef)
  if (userDocSnap.exists()) {
    const userData = userDocSnap.data()
    appStore.user = userData
    return true
  }
  return false
}

export const getUserServices = async () => {
  const appStore = useAppStore()
  const services = []
  for (const service of appStore.user.services) {
    const serviceDocRef = doc(db, 'Services', service.id)
    const serviceDocSnap = await getDoc(serviceDocRef)
    if (serviceDocSnap.exists()) {
      const serviceData = serviceDocSnap.data()
      services.push(serviceData)
    }
  }
  appStore.services = services
}

export const getUserBuildings = async () => {
  const appStore = useAppStore()
  const buildingsIds = new Set(appStore.services.map((service: any) => service.building.id))
  const buildings = []
  for (const buildingId of buildingsIds) {
    const buildingDocRef = doc(db, 'Buildings', buildingId as string)
    const buildingDocSnap = await getDoc(buildingDocRef)
    if (buildingDocSnap.exists()) {
      const buildingData = buildingDocSnap.data()
      buildings.push({ ...buildingData, id: buildingId })
    }
  }
  appStore.buildings = buildings
}
