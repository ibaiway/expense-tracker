import { columns } from "@/components/data-tables/columns-expenses"
import { DataTable } from "@/components/data-tables/data-table"
import type { Expense } from "@/types/expense"
import { useParams } from "react-router"

const mockExpenses: Expense[] = [
  {
    id: "1",
    title: "Expense 1",
    projectId: "1",
    originalCurrency: "USD",
    originalAmount: 100,
    convertedAmount: 100,
    exchangeRate: 1,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Expense 2",
    projectId: "1",
    originalCurrency: "USD",
    originalAmount: 100,
    convertedAmount: 100,
    exchangeRate: 1,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
export default function ProjectPage() {
  const { projectId } = useParams()
  console.log(projectId)
  return (
    <div>
      <h1>Project {projectId}</h1>
      <DataTable columns={columns} data={mockExpenses} />
    </div>
  )
}
