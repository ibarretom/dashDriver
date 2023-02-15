import { StyleSheet, View, Text, ScrollView, Alert } from "react-native"
import { useEffect, useState } from "react"

import { AppButton } from "../components/buttons/AppButton"
import { BackButton } from "../components/buttons/BackButton"
import { AppTextInput } from "../components/inputs/AppTextInput"
import { AppDatePicker } from "../components/inputs/AppDatePicker"

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { db, addDoc, collection } from "../plugins/firebase"
import { useAuth } from "../hooks/auth"
import { months } from "../utils/months"

const earningSchema = yup.object({
  amount: yup
    .number()
    .transform((value) => (isNaN(value) || value === null || value === undefined) ? 0 : value)
    .positive('Este campo deve maior que zero')
    .required('Digite o valor'),
  date: yup.string().required('Insira a data')
})

export function Earning({ navigation }) {
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm({
    defaultValues: {
      amount: 0,
      date: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      description: ''
    },
    resolver: yupResolver(earningSchema)
  })

  useEffect(() => {
    if (isSubmitSuccessful) reset()
  }, [isSubmitSuccessful])

  async function handleEarningSubmit({ amount, date, description }) {
    setIsLoading(true)

    try {
      await addDoc(collection(db, 'earning'), {
        user_id: user.uid,
        amount,
        date: {
          month_name: months[date.split('/')[1] - 1].label, // menos 1 porque no javascript o mes começa de 0 e o date picker de 1
          day: parseInt(date.split('/')[0]),
          month: parseInt(date.split('/')[1]) - 1, // menos 1 porque no javascript o mes começa de 0 e o date picker de 1
          year: parseInt(date.split('/')[2]),
          date_string: date,
        },
        description
      })

      Alert.alert('Ganho adicionado', 'Ganho adicionado com sucesso')

      setIsLoading(false)

    } catch (e) {
      Alert.alert('Erro ao adicionar ganho', 'Não foi possível adicionar ganho')

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
        <Text style={styles.title}>Adicionar ganho</Text>
      </View>

      <ScrollView>
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
              maximumDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}
            />
          )}
        />

        <Controller
          control={control}
          name={'description'}
          render={({ field: { onChange, value } }) => (
            <AppTextInput
              label={'Descrição'}
              placeholder={'Descrição'}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <View style={{ marginTop: 18 }}>
          <AppButton
            title={'Inserir ganho'}
            color={'#0E6ECE'}
            isLoading={isLoading}
            onPress={handleSubmit(handleEarningSubmit)}
          />
        </View>
        <View style={{ marginTop: 8 }}>
          <AppButton title={'Cancelar'} color={'#D6561A'} onPress={navigateBack} />
        </View>

        <View style={styles.emptySpace}></View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8
  },
  addressText: {
    fontWeight: '300',
    marginBottom: 8
  },
  emptySpace: {
    marginTop: 120
  }
})