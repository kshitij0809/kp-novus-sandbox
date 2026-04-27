import { Zap } from "lucide-react";
import Link from "next/link";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-indigo-950">
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Zap className="text-indigo-500" size={24} />
          TaskPilot
        </Link>
      </header>
      <main className="flex items-center justify-center min-h-[calc(100vh-65px)] p-4">{children}</main>
    </div>
  );
}
