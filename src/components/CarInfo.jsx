import { View, Text, StyleSheet } from "react-native"

export function CarInfo({ value = 0, unit = '' }) {
  return (
    <View style={styles.content}>
      <Text style={styles.value}>{value.toString().replace(".", ",")}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 96,
    height: 96,
    borderWidth: 6,
    borderColor: '#FACA9B',
    borderRadius: 48
  },
  value: {
    fontSize: 24,
    fontWeight: '700'
  },
  unit: {
    fontSize: 18,
    fontWeight: '700'
  }
})