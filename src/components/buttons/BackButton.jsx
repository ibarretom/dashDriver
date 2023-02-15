import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"
import Reapple from "react-native-material-ripple";

export function BackButton({ onPress = () => { } }) {
  return (
    <Reapple style={styles.content} onPress={onPress}>
      <Icon size={36} name={'arrow-back'} color="#000" />
    </Reapple>
  )
}
const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
})