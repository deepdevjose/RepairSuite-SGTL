"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateTimePickerProps {
    date?: Date
    setDate: (date: Date | undefined) => void
    minDate?: Date
}

export function DateTimePicker({ date, setDate, minDate }: DateTimePickerProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
    const [timeValue, setTimeValue] = React.useState<string>("09:00")

    React.useEffect(() => {
        if (date) {
            setSelectedDate(date)
            setTimeValue(format(date, "HH:mm"))
        }
    }, [date])

    const handleDateSelect = (newDate: Date | undefined) => {
        if (newDate) {
            const [hours, minutes] = timeValue.split(":").map(Number)
            newDate.setHours(hours)
            newDate.setMinutes(minutes)

            // Validate against minDate
            if (minDate && newDate < minDate) {
                // If selected time is in the past, reset to minDate (or current time if minDate is now)
                const now = new Date()
                if (newDate.toDateString() === now.toDateString()) {
                    newDate.setHours(now.getHours())
                    newDate.setMinutes(now.getMinutes())
                    setTimeValue(format(newDate, "HH:mm"))
                }
            }

            setDate(newDate)
        } else {
            setDate(undefined)
        }
        setSelectedDate(newDate)
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value
        setTimeValue(newTime)

        if (selectedDate) {
            const [hours, minutes] = newTime.split(":").map(Number)
            const newDate = new Date(selectedDate)
            newDate.setHours(hours)
            newDate.setMinutes(minutes)

            // Validate against minDate
            if (minDate && newDate < minDate) {
                // Allow user to type, but don't set invalid date? 
                // Or maybe just let parent handle validation?
                // For now, let's just update. The parent or a blur handler should ideally validate.
                // But to prevent the specific error "cannot choose past date", we can check here.
                return // Don't update if invalid? Or maybe show error?
                // Better approach: Let it update, but maybe visual feedback?
                // For this specific request, let's just allow it but maybe clamp it on blur?
                // Actually, the user said "no puedes escoger", implying prevention.
            }

            setDate(newDate)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal bg-slate-800/40 border-slate-700 text-slate-100",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP p", { locale: es }) : <span>Seleccionar fecha y hora</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10" align="start">
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm font-medium text-slate-200">Hora de entrega</span>
                    </div>
                    <Input
                        type="time"
                        value={timeValue}
                        onChange={handleTimeChange}
                        className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                </div>
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={minDate ? { before: minDate } : undefined}
                    initialFocus
                    className="p-3 pointer-events-auto"
                />
            </PopoverContent>
        </Popover>
    )
}
