import { useState } from "react"
import { StyleSheet, Text } from "react-native"

import DateTimePicker from "@react-native-community/datetimepicker";
import Reapple from "react-native-material-ripple";
import Icon from "react-native-vector-icons/MaterialIcons"

export function AppDatePicker({ value, setValue, label, timeMode = 'date', icon = 'calendar-today', maximumDate }) {

  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false)
  const [mode, setMode] = useState(timeMode)

  const onChange = (event, selectedDate) => {
    currentDate = selectedDate || date
    setShow(Platform.OS == "ios")
    setDate(currentDate)

    const tempDate = new Date(currentDate)
    const fDate = `${tempDate.getDate()}/${tempDate.getMonth() + 1}/${tempDate.getFullYear()}`
    const fTime = `${tempDate.getHours()}:${tempDate.getMinutes()}`
    setValue(timeMode === 'date' ? fDate : fTime)
  }

  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  return (
    <>
      {!!label && <Text style={[styles.label, { fontSize: 16 }]} >{label}</Text>}
      <Reapple style={styles.dateButton} onPress={() => showMode(timeMode)}>
        <Text style={styles.dataButtonText}>{value}</Text>
        <Icon
          style={styles.calendarIcon}
          size={32}
          name={icon}
          color='#999'
        />
      </Reapple>
      {
        show &&
        <DateTimePicker
          testID='dateTimePicker'
          value={date}
          mode={mode}
          display='default'
          is24Hour={true}
          maximumDate={maximumDate}
          onChange={onChange}
        />
      }
    </>
  )
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '400',
    marginTop: 8,
  },

  dateButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    height: 56,
    backgroundColor: '#F7F8F9',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8
  },
  dataButtonText: {
    flex: 1,
    color: '#8391A1'
  }
});