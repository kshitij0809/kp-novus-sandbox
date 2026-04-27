"use client";

import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { track } from "@/lib/pendo";

interface Props {
  taskId: string;
}

export function FileUploadButton({ taskId }: Props) {
  const handleClick = () => {
    // PENDO: task attachment uploaded (mock)
    track("task_attachment_uploaded", { task_id: taskId });
    toast.success("File attachment simulated (mock mode)");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick} className="gap-1.5">
      <Paperclip size={13} />
      Attach file
    </Button>
  );
}
