import { StyleSheet, View, Text } from "react-native"

export function RevenueCard({ title = '', value = '', color = '#000' }) {
  return (
    <View style={[styles.card, {backgroundColor: color}]}>
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.text}>R$ {value.toString().replace(".", ",")}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 4
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  }
})