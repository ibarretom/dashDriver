import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { useEffect, useState } from 'react'

import { AppButton } from '../components/buttons/AppButton'
import { BackButton } from '../components/buttons/BackButton'
import { AppTextInput } from '../components/inputs/AppTextInput'
import { AppDatePicker } from '../components/inputs/AppDatePicker'
import { AppPicker } from '../components/inputs/AppPicker'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import fuel from '../service/spent/fuel/fuel.service'

const fuelSchema = yup.object({
  type: yup.string().required('Escolha o tipo'),
  liters: yup
    .number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .positive('Este campo deve maior que zero')
    .required('Digite o valor'),
  amount: yup
    .number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .positive('Este campo deve maior que zero')
    .required('Digite o valor'),
  date: yup.string().required('Digite a data'),
})

export function Fuel({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      type: 'gas_natural',
      liters: 0,
      amount: 0,
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
    },
    resolver: yupResolver(fuelSchema),
  })

  useEffect(() => {
    if (isSubmitSuccessful) reset()
  }, [isSubmitSuccessful])

  async function handleFuelSubmit({ type, liters, amount, date }) {
    setIsLoading(true)

    const date_object = {
      day: parseInt(date.split('/')[0]),
      month: parseInt(date.split('/')[1]) - 1, // menos 1 porque no javascript o mes começa de 0 e o date picker de 1
      year: parseInt(date.split('/')[2]),
    }
    try {
      await fuel.create({
        type,
        amount,
        liters,
        fuel_date: new Date(
          date_object.year,
          date_object.month,
          date_object.day
        ),
      })

      Alert.alert(
        'Abastecimento adicionado',
        'Abastecimento adicionado com sucesso'
      )

      setIsLoading(false)
    } catch (e) {
      Alert.alert(
        'Erro ao adicionar abastecimento',
        'Não foi possível adicionar abastecimento'
      )

      setIsLoading(false)
    }
  }

  function navigateBack() {
    navigation.goBack()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>
        <View style={styles.header}>
          <BackButton onPress={navigateBack} />
          <Text style={styles.title}>Adicionar abastecimento</Text>
        </View>

        <ScrollView>
          <Controller
            control={control}
            name={'type'}
            render={({ field: { onChange, value } }) => (
              <AppPicker
                label={'Combustível'}
                items={[
                  { label: 'Gás natural (GNV)', value: 'gas_natural' },
                  { label: 'Gasolina', value: 'gasolina' },
                  { label: 'Etanol', value: 'etanol' },
                ]}
                value={value}
                setValue={onChange}
                error={errors.type?.message}
              />
            )}
          />

          <Controller
            control={control}
            name={'liters'}
            render={({ field: { onChange, value } }) => (
              <AppTextInput
                label={'Quantidade'}
                placeholder={'Litros'}
                inputMode={'numeric'}
                keyboardType={'numeric'}
                onChangeText={onChange}
                value={value}
                error={errors.liters?.message}
              />
            )}
          />

          <Controller
            control={control}
            name={'amount'}
            render={({ field: { onChange, value } }) => (
              <AppTextInput
                label={'Valor'}
                placeholder={'Valor'}
                inputMode={'numeric'}
                keyboardType={'numeric'}
                onChangeText={onChange}
                value={value}
                error={errors.amount?.message}
              />
            )}
          />

          <Controller
            control={control}
            name={'date'}
            render={({ field: { onChange, value } }) => (
              <AppDatePicker
                label={'Data'}
                value={value}
                setValue={onChange}
                error={errors.date?.message}
                maximumDate={
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate()
                  )
                }
              />
            )}
          />

          <View style={{ marginTop: 18 }}>
            <AppButton
              title={'Inserir abastecimento'}
              color={'#0E6ECE'}
              isLoading={isLoading}
              onPress={handleSubmit(handleFuelSubmit)}
            />
          </View>
          <View style={{ marginTop: 8 }}>
            <AppButton
              title={'Cancelar'}
              color={'#D6561A'}
              onPress={navigateBack}
            />
          </View>

          <View style={styles.emptySpace}></View>
        </ScrollView>
      </>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  addressText: {
    fontWeight: '300',
    marginBottom: 8,
  },
  emptySpace: {
    marginTop: 120,
  },
})
