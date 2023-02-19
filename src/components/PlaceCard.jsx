import { StyleSheet, View, Text } from "react-native"

export function PlaceCard({ title = '', value = '', color = '#E4E5E7' }) {
  return (
    <View style={[styles.card, {backgroundColor: color}]}>
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.text}>{value}</Text>
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
    fontWeight: '500',
    color: '#000'
  }
})