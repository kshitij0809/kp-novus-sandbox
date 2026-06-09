"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProjectDialog } from "./create-project-dialog";
import { track } from "@/lib/pendo";

export function CreateProjectButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    // PENDO: project create dialog opened funnel step 1
    track("project_create_dialog_opened", { source: "button" });
    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleOpen} className="bg-indigo-600 hover:bg-indigo-700 gap-1.5">
        <Plus size={16} />
        New project
      </Button>
      <CreateProjectDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
