import { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native'

import { AppButton } from '../components/buttons/AppButton'
import { BackButton } from '../components/buttons/BackButton'
import { AppTextInput } from '../components/inputs/AppTextInput'
import { AppDatePicker } from '../components/inputs/AppDatePicker'
import { AppPicker } from '../components/inputs/AppPicker'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import spent from '../service/spent/spent/spent.service'

const spendSchema = yup.object({
  spentType: yup.string().required('Insira o tipo de gasto'),
  amount: yup
    .number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .positive('Este campo deve maior que zero')
    .required('Digite o valor'),
  date: yup.string().required('Insira a data'),
})

export function Spent({ navigation }) {
  const [isLoading, setIsLoading] = useState()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      spentType: 'aluguel_de_carro',
      amount: 0,
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
    },
    resolver: yupResolver(spendSchema),
  })

  useEffect(() => {
    if (isSubmitSuccessful) reset()
  }, [isSubmitSuccessful])

  async function handleSpentSubmit({ spentType, amount, date }) {
    setIsLoading(true)

    const date_object = {
      day: parseInt(date.split('/')[0]),
      month: parseInt(date.split('/')[1]) - 1, // menos 1 porque no javascript o mes começa de 0 e o date picker de 1
      year: parseInt(date.split('/')[2]),
    }

    try {
      await spent.create({
        spent_type: spentType,
        amount,
        spent_date: new Date(
          date_object.year,
          date_object.month,
          date_object.day
        ).toISOString(),
      })

      Alert.alert('Despesa adicionada', 'Despesa adicionada com sucesso')

      setIsLoading(false)
    } catch (e) {
      Alert.alert(
        'Erro ao adicionar despesa',
        'Não foi possível adicionar despesa'
      )

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
        <Text style={styles.title}>Adicionar despesa</Text>
      </View>

      <ScrollView>
        <Controller
          control={control}
          name={'spentType'}
          render={({ field: { onChange, value } }) => (
            <AppPicker
              label={'Tipo de gasto'}
              items={[
                { label: 'Aluguel de carro', value: 'aluguel_de_carro' },
                { label: 'Manutenção', value: 'manutencao' },
                { label: 'Almoço', value: 'almoco' },
                { label: 'Outros', value: 'outros' },
              ]}
              value={value}
              setValue={onChange}
              error={errors.spentType?.message}
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
            title={'Inserir despesa'}
            color={'#0E6ECE'}
            isLoading={isLoading}
            onPress={handleSubmit(handleSpentSubmit)}
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
