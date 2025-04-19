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
import { Badge } from "@/components/ui/badge"

export type Student = {
  id: string
  name: string
  email: string
  grade: string
  status: "active" | "inactive"
  enrollmentDate: string
}

const data: Student[] = [
  {
    id: "1",
    name: "Sofia Rodriguez",
    email: "sofia.r@example.com",
    grade: "10th",
    status: "active",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "2",
    name: "Carlos Martinez",
    email: "carlos.m@example.com",
    grade: "9th",
    status: "active",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "3",
    name: "Ana Garcia",
    email: "ana.g@example.com",
    grade: "11th",
    status: "active",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "4",
    name: "Miguel Lopez",
    email: "miguel.l@example.com",
    grade: "10th",
    status: "inactive",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "5",
    name: "Isabella Hernandez",
    email: "isabella.h@example.com",
    grade: "12th",
    status: "active",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "6",
    name: "Javier Diaz",
    email: "javier.d@example.com",
    grade: "9th",
    status: "active",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "7",
    name: "Valentina Morales",
    email: "valentina.m@example.com",
    grade: "11th",
    status: "active",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "8",
    name: "Santiago Flores",
    email: "santiago.f@example.com",
    grade: "10th",
    status: "inactive",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "9",
    name: "Camila Torres",
    email: "camila.t@example.com",
    grade: "12th",
    status: "active",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "10",
    name: "Mateo Ruiz",
    email: "mateo.r@example.com",
    grade: "9th",
    status: "active",
    enrollmentDate: "2023-09-01",
  },
]

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => <div>{row.getValue("grade")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <Badge variant={status === "active" ? "default" : "secondary"}>{status}</Badge>
    },
  },
  {
    accessorKey: "enrollmentDate",
    header: "Enrollment Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("enrollmentDate"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(student.id)}>
              Copy student ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View student</DropdownMenuItem>
            <DropdownMenuItem>Edit student</DropdownMenuItem>
            <DropdownMenuItem>View grades</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function StudentsTable() {
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
            placeholder="Search students..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
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
