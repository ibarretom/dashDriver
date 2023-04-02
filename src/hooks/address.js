import MostVisited from '../service/address/mostVisited.service'

export function useAddress() {
  async function get({ month, date }) {
    try {
      const mostVisited = await MostVisited.get()

      const mostVisitedByMonth = await MostVisited.getByMonth({
        date: new Date(
          new Date().getFullYear(),
          month,
          new Date().getDate()
        ).toISOString(),
      })

      const mostVisitedByDay = await MostVisited.getByDay({
        date: new Date(
          Number(date.split('/')[2]),
          Number(date.split('/')[1]) - 1,
          Number(date.split('/')[0])
        ).toISOString(),
      })

      return {
        mostVisited: mostVisited.all_time,
        mostVisitedByMonth: mostVisitedByMonth,
        mostVisitedByDay: mostVisitedByDay,
        mostVisitedMorning: mostVisited.morning,
        mostVisitedAfternoon: mostVisited.afternoon,
        mostVisitedNight: mostVisited.night,
        mostVisitedDawn: mostVisited.dawn,
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  return {
    get,
  }
}
