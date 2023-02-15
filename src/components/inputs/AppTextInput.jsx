import { StyleSheet, Text, TextInput } from "react-native"

export function AppTextInput({ label, size = 'sm', error = null, ...props }) {
  return (
    <>
      {!!label && <Text style={[styles.label, { fontSize: size == 'sm' ? 16 : 20 }]}>{label}</Text>}
      <TextInput style={styles.inputStyle} {...props} placeholderTextColor={'#8391A1'} />
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
    borderColor: '#DADADA',
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