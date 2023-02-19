import { useState } from "react"

import { collection, db, getDocs, query, where } from "../plugins/firebase";

import { useAuth } from "../hooks/auth";

export function useCarRides() {
  const { user } = useAuth()

  async function getMostVisitedPlaces({ month, date }) {
    const carRides = await getAllCarRides()

    const carRidesByMonth = carRides.filter(ride => ride.date.month_name === month)
    const carRidesByDay = carRides.filter(ride => ride.date.date_string === date)
    const carRidesMoring = carRides.filter(ride => (ride.date.hour >= 6 && ride.date.hour < 12))
    const carRidesAfternoon = carRides.filter(ride => (ride.date.hour >= 12 && ride.date.hour < 18))
    const carRidesNight = carRides.filter(ride => ride.date.hour >= 18)
    const carRidesDawn = carRides.filter(ride => (ride.date.hour >= 0 && ride.date.hour < 6))

    const mostVisetdPlaces = calculeteMostVistedPlaces(carRides)
    const fiveMostVisetPlaces = getFiveMostVisitedPlaces(objectToArray(mostVisetdPlaces))

    const mostVisetdPlacesByMonth = calculeteMostVistedPlaces(carRidesByMonth)
    const fiveMostVisitedPlacesByMonth = getFiveMostVisitedPlaces(objectToArray(mostVisetdPlacesByMonth))

    const mostVisetdPlacesByDay = calculeteMostVistedPlaces(carRidesByDay)
    const fiveMostVisitedPlacesByDay = getFiveMostVisitedPlaces(objectToArray(mostVisetdPlacesByDay))

    const mostVisetdPlacesMorning = calculeteMostVistedPlaces(carRidesMoring)
    const fiveMostVisitedPlacesMorning = getFiveMostVisitedPlaces(objectToArray(mostVisetdPlacesMorning))

    const mostVisetdPlacesAfternoon = calculeteMostVistedPlaces(carRidesAfternoon)
    const fiveMostVisitedPlacesAfternoon = getFiveMostVisitedPlaces(objectToArray(mostVisetdPlacesAfternoon))

    const mostVisetdPlacesNight = calculeteMostVistedPlaces(carRidesNight)
    const fiveMostVisitedPlacesNight = getFiveMostVisitedPlaces(objectToArray(mostVisetdPlacesNight))

    const mostVisetdPlacesDawn = calculeteMostVistedPlaces(carRidesDawn)
    const fiveMostVisitedPlacesDawn = getFiveMostVisitedPlaces(objectToArray(mostVisetdPlacesDawn))


    return {
      mostVisited: fiveMostVisetPlaces,
      mostVisitedByMonth: fiveMostVisitedPlacesByMonth,
      mostVisitedByDay: fiveMostVisitedPlacesByDay,
      mostVisitedMorning: fiveMostVisitedPlacesMorning,
      mostVisitedAfternoon: fiveMostVisitedPlacesAfternoon,
      mostVisitedNight: fiveMostVisitedPlacesNight,
      mostVisitedDawn: fiveMostVisitedPlacesDawn
    }
  }

  async function getAllCarRides() {
    const carRides = []

    const carRidesRef = collection(db, 'car_ride')

    const q = query(carRidesRef, where('user_id', '==', user.uid))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(d => carRides.push(d.data()))

    return carRides
  }

  function calculeteMostVistedPlaces(rides) {
    const commonPlaces = {}

    rides.forEach(ride => {
      if (!commonPlaces[`${ride.address.neighborhood} - ${ride.address.city}`]) {
        commonPlaces[`${ride.address.neighborhood} - ${ride.address.city}`] = 1
      } else {
        commonPlaces[`${ride.address.neighborhood} - ${ride.address.city}`] += 1
      }
    })

    return commonPlaces
  }

  function getFiveMostVisitedPlaces(mostVisitedPlaces) {
    const fiveOrLessPlaces = []

    const sortedMostVisitedPlaces = mostVisitedPlaces.sort((a, b) => {
      if (a.data > b.data) {
        return -1
      }

      if (a.data < b.data) {
        return 1
      }

      return 0
    })

    for (let start = 0; start < 5; start++) {
      if (sortedMostVisitedPlaces[start]) {
        fiveOrLessPlaces.push(sortedMostVisitedPlaces[start])
      } else {
        break
      }
    }

    return fiveOrLessPlaces
  }

  function objectToArray(obj) {
    const array = []

    for (const key of Object.keys(obj)) {
      array.push({ id: key, data: obj[key] })
    }

    return array
  }


  return {
    getMostVisitedPlaces
  }
}