import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"

export function Picture() {
  return (
    <View style={styles.pictureContainer}>
      <Icon size={42} name={'person'} color='#999' />
    </View>
  )
}

const styles = StyleSheet.create({
  pictureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E4E5E7',
  }
})