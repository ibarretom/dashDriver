import { StyleSheet, View } from "react-native" 

export function Bullet({color}) {
  return (
    <View style={[styles.bullet, {backgroundColor: color ? color : '#000' }]}>

    </View>
  )
}

const styles = StyleSheet.create({
  bullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
  }
})
