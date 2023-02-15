import { StyleSheet, View, Text, Keyboard, TouchableWithoutFeedback } from "react-native";

import { AppTextInput } from "../components/inputs/AppTextInput";
import { AppButton } from "../components/buttons/AppButton";

import { useForm, Controller } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"

import { useAuth } from "../hooks/auth"
import { useState } from "react";

const loginSchema = yup.object({
  email: yup.string().email('Email inválido').required('Digite o email'),
  password: yup.string().required('Digite a senha'),
})


export function Login({ navigation }) {
  const { signIn } = useAuth()

  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(loginSchema)
  })

  async function handleLogin({ email, password }) {
    setIsLoading(true)
    try {
      await signIn({ email, password })
      setIsLoading(false)
    } catch (err) {
      console.warn(err.message)
    }
  }

  function navigate({ page }) {
    navigation.navigate(page);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.mainContainer}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange } }) => (
            <AppTextInput
              label={'Email'}
              placeholder={'Insira email'}
              size={'lg'}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange } }) => (
            <AppTextInput
              secureTextEntry
              label={'Senha'}
              size={'lg'}
              placeholder={'Insira a senha'}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />

        <View style={{ marginTop: 16 }}>
          <AppButton
            title={'Entrar'}
            color={'#1E232C'}
            isLoading={isLoading}
            onPress={handleSubmit(handleLogin)}
          />
        </View>
        <View style={styles.registerTextContainer}>
          <Text style={{ fontSize: 14 }}>Ainda não tem cadastro?</Text>
          <Text style={[styles.registerText, { fontSize: 16 }]} onPress={() => navigate({ page: 'Register' })}>Registre-se</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    justifySelf: 'flex-end',
    marginTop: 'auto',
    paddingBottom: 32,
  },
  registerTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 16,
  },
  registerText: {
    marginLeft: 4,
    textDecorationLine: 'underline',
    color: '#0E6ECE'
  }
})
