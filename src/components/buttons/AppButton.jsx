import { ActivityIndicator, StyleSheet, Text, TouchableHighlight } from "react-native"

export function AppButton({ title, color, isLoading = false, onPress = () => { } }) {
  return (
    <>
      <TouchableHighlight
        style={[styles.button, { backgroundColor: !!color ? color : '#007AFF' }]}
        onPress={isLoading ? () => { } : onPress}>
        {isLoading ?
          <ActivityIndicator size={'large'} color='#fff'/> :
          <Text style={styles.text}>{title}</Text>
        }
      </TouchableHighlight>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    borderRadius: 8,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: 'white'
  }
})