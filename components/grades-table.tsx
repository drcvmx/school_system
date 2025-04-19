"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type Grade = {
  id: string
  student: string
  teacher: string
  subject: string
  value: number
  date: string
}

const data: Grade[] = [
  {
    id: "1",
    student: "Sofia Rodriguez",
    teacher: "Mr. Johnson",
    subject: "Mathematics",
    value: 9.5,
    date: "2023-10-15",
  },
  {
    id: "2",
    student: "Carlos Martinez",
    teacher: "Mrs. Smith",
    subject: "Science",
    value: 8.7,
    date: "2023-10-12",
  },
  {
    id: "3",
    student: "Ana Garcia",
    teacher: "Mr. Williams",
    subject: "History",
    value: 7.2,
    date: "2023-10-10",
  },
  {
    id: "4",
    student: "Miguel Lopez",
    teacher: "Ms. Brown",
    subject: "Language",
    value: 6.5,
    date: "2023-10-08",
  },
  {
    id: "5",
    student: "Isabella Hernandez",
    teacher: "Mrs. Davis",
    subject: "Art",
    value: 9.8,
    date: "2023-10-05",
  },
  {
    id: "6",
    student: "Javier Diaz",
    teacher: "Mr. Miller",
    subject: "Physical Education",
    value: 8.5,
    date: "2023-10-03",
  },
  {
    id: "7",
    student: "Valentina Morales",
    teacher: "Ms. Wilson",
    subject: "Music",
    value: 9.2,
    date: "2023-10-01",
  },
  {
    id: "8",
    student: "Santiago Flores",
    teacher: "Mr. Moore",
    subject: "Computer Science",
    value: 7.8,
    date: "2023-09-28",
  },
]

export const columns: ColumnDef<Grade>[] = [
  {
    accessorKey: "student",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Student
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("student")}</div>,
  },
  {
    accessorKey: "teacher",
    header: "Teacher",
    cell: ({ row }) => <div>{row.getValue("teacher")}</div>,
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <div>{row.getValue("subject")}</div>,
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Grade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("value"))
      return <div className={getGradeColor(value)}>{value.toFixed(1)}</div>
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const grade = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(grade.id)}>Copy grade ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit grade</DropdownMenuItem>
            <DropdownMenuItem>View student profile</DropdownMenuItem>
            <DropdownMenuItem>View subject grades</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function getGradeColor(grade: number) {
  if (grade >= 9) return "text-green-500"
  if (grade >= 7) return "text-yellow-500"
  return "text-red-500"
}

export function GradesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search grades..."
            value={(table.getColumn("student")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("student")?.setFilterValue(event.target.value)}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
