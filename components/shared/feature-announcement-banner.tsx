"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function FeatureAnnouncementBanner({ title, body, ctaLabel, ctaHref }: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-indigo-600 text-white px-4 py-2.5 flex items-center gap-3">
      <Sparkles size={16} className="flex-shrink-0" />
      <div className="flex-1 text-sm">
        <span className="font-semibold">{title}</span>{" "}
        <span className="opacity-90">{body}</span>
      </div>
      {ctaHref && ctaLabel && (
        <Link href={ctaHref}>
          <Button size="sm" variant="secondary" className="h-7 text-xs">
            {ctaLabel}
          </Button>
        </Link>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-white hover:bg-white/20 flex-shrink-0"
        onClick={() => setDismissed(true)}
      >
        <X size={14} />
      </Button>
    </div>
  );
}
