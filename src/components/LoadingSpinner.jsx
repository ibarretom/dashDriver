import { ActivityIndicator, StyleSheet, View } from "react-native";

export function LoadingSpinner() {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.uploadingOverlay
      ]}
    >
      <ActivityIndicator color='#fff' animating size='large' />
    </View>
  )
}

const styles = StyleSheet.create({
  uploadingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})