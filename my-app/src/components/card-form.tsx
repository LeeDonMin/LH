import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type CardWithFormProps = {
  children?: React.ReactNode
  items: {
    title: string
    description: string
    leftLabel: string
    rightLabel: string
    handelSubmit?: () => void

  }
}

export function CardWithForm({ children, items}:CardWithFormProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{items.title}</CardTitle>
        <CardDescription>{items.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              {children}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">{items.leftLabel}</Button>
        <Button onClick={items.handelSubmit}>{items.rightLabel}</Button>
      </CardFooter>
    </Card>
  )
}
