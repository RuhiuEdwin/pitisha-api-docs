/** The go-live checklist. The phases after "Build" follow the partners portal: Settings and security, then Request live access (onboarding, in review, live). */
export interface CheckItem { id: string; text: string; help?: string; href?: string; where: "your code" | "portal" }
export interface CheckPhase { id: string; title: string; blurb: string; items: CheckItem[] }

export const GOLIVE: CheckPhase[] = [
  {
    id: "build",
    title: "Build and test in the sandbox",
    blurb: "Everything in this phase is yours to prove with test money.",
    items: [
      { id: "webhook-verify", where: "your code", text: "A webhook endpoint is saved, receives events and verifies the signature.", href: "/docs/recipes/verify-webhook/" },
      { id: "webhook-idempotent", where: "your code", text: "Your handler ignores events it has already processed.", help: "Store each event id you handled. Events can arrive more than once.", href: "/docs/webhooks/" },
      { id: "idem-keys", where: "your code", text: "Every create request sends an Idempotency-Key.", href: "/docs/recipes/retry-safely/" },
      { id: "failures", where: "your code", text: "You tested a successful payment and a failed one (insufficient_funds, customer_cancelled, no_response).", href: "/docs/sandbox/" },
      { id: "pending", where: "your code", text: "You handle a collection that stays pending: wait for the event, or ask with the query call, and never charge twice.", href: "/docs/recipes/collect-paybill-payment/" },
      { id: "rails", where: "your code", text: "Each rail you use (card, Airtel Money, PesaLink) is enabled for your business and tested. They are not yet verified with their providers.", href: "/docs/rails/" },
      { id: "shortcode", where: "portal", text: "A shortcode is assigned to a wallet, and you know where each payment will land.", href: "/docs/reference/shortcodes/" },
      { id: "secrets", where: "your code", text: "Secret keys live in environment variables or a secrets manager, never in source control." },
      { id: "request-id", where: "your code", text: "Logs include the request_id from errors.", href: "/docs/errors/" },
    ],
  },
  {
    id: "portal",
    title: "Get ready in the partners portal",
    blurb: "These are the steps the portal itself shows under Settings and security.",
    items: [
      { id: "verified", where: "portal", text: "The business is verified. Sending money stays off until it is.", help: "Receiving payments is not affected. Payouts return verification_required until verification is done.", href: "/docs/errors/" },
      { id: "approval-limit", where: "portal", text: "The approval limit is set to what you want.", help: "Payouts above it need a second person. Raising the limit also needs a second person.", href: "/docs/approvals/" },
      { id: "ip-allowlist", where: "portal", text: "The app that holds your live key has an IP allowlist of your servers, if you have fixed addresses.", help: "Requests from other addresses get ip_not_allowed. In live, changing it needs a second team member.", href: "/docs/app-security/" },
      { id: "permission", where: "portal", text: "Someone with the permission to request live access is ready to do it." },
    ],
  },
  {
    id: "request",
    title: "Request live access",
    blurb: "In the portal the status moves from onboarding, to in review, to live.",
    items: [
      { id: "request-live", where: "portal", text: "Choose Request live access in Settings and security.", help: "Tefo reviews the request and a second person approves it." },
      { id: "live-keys", where: "your code", text: "After approval, create a live app and put the sk_live_ key in your production secrets.", href: "/docs/environments/" },
      { id: "live-webhook", where: "portal", text: "Add a live webhook endpoint. A second person approves it.", href: "/docs/reference/webhooks/" },
    ],
  },
  {
    id: "after",
    title: "After you are live",
    blurb: "The first week is for watching.",
    items: [
      { id: "small", where: "your code", text: "Start with small amounts and check the first payments in Transactions." },
      { id: "watch", where: "portal", text: "Watch Webhooks for failed deliveries." },
      { id: "rotate", where: "portal", text: "Rotate keys whenever someone with access leaves." },
    ],
  },
];

export const ALL_CHECK_ITEMS = GOLIVE.flatMap((p) => p.items);

export function goLiveMarkdown(done: ReadonlySet<string> = new Set()): string {
  return GOLIVE.map((p) => `## ${p.title}\n\n${p.blurb}\n\n${p.items.map((i) => `- [${done.has(i.id) ? "x" : " "}] ${i.text}${i.help ? ` ${i.help}` : ""}`).join("\n")}`).join("\n\n");
}
