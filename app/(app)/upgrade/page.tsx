"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { track } from "@/lib/pendo";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["3 projects", "5 team members", "Basic reports", "Kanban & list views"],
    cta: "Current plan",
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "per user / month",
    features: ["Unlimited projects", "Unlimited members", "Advanced reports", "Gantt view", "Priority support", "AI assistant"],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "contact sales",
    features: ["Everything in Pro", "SSO / SAML", "Custom integrations", "Dedicated CSM", "SLA guarantee", "Audit logs"],
    cta: "Contact sales",
  },
];

export default function UpgradePage() {
  useEffect(() => {
    document.title = "TaskPilot — Upgrade";
    // PENDO: pricing page viewed
    track("pricing_page_viewed", { source: "upgrade_page" });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Upgrade your plan</h1>
        <p className="text-muted-foreground">Choose the plan that's right for your team. Change anytime.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={plan.popular ? "border-indigo-500 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20" : ""}>
            <CardContent className="pt-6 pb-6">
              {plan.popular && <Badge className="mb-3 bg-indigo-500 text-white border-0">Most popular</Badge>}
              <p className="text-lg font-bold mb-1">{plan.name}</p>
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-indigo-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <Button className="w-full" variant="outline" disabled>
                  {plan.cta}
                </Button>
              ) : (
                <Link href={plan.id === "enterprise" ? "/help" : `/checkout?plan=${plan.id}`}>
                  <Button
                    className={`w-full ${plan.popular ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => {
                      // PENDO: plan selected from pricing page
                      track("plan_selected", { plan: plan.id, source: "upgrade_page" });
                    }}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
