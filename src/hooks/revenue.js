import { useAuth } from "../hooks/auth";

import { db, collection, getDocs, query, where } from "../plugins/firebase";

export function useRevenue() {
  const { user } = useAuth()

  function getTotalRevenue(revenue) {
    const total = {
      amount: 0
    }

    revenue.earnings.forEach(e => {
      total.amount += e.value
    })

    revenue.spents.forEach(s => {
      total.amount -= s.value
    })

    return total.amount
  }

  async function getRevenue(month) {
    const monthSpents = await getMonthSpents(month)
    const monthEarnings = await getMonthEarnings(month)

    const earningClassifiedData = {
      'Ganho': 0,
      'Outros': 0,
    }

    const spentClassifiedData = {
      'Aluguel de carro': 0,
      'Combustível': 0,
      'Manutenção': 0,
      'Almoço': 0,
      'Outros': 0
    }

    monthEarnings.carRides.forEach(s => {
      earningClassifiedData['Ganho'] += s.amount
    })

    monthEarnings.earnings.forEach(s => {
      earningClassifiedData['Outros'] += s.amount
    })

    monthSpents.fuel.forEach(s => {
      spentClassifiedData['Combustível'] += s.amount
    })

    monthSpents.spent.forEach(s => {
      if (s.spent_type === 'aluguel_de_carro') {
        spentClassifiedData['Aluguel de carro'] += s.amount
      }

      if (s.spent_type === 'manutencao') {
        spentClassifiedData['Manutenção'] += s.amount
      }

      if (s.spent_type === 'almoco') {
        spentClassifiedData['Almoço'] += s.amount
      }

      if (s.spent_type === 'outros') {
        spentClassifiedData['Outros'] += s.amount
      }
    })

    const revenue = {
      earnings: [
        { label: 'Corridas', value: earningClassifiedData['Ganho'] },
        { label: 'Outros', value: earningClassifiedData['Outros'] },
      ],
      spents: [
        { label: 'Aluguel de carro', value: spentClassifiedData['Aluguel de carro'], color: '#6085F7' },
        { label: 'Combustível', value: spentClassifiedData['Combustível'], color: '#0E6ECE' },
        { label: 'Manutenção', value: spentClassifiedData['Manutenção'], color: '#2D9CED' },
        { label: 'Almoço', value: spentClassifiedData['Almoço'], color: '#68CEEE' },
        { label: 'Outros', value: spentClassifiedData['Outros'], color: '#FACA9B' },
      ]
    }

    return revenue

  }

  async function getMonthSpents(month) {
    const fuel = await getFuel(month)
    const spent = await getSpents(month)

    return { fuel, spent }
  }

  async function getMonthEarnings(month) {
    const carRides = await getCarRide(month)
    const earnings = await getEarnings(month)

    return { carRides, earnings }
  }

  async function getCarRide(month) {
    const carRides = []

    const carRideRef = collection(db, 'car_ride')

    const q = query(carRideRef, where('user_id', '==', user.uid), where('date.month_name', '==', month))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(d => carRides.push(d.data()))

    return carRides
  }

  async function getFuel(month) {
    const fuel = []

    const fuelRef = collection(db, 'fuel')

    const q = query(fuelRef, where('user_id', '==', user.uid), where('date.month_name', '==', month))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(d => fuel.push(d.data()))

    return fuel
  }

  async function getEarnings(month) {
    const earnings = []

    const earningRef = collection(db, 'earning')

    const q = query(earningRef, where('user_id', '==', user.uid), where('date.month_name', '==', month))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(d => earnings.push(d.data()))

    return earnings
  }

  async function getSpents(month) {
    const spents = []

    const spentRef = collection(db, 'spent')

    const q = query(spentRef, where('user_id', '==', user.uid), where('date.month_name', '==', month))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(d => spents.push(d.data()))

    return spents
  }

  return {
    getRevenue,
    getTotalRevenue
  }
}