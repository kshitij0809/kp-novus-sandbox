"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/pendo";

interface Props {
  dueDate: string | null;
  onChangeDueDate: (date: string | null) => void;
}

export function DueDatePicker({ dueDate, onChangeDueDate }: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    const iso = date ? date.toISOString() : null;
    // PENDO: task due date set
    if (iso) track("task_due_date_set", { date: iso });
    onChangeDueDate(iso);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-input bg-background text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
        <CalendarIcon size={13} />
        {dueDate ? format(new Date(dueDate), "MMM d, yyyy") : "Set due date"}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dueDate ? new Date(dueDate) : undefined}
          onSelect={handleSelect}
          initialFocus
        />
        {dueDate && (
          <div className="px-3 pb-3">
            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={() => handleSelect(undefined)}>
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
