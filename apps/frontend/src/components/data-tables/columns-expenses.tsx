import type { Expense } from "@/types/expense"
import type { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "originalCurrency",
    header: "Original Currency",
  },
  {
    accessorKey: "originalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("originalAmount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.original.originalCurrency,
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "convertedAmount",
    header: "Converted Amount",
  },
  {
    accessorKey: "exchangeRate",
    header: "Exchange Rate",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return (
        <div className="text-right font-medium">
          {date.toLocaleDateString()}
        </div>
      )
    },
  },
]
