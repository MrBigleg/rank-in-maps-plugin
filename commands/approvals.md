---
name: approvals
description: See the drafts waiting for your OK before they go to Google
---

Call `rim_list_pending_approvals` for the user's business (pick it with
`rim_list_businesses` first if more than one is connected). In hosts that
support MCP Apps this renders each draft with a before/after preview and a
button that opens it in the Rank-in-Maps action queue.

You cannot approve drafts, and neither can the view: the owner approves in
Rank-in-Maps at `/dashboard/action-queue`. You may withdraw a draft you staged
with `rim_withdraw_staged_action` when the user asks for a change, then stage a
corrected one.
