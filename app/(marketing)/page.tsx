"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Zap, Users, BarChart3, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { track } from "@/lib/pendo";

const FEATURES = [
  {
    icon: Zap,
    title: "Blazing Fast Kanban",
    description: "Drag-and-drop task management with real-time updates. Never lose context again.",
  },
  {
    icon: Users,
    title: "Built for Teams",
    description: "Assign, collaborate, and communicate without leaving your task board.",
  },
  {
    icon: BarChart3,
    title: "Actionable Reports",
    description: "Velocity charts, completion rates, and goal tracking out of the box.",
  },
];

const PRICING = [
  { name: "Free", price: "$0", features: ["3 projects", "5 members", "Basic reports"] },
  { name: "Pro", price: "$12/mo", features: ["Unlimited projects", "Unlimited members", "Advanced reports", "Gantt view"] },
  { name: "Enterprise", price: "Custom", features: ["Everything in Pro", "SSO", "Custom integrations", "SLA"] },
];

export default function LandingPage() {
  useEffect(() => {
    document.title = "TaskPilot — Ship faster together";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Zap className="text-indigo-400" size={24} />
          TaskPilot
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm text-slate-300 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white">
              Get started free
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <Badge className="mb-6 bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30">
          <Star size={12} className="mr-1" /> Trusted by 10,000+ teams
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent leading-tight">
          Ship faster,
          <br />
          together.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          TaskPilot brings your team's work together in one place — kanban boards, timelines, reports, and AI-powered
          insights. No fluff, just flow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8"
              onClick={() => {
                // PENDO: landing page primary CTA clicked
                track("landing_cta_clicked", { cta: "hero_get_started" });
              }}
            >
              Get started free <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link href="/upgrade">
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8"
              onClick={() => {
                // PENDO: landing page pricing CTA clicked
                track("landing_cta_clicked", { cta: "hero_view_pricing" });
              }}
            >
              View pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything your team needs</h2>
          <p className="text-slate-400">Powerful features that grow with your team.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-colors">
              <div className="bg-indigo-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="text-indigo-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing snippet */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-slate-400">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((plan, i) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${i === 1 ? "bg-indigo-500/20 border-indigo-500/50" : "bg-white/5 border-white/10"}`}
            >
              {i === 1 && <Badge className="mb-3 bg-indigo-500 text-white border-0">Most popular</Badge>}
              <div className="text-2xl font-bold mb-1">{plan.name}</div>
              <div className="text-3xl font-bold text-indigo-400 mb-6">{plan.price}</div>
              <ul className="space-y-2 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle size={14} className="text-indigo-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={i === 0 ? "/sign-up" : "/upgrade"}>
                <Button
                  className={`w-full ${i === 1 ? "bg-indigo-500 hover:bg-indigo-600 text-white" : "border-white/20 hover:bg-white/10"}`}
                  variant={i === 1 ? "default" : "outline"}
                  onClick={() => {
                    // PENDO: landing pricing plan CTA clicked
                    track("landing_cta_clicked", { cta: "pricing_plan", plan: plan.name.toLowerCase() });
                  }}
                >
                  {i === 0 ? "Get started free" : "Get started"}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} TaskPilot. Built with ❤️ for fast-moving teams.
      </footer>
    </div>
  );
}
