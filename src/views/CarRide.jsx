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
import { AppDatePicker } from '../components/inputs/AppDatePicker'
import { AppTextInput } from '../components/inputs/AppTextInput'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import carRide from '../service/carRide/carRide.service'

const carRideSchema = yup.object({
  zipCode: yup
    .string()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .length(8, 'O CEP deve ter 8 dígitos')
    .required('Digite o cep'),
  amount: yup
    .number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .positive('Este campo deve maior que zero')
    .required('Digite o valor'),
  date: yup.string().required('Digite a data'),
  time: yup.string().required('Este campo deve ser preenchido'),
})

export function CarRide({ navigation }) {
  const [address, setAddress] = useState({
    street: '',
    neighborhood: '',
    city: '',
    federated_unit: '',
  })

  const [sendingData, setSendingData] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      zipCode: '',
      amount: 0,
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    },
    resolver: yupResolver(carRideSchema),
  })

  const zipCode = watch('zipCode')

  useEffect(() => {
    if (isSubmitSuccessful) reset()
  }, [isSubmitSuccessful])

  useEffect(() => {
    if (zipCode.length == 8) {
      fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
        .then((r) => r.json())
        .then((d) => {
          setAddress({
            street: d.logradouro,
            neighborhood: d.bairro,
            city: d.localidade,
            federated_unit: d.uf,
          })
        })
        .catch((e) => console.log(e))
    }

    if (zipCode != 8 && address != '') {
      setAddress('')
    }
  }, [zipCode])

  async function handleSubmitCarRide({ zipCode, amount, date, time }) {
    setSendingData(true)

    const dateObject = {
      day: parseInt(date.split('/')[0]),
      month: parseInt(date.split('/')[1]) - 1, // menos 1 porque no javascript o mes começa de 0 e o date picker de 1
      year: parseInt(date.split('/')[2]),
      hour: parseInt(time.split(':')[0]),
      minute: parseInt(time.split(':')),
    }

    try {
      await carRide.create({
        amount,
        address: {
          zip_code: Number(zipCode),
          ...address,
        },
        iso_date: new Date(
          dateObject.year,
          dateObject.month,
          dateObject.day,
          dateObject.hour,
          dateObject.minute
        ).toISOString(),
      })

      Alert.alert('Corrida adicionada', 'A corrida foi adicionada com sucesso')

      setSendingData(false)
    } catch (e) {
      console.log(e)
      Alert.alert(
        'Erro ao adicionar corrida',
        'Não foi possível adicionar a corrida'
      )

      setSendingData(false)
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
          <Text style={styles.title}>Adicionar corrida</Text>
        </View>

        <ScrollView>
          <Controller
            control={control}
            name={'zipCode'}
            render={({ field: { onChange, value } }) => (
              <AppTextInput
                label={'Digite o cep de onde pegou a corrida'}
                placeholder={'Cep'}
                inputMode={'numeric'}
                keyboardType={'numeric'}
                onChangeText={onChange}
                maxLength={8}
                value={value}
                error={errors.zipCode?.message}
              />
            )}
          />
          {!!address && (
            <Text
              style={styles.addressText}
            >{`${address.street} - ${address.neighborhood} - ${address.city} - ${address.federated_unit}`}</Text>
          )}

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

          <Controller
            control={control}
            name={'time'}
            render={({ field: { onChange, value } }) => (
              <AppDatePicker
                label={'Hora'}
                timeMode={'time'}
                icon={'access-time'}
                value={value}
                setValue={onChange}
                error={errors.time?.message}
              />
            )}
          />

          <View style={{ marginTop: 18 }}>
            <AppButton
              title={'Inserir corrida'}
              color={'#0E6ECE'}
              isLoading={sendingData}
              onPress={handleSubmit(handleSubmitCarRide)}
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
    marginTop: 70,
  },
})
