"use client"

import type { ColumnDef } from "@tanstack/react-table"

// Define the Person type directly here for simplicity
export type Person = {
  id: string
  firstName: string
  lastName: string
  age: number
  visits: number
  status: "relationship" | "complicated" | "single"
  progress: number
}

export const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    id: "firstName",
    size: 150,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    id: "lastName",
    size: 150,
  },
  {
    accessorKey: "age",
    header: "Age",
    id: "age",
    size: 120,
  },
  {
    accessorKey: "visits",
    header: "Visits",
    id: "visits",
    size: 120,
  },
  {
    accessorKey: "status",
    header: "Status",
    id: "status",
    size: 150,
  },
  {
    accessorKey: "progress",
    header: "Profile Progress",
    id: "progress",
    size: 180,
    cell: ({ row }) => {
      const progress = row.getValue("progress") as number
      return <div className="font-medium">{progress}%</div>
    },
  },
]

// Simple constant data array
export const data = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    age: 32,
    visits: 10,
    status: "relationship" as const,
    progress: 75,
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Doe",
    age: 28,
    visits: 15,
    status: "single" as const,
    progress: 50,
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
    age: 45,
    visits: 5,
    status: "complicated" as const,
    progress: 90,
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
    age: 30,
    visits: 20,
    status: "relationship" as const,
    progress: 60,
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    age: 38,
    visits: 8,
    status: "single" as const,
    progress: 25,
  },
]

