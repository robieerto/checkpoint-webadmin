import { collection, doc, getDoc, query, where } from 'firebase/firestore'
import { db } from '@/firebase'
import { useCollection } from 'vuefire'

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
      services.push({ ...serviceData, id: service.id })
    }
  }
  appStore.userServices = services
}

export const getUserBuildings = async () => {
  const appStore = useAppStore()
  const buildingsIds = new Set(appStore.userServices.map((service: any) => service.building.id))
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

export const getSelectedBuildingServices = async () => {
  const appStore = useAppStore()
  const selectedBuildingRef = doc(db, 'Buildings', appStore.selectedBuilding.id)
  const selectedBuildingServices = useCollection(
    query(collection(db, 'Services'), where('building', '==', selectedBuildingRef)),
    {
      once: true,
    }
  )
  // await for the data to be fetched
  await selectedBuildingServices.promise.value
  appStore.selectedBuildingServices = selectedBuildingServices.value
}

export const getSelectedBuildingEmployees = async () => {
  const appStore = useAppStore()
  const buildingServiceRefs = [] as any[]
  appStore.selectedBuildingServices.forEach((service: any) => {
    buildingServiceRefs.push(doc(db, 'Services', service.id))
  })
  const selectedBuildingEmployees = useCollection(
    query(collection(db, 'Users'), where('services', 'array-contains-any', buildingServiceRefs)),
    {
      once: true,
    }
  )
  // await for the data to be fetched
  await selectedBuildingEmployees.promise.value
  appStore.employees = selectedBuildingEmployees.value
}
