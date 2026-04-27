"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  useEffect(() => {
    document.title = "TaskPilot — Welcome to Pro!";
  }, []);

  return (
    <div className="flex items-center justify-center h-full py-20">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-3">You're on Pro! 🎉</h1>
        <p className="text-muted-foreground mb-8">
          Your upgrade was successful. Enjoy unlimited projects, Gantt views, and all Pro features.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard">
            <Button className="bg-indigo-600 hover:bg-indigo-700">Go to Dashboard</Button>
          </Link>
          <Link href="/settings/billing">
            <Button variant="outline">View billing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
