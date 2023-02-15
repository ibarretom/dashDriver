
import { useAuth } from "../hooks/auth";
import { db, collection, getDocs, query, where } from "../plugins/firebase"

export function useCarInfo() {
  const { user } = useAuth()

  async function getCarInfo(month) {
    const kilometers = await getKilometers(month)
    const fuel = await getFuel(month)

    const carInfo = {
      kilometers: 0,
      liters: 0,
      kilometersPerLitters: 0,
      realsPerLiter: 0
    }
    const real = { amount: 0 }

    kilometers.forEach(k => {
      if (k.register_moment === 'inicio') {
        carInfo.kilometers -= k.kilometers
      }

      if (k.register_moment === 'fim') {
        carInfo.kilometers += k.kilometers
      }
    })

    fuel.forEach(f => {
      carInfo.liters += f.liters

      real.amount += f.amount
    })

    carInfo.kilometersPerLitters = carInfo.liters === 0 ? 0 : carInfo.kilometers / carInfo.liters

    carInfo.realsPerLiter = carInfo.liters === 0 ? 0 : real.amount / carInfo.liters

    return carInfo
  }

  async function getKilometers(month) {
    const kilometers = []

    const kilometersRef = collection(db, 'kilometers')

    const q = query(kilometersRef, where('user_id', '==', user.uid), where('date.month_name', '==', month))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(d => kilometers.push(d.data()))

    return kilometers
  }

  async function getFuel(month) {
    const fuel = []

    const fuelRef = collection(db, 'fuel')

    const q = query(fuelRef, where('user_id', '==', user.uid), where('date.month_name', '==', month))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(d => fuel.push(d.data()))

    return fuel
  }

  return {
    getCarInfo
  }
} 