# Deskolas to Learners Hub integration

A proposal for connecting Deskolas (ticketing) to the Learners Hub knowledge
base, to bring to the sync with the KB team. This is the KCS loop: resolved
tickets become candidate articles.

Status: proposal. The wiring lands in Phase 2, once Deskolas has its Supabase
backend and server-side API routes. Target for MVP integration: July 6, 2026.

## The loop

1. A ticket is resolved in Deskolas and an admin clicks **Promote to Knowledge
   Base**. That sets `is_candidate_article = true` on the ticket.
2. Deskolas POSTs the ticket data to the Learners Hub submissions API. It lands
   in their Admin Portal QA queue.
3. The KB team formats and publishes the article.
4. On publish, Learners Hub calls a Deskolas webhook with the published URL.
   Deskolas stores it in `tickets.kb_article_url` and shows an "In Knowledge
   Base" tag on the ticket.

## Why promote, not every resolve

Firing on every resolved ticket would flood the QA queue with routine fixes.
Firing on the explicit **Promote** action means only curated, genuinely reusable
fixes are handed off. The two KB-bridge fields (`is_candidate_article`,
`kb_article_url`) have been on the `tickets` table since the first migration for
exactly this, so no schema change is needed.

## Contract

### Deskolas to Learners Hub (on promote)

`POST {learners_hub_base}/api/submissions`

Headers: `Authorization: Bearer <shared secret>`, `Content-Type: application/json`

```json
{
  "source": "deskolas",
  "event": "ticket.promoted",
  "idempotency_key": "PS-0005",
  "ticket": {
    "reference": "PS-0005",
    "title": "Zoom mic not picking up audio in class",
    "category": "Hardware and AV",
    "priority": "low",
    "problem": "Mic shows no input in Zoom during class, works in other apps.",
    "solution": "Switched Zoom input to the USB headset and turned off exclusive mode in Windows sound. Confirmed in a test call.",
    "resolved_by": "Andre T.",
    "resolved_at": "2026-06-28T14:50:00Z",
    "source_url": "https://deskolas.app/tickets/PS-0005"
  }
}
```

Expected response: `202 Accepted` with `{ "submission_id": "..." }`.

### Learners Hub to Deskolas (on publish)

`POST {deskolas_base}/api/kb/published`

Headers: `Authorization: Bearer <shared secret>`

```json
{
  "reference": "PS-0005",
  "status": "published",
  "article_url": "https://learners-hub.bolt.host/zoom-mic"
}
```

Deskolas sets `kb_article_url` on the matching ticket and returns `200 OK`.

## Field notes

- `reference` is the human ticket id (PS-0005) and doubles as the join key
  between the two systems.
- `idempotency_key` = the reference, so a re-send never creates a duplicate
  submission.
- `problem` is the ticket description; `solution` is the resolution notes.
- `resolved_by` is a display name only. The opener's identity is left out unless
  the KB team needs it.

## Security

- Both calls are server to server. The shared secret never reaches the browser.
- Deskolas keeps the secret in a server-only env var (not `NEXT_PUBLIC`).
- Both endpoints reject requests without a valid bearer token.

## Open questions for the sync

- Exact base URLs and the shape of the submissions table on their side.
- Do they want tags or a category mapping, or is our free-text category enough?
- Retry and failure handling if a submission POST fails (Deskolas can retry with
  the same idempotency key).
