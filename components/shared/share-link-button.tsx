"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { track } from "@/lib/pendo";

interface Props {
  label?: string;
  url?: string;
}

export function ShareLinkButton({ label = "Share", url }: Props) {
  const handleClick = () => {
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    // PENDO: project shared via share link
    track("project_shared", { url: shareUrl });
    toast.success("Link copied to clipboard");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick} className="gap-1.5">
      <Share2 size={14} />
      {label}
    </Button>
  );
}
