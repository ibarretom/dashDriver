import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { AppSquareWithIconButton } from '../components/buttons/AppSquareWithIconButton'
import { AppPicker } from '../components/inputs/AppPicker'
import { RevenueCard } from '../components/RevenueCard'
import { Picture } from '../components/Picture'
import { CarInfo } from '../components/CarInfo'
import { Chart } from '../components/Chart'

import { months } from '../utils/months'

import { useNavigationState } from '@react-navigation/native'
import { useAuth } from '../hooks/auth'

import Revenue from '../service/revenue/revenue.service'
import carInfoService from '../service/carInfo/carInfo.service'

export function Home({ navigation }) {
  const { user } = useAuth()

  const state = useNavigationState((state) => state)

  const [resumeMonth, setResumeMonth] = useState(new Date().getMonth())
  const [revenue, setRevenue] = useState({
    earnings: [
      { label: 'Corridas', value: 25 },
      { label: 'Outros', value: 25 },
    ],
    spent: [
      { label: 'Aluguel de carro', value: 25, color: '#6085F7' },
      { label: 'Combustível', value: 12, color: '#0E6ECE' },
      { label: 'Manutenção', value: 20, color: '#2D9CED' },
      { label: 'Almoço', value: 30, color: '#68CEEE' },
      { label: 'Outros', value: 40, color: '#FACA9B' },
    ],
    total: [{ label: 'Total', value: 0 }],
  })

  const [carInfo, setCarInfo] = useState({
    kilometers: 0,
    fuel: {
      gas: 0,
      etanol: 0,
      gasoline: 0,
    },
    total_amount_fuel: 0,
  })
  const [loadingScreen, setLoadingScreen] = useState(false)

  useEffect(() => {
    Revenue.get({
      date: new Date(
        new Date().getFullYear(),
        resumeMonth,
        new Date().getDate()
      ),
    })
      .then((d) => {
        d.spent = d.spent.map((s) => {
          if (s.label == 'Aluguel de carro') {
            return {
              ...s,
              color: '#6085F7',
            }
          } else if (s.label == 'Combustível') {
            return {
              ...s,
              color: '#0E6ECE',
            }
          } else if (s.label == 'Manutenção') {
            return {
              ...s,
              color: '#2D9CED',
            }
          } else if (s.label == 'Almoço') {
            return {
              ...s,
              color: '#68CEEE',
            }
          } else if (s.label == 'Outros') {
            return {
              ...s,
              color: '#FACA9B',
            }
          }
        })
        setRevenue(d)
      })
      .catch((e) => console.log('home', e.message))

    carInfoService
      .get({
        date: new Date(
          new Date().getFullYear(),
          resumeMonth,
          new Date().getDate()
        ),
      })
      .then((d) => {
        setCarInfo(d)
      })
      .catch((e) => console.log('home', e.message))
  }, [resumeMonth, state])

  function navigate({ page }) {
    navigation.navigate(page)
  }

  return (
    <ScrollView style={styles.mainContainer}>
      <>
        <View style={styles.welcomeContainer}>
          <Picture
            setLoadingScreen={setLoadingScreen}
            userImage={user?.photo_url}
          />
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeText}>Bem-vindo, {user?.name}</Text>
            <Text>
              {`${new Date().getDate()} de ${
                months[new Date().getMonth()].label
              } de ${new Date().getFullYear()}`}{' '}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Adicionar</Text>
        <ScrollView style={styles.buttonsContainer} horizontal>
          <AppSquareWithIconButton
            iconName={'directions-car'}
            title={'Corrida'}
            onPress={() => navigate({ page: 'CarRide' })}
          />
          <AppSquareWithIconButton
            iconName={'local-gas-station'}
            title={'Abastecimento'}
            onPress={() => navigate({ page: 'Fuel' })}
          />
          <AppSquareWithIconButton
            iconName={'speed'}
            title={'Quilometragem'}
            onPress={() => navigate({ page: 'Kilometers' })}
          />
          <AppSquareWithIconButton
            iconName={'attach-money'}
            title={'Ganho'}
            onPress={() => navigate({ page: 'Earning' })}
          />
          <AppSquareWithIconButton
            iconName={'money-off'}
            title={'Despesa'}
            onPress={() => navigate({ page: 'Spent' })}
          />
        </ScrollView>

        <View>
          <Text style={styles.title}>Resumo</Text>
          <AppPicker
            value={resumeMonth}
            setValue={setResumeMonth}
            items={months}
          />
        </View>
        <Chart data={revenue.spent} />

        <Text style={styles.title}>Ganhos</Text>
        <View>
          {revenue.earnings.map((d, i) => (
            <RevenueCard
              key={i}
              title={d.label}
              value={d.value.toFixed(2)}
              color={'#04D64A'}
            />
          ))}
        </View>

        <Text style={styles.title}>Despesas</Text>
        <View>
          {revenue.spent.map((d, i) => (
            <RevenueCard
              key={i}
              title={d.label}
              value={d.value.toFixed(2)}
              color={'#D6561A'}
            />
          ))}
        </View>

        <Text style={styles.title}>Total</Text>
        <View>
          {revenue.total.map((d, i) => (
            <RevenueCard
              key={i}
              title={'Mês de ' + months[resumeMonth].label.toLowerCase()}
              value={d.value.toFixed(2)}
              color={'#0E6ECE'}
            />
          ))}
        </View>

        <View
          style={{
            borderBottomColor: 'E4E5E7',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 24,
            marginBottom: 12,
          }}
        />

        <Text style={styles.title}>Informações do carro</Text>
        <View style={styles.carInfoContent}>
          <CarInfo value={carInfo.kilometers.toFixed(1)} unit={'Km'} />

          <CarInfo
            value={
              carInfo.fuel.gasoline + carInfo.fuel.etanol != 0
                ? (
                    carInfo.kilometers /
                    (carInfo.fuel.gasoline + carInfo.fuel.etanol)
                  ).toFixed(1)
                : '0,0'
            }
            unit={'Km/L'}
          />
          <CarInfo
            value={
              carInfo.fuel.gas != 0
                ? (carInfo.kilometers / carInfo.fuel.gas).toFixed(1)
                : '0,0'
            }
            unit={'Km/m³'}
          />
        </View>
        <View style={styles.carInfoContent}>
          <CarInfo
            value={
              carInfo.total_amount_fuel != 0
                ? (carInfo.total_amount_fuel / carInfo.kilometers).toFixed(1)
                : '0,0'
            }
            unit={'R$/Km'}
          />
        </View>

        <View style={[styles.emptyspace]}></View>

        {loadingScreen && (
          <View style={[StyleSheet.absoluteFill, styles.uploadingOverlay]}>
            <ActivityIndicator color="#fff" animating size="large" />
          </View>
        )}
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
    marginBottom: 8,
  },
  welcomeTextContainer: {
    marginLeft: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  buttonsContainer: {
    marginTop: 8,
  },
  carInfoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  emptyspace: {
    marginBottom: 52,
  },
  uploadingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
