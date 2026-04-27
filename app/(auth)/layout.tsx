import { Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-xl">
            <Zap className="text-indigo-400" size={24} />
            TaskPilot
          </Link>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-black/50 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
