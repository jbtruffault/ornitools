import * as React from "react"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedDates: DateRange | undefined;
  onDateSelectionChange: (selectedDates: DateRange) => void;
}

export function DatePickerWithRange({
  className,
  selectedDates,
  onDateSelectionChange
}: DatePickerWithRangeProps) {

  const [date, setDate] = React.useState<DateRange | undefined>(selectedDates);

  React.useEffect(() => {
    if (date) {
      onDateSelectionChange(date);
    }
  }, [date]);

  // Ensure date?.to is defined before using addDays
  const defaultMonth = date?.to ? addDays(date.to, -30) : new Date(); // Fallback to the current date if date?.to is undefined

  return (
    <div className={cn("grid gap-2 items-center justify-center", className)}>      
      <Calendar
        mode="range"
        defaultMonth={defaultMonth}
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
      />
    </div>
  )
}
