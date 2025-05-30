"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useState } from "react"

const initialAttendData = [
  { day: "2025-05-22", time: "9:00 AM", status: "출석", reason: "" },
  { day: "2025-05-23", time: "10:00 AM", status: "지각", reason: "" },
  { day: "2025-05-24", time: "11:00 AM", status: "결석", reason: "" },
  { day: "2025-05-25", time: "9:30 AM", status: "지각", reason: "" },
  { day: "2025-05-26", time: "9:10 AM", status: "출석", reason: "" },
  { day: "2025-05-27", time: "10:00 AM", status: "지각", reason: "" },
  { day: "2025-05-28", time: "11:00 AM", status: "결석", reason: "" },
]

export default function TableDemo() {
  const [data, setData] = useState(initialAttendData)

  const handleStatusChange = (day: string, newStatus: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.day === day ? { ...item, status: newStatus } : item
      )
    )
  }

  return (
    <Table>
      <TableCaption>최근 출결 기록</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">날짜</TableHead>
          <TableHead>출석 시간</TableHead>
          <TableHead>출결 상태</TableHead>
          <TableHead className="text-right">사유</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.day}>
            <TableCell className="font-medium">{row.day}</TableCell>
            <TableCell>{row.time}</TableCell>
            <TableCell>
              <Select
                value={row.status}
                onValueChange={(value) => handleStatusChange(row.day, value)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="출석">출석</SelectItem>
                  <SelectItem value="지각">지각</SelectItem>
                  <SelectItem value="결석">결석</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-right">{row.reason}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}></TableCell>
          <TableCell className="text-right"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
