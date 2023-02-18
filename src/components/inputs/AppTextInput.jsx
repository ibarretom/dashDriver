import { useState } from "react"
import { StyleSheet, Text, TextInput } from "react-native"

export function AppTextInput({ label, size = 'sm', error = null, ...props }) {
  const [borderColor, setBorderColor] = useState('#DADADA')

  function onFocus() {
    setBorderColor('green')
  }
  function onBlur() {
    setBorderColor('#DADADA')
  }

  return (
    <>
      {!!label && <Text style={[styles.label, { fontSize: size == 'sm' ? 16 : 20 }]}>{label}</Text>}
      <TextInput
        style={[styles.inputStyle, { borderColor: error ? 'red' : borderColor }]}
        placeholderTextColor={error ? 'red' : '#8391A1'}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </>
  )
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '400',
    marginTop: 16,
  },
  inputStyle: {
    height: 56,
    paddingHorizontal: 12,
    marginTop: 8,
    backgroundColor: '#F7F8F9',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'red',
    marginLeft: 8
  }
})