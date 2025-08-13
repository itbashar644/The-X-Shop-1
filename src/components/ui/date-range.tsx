
import * as React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange as DateRangeType } from "react-day-picker";

import { cn } from "@/lib/Image-utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangeProps {
  className?: string;
  from: Date;
  to: Date;
  onSelect: (range: DateRangeType | undefined) => void;
}

export function DateRange({ className, from, to, onSelect }: DateRangeProps) {
  const [date, setDate] = React.useState<DateRangeType | undefined>({
    from,
    to,
  });

  // Обновление внутреннего состояния при изменении пропсов
  React.useEffect(() => {
    setDate({ from, to });
  }, [from, to]);

  // Форматирование выбранного диапазона дат для отображения
  const formatDateRange = () => {
    if (date?.from && date?.to) {
      return `${format(date.from, "dd.MM.yyyy", { locale: ru })} - ${format(
        date.to,
        "dd.MM.yyyy",
        { locale: ru }
      )}`;
    }
    return "Выберите диапазон";
  };

  // Обработчик выбора даты
  const handleSelect = (range: DateRangeType | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      onSelect(range);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-auto justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={ru}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
