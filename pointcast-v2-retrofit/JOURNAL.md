# Pointcast v2 Polariser (Jonsa) — 7-Pin CNLINKO Connector Retrofit to Legacy CNLINKO Bulkhead

**Working journal** — raw capture of steps, photos and notes as the work happens.
The formal procedure document will be generated from this journal once all steps
are marked done.

- **Started:** 2026-08-20
- **Author:** Kelvin (kelvin@kacific.com)
- **Status:** IN PROGRESS — collecting steps
- **Goal:** Retrofit the new CNLINKO 7-pin connector supplied with the Pointcast v2
  (Jonsa) polariser so it mates with / works on the existing legacy CNLINKO bulkhead
  already installed in the field.

---

## Photo index

| # | File | Step | Caption |
|---|------|------|---------|
| _(none yet)_ | | | |

---

## Steps

_(entries appended below as they are received)_

## Step 01 — Open the packaging box (as-received inspection)

**Date:** 2026-08-20
**Photo:** `photos/step-01-box-opened.jpg` _(pending — see note on photo handling)_
**Kelvin's note:** "Open the packaging box"

### Observations from photo
- New Pointcast v2 (Jonsa) polariser assembly received boxed in a plain
  single-wall carton, unit sealed inside a clear poly bag, cable coiled around
  the unit inside the same bag. No visible foam/moulded insert — unit is a
  loose fit in the carton.
- **Main body:** light grey / beige die-cast housing with a dark grey (near
  black) rectangular cover plate across the centre face. Cast mounting lugs /
  bracket feet visible on the left and lower-right of the body, secured with
  hex-head screws.
- **Attached cable, left side:** moulded lead terminating in a **black CNLINKO
  connector with a red locking ring / coupling nut** — this is the NEW 7-pin
  connector that is the subject of the retrofit. Red collar is the immediate
  visual identifier vs. the legacy part.
- **Bottom-left of frame:** a metallic **right-angle coax connector** on the end
  of the same lead run (RF port). Body carries stamped markings, not legible at
  this resolution.
- **Right side of frame:** a second coiled white/light-grey cable, bagged
  separately.
- Condition on arrival: no visible transit damage, no crushed corners, bag
  intact, connector caps/collars appear undisturbed.

### To confirm / capture later
- [ ] Part number and label on the carton (outer box label)
- [ ] Part number stamped on the new CNLINKO connector body
- [ ] Markings on the right-angle coax connector
- [ ] What the second (white) cable is and where it goes
- [ ] Full packing list vs. what was actually in the box

---

## Step 02 — Remove cable assembly only, set the rest aside

**Kelvin's note:** "Only remove cable assembly. Set the rest aside"

Photo: cable assembly held in hand, lifted clear of the still-bagged polariser body.
- Grey/beige jacketed round cable, coiled, ~2 m, one cable tie still on the coil.
- One end: **CNLINKO connector — black knurled coupling nut, red centre body,
  black rear gland nut.** Cable enters at 90° (right-angle) to the connector axis.
- Metal collar / strain relief visible at the cable exit.
- White text printed along the cable jacket (not legible in this shot).
- Polariser body left bagged and set aside; only the cable assembly taken out.

---

## Step 03 — Twist and unfasten the back cable clamp

**Kelvin's note:** "Twist and unfasten the back cable clamp."

Close-up of the new CNLINKO connector, cable exiting top of frame.
Connector layout top-to-bottom:
1. **Black knurled nut (cable end) = back cable clamp** — the part being undone here.
2. Red moulded centre body.
3. Larger black knurled coupling nut (mating end, toward bulkhead).

Action: twist the back cable clamp to unfasten it.

> **Doc rendering note (Kelvin):** the screwdriver in this photo is being used as a
> pointer only — replace it with a drawn callout arrow in the final procedure
> document. It points at the back cable clamp (upper black nut).
> Apply this convention to any later photo where a screwdriver is used to point.

---

## Step 04 — End state after back cable clamp removal

**Kelvin's note:** "End state after removal"

- Back cable clamp (black nut) fully unscrewed and slid back along the grey cable,
  now sitting loose ~100 mm up the coil. Not removed from the cable — captive on it.
- Connector rear now exposed: **red threaded collar** with a slotted/fingered
  collet section at the top where the cable passes through (the gland/seal grip).
  External thread on the red body is what the black clamp nut screws down onto.
- Black coupling nut at the mating end still in place on the red body.
- Also in frame (bottom): a separate **metal circular connector, knurled chrome
  coupling nut with two side screws, on a black cable** — the legacy-side / other
  cable end. To be identified.

---

## Step 05 — Legacy bulkhead identified / remove from packet

**Kelvin's note:** "This is the legacy version of the bulkhead that we are adapting
the new cable's new connector to. The new one basically just has the same part
number ending with 401A"

