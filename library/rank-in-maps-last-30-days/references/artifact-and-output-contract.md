# Artifact and output contract

## RIM artifact

Expect `rim.business-last-30-days.v1` with an exact rolling window, business identity, per-source outcomes, normalized signals, limitations, and evidence references.

Each source is `completed`, `partial`, `unavailable`, `skipped`, or `failed`. Each signal identifies its entity, category, observation time, optional event time and metrics, confidence, source, and `currentSnapshot` status.

Keep RIM evidence distinct from host-researched evidence. Cite `evidenceRef` for important RIM claims; cite URLs for host research. Never promote an observation time into an event date.

## Required report order

Use these headings exactly:

1. `What you probably did not know`
2. `Contradictions or risks`
3. `Competitor moves`
4. `Customer and demand signals`
5. `Visibility and performance`
6. `What to do next`
7. `Coverage and receipts`

Under Coverage and receipts, list the exact window, source outcomes, host-search lanes actually searched, limitations, task id, and artifact version.

Do not claim a competitor move merely because a current listing snapshot differs from memory. Do not claim absence when collection failed or was unavailable.
