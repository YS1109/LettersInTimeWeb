"use client"
import { useState } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  minDate?: Date
  placeholder?: string
}

export function DateTimePicker({ date, onDateChange, minDate, placeholder = "选择日期和时间" }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  const seconds = Array.from({ length: 60 }, (_, i) => i)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onDateChange?.(undefined)
      return
    }

    const newDate = new Date(selectedDate)
    if (date) {
      newDate.setHours(date.getHours())
      newDate.setMinutes(date.getMinutes())
      newDate.setSeconds(date.getSeconds())
    } else {
      // 如果设置了 minDate，默认时间设为 minDate 的时间，否则设为 9:00:00
      if (minDate) {
        newDate.setHours(minDate.getHours())
        newDate.setMinutes(minDate.getMinutes())
        newDate.setSeconds(minDate.getSeconds())
        // 如果日期是今天，确保时间不早于 minDate
        if (newDate < minDate) {
          newDate.setTime(minDate.getTime())
        }
      } else {
        newDate.setHours(9)
        newDate.setMinutes(0)
        newDate.setSeconds(0)
      }
    }
    onDateChange?.(newDate)
  }

  const handleHourChange = (hour: string) => {
    const newDate = date ? new Date(date) : (minDate ? new Date(minDate) : new Date())
    newDate.setHours(Number.parseInt(hour))
    // 如果设置了 minDate，确保不早于 minDate
    if (minDate && newDate < minDate) {
      newDate.setTime(minDate.getTime())
    }
    onDateChange?.(newDate)
  }

  const handleMinuteChange = (minute: string) => {
    const newDate = date ? new Date(date) : (minDate ? new Date(minDate) : new Date())
    newDate.setMinutes(Number.parseInt(minute))
    // 如果设置了 minDate，确保不早于 minDate
    if (minDate && newDate < minDate) {
      newDate.setTime(minDate.getTime())
    }
    onDateChange?.(newDate)
  }

  const handleSecondChange = (second: string) => {
    const newDate = date ? new Date(date) : (minDate ? new Date(minDate) : new Date())
    newDate.setSeconds(Number.parseInt(second))
    // 如果设置了 minDate，确保不早于 minDate
    if (minDate && newDate < minDate) {
      newDate.setTime(minDate.getTime())
    }
    onDateChange?.(newDate)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full h-11 justify-start text-left font-normal bg-background hover:bg-muted/50",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            <>
              {date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
              <Clock className="ml-2 mr-1 h-3.5 w-3.5" />
              {date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </>
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-card border-border" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="flex flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={(date) => {
              if (!minDate) return false
              // 只禁用今天之前的日期，时间选择会在 handleDateSelect 中处理
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return date < today
            }}
            initialFocus
          />
          <div className="border-t border-border p-3 space-y-2 bg-muted/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">时间</span>
            </div>
            <div className="flex gap-2 items-center">
              <Select value={date?.getHours().toString() || "9"} onValueChange={handleHourChange}>
                <SelectTrigger className="w-[80px] bg-background">
                  <SelectValue placeholder="时" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="flex items-center text-muted-foreground">:</span>
              <Select value={date?.getMinutes().toString() || "0"} onValueChange={handleMinuteChange}>
                <SelectTrigger className="w-[80px] bg-background">
                  <SelectValue placeholder="分" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute.toString()}>
                      {minute.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="flex items-center text-muted-foreground">:</span>
              <Select value={date?.getSeconds().toString() || "0"} onValueChange={handleSecondChange}>
                <SelectTrigger className="w-[80px] bg-background">
                  <SelectValue placeholder="秒" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {seconds.map((second) => (
                    <SelectItem key={second} value={second.toString()}>
                      {second.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
