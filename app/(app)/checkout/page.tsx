"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { track } from "@/lib/pendo";
import { toast } from "sonner";

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get("plan") ?? "pro";
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "TaskPilot — Checkout";
    // PENDO: checkout started
    track("checkout_started", { plan });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    // PENDO: payment method added
    track("payment_method_added", { plan });
    // PENDO: checkout completed
    track("checkout_completed", { plan });
    toast.success("Payment successful!");
    router.push("/checkout/success");
  };

  const handleSimulateFailure = () => {
    // PENDO: payment failed
    track("payment_failed", { plan, reason: "simulated" });
    toast.error("Payment failed: Card declined (simulated)");
  };

  const prices: Record<string, string> = { pro: "$12/mo", enterprise: "Custom" };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid gap-6">
        {/* Order summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Order summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-1">
              <span className="capitalize">TaskPilot {plan}</span>
              <span className="font-medium">{prices[plan] ?? "$12/mo"}</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{prices[plan] ?? "$12/mo"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Payment details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Cardholder name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rivera" className="mt-1" required />
              </div>
              <div>
                <Label>Card number</Label>
                <Input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="mt-1"
                  data-pendo-mask="true"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Expiry date</Label>
                  <Input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="mt-1"
                    data-pendo-mask="true"
                    required
                  />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="•••"
                    className="mt-1"
                    data-pendo-mask="true"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading ? "Processing…" : `Pay ${prices[plan] ?? "$12/mo"}`}
              </Button>
              <Button type="button" variant="ghost" className="w-full text-xs text-muted-foreground" onClick={handleSimulateFailure}>
                Simulate payment failure
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-6 py-12">Loading checkout…</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
