import { StyleSheet, View, Text, ScrollView, Alert } from "react-native"
import { useEffect, useState } from "react"

import { AppButton } from "../components/buttons/AppButton"
import { BackButton } from "../components/buttons/BackButton"
import { AppDatePicker } from "../components/inputs/AppDatePicker"
import { AppTextInput } from "../components/inputs/AppTextInput"
import { AppPicker } from "../components/inputs/AppPicker"

import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { db, addDoc, collection, query, where, getDocs } from "../plugins/firebase"
import { useAuth } from "../hooks/auth"
import { months } from "../utils/months"

const kilometersSchema = yup.object({
  registerMoment: yup.string().required('Insira o momento do registro'),
  kilometers: yup
    .number()
    .transform((value) => (isNaN(value) || value === null || value === undefined) ? 0 : value)
    .positive('Este campo deve maior que zero')
    .required('Digite a kilometragem'),
  date: yup.string().required('Inisra a data de registro da kilometragem')
})

export function Kilometers({ navigation }) {
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm({
    defaultValues: {
      registerMoment: 'inicio',
      kilometers: 0,
      date: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
    },
    resolver: yupResolver(kilometersSchema)
  })

  useEffect(() => {
    if (isSubmitSuccessful) reset()
  }, [isSubmitSuccessful])

  async function handleKilometersSubmit({ registerMoment, kilometers, date }) {
    setIsLoading(true)

    try {
      const kilometersRegister = await getKilometersList({ registerMoment, kilometers, date })

      if (
        kilometersRegister.length > 0 &&
        kilometerWasAlreadyRegister({ kilometersArray: kilometersRegister, registerMoment })
      ) {
        setIsLoading(false)
        return
      }

      if (
        kilometersRegister.length > 0 &&
        kilometerIsInvalid({ kilometersArray: kilometersRegister, registerMoment, kilometers })
      ) {
        setIsLoading(false)
        return
      }

      await addDoc(collection(db, 'kilometers'), {
        user_id: user.uid,
        register_moment: registerMoment,
        kilometers,
        date: {
          month_name: months[date.split('/')[1] - 1].label, // menos 1 porque no javascript o mes começa de 0 e o date picker de 1
          day: parseInt(date.split('/')[0]),
          month: parseInt(date.split('/')[1]) - 1, // menos 1 porque no javascript o mes começa de 0 e o date picker de 1
          year: parseInt(date.split('/')[2]),
          date_string: date,
        },
      })

      Alert.alert('Kilometragem adicionada', 'Kilometragem adicionada com sucesso')

      setIsLoading(false)
    } catch (e) {
      Alert.alert('Erro ao adicionar kilometragem', 'Não foi possível adicionar kilometragem')
      
      setIsLoading(false)
    }
  }

  async function getKilometersList({ date }) {
    const kilometersRegister = []

    const kilometersRef = collection(db, 'kilometers')
    const q = query(kilometersRef, where('user_id', '==', user.uid), where('date.date_string', '==', date))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(d => kilometersRegister.push(d.data()))

    return kilometersRegister
  }

  function kilometerWasAlreadyRegister({ kilometersArray, registerMoment }) {
    if (kilometersArray.filter(k => k.register_moment == registerMoment).length > 0) {
      Alert.alert('Kilometragem já adicionada', `Você já adicionou a kilometragem de ${registerMoment} do dia`)

      setIsLoading(false)
      
      return true
    }

    return false
  }

  function kilometerIsInvalid({ kilometersArray, kilometers }) {

    if (kilometersOfBeginingIsInvalid({ kilometersArray, kilometers })) {
      Alert.alert(
        'Kilometragem final menor que kilometragem inicial',
        `Você está tentando adicionar uma kilometragem final menor do que a kilometragem inicial cadastrada`
      )

      return true
    }

    if (kilometersOfEndIsInvalid({ kilometersArray, kilometers })) {
      Alert.alert(
        'Kilometragem inicial maior que kilometragem final',
        `Você está tentando adicionar uma kilometragem inicial maior do que a kilometragem final cadastrada`
      )

      return true
    }

    return false
  }

  function kilometersOfBeginingIsInvalid({ kilometersArray, kilometers }) {
    const beginKilometer = kilometersArray.filter(k => k.register_moment === 'inicio')[0]

    if (!!beginKilometer && beginKilometer.kilometers > kilometers) {
      return true
    }

    return false
  }

  function kilometersOfEndIsInvalid({ kilometersArray, kilometers }) {
    const endKilometer = kilometersArray.filter(k => k.register_moment === 'fim')[0]

    if (!!endKilometer && endKilometer.kilometers < kilometers) {
      return true
    }

    return false
  }

  function navigateBack() {
    navigation.goBack()
  }

  return (
    <>
      <View style={styles.header}>
        <BackButton onPress={navigateBack} />
        <Text style={styles.title}>Adicionar Kilometragem</Text>
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
                { label: 'Fim do dia', value: 'fim' }
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
              label={'Kilometragem'}
              placeholder={'Kilometragem'}
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
              maximumDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}
            />
          )}
        />

        <View style={{ marginTop: 18 }}>
          <AppButton
            title={'Inserir kilometragem'}
            color={'#0E6ECE'}
            isLoading={isLoading}
            onPress={handleSubmit(handleKilometersSubmit)}
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