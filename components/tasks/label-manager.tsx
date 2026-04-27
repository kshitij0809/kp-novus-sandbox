"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/pendo";

const PRESET_LABELS = ["frontend", "backend", "design", "marketing", "mobile", "bug", "feature"];

interface Props {
  labels: string[];
  onChangeLabels: (labels: string[]) => void;
}

export function LabelManager({ labels, onChangeLabels }: Props) {
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState("");

  const addLabel = (label: string) => {
    const l = label.trim().toLowerCase();
    if (!l || labels.includes(l)) return;
    // PENDO: task label added
    track("task_label_added", { label: l });
    onChangeLabels([...labels, l]);
    setInput("");
    setAdding(false);
  };

  const removeLabel = (label: string) => {
    onChangeLabels(labels.filter((l) => l !== label));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {labels.map((l) => (
          <Badge key={l} variant="secondary" className="gap-1 text-xs pl-2 pr-1">
            {l}
            <button onClick={() => removeLabel(l)} className="hover:text-destructive ml-0.5">
              <X size={10} />
            </button>
          </Badge>
        ))}
        {adding ? (
          <div className="flex items-center gap-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addLabel(input);
                if (e.key === "Escape") setAdding(false);
              }}
              className="h-6 text-xs w-24 px-2"
              autoFocus
              placeholder="label"
            />
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => addLabel(input)}>
              <Plus size={12} />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1 text-muted-foreground" onClick={() => setAdding(true)}>
            <Plus size={10} />
            Add label
          </Button>
        )}
      </div>
      {adding && (
        <div className="flex flex-wrap gap-1">
          {PRESET_LABELS.filter((l) => !labels.includes(l)).map((l) => (
            <button key={l} onClick={() => addLabel(l)} className="text-xs px-2 py-0.5 bg-muted rounded-full hover:bg-accent transition-colors">
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
