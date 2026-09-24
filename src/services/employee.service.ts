import { NotFound, RuleViolation } from '../errors'
import { Employee, NewEmployee } from '../types'
import { CompanyRepository } from '../repositories/company.repository'
import { EmployeeRepository } from '../repositories/employee.repository'

const MINIMUM_WAGE = 1518
const DEFAULT_INSS = 0.11

const INSS_BY_STATE: Record<string, number> = {
  SP: 0.11,
  MG: 0.09,
  RJ: 0.08
}

function inssRate(state: string): number {
  return INSS_BY_STATE[state.toUpperCase()] ?? DEFAULT_INSS
}

export class EmployeeService {
  constructor(
    private employees: EmployeeRepository,
    private companies: CompanyRepository
  ) {}

  async create(data: NewEmployee): Promise<Employee> {
    const company = this.companies.findById(data.companyId)
    if (!company) throw new NotFound('company')

    const gross = data.salary
    if (gross < MINIMUM_WAGE) {
      throw new RuleViolation('salary below minimum wage')
    }

    const net = gross - gross * inssRate(company.state)

    return this.employees.save({
      name: data.name,
      email: data.email,
      gross_salary: gross,
      net_salary: net,
      company_id: data.companyId
    })
  }

  async findByCompany(companyId: number): Promise<Employee[]> {
    return this.employees.findByCompany(companyId)
  }
}
