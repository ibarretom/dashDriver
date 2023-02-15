import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text } from 'react-native';

export function AppPicker({ value, setValue = () => { }, label, size = 'sm', items = [], error }) {
  return (
    <>
      {!!label && <Text style={[styles.label, { fontSize: size == 'sm' ? 16 : 20 }]}>{label}</Text>}
      <Picker
        selectedValue={value}
        onValueChange={(itemValue, itemIndex) =>
          setValue(itemValue)
        }
        style={{
          height: 56,
          paddingHorizontal: 12,
          marginVertical: 8,
          backgroundColor: '#F7F8F9',
          borderWidth: 1,
          borderColor: '#DADADA',
          borderRadius: 8,
          fontSize: 16
        }}
      >
        {items.map((item, i) => <Picker.Item key={i} label={item.label} value={item.value} />)}
      </Picker>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </>
  )
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '400',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'red',
    marginLeft: 8
  }
})