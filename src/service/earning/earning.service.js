import { dashDriverInstance } from '../api'

async function create({ amount, earning_date }) {
  try {
    await dashDriverInstance.post('/earning', {
      amount,
      earning_date,
    })
  } catch (err) {
    throw new Error(err)
  }
}
export default { create }
