"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { track } from "@/lib/pendo";
import { useAuthStore } from "@/store/auth-store";

export default function BillingSettingsPage() {
  const { user } = useAuthStore();

  useEffect(() => {
    document.title = "TaskPilot — Billing";
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-lg capitalize">{user?.plan ?? "pro"}</span>
                <Badge className="bg-indigo-500 text-white border-0 capitalize">{user?.plan ?? "pro"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">$12/month · Renews Jan 1, 2027</p>
            </div>
            <div className="flex gap-2">
              <Link href="/upgrade">
                <Button variant="outline" size="sm" onClick={() => {
                  // PENDO: pricing page viewed from billing
                  track("pricing_page_viewed", { source: "billing_settings" });
                }}>
                  Upgrade
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/30"
                onClick={() => {
                  // PENDO: subscription cancelled
                  track("subscription_cancelled", { plan: user?.plan });
                  toast.error("Cancellation is disabled in demo mode");
                }}>
                Cancel plan
              </Button>
              <Button variant="outline" size="sm"
                onClick={() => {
                  // PENDO: subscription resumed
                  track("subscription_resumed", { plan: user?.plan });
                  toast.success("Subscription resumed (demo)");
                }}>
                Resume plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 billing-payment-method-selector">
          <div>
            <Label>Card number</Label>
            <Input
              type="text"
              placeholder="•••• •••• •••• 4242"
              className="mt-1"
              data-pendo-mask="true"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Expiry</Label>
              <Input type="text" placeholder="MM/YY" className="mt-1" data-pendo-mask="true" />
            </div>
            <div>
              <Label>CVV</Label>
              <Input type="text" placeholder="•••" className="mt-1" data-pendo-mask="true" />
            </div>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => {
            // PENDO: payment method added
            track("payment_method_added", { source: "billing_settings" });
            toast.success("Payment method updated");
          }}>
            Update card
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
