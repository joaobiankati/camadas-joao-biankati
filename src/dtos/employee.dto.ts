import { InvalidInput } from '../errors'
import { NewEmployee } from '../types'

export function employeeDTO(body: unknown): NewEmployee {
  const data = body as Record<string, unknown>
  const fields: string[] = []

  if (!data || typeof data.name !== 'string' || data.name.length < 3) {
    fields.push('name')
  }
  if (!data || typeof data.email !== 'string' || !data.email.includes('@')) {
    fields.push('email')
  }
  if (!data || typeof data.salary !== 'number') {
    fields.push('salary')
  }
  if (!data || typeof data.companyId !== 'number') {
    fields.push('companyId')
  }

  if (fields.length > 0) {
    throw new InvalidInput(fields)
  }

  return {
    name: data.name as string,
    email: data.email as string,
    salary: data.salary as number,
    companyId: data.companyId as number
  }
}
