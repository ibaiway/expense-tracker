export type Expense = {
  id: string
  title: string
  projectId: string
  originalCurrency: string
  originalAmount: number
  convertedAmount: number
  exchangeRate: number
  date: Date
  createdAt: Date
  updatedAt: Date
}
