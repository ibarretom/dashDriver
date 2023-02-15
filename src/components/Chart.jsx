import { StyleSheet, Text, View } from "react-native";
import { VictoryPie } from "victory-native";
import { Bullet } from "./Bullet";

export function Chart({data = []}) {
  return (
    <View style={styles.chartContainer}>
      <VictoryPie
        data={data}
        x={'label'}
        y={'value'}
        width={200}
        height={200}
        colorScale={data.map(expense => expense.color)}
        innerRadius={60}
        padAngle={3}
        padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
        animate={{
          easing: 'bounce'
        }}
        style={{
          labels: {
            display: 'none'
          },
        }}
      />
      <View>
        {data.map((d, i) =>
        (<View key={i + d.label + 1} style={styles.chartLabelsContainer}>
          <Bullet color={d.color} />
          <Text style={styles.chartLabel}>{d.label}</Text>
        </View>)
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  chartLabelsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  chartLabel: {
    margin: 2,
    fontSize: 14,
    fontWeight: '600'
  },
})