"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { track } from "@/lib/pendo";

interface Props {
  label?: string;
  eventName?: "report_exported";
}

export function ExportButton({ label = "Export", eventName = "report_exported" }: Props) {
  const handleClick = () => {
    // PENDO: report exported
    track(eventName, { format: "csv" });
    toast.success("Export started — your file will download shortly.");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick} className="gap-1.5">
      <Download size={14} />
      {label}
    </Button>
  );
}