### Part identification (from CNLINKO bag label)
| | |
|---|---|
| Manufacturer | CNLINKO (Shenzhen Linko Electric Co., Ltd) — www.cnlinko.com |
| **Legacy bulkhead P/N** | **YM-20-J07SX-02-401** |
| **New (v2) bulkhead P/N** | **YM-20-J07SX-02-401A** — same P/N, `A` suffix |
| Internal / order code | 11320007400106 |
| Qty | 1 PCS |
| L/N | MF01 |
| Bag code | C162 |
| SN | 2606001246 |
| Standard on bag | GB/T 4208-2017 (IP ratings) |

Series: YM-20, 7-pin (`J07S`). Black moulded bulkhead receptacle visible inside
the bag, with a metal retaining/lanyard eyelet.

**Action:** remove the bulkhead from the packet.

> Key point for the procedure doc: legacy `-401` vs new `-401A` is the whole
> reason for the retrofit. Confirm what physically differs between the two.

---

## Step 06 — Root cause of incompatibility: pin rotation + extra alignment teeth

**Kelvin's note:** "This is the difference between pin rotation and the presence of
two additional internal alignment teeth"

Side-by-side mating-face comparison, held together for reference:

**LEFT — new cable-side connector (male plug, pins):** 7 gold pins, 6 in a ring +
1 centre. Circular black housing, keyways moulded into the inner shell wall.

**RIGHT — legacy bulkhead (female receptacle, sockets):** 7 gold sockets, 6 + 1
centre, positions moulded-numbered **1–7** around the insert. Square flange with
2 diagonal mounting holes, red body visible behind the black flange face.

### The two blocking differences
1. **Pin rotation (clocking)** — the pin/socket pattern is rotated between the
   two parts, so pin numbering does not line up when mated in the natural
   orientation.
2. **Two additional internal alignment teeth** — the new connector has extra
   keying teeth inside the shell that the legacy bulkhead does not accommodate,
   physically preventing full insertion.

> This is the core of the retrofit — both must be resolved for the new connector
> to seat and pin out correctly on the legacy `-401` bulkhead.

---

## Step 07 — Trial fit: push together until rotation stops (will NOT fully mate)

**Kelvin's note:** "Fit them together loosely until no loose rotation is possible.
Note that the connectors will not fully mate together"

- New cable connector (red body, black coupling nut) offered up to the legacy
  bulkhead (black square flange, red sealing gasket on the underside of the flange).
- Pushed together only until the keying picks up and **free rotation stops** —
  this is the reference/datum position for the rotation check.
- **Confirmed: the two will not seat fully.** A visible gap remains between the
  black coupling nut and the bulkhead flange; the coupling nut cannot be run down
  onto the bulkhead. Consistent with the extra alignment teeth fouling (Step 06).

> Procedure doc: this is a diagnostic/reference step, not an assembly step —
> do not force. Purpose is to establish the clocking datum and confirm the
> interference before any material is removed.

---

## Step 08 — Use the bulkhead as a tool to loosen and unscrew the internal connector shaft

**Kelvin's note:** "Use the bulkhead to help loosen the internal connector shaft
and unscrew it completely"

- With the two parts loosely engaged (Step 07 datum), the **bulkhead is used as a
  grip/wrench** on the plug's inner insert. The keying that stops free rotation is
  what lets the bulkhead drive the internal shaft.
- Hold the red body in one hand, twist the bulkhead to break the internal
  connector shaft free of the red body, then unscrew the shaft **completely**.
- Photo shows the coupling nut / inner black insert partly backed out of the red
  body, the joint line clearly open.

> Useful field trick — no special tool needed, the mating bulkhead is the tool.
> Worth calling out explicitly in the procedure doc.
> **To capture:** thread direction (assumed normal RH / anticlockwise to loosen)
> and whether any thread-lock was present.

---

## Step 09 — End state of segment: insert withdrawn from red body

**Kelvin's note:** "End state of segment"

- Internal connector insert now fully unscrewed and drawn out of the red shell,
  still wired — cable core remains attached, connector hanging on the loom.
- **Red shell:** "LINKO" moulded into the outer surface; internal thread visible
  at the open end. Grey cable jacket enters through it.
- **Insert:** black knurled body, multiple external thread starts, **red O-ring
  (face/radial seal) fitted in its groove** — protect this, it is the primary
  seal.
- **Wiring visible:** individually coloured conductors leaving the cable jacket —
  blue, orange, green, white, pink/white identifiable in shot; black heatshrink
  sleeving over the joints/tails at the insert end.
- Bottom of frame: the previously separated connector shaft with the gold pins,
  set down on the bench.

### To capture
- [ ] Full wire colour → pin number table before anything is disturbed

---

