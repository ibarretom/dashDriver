import { useNavigationState } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { AppDatePicker } from '../components/inputs/AppDatePicker'
import { AppPicker } from '../components/inputs/AppPicker'
import { PlaceCard } from '../components/PlaceCard'

import { useAddress } from '../hooks/address'

import { months } from '../utils/months'

export function CarRidesResume() {
  const mostVisited = useAddress()

  const [month, setMonth] = useState(months[new Date().getMonth()].value)
  const [date, setDate] = useState(
    `${new Date().getDate()}/${
      new Date().getMonth() + 1
    }/${new Date().getFullYear()}`
  )
  const [mostVisitedPlaces, setMostVisitedPlaces] = useState({
    mostVisited: [],
    mostVisitedByMonth: [],
    mostVisitedByDay: [],
    mostVisitedMorning: [],
    mostVisitedAfternoon: [],
    mostVisitedNight: [],
    mostVisitedDawn: [],
  })
  const state = useNavigationState((state) => state)

  useEffect(() => {
    mostVisited
      .get({ month, date })
      .then((d) => {
        setMostVisitedPlaces(d)
      })
      .catch((e) => console.log(e))
  }, [month, date, state])

  return (
    <ScrollView>
      <View style={styles.dateContainer}>
        <View style={{ flexGrow: 1, marginRight: 16 }}>
          <Text style={styles.title}>Mês</Text>
          <AppPicker value={month} setValue={setMonth} items={months} />
        </View>

        <View style={{ flexGrow: 1 }}>
          <Text style={styles.title}>Dia</Text>
          <AppDatePicker
            value={date}
            setValue={setDate}
            maximumDate={
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate()
              )
            }
          />
        </View>
      </View>

      <Text style={styles.title}>Locais com mais corridas</Text>

      {mostVisitedPlaces.mostVisited.length > 0 ? (
        mostVisitedPlaces.mostVisited.map((place, i) => (
          <PlaceCard key={i} title={place.id} value={place.value} />
        ))
      ) : (
        <Text style={styles.emptyRide}>Nenhuma corrida foi realizada</Text>
      )}

      <Text style={styles.title}>Locais com mais corridas por mês</Text>

      {mostVisitedPlaces.mostVisitedByMonth.length > 0 ? (
        mostVisitedPlaces.mostVisitedByMonth.map((place, i) => (
          <PlaceCard key={i} title={place.id} value={place.value} />
        ))
      ) : (
        <Text style={styles.emptyRide}>
          Nenhuma corrida registrada para este mês
        </Text>
      )}

      <Text style={styles.title}>Locais com mais corridas por dia</Text>

      {mostVisitedPlaces.mostVisitedByDay.length > 0 ? (
        mostVisitedPlaces.mostVisitedByDay.map((place, i) => (
          <PlaceCard key={i} title={place.id} value={place.value} />
        ))
      ) : (
        <Text style={styles.emptyRide}>
          Nenhuma corrida registrada para este dia
        </Text>
      )}

      <Text style={styles.title}>Locais com mais corridas por horário</Text>

      <Text style={styles.subTitle}>6:00 até 12:00</Text>

      {mostVisitedPlaces.mostVisitedMorning.length > 0 ? (
        mostVisitedPlaces.mostVisitedMorning.map((place, i) => (
          <PlaceCard key={i} title={place.id} value={place.value} />
        ))
      ) : (
        <Text style={styles.emptyRide}>
          Nenhuma corrida registrada para este dia
        </Text>
      )}

      <Text style={styles.subTitle}>12:00 até 18:00</Text>

      {mostVisitedPlaces.mostVisitedAfternoon.length > 0 ? (
        mostVisitedPlaces.mostVisitedAfternoon.map((place, i) => (
          <PlaceCard key={i} title={place.id} value={place.value} />
        ))
      ) : (
        <Text style={styles.emptyRide}>
          Nenhuma corrida registrada para este dia
        </Text>
      )}

      <Text style={styles.subTitle}>18:00 até 00:00</Text>

      {mostVisitedPlaces.mostVisitedNight.length > 0 ? (
        mostVisitedPlaces.mostVisitedNight.map((place, i) => (
          <PlaceCard key={i} title={place.id} value={place.value} />
        ))
      ) : (
        <Text style={styles.emptyRide}>
          Nenhuma corrida registrada para este dia
        </Text>
      )}

      <Text style={styles.subTitle}>00:00 até 06:00</Text>

      {mostVisitedPlaces.mostVisitedDawn.length > 0 ? (
        mostVisitedPlaces.mostVisitedDawn.map((place, i) => (
          <PlaceCard key={i} title={place.id} value={place.value} />
        ))
      ) : (
        <Text style={styles.emptyRide}>
          Nenhuma corrida registrada para este dia
        </Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  subTitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  emptyRide: {
    marginVertical: 8,
    padding: 12,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: '#E4E5E7',
    borderRadius: 8,
  },
})
