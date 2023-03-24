import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native'
import { useEffect, useState } from 'react'

import { AppButton } from '../components/buttons/AppButton'
import { BackButton } from '../components/buttons/BackButton'
import { AppDatePicker } from '../components/inputs/AppDatePicker'
import { AppTextInput } from '../components/inputs/AppTextInput'
import { AppPicker } from '../components/inputs/AppPicker'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import kilometer from '../service/kilometer/kilometer.service'

const kilometersSchema = yup.object({
  registerMoment: yup.string().required('Insira o momento do registro'),
  kilometers: yup
    .number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .positive('Este campo deve maior que zero')
    .required('Digite a quilometragem'),
  date: yup.string().required('Insira a data de registro da quilometragem'),
})

export function Kilometers({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      registerMoment: 'inicio',
      kilometers: 0,
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
    },
    resolver: yupResolver(kilometersSchema),
  })

  useEffect(() => {
    if (isSubmitSuccessful) reset()
  }, [isSubmitSuccessful])

  async function handleKilometersSubmit({ registerMoment, kilometers, date }) {
    setIsLoading(true)
    const date_object = {
      day: parseInt(date.split('/')[0]),
      month: parseInt(date.split('/')[1]) - 1, // menos 1 porque no javascript o mes começa de 0 e o date picker de 1
      year: parseInt(date.split('/')[2]),
    }
    try {
      const response = await kilometer.create({
        moment: registerMoment,
        amount: kilometers,
        kilometer_date: new Date(
          date_object.year,
          date_object.month,
          date_object.day
        ),
      })
      console.log(response)
      Alert.alert(
        'Quilometragem adicionada',
        'Quilometragem adicionada com sucesso'
      )

      setIsLoading(false)
    } catch (e) {
      console.log(e)
      if (e.status == 400) {
        if (e.message == 'Kilometer was already registered') {
          const moment = registerMoment == 'inicio' ? 'início' : 'fim'
          Alert.alert(
            'Erro ao adicionar quilometragem',
            `Quilometragem de ${moment} do dia já foi adicionada`
          )
        } else if (e.message == 'Kilometer is with invalid amount') {
          const mensagem =
            registerMoment == 'inicio'
              ? `Quilometragem de início do dia com valor maior que a quilometragem de fim do dia.`
              : `Quilometragem de fim do dia com valor menor que a quilometragem de início do dia.`

          Alert.alert('Erro ao adicionar quilometragem', mensagem)
        }
      } else {
        Alert.alert(
          'Erro ao adicionar quilometragem',
          'Não foi possível adicionar quilometragem'
        )
      }

      setIsLoading(false)
    }
  }

  function navigateBack() {
    navigation.goBack()
  }

  return (
    <>
      <View style={styles.header}>
        <BackButton onPress={navigateBack} />
        <Text style={styles.title}>Adicionar Quilometragem</Text>
      </View>

      <ScrollView>
        <Controller
          control={control}
          name={'registerMoment'}
          render={({ field: { onChange, value } }) => (
            <AppPicker
              label={'Momento do registro'}
              value={value}
              setValue={onChange}
              items={[
                { label: 'Inicio do dia', value: 'inicio' },
                { label: 'Fim do dia', value: 'fim' },
              ]}
              error={errors.registerMoment?.message}
            />
          )}
        />

        <Controller
          control={control}
          name={'kilometers'}
          render={({ field: { onChange, value } }) => (
            <AppTextInput
              label={'Quilometragem'}
              placeholder={'Quilometragem'}
              inputMode={'numeric'}
              keyboardType={'numeric'}
              onChangeText={onChange}
              value={value}
              error={errors.kilometers?.message}
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
            title={'Inserir quilometragem'}
            color={'#0E6ECE'}
            isLoading={isLoading}
            onPress={handleSubmit(handleKilometersSubmit)}
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
