import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native"

import { AppSquareWithIconButton } from "../components/buttons/AppSquareWithIconButton"
import { AppPicker } from "../components/inputs/AppPicker"
import { RevenueCard } from "../components/RevenueCard"
import { Picture } from "../components/Picture"
import { CarInfo } from "../components/CarInfo"
import { Chart } from "../components/Chart"

import { months } from "../utils/months"

import { useRevenue } from "../hooks/revenue"
import { useCarInfo } from "../hooks/carInfo"
import { useNavigationState } from "@react-navigation/native";
import { useAuth } from "../hooks/auth";

export function Home({ navigation }) {
  const { user } = useAuth()

  const { getRevenue, getTotalRevenue } = useRevenue()
  const { getCarInfo } = useCarInfo()
  const state = useNavigationState(state => state);

  const [resumeMonth, setResumeMonth] = useState(months[new Date().getMonth()].label)
  const [revenue, setRevenue] = useState({
    earnings: [
      { label: 'Corridas', value: 25 },
      { label: 'Outros', value: 25 },
    ],
    spents: [
      { label: 'Aluguel de carro', value: 25, color: '#6085F7' },
      { label: 'Combustível', value: 12, color: '#0E6ECE' },
      { label: 'Munutenção', value: 20, color: '#2D9CED' },
      { label: 'Almoço', value: 30, color: '#68CEEE' },
      { label: 'Outros', value: 40, color: '#FACA9B' },
    ]
  })
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [carInfo, setCarInfo] = useState({
    kilometers: 0,
    liters: 0,
    kilometersPerLitters: 0,
    realsPerLiter: 0
  })

  useEffect(() => {
    getRevenue(resumeMonth)
      .then(d => {
        setRevenue(d)
      })
      .catch(e => console.log('home', e.message))

    getCarInfo(resumeMonth)
      .then(d => setCarInfo(d))
      .catch(e => console.log('home', e.message))
  }, [resumeMonth, state])

  useEffect(() => {
    setTotalRevenue(getTotalRevenue(revenue))
  }, [revenue])

  function navigate({ page }) {
    navigation.navigate(page)
  }

  return (
    <ScrollView style={styles.mainContainer}>
      <>
        <View style={styles.welcomeContainer}>
          <Picture />
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeText}>Bem-vindo, {user?.displayName}</Text>
            <Text>{`${new Date().getDate()} de ${months[new Date().getMonth()].label} de ${new Date().getFullYear()}`} </Text>
          </View>
        </View>

        <Text style={styles.title}>Adicionar</Text>
        <ScrollView style={styles.buttonsContainer} horizontal>
          <AppSquareWithIconButton iconName={'directions-car'} title={'Corrida'} onPress={() => navigate({ page: 'CarRide' })} />
          <AppSquareWithIconButton iconName={'local-gas-station'} title={'Abastecimento'} onPress={() => navigate({ page: 'Fuel' })} />
          <AppSquareWithIconButton iconName={'speed'} title={'Kilometragem'} onPress={() => navigate({ page: 'Kilometers' })} />
          <AppSquareWithIconButton iconName={'attach-money'} title={'Ganho'} onPress={() => navigate({ page: 'Earning' })} />
          <AppSquareWithIconButton iconName={'money-off'} title={'Despesa'} onPress={() => navigate({ page: 'Spent' })} />
        </ScrollView>

        <View>
          <Text style={styles.title}>Resumo</Text>
          <AppPicker value={resumeMonth} setValue={setResumeMonth} items={months} />
        </View>
        <Chart data={revenue.spents} />

        <Text style={styles.title}>Ganhos</Text>
        <View>
          {revenue.earnings.map((d, i) => <RevenueCard key={i} title={d.label} value={d.value.toFixed(2)} color={"#04D64A"} />)}
        </View>

        <Text style={styles.title}>Despesas</Text>
        <View>
          {revenue.spents.map((d, i) => <RevenueCard key={i} title={d.label} value={d.value.toFixed(2)} color={"#D6561A"} />)}
        </View>

        <Text style={styles.title}>Total</Text>
        <View>
          <RevenueCard
            title={"Mês de " + months[new Date().getMonth()].label.toLowerCase()}
            value={totalRevenue.toFixed(2)}
            color={"#0E6ECE"}
          />
        </View>

        <View
          style={{
            borderBottomColor: 'E4E5E7',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 24,
            marginBottom: 12
          }}
        />

        <Text style={styles.title}>Informações do carro</Text>
        <View style={styles.carInfoContent}>
          <CarInfo value={carInfo.kilometers.toFixed(1)} unit={"Km"} />

          <CarInfo value={carInfo.kilometersPerLitters.toFixed(2)} unit={"Km/L"} />

          <CarInfo value={carInfo.realsPerLiter.toFixed(2)} unit={"R$/L"} />
        </View>

        <View style={[styles.emptyspace]}></View>
      </>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 16,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  welcomeTextContainer: {
    marginLeft: 16
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16
  },
  buttonsContainer: {
    marginTop: 8
  },
  carInfoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  emptyspace: {
    marginBottom: 52
  },
})