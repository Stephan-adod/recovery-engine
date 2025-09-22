param([Parameter(Mandatory=$true)][string]$Title)

$TicketDir = "tickets"
$HandoverDir = "handover"
$SmokeDir = "smoke"

$max = (Get-ChildItem $TicketDir -Filter 'AT-*.md' |
  Where-Object { $_.Name -match 'AT-(\d{3})\.md' } |
  ForEach-Object { [int]$Matches[1] } | Measure-Object -Maximum).Maximum
if (-not $max) { $max = 0 }
$next = $max + 1
$id = ('AT-{0:D3}' -f $next)
$slug = ($Title.ToLower() -replace '[^a-z0-9]+','-').Trim('-')

New-Item -ItemType Directory -Force $HandoverDir | Out-Null
New-Item -ItemType Directory -Force $SmokeDir | Out-Null

# Ticket
$ticketPath = Join-Path $TicketDir "$id.md"
Set-Content $ticketPath @"
# $id: $Title

## Ziel
<1 Satz>

## Scope-Dateien
- functions/...

## MVP-Bezug
- ops/runbooks/Product_MVP_v0.5.md

## Infra-Abhängigkeiten
- Keine | siehe ops/runbooks/Infrastructure_v.01.md

## Input
<Schema/Beispiel>

## Output
<Endpoint/Dateien>

## Tests
- Emulator lokal + Smoke (siehe Handover)

## DoD
- [ ] Feature ok
- [ ] Smoke grün
- [ ] CI grün
"@

# Handover
$handoverPath = Join-Path $HandoverDir "$id.md"
Set-Content $handoverPath @"
# Handover: $id $Title

## Ticket
- tickets/$id.md
- Branch: feature/$id-$slug

## Ziel & Scope
- Ziel: <aus Ticket>
- Scope: [Liste der zu ändernden Dateien]

## Inputs
- ops/runbooks/workflow.md
- ops/runbooks/governance.md v0.1.md
- ops/runbooks/Product_MVP_v0.5.md
- ops/runbooks/Infrastructure_v.01.md
- ops/runbooks/codex_prinzipien_v_0.md

## Outputs
- <Endpoint/Dateien>

## Tests
- Emulator starten
- Smoke: smoke/$id.http

## Smoke-Curl
\`\`\`http
GET http://127.0.0.1:5001/recovery-engine/europe-west1/<endpoint>
Content-Type: application/json
\`\`\`

## DoD
- [ ] Ticket erfüllt
- [ ] Nur Scope geändert
- [ ] Smoke lokal grün
- [ ] CI grün
"@

# Smoke
$smokePath = Join-Path $SmokeDir "$id.http"
Set-Content $smokePath @"
GET http://127.0.0.1:5001/recovery-engine/europe-west1/<endpoint>
Content-Type: application/json
"@

git checkout -b "feature/$id-$slug"
git add $ticketPath $handoverPath $smokePath
git commit -m "chore($id): scaffold ticket + handover + smoke"
Write-Output "$id ready: $ticketPath, $handoverPath, $smokePath"
