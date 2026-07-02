-- Tracks the Learners Hub handoff for a promoted ticket. is_candidate_article
-- (promoted intent) and kb_article_url (published back) already exist; these
-- record that the outbound submission actually reached Learners Hub and the id
-- they returned, so the UI can tell "marked candidate" from "handed off" and a
-- failed handoff can be retried safely.

alter table public.tickets add column kb_submission_id text;
alter table public.tickets add column kb_submitted_at timestamptz;
