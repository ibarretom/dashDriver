import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";

import { AppTextInput } from "../components/inputs/AppTextInput";
import { AppButton } from "../components/buttons/AppButton";
import { BackButton } from "../components/buttons/BackButton";

import { useForm, Controller } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"

import { useAuth } from "../hooks/auth"
import { useState } from "react";
import { useUser } from "../hooks/user"

const registerSchema = yup.object({
  name: yup.string().required('Digite o nome'),
  email: yup.string().email('Email inválido').required('Digite o email'),
  password: yup.string().min(6, 'Senha com no mínimo 6 caracteres').required('Digite a senha'),
  password_confirmation: yup
    .string()
    .required('Digite a confirmação de senha')
    .oneOf([yup.ref('password'), null], 'As senhas devem coincindir')
})

export function Register({ navigation }) {
  const { updateUserName } = useUser()
  const { createUser } = useAuth()

  const [isLoading, setIsLoading] = useState()
  const [errorCreatingUser, setErrorCreatingUser] = useState()

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    },
    resolver: yupResolver(registerSchema)
  })


  async function handleRegister({ name, email, password }) {
    setIsLoading(true)
    try {
      await createUser({ email, password })
      await updateUserName(name)

    } catch (err) {
      setErrorCreatingUser('Não foi possível criar usuário')
    } finally {
      setIsLoading(false)
    }
  }

  function navigateBack() {
    navigation.goBack()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.mainContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <BackButton onPress={navigateBack} />
          <Text style={styles.title}>Registrar-se</Text>
        </View>

        <Controller
          control={control}
          name='name'
          render={({ field: { onChange } }) => (
            <AppTextInput
              label={'Nome'}
              placeholder={'Nome'}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name='email'
          render={({ field: { onChange } }) => (
            <AppTextInput
              label={'Email'}
              placeholder={'Email'}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name='password'
          render={({ field: { onChange } }) => (
            <AppTextInput
              label={'Senha'}
              secureTextEntry
              placeholder={'Senha'}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password_confirmation"
          render={({ field: { onChange } }) => (
            <AppTextInput
              secureTextEntry
              label={'Confirmação de senha'}
              placeholder={'Confirmação de senha'}
              onChangeText={onChange}
              error={errors.password_confirmation?.message}
            />
          )}
        />

        <View style={{ marginTop: 16 }}>
          <AppButton
            title={'Registrar-se'}
            color={'#1E232C'}
            isLoading={isLoading}
            onPress={handleSubmit(handleRegister)}
          />
        </View>

        {!!errorCreatingUser && <Text style={styles.errorMessage}>{errorCreatingUser}</Text>}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  mainContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 8
  },
  errorMessage: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: 'red'
  }
})
