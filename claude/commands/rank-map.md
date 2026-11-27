---
description: Show where your business ranks on Google Maps across your area
---

Show the user where their business ranks on Google Maps. If more than one
business is connected and the user has not said which, call
`rim_list_businesses` and let them pick. Then call `rim_get_geo_grid` with the
`locationId` (and `query` if the user named a search term). In hosts that
support MCP Apps this renders an interactive rank map; otherwise summarise the
grid in words: where the business is in the top 3, where it is missing, and
which competitors beat it most.

`rim_get_geo_grid` only reads the latest saved scan and is free. If it returns
`no_scan` or `scanning`, say so plainly and point to Rankings in Rank-in-Maps;
do not start a paid scan without the user's explicit yes. Never invent
positions.
