import { dashDriverInstance } from '../../api'

async function create({ type, liters, amount, fuel_date }) {
  try {
    const response = await dashDriverInstance.post('/spent/fuel', {
      type,
      liters,
      amount,
      fuel_date,
    })

    return response.data
  } catch (err) {
    throw new Error(err)
  }
}

export default { create }
