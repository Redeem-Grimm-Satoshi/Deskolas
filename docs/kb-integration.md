# Deskolas to Learners Hub integration

Connecting Deskolas (ticketing) to the Learners Hub knowledge base: the KCS
loop, where resolved tickets become candidate articles.

Status: implemented, behind env-var config, ready for the live test with the KB
team. Target for MVP integration: July 6, 2026. The contract below reflects what
the KB team confirmed on issue #6.

## The loop

1. A ticket is resolved in Deskolas and an admin clicks **Promote to Knowledge
   Base**. That sets `is_candidate_article = true` and hands the ticket off to
   Learners Hub.
2. Deskolas POSTs the ticket to the Learners Hub submissions API. It lands in
   their Admin Portal QA queue. We store the id they return.
3. The KB team formats and publishes the article.
4. On publish, Learners Hub calls our webhook with the published URL. Deskolas
   stores it in `tickets.kb_article_url` and the ticket shows an "In Knowledge
   Base" link.

## Why promote, not every resolve

Firing on every resolved ticket would flood their QA queue with routine fixes.
Firing on the explicit **Promote** action means only curated, genuinely reusable
fixes are handed off.

## Contract

### Deskolas to Learners Hub (on promote)

We POST directly to the Learners Hub Supabase REST API.

`POST {KB_SUBMISSIONS_URL}` (their `.../rest/v1/submissions`)

Headers: `apikey: {KB_API_KEY}`, `Authorization: Bearer {KB_API_KEY}`,
`Content-Type: application/json`, `Prefer: return=representation`.

```json
{
  "type": "Resolved Ticket",
  "title": "Zoom mic not picking up audio in class",
  "content": "Problem: Mic shows no input in Zoom during class...\n\nSolution: Switched Zoom input to the USB headset...",
  "track": "Hardware and AV",
  "author": "Andre T.",
  "full_name": "Andre T.",
  "url": "https://deskolas.example/tickets/PS-0005",
  "reference_id": "PS-0005"
}
```

`full_name` duplicates `author`: their table requires it (it drives the Wall of
Fame placard) and rejects rows without it, confirmed during the live test.

- `content` combines the ticket description (problem) and resolution notes
  (solution), each labelled. The admin can leave the notes out at promote time.
- `track` is our free-text category. Their Normalization Engine maps it to their
  canonical domain in the staging queue, so we stay decoupled from their
  taxonomy.
- `reference_id` (the PS-#### reference) is the idempotency key. Their table
  rejects duplicates, so a retry never creates a second submission.

Response: `201 Created` with a JSON array holding the new row, including its
`id`. A duplicate `reference_id` returns `409`, which we treat as already
submitted. We retry `5xx` and network failures with exponential backoff, and do
not retry other `4xx`.

### Learners Hub to Deskolas (on publish)

`POST {deskolas_base}/api/kb/published`

Headers: `Authorization: Bearer {KB_WEBHOOK_SECRET}`

```json
{
  "reference": "PS-0005",
  "article_url": "https://learners-hub.example/zoom-mic"
}
```

Deskolas verifies the secret (constant-time), sets `kb_article_url` on the
matching ticket, and returns `200 OK`. Unknown reference returns `404`; a bad or
missing secret returns `401`. `reference_id`/`url` are accepted as aliases for
`reference`/`article_url`.

## Configuration

Three server-only env vars, exchanged with the KB team over a secure channel and
never committed (see `.env.example`):

- `KB_SUBMISSIONS_URL`, `KB_API_KEY` for the outbound POST.
- `KB_WEBHOOK_SECRET` for the inbound webhook.

When the outbound pair is unset, promote still records the local candidate flag
and simply skips the handoff, so the app works without KB wired up.

## Data model

`tickets` carries the bridge fields: `is_candidate_article` (promoted intent),
`kb_submission_id` and `kb_submitted_at` (handed off, with their id), and
`kb_article_url` (published back). The three visible states on the ticket are
Promote available, Sent to Learners Hub, and In Knowledge Base.

## Security

- Both calls are server to server. No secret reaches the browser (none are
  `NEXT_PUBLIC`).
- The outbound key is sent only to the KB endpoint. The inbound webhook rejects
  any request without the shared secret, compared in constant time.
- The webhook writes with the service role because there is no user session; it
  only ever sets `kb_article_url` on the referenced ticket.
