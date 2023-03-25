import { dashDriverInstance } from '../../api'

async function create({ spent_type, amount, spent_date }) {
  try {
    const response = await dashDriverInstance.post('/spent', {
      spent_type,
      amount,
      spent_date,
      description: '',
    })

    return response.data
  } catch (err) {
    throw new Error(err)
  }
}

export default { create }
