export const sessionReplayConfig = {
  enabled: true,
  maskInputFields: ["password", "credit_card", "cvv", "ssn"],
  maskSelectors: [
    "[data-pendo-mask='true']",
    "input[type='password']",
    ".billing-payment-method-selector input",
  ],
  blockSelectors: [".user-pii"],
  excludePages: ["/settings/billing/payment-methods/edit"],
  sampleRate: 1.0,
};
