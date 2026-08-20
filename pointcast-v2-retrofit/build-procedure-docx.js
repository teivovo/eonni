const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, LevelFormat,
  Header, Footer, PageNumber, convertInchesToTwip, TableLayoutType, VerticalAlign
} = require('/tmp/claude-0/-home-user-eonni/5b8a75e6-bcde-5614-87cb-c4d51f387f27/scratchpad/node_modules/docx');
const fs = require('fs');

const NAVY = '1F3864';
const ACCENT = '2E5C8A';
const RED = 'B32020';
const GREY = '595959';
const LIGHT = 'F2F5F9';
const WARNBG = 'FBE7E7';
const NOTEBG = 'FFF7E0';
const CW = 9020; // content width in DXA

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE,
                    insideHorizontal: NONE, insideVertical: NONE };

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 0, after: opts.after ?? 120, line: 264 },
    alignment: opts.align,
    indent: opts.indent,
    children: [new TextRun({
      text, bold: opts.bold, italics: opts.italics, color: opts.color,
      size: opts.size ?? 21, font: 'Calibri', allCaps: opts.caps
    })],
    ...(opts.border ? { border: opts.border } : {})
  });
}

function rich(runs, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 0, after: opts.after ?? 120, line: 264 },
    alignment: opts.align,
    indent: opts.indent,
    children: runs.map(r => new TextRun({
      text: r.t, bold: r.b, italics: r.i, color: r.c, size: r.s ?? 21, font: 'Calibri'
    }))
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT, space: 4 } },
    children: [new TextRun({ text, bold: true, color: NAVY, size: 28, font: 'Calibri' })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 100 },
    children: [new TextRun({ text, bold: true, color: ACCENT, size: 23, font: 'Calibri' })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, bold: true, color: '333333', size: 21, font: 'Calibri' })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { after: 60, line: 264 },
    children: [new TextRun({ text, size: 21, font: 'Calibri' })]
  });
}

function bulletRich(runs, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { after: 60, line: 264 },
    children: runs.map(r => new TextRun({ text: r.t, bold: r.b, italics: r.i, color: r.c, size: 21, font: 'Calibri' }))
  });
}

function checkbox(text) {
  return new Paragraph({
    spacing: { after: 60, line: 264 },
    indent: { left: 300 },
    children: [
      new TextRun({ text: '☐ ', size: 22, font: 'Calibri' }),
      new TextRun({ text, size: 21, font: 'Calibri' })
    ]
  });
}

// Coloured callout box (warning / note / tip)
function callout(title, lines, bg, barColor) {
  const kids = [
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: title, bold: true, color: barColor, size: 21, font: 'Calibri' })]
    })
  ];
  lines.forEach((l, i) => {
    kids.push(new Paragraph({
      spacing: { after: i === lines.length - 1 ? 0 : 60, line: 264 },
      children: typeof l === 'string'
        ? [new TextRun({ text: l, size: 21, font: 'Calibri' })]
        : l.map(r => new TextRun({ text: r.t, bold: r.b, italics: r.i, color: r.c, size: 21, font: 'Calibri' }))
    }));
  });
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    layout: TableLayoutType.FIXED,
    borders: {
      top: NONE, bottom: NONE, right: NONE,
      left: { style: BorderStyle.SINGLE, size: 18, color: barColor },
      insideHorizontal: NONE, insideVertical: NONE
    },
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: CW, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: bg, color: 'auto' },
        margins: { top: 140, bottom: 140, left: 200, right: 200 },
        children: kids
      })]
    })]
  });
}

// Placeholder frame for a photograph
function photoPlaceholder(caption) {
  return [
    new Table({
      width: { size: CW, type: WidthType.DXA },
      columnWidths: [CW],
      layout: TableLayoutType.FIXED,
      borders: {
        top:    { style: BorderStyle.DASHED, size: 6, color: 'AAAAAA' },
        bottom: { style: BorderStyle.DASHED, size: 6, color: 'AAAAAA' },
        left:   { style: BorderStyle.DASHED, size: 6, color: 'AAAAAA' },
        right:  { style: BorderStyle.DASHED, size: 6, color: 'AAAAAA' },
        insideHorizontal: NONE, insideVertical: NONE
      },
      rows: [new TableRow({
cantSplit: true,
      height: { value: 2600, rule: 'atLeast' },
      children: [new TableCell({
          width: { size: CW, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: 'FAFAFA', color: 'auto' },
          margins: { top: 300, bottom: 300, left: 200, right: 200 },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 40 },
              children: [new TextRun({ text: '[ PHOTOGRAPH ]', bold: true, color: '999999', size: 19, font: 'Calibri' })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 0 },
              children: [new TextRun({ text: caption, italics: true, color: '777777', size: 18, font: 'Calibri' })]
            })
          ]
        })]
      })]
    }),
    new Paragraph({ spacing: { after: 160 }, children: [] })
  ];
}

// Generic table builder
function table(headers, rows, widths, opts = {}) {
  const hdr = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map((htext, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: NAVY, color: 'auto' },
      margins: { top: 90, bottom: 90, left: 130, right: 130 },
      children: [new Paragraph({
        spacing: { after: 0 },
        children: [new TextRun({ text: htext, bold: true, color: 'FFFFFF', size: 19, font: 'Calibri' })]
      })]
    }))
  });
  const body = rows.map((r, ri) => new TableRow({
    cantSplit: true,
    children: r.map((cellText, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: ri % 2 ? 'FFFFFF' : LIGHT, color: 'auto' },
      margins: { top: 80, bottom: 80, left: 130, right: 130 },
      children: String(cellText).split('|').map((line, li) => new Paragraph({
        spacing: { after: 0, line: 250 },
        children: [new TextRun({
          text: line,
          bold: (opts.boldCol === i) || (li === 0 && opts.boldFirstLineCol === i),
          color: line.startsWith('!!') ? RED : undefined,
          size: 19, font: 'Calibri'
        })]
      }))
    }))
  }));
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: widths,
    layout: TableLayoutType.FIXED,
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 4, color: 'BFC9D6' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BFC9D6' },
      left:   { style: BorderStyle.SINGLE, size: 4, color: 'BFC9D6' },
      right:  { style: BorderStyle.SINGLE, size: 4, color: 'BFC9D6' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: 'D6DEE8' },
      insideVertical:   { style: BorderStyle.SINGLE, size: 2, color: 'D6DEE8' }
    },
    rows: [hdr, ...body]
  });
}

function spacer(h = 160) { return new Paragraph({ spacing: { after: h }, children: [] }); }

// ---- Step block -------------------------------------------------------------
function step(num, title, journalRef, bodyEls) {
  const bar = new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [900, CW - 900 - 1500, 1500],
    layout: TableLayoutType.FIXED,
    borders: noBorders,
    rows: [new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 900, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: NAVY, color: 'auto' },
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({
            alignment: AlignmentType.CENTER, spacing: { after: 0 },
            children: [new TextRun({ text: String(num), bold: true, color: 'FFFFFF', size: 24, font: 'Calibri' })]
          })]
        }),
        new TableCell({
          width: { size: CW - 900 - 1500, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: LIGHT, color: 'auto' },
          margins: { top: 90, bottom: 90, left: 160, right: 120 },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({
            spacing: { after: 0 },
            children: [new TextRun({ text: title, bold: true, color: NAVY, size: 22, font: 'Calibri' })]
          })]
        }),
        new TableCell({
          width: { size: 1500, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: LIGHT, color: 'auto' },
          margins: { top: 90, bottom: 90, left: 120, right: 140 },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT, spacing: { after: 0 },
            children: [new TextRun({ text: journalRef, italics: true, color: GREY, size: 17, font: 'Calibri' })]
          })]
        })
      ]
    })]
  });
  return [bar, spacer(120), ...bodyEls, spacer(140)];
}

// =============================================================================
//  DOCUMENT CONTENT
// =============================================================================
const children = [];

// ---------- Cover ----------
children.push(
  new Paragraph({ spacing: { after: 900 }, children: [] }),
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: 'FIELD ENGINEERING PROCEDURE', bold: true, color: ACCENT, size: 20, font: 'Calibri', characterSpacing: 40 })]
  }),
  new Paragraph({
    spacing: { after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: NAVY, space: 6 } },
    children: []
  }),
  new Paragraph({
    spacing: { before: 120, after: 100 },
    children: [new TextRun({ text: 'Retrofitting the Pointcast v2 (Jonsa) Polariser', bold: true, color: NAVY, size: 40, font: 'Calibri' })]
  }),
  new Paragraph({
    spacing: { after: 500 },
    children: [new TextRun({ text: '7-Pin CNLINKO Connector to the Legacy CNLINKO Bulkhead', color: ACCENT, size: 30, font: 'Calibri' })]
  })
);

children.push(table(
  ['Field', 'Detail'],
  [
    ['Document title', 'Pointcast v2 (Jonsa) Polariser — CNLINKO 7-Pin Connector Retrofit Procedure'],
    ['Subject', 'Adapting the new CNLINKO YM-20-J07SX-02-401A style cable connector so that it mates with the legacy YM-20-J07SX-02-401 bulkhead already installed in the field'],
    ['Prepared by', 'Kelvin — kelvin@kacific.com'],
    ['Date of work', '20 August 2026'],
    ['Revision', '1.0 — first issue'],
    ['Status', 'Issued for review'],
    ['Source', 'Compiled from the working journal and photographs recorded during the first physical retrofit (21 recorded steps)']
  ],
  [2100, CW - 2100],
  { boldCol: 0 }
));

children.push(spacer(400));

children.push(callout(
  '⚠  READ BEFORE USE — PIN 4 / PIN 5 ARE TRANSPOSED',
  [
    [{ t: 'A connector retrofitted by this procedure mates and functions, but the resulting bulkhead pinout has ' },
     { t: 'pin 4 and pin 5 logically swapped', b: true },
     { t: ' relative to the standard CNLINKO YM-20 numbering.' }],
    'This is an inherent and accepted consequence of the re-clocking method, not a fault or an assembly error.',
    [{ t: 'Every downstream activity that references the bulkhead pinout — far-end wiring, continuity testing, fault-finding, documentation — must account for 4↔5. ' },
     { t: 'Label every retrofitted assembly physically.', b: true }]
  ],
  WARNBG, RED
));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 1. Purpose and scope ----------
children.push(h1('1.  Purpose and Scope'));
children.push(p('This procedure describes how to modify the 7-pin CNLINKO connector supplied on the Pointcast v2 (Jonsa) polariser cable assembly so that it will mate correctly with the earlier-generation CNLINKO bulkhead receptacle already deployed in the field.'));
children.push(p('The retrofit allows new-build v2 polariser cable assemblies to be used against existing installed bulkheads without replacing the bulkhead, avoiding disturbance to the installed base.'));

children.push(h2('1.1  Applicability'));
children.push(bullet('Applies to the Pointcast v2 (Jonsa) polariser cable assembly fitted with the new CNLINKO 7-pin connector (red body, black coupling nut).'));
children.push(bullet('Applies where the installed bulkhead is the legacy CNLINKO YM-20-J07SX-02-401.'));
children.push(bullet('Does not apply where the installed bulkhead is already the newer -401A variant; in that case the connector mates as supplied and no modification is required.'));

children.push(h2('1.2  Nature of the modification'));
children.push(p('The modification is mechanical only. No conductor is cut, re-terminated, re-crimped or re-soldered, and no electrical joint is disturbed. The work consists of removing keying material from the connector’s pin encasement and cutting a new locating groove so that the pin carrier can be re-indexed to a different rotational position within the housing.'));

children.push(spacer(80));
children.push(callout('Note on skill level and reversibility', [
  'The modification permanently alters the connector’s pin encasement. It cannot be undone. Practise on a scrap or spare connector before working on a live assembly.',
  'The connector remains a sealed, weatherproof assembly after modification provided the red O-ring and the retaining ring are refitted correctly.'
], NOTEBG, 'A67C00'));

// ---------- 2. Warning ----------
children.push(h1('2.  Critical Warning — Pin 4 / Pin 5 Transposition'));
children.push(p('The re-clocking used by this procedure rotates the pin carrier relative to the connector housing. Once mated to the legacy bulkhead, the physical pin positions no longer correspond one-for-one with the standard CNLINKO YM-20 pin numbering.'));
children.push(spacer(60));
children.push(callout(
  '⚠  PIN 4 ↔ PIN 5 SWAP',
  [
    [{ t: 'On a bulkhead mated to a connector retrofitted by this method, ' },
     { t: 'pin 4 and pin 5 are logically transposed.', b: true }],
    'All other pins (1, 2, 3, 6, 7) retain their standard positions.',
    'Verify continuity end to end before returning the assembly to service. Do not assume the pinout from the moulded numbering on the bulkhead face.'
  ],
  WARNBG, RED
));
children.push(spacer(120));
children.push(h2('2.1  Required mitigations'));
children.push(bullet('Confirm the swap by continuity test on every retrofitted assembly before it leaves the bench (see Section 7).'));
children.push(bullet('Fit a durable physical label to the cable adjacent to the connector recording the retrofit and the 4↔5 swap (see Section 8).'));
children.push(bullet('Record the modification against the asset or serial number in the maintenance record.'));
children.push(bullet('Brief any technician who will subsequently work on the assembly. A retrofitted connector is visually almost indistinguishable from an unmodified one once assembled.'));

children.push(spacer(100));
children.push(callout('Open item — to be completed before final issue', [
  'The signal function carried on pins 4 and 5 has not yet been recorded. Once confirmed, restate this warning in terms of the affected signals rather than pin numbers alone — a warning naming the actual functions is far harder to overlook than one naming bare pin numbers.'
], NOTEBG, 'A67C00'));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 3. Parts ----------
children.push(h1('3.  Parts, Tools and Consumables'));

children.push(h2('3.1  Parts'));
children.push(table(
  ['Item', 'Part number / description', 'Notes'],
  [
    ['Legacy bulkhead', 'CNLINKO YM-20-J07SX-02-401|Order code 11320007400106', 'The installed field part. Square flange, 2 mounting holes, 7 gold sockets, positions moulded 1–7'],
    ['New bulkhead (v2)', 'CNLINKO YM-20-J07SX-02-401A', 'Same part number with "A" suffix. Shown for comparison only — not used in this procedure'],
    ['Cable assembly', 'Pointcast v2 (Jonsa) polariser lead', 'Grey jacketed round cable, approx. 2 m. Cat5-style 4-pair construction (blue, orange, green, brown + whites)'],
    ['Connector', 'CNLINKO YM-20 series 7-pin plug', 'Red body, black coupling nut, black rear cable clamp. This is the part that is modified'],
    ['Manufacturer', 'CNLINKO — Shenzhen Linko Electric Co., Ltd|www.cnlinko.com', 'Bag marked to GB/T 4208-2017 (IP ratings)']
  ],
  [1750, 4100, CW - 1750 - 4100],
  { boldCol: 0 }
));

children.push(spacer(200));
children.push(h2('3.2  Tools'));
children.push(table(
  ['Tool', 'Used for', 'Step'],
  [
    ['Side cutters / flush cutters', 'Nibbling away the pin encasement side wall', '13'],
    ['Slim sharp pick, scriber or small flat-blade screwdriver', 'Levering out the retaining ring; marking the new groove position', '9, 14'],
    ['Small flat-blade screwdriver', 'General prising and as a pointer', 'Various'],
    ['Sharp craft knife or fine needle file', 'Cutting and cleaning the new groove', '14, 15'],
    ['The legacy bulkhead itself', 'Used as a wrench to loosen and later tighten the inner core', '7, 19'],
    ['Continuity tester or multimeter', 'End-to-end verification after reassembly', '21'],
    ['Eye protection', 'Mandatory while cutting plastic', '13–15'],
    ['Clean, light-coloured work surface', 'Small parts are dark and easily lost', 'Throughout']
  ],
  [3000, 4400, CW - 3000 - 4400],
  { boldCol: 0 }
));

children.push(spacer(180));
children.push(callout('Field note — the bulkhead is the tool', [
  'No special or proprietary tooling is required. The mating bulkhead itself provides the grip needed to break the inner core free of the connector body and to tighten it again on reassembly. This is the single most useful trick in the procedure.'
], NOTEBG, 'A67C00'));

children.push(spacer(300));

// ---------- 4. Background ----------
children.push(h1('4.  Background — Why the Retrofit Is Necessary'));
children.push(p('The connector supplied on the v2 polariser lead and the legacy bulkhead share the same CNLINKO YM-20 shell size and the same 7-pin contact pattern (six contacts in a ring plus one central contact). They will not, however, mate.'));
children.push(p('Two independent differences were identified by direct comparison of the two mating faces:'));
children.push(spacer(60));

children.push(table(
  ['#', 'Difference', 'Effect'],
  [
    ['1', 'Pin rotation (clocking)|The pin and socket patterns are rotated relative to one another between the two generations.', 'Pin numbering does not line up when the parts are brought together in their natural orientation.'],
    ['2', 'Two additional internal alignment teeth|The new connector carries extra keying teeth inside the shell that the legacy bulkhead does not accommodate.', 'Physically prevents full insertion. The coupling nut cannot be run down onto the bulkhead flange and a visible gap remains.']
  ],
  [500, 4300, CW - 500 - 4300],
  { boldCol: 0, boldFirstLineCol: 1 }
));

children.push(spacer(200));
children.push(h2('4.1  How the procedure resolves them'));
children.push(p('Both are addressed by the same modification. The pin encasement’s side wall — which carries the offending alignment teeth — is removed entirely, and a new locating groove is cut at a different angular position. When the pin carrier is refitted using the new groove, it seats at a corrected rotational position that the legacy bulkhead accepts.'));
children.push(p('The cost of this approach is the pin 4 / pin 5 transposition described in Section 2. It is a deliberate trade: full mechanical mating and sealing are preserved, at the price of a known and documented pinout deviation.'));

children.push(spacer(200));
children.push(...photoPlaceholder('Figure 1 — Mating faces compared. Left: new cable-side plug (7 gold pins, 6 + 1 centre). Right: legacy bulkhead receptacle (7 gold sockets, positions moulded 1–7, square flange, red gasket).'));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 5. Safety ----------
children.push(h1('5.  Safety and Handling'));
children.push(bullet('Wear eye protection whenever cutting or nibbling plastic. Fragments travel unpredictably when the encasement wall is cut with side cutters.'));
children.push(bullet('Isolate the equipment. Ensure the cable assembly is disconnected and de-energised before any work begins.'));
children.push(bullet('Work on a clean, light-coloured surface. The retaining ring, O-ring and trimmed disc are small, black and very easy to lose.'));
children.push(bullet('Do not force any part. Every disassembly step in this procedure is achievable by hand or with light tool pressure. Resistance means something is not aligned.'));
children.push(bullet('Protect the red O-ring at all times. It is the connector’s primary environmental seal and is reused. A nicked, stretched or contaminated O-ring compromises the weatherproof rating of the finished assembly.'));
children.push(bullet('Remove all swarf. Loose plastic fragments trapped inside the connector can prevent full seating or bridge between contacts.'));

children.push(spacer(200));
children.push(h2('5.1  Component naming used in this document'));
children.push(table(
  ['Term', 'What it refers to'],
  [
    ['Back cable clamp', 'The black knurled nut at the cable end of the connector. Captive on the cable once loosened.'],
    ['Red body / red shell', 'The main red moulded connector body, marked "LINKO".'],
    ['Coupling nut', 'The larger black knurled nut at the mating end that draws the connector onto the bulkhead.'],
    ['Inner core', 'The contact insert assembly — the pin carrier plus its terminated conductors.'],
    ['Pin encasement', 'The black cylindrical shroud fitted over the pins. Carries the keying. This is the part that is cut.'],
    ['Retaining ring', 'The black split (C-shaped) ring that holds the inner core into the insert body. Reused.'],
    ['O-ring', 'The red elastomer sealing ring on the insert body. Distinct from the retaining ring. Reused.'],
    ['Alignment pin', 'The small moulded index feature used as the rotational datum when marking the new groove.']
  ],
  [2200, CW - 2200],
  { boldCol: 0 }
));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 6. Procedure ----------
children.push(h1('6.  Procedure'));
children.push(p('Twenty-one steps in six stages. Step numbers below are procedure step numbers; the reference at the right of each step header gives the corresponding entry in the working journal from which this document was compiled.'));
children.push(spacer(120));

children.push(callout('Photograph placeholders', [
  'The frames marked [ PHOTOGRAPH ] correspond to photographs taken during the work. Insert the images into these frames before the document is issued for field use.',
  'Where a photograph shows a screwdriver or scriber being used to point at a feature, replace it with a drawn callout arrow when preparing the final images. The tool is a pointer only, not part of the operation.'
], NOTEBG, 'A67C00'));

children.push(spacer(200));

// STAGE A
children.push(h2('Stage A — Unpack and Identify'));

children.push(...step(1, 'Open the packaging and inspect as received', 'Journal 01', [
  p('Open the carton. The polariser assembly is supplied sealed in a clear poly bag with the cable coiled around the unit inside the same bag. There is no moulded insert; the unit is a loose fit in the carton.'),
  bullet('Check for transit damage: crushed corners, punctured bag, disturbed connector caps or collars.'),
  bullet('Identify the contents: polariser body (light grey die-cast housing with a dark grey centre cover plate), the attached cable assembly terminating in the new CNLINKO connector, a right-angle coaxial connector on the same lead run, and a second coiled white cable bagged separately.'),
  bullet('Record the carton label and any part numbers before the packaging is discarded.'),
  spacer(80),
  ...photoPlaceholder('Figure 2 — Assembly as received. Note the red collar on the CNLINKO connector at left — the immediate visual identifier of the new part.')
]));

children.push(...step(2, 'Remove the cable assembly only', 'Journal 02', [
  p('Take out the cable assembly and set the polariser body aside, still bagged. Only the cable assembly is worked on.'),
  bullet('Grey/beige jacketed round cable, approximately 2 m, supplied coiled with a cable tie.'),
  bullet('One end carries the CNLINKO connector: black knurled coupling nut, red centre body, black rear gland nut, with the cable entering at 90° to the connector axis.'),
  bullet('Leave the cable tie in place until you need the slack — it keeps the coil manageable on the bench.'),
  spacer(80),
  ...photoPlaceholder('Figure 3 — Cable assembly removed, polariser body set aside.')
]));

children.push(...step(3, 'Identify the legacy bulkhead', 'Journal 05', [
  p('Confirm the bulkhead you are adapting to is the legacy variant. This determines whether the retrofit is needed at all.'),
  spacer(60),
  table(
    ['Marking', 'Value'],
    [
      ['Legacy bulkhead part number', 'YM-20-J07SX-02-401'],
      ['New (v2) bulkhead part number', 'YM-20-J07SX-02-401A'],
      ['Order / internal code', '11320007400106'],
      ['Quantity per bag', '1 PCS'],
      ['Lot number', 'MF01'],
      ['Bag code', 'C162'],
      ['Serial', '2606001246'],
      ['Standard quoted on bag', 'GB/T 4208-2017']
    ],
    [3400, CW - 3400],
    { boldCol: 0 }
  ),
  spacer(120),
  rich([
    { t: 'The two variants differ only by the trailing ', c: '000000' },
    { t: 'A', b: true },
    { t: '. If the installed bulkhead is a -401A, stop — no modification is required.' }
  ]),
  bullet('Remove the bulkhead from its packet. Black moulded receptacle with a metal retaining/lanyard eyelet.'),
  spacer(80),
  ...photoPlaceholder('Figure 4 — CNLINKO bag label showing YM-20-J07SX-02-401.')
]));

// STAGE B
children.push(h2('Stage B — Confirm the Incompatibility'));

children.push(...step(4, 'Compare the two mating faces', 'Journal 06', [
  p('Hold the connector and the bulkhead side by side, mating faces up, and identify the two blocking differences described in Section 4.'),
  bullet('New cable-side plug: 7 gold pins, 6 in a ring plus 1 centre, with keyways moulded into the inner shell wall.'),
  bullet('Legacy bulkhead: 7 gold sockets in the same pattern, positions moulded-numbered 1 to 7, square flange with 2 diagonal mounting holes, red body visible behind the black flange face.'),
  bulletRich([{ t: 'Confirm the pin pattern is ' }, { t: 'rotated', b: true }, { t: ' between the two parts.' }]),
  bulletRich([{ t: 'Confirm the ' }, { t: 'two additional internal alignment teeth', b: true }, { t: ' on the new connector.' }]),
  spacer(80),
  p('Refer to Figure 1 in Section 4.')
]));

children.push(...step(5, 'Trial fit — confirm the parts will not seat', 'Journal 07', [
  callout('Diagnostic step — do not force', [
    'This step establishes the clocking datum and confirms the interference before any material is removed. It is not an assembly step.'
  ], NOTEBG, 'A67C00'),
  spacer(120),
  bullet('Offer the connector up to the bulkhead.'),
  bullet('Push them together only until the keying picks up and free rotation stops. That position is the reference datum.'),
  bulletRich([{ t: 'Confirm the two ' }, { t: 'will not seat fully', b: true }, { t: ': a visible gap remains between the black coupling nut and the bulkhead flange, and the coupling nut cannot be run down onto the bulkhead.' }]),
  spacer(80),
  ...photoPlaceholder('Figure 5 — Trial fit. Gap at the flange confirms the parts will not fully mate.')
]));

children.push(new Paragraph({ children: [new PageBreak()] }));

// STAGE C
children.push(h2('Stage C — Disassemble the Connector'));

children.push(...step(6, 'Unfasten the back cable clamp', 'Journal 03, 04', [
  p('Working from the cable end, identify the connector layout:'),
  bullet('Black knurled nut at the cable end — the back cable clamp. This is the part to undo.'),
  bullet('Red moulded centre body (marked "LINKO").'),
  bullet('Larger black knurled coupling nut at the mating end.'),
  spacer(80),
  p('Twist the back cable clamp to unfasten it and slide it back along the cable, roughly 100 mm clear of the connector. It stays captive on the cable — do not attempt to remove it.'),
  p('The connector rear is now exposed: a red threaded collar with a slotted collet section where the cable passes through. The external thread on the red body is what the clamp nut screws onto.'),
  spacer(80),
  ...photoPlaceholder('Figure 6 — Back cable clamp unfastened and slid back along the cable, red threaded collar exposed.')
]));

children.push(...step(7, 'Unscrew the internal connector shaft using the bulkhead', 'Journal 08', [
  p('With the two parts loosely engaged at the datum position from Step 5, use the bulkhead as a wrench. The keying that stops free rotation is exactly what allows the bulkhead to drive the internal shaft.'),
  bullet('Hold the red body in one hand.'),
  bullet('Twist the bulkhead to break the internal connector shaft free of the red body.'),
  bullet('Unscrew the shaft completely and withdraw it from the red shell.'),
  spacer(80),
  p('The insert comes away still wired, hanging on the loom. Note the red O-ring fitted in its groove on the insert body — protect it from here on.'),
  spacer(80),
  callout('Open item', [
    'Thread direction and the presence of any thread-locking compound were not recorded during the first retrofit. Confirm and add to this step before final issue. Normal right-hand thread (anticlockwise to loosen) is assumed.'
  ], NOTEBG, 'A67C00'),
  spacer(120),
  ...photoPlaceholder('Figure 7 — Insert withdrawn from the red shell, still wired. Red O-ring visible in its groove.')
]));

children.push(...step(8, 'Remove the retaining ring', 'Journal 10, 11', [
  p('Work on the rear (cable side) of the insert, laid flat on the bench.'),
  bullet('Locate the black split retaining ring seated in the annular groove around the inner bore.'),
  bullet('Enter a slim sharp pick, scriber or small flat blade into the groove and lever the ring up and out.'),
  bullet('Set the ring aside for reuse — it goes back in at Step 17.'),
  spacer(80),
  callout('Cautions', [
    'Work the pick under the ring, not against the conductors or the moulding.',
    'Do not nick or stretch the ring — it is reused.',
    'Keep clear of the red O-ring, which is a separate part and stays in place.'
  ], WARNBG, RED),
  spacer(120),
  ...photoPlaceholder('Figure 8 — Levering the retaining ring out of its groove with a slim sharp tool.')
]));

children.push(...step(9, 'Lift out the inner core', 'Journal 12', [
  p('With the retaining ring removed, the inner core lifts straight out of the black outer sleeve. No tool and no force are required.'),
  bullet('The core comes away as one piece with all conductors still terminated.'),
  bullet('Black cylindrical body, gold contacts visible at the joint, individual black heatshrink sleeves over each termination.'),
  bulletRich([{ t: 'Cable make-up confirmed at this point: Cat5-style 4-pair — blue, orange, green and brown with their white partners. With seven contacts in use, one conductor is presumed unused. ' }, { t: '(Open item — confirm the colour-to-pin mapping.)', i: true }]),
  spacer(80),
  p('You should now have three separated items on the bench: the inner core with the cable attached, the black insert body with the red O-ring still fitted, and the red shell.'),
  spacer(80),
  ...photoPlaceholder('Figure 9 — Inner core lifted clear, parts laid out.')
]));

children.push(...step(10, 'Remove the pin encasement', 'Journal 13', [
  p('Slide the black cylindrical pin encasement (front shroud) off the inner core, exposing the pins fully.'),
  bullet('The encasement is a black cap with 7 through-holes — 6 in a ring plus 1 centre — matching the pin pattern.'),
  bulletRich([{ t: 'It carries a ' }, { t: 'small moulded index / orientation mark', b: true }, { t: ' on the face, and a moulded tab standing proud of the rim. Note this mark before removal so the original orientation remains recoverable.' }]),
  bullet('Beneath it, the pin carrier disc holds the 7 long gold pins, each conductor terminated below and covered with black heatshrink.'),
  spacer(80),
  ...photoPlaceholder('Figure 10 — Pin encasement removed. 7 gold pins fully exposed on the carrier disc.')
]));

children.push(new Paragraph({ children: [new PageBreak()] }));

// STAGE D
children.push(h2('Stage D — Modify the Keying'));

children.push(callout('⚠  Point of no return', [
  'Steps 11 to 13 permanently modify the connector. Confirm before proceeding that the installed bulkhead is the legacy -401 variant (Step 3) and that the trial fit failed as expected (Step 5).'
], WARNBG, RED));
children.push(spacer(180));

children.push(...step(11, 'Trim off the side wall of the pin encasement', 'Journal 14', [
  p('Using side cutters, remove the entire side wall of the pin encasement. What remains is the flat end disc carrying the 7 holes, plus a small residual lug on one edge.'),
  bullet('Work around the circumference, nibbling the wall down to the face of the disc.'),
  bullet('Cut edges will be rough and deformed from the cutters. This is cosmetic and acceptable.'),
  spacer(80),
  callout('Cautions', [
    'Cut the wall only. Do not cut into the disc face or the webs between the holes — the disc still has to locate and space the 7 pins.',
    'Wear eye protection. Plastic fragments fly when nibbling with cutters.',
    'Deburr and clean up so that no swarf or loose plastic remains near the contacts.'
  ], WARNBG, RED),
  spacer(120),
  ...photoPlaceholder('Figure 11 — Before and after. The moulded tab on the rim (left) is part of the keying that fouls the legacy bulkhead; after trimming (right) only the 7-hole disc remains.')
]));

children.push(...step(12, 'Cut a new groove in the disc', 'Journal 15', [
  callout('Orientation datum — critical', [
    [{ t: 'Hold the disc with the ' }, { t: 'alignment pin facing up', b: true }, { t: '. Every position given below is referenced to that orientation. Getting this wrong produces a connector that either will not mate or mates with an unintended pinout.' }]
  ], WARNBG, RED),
  spacer(140),
  p('With the disc held alignment-pin-up:'),
  bullet('The existing groove/notch sits at the lower-left edge, roughly the 7 to 8 o’clock position, with a second small notch at the bottom.'),
  bulletRich([{ t: 'Cut the ' }, { t: 'new groove on the left-hand edge at approximately the 9 o’clock position', b: true }, { t: '.' }]),
  bullet('Cut cleanly with a sharp knife or fine needle file. Dress the edges so the groove will slide freely on the housing key.'),
  spacer(80),
  callout('Open item — dimensions required', [
    'The angular offset of the new groove from the existing one, and the required groove depth and width, were not measured during the first retrofit. Measure and record them, then add a dimensioned diagram to this step before the document is issued for field use. This is the step most likely to be got wrong from a clock-position description alone.'
  ], NOTEBG, 'A67C00'),
  spacer(120),
  ...photoPlaceholder('Figure 12 — New groove position marked on the trimmed disc, alignment pin facing up. Replace the pointing tool with a callout arrow in the final artwork.')
]));

children.push(...step(13, 'Extend the new groove onto the connecting piece', 'Journal 16', [
  p('Carry the groove through onto the connecting piece — the black pin-carrier body behind the pins — so that disc and carrier form one continuous channel.'),
  bulletRich([{ t: 'Use the ' }, { t: 'same angular position', b: true }, { t: ', indexed off the alignment pin as in Step 12.' }]),
  bullet('The carrier body presents two visible black bands; the groove crosses both at the same clock position.'),
  spacer(80),
  callout('Cautions', [
    'Cut only as deep as needed to clear the bulkhead’s alignment tooth.',
    'Keep well away from the pins and their terminations. Do not compromise the insulation between contacts.',
    'Clear all swarf before reassembly.'
  ], WARNBG, RED),
  spacer(120),
  ...photoPlaceholder('Figure 13 — Groove extended onto the connecting piece, aligned with the groove in the disc.')
]));

children.push(new Paragraph({ children: [new PageBreak()] }));

// STAGE E
children.push(h2('Stage E — Reassemble'));

children.push(...step(14, 'Refit the pin carrier using the new groove', 'Journal 17', [
  p('Feed the pin carrier back into the connector housing, using the newly cut groove — not the original one — as the locating feature. The new groove registers on the housing key, and this is what sets the corrected pin clocking.'),
  bullet('Looking into the open end of the housing you will see the internal keyway ribs, the red O-ring seated on the outer face, and the notch in the housing rim.'),
  bullet('Push home until fully seated.'),
  spacer(80),
  p('Check before proceeding:'),
  checkbox('Pins square and evenly proud'),
  checkbox('Carrier seated flat, fully home'),
  checkbox('No plastic swarf trapped inside'),
  checkbox('Red O-ring undamaged and still in its groove'),
  spacer(100),
  ...photoPlaceholder('Figure 14 — Looking into the housing: internal keyway ribs, red O-ring, and the notch in the rim matching the new groove.')
]));

children.push(...step(15, 'Refit the retaining ring', 'Journal 18', [
  p('Press the black retaining ring back into its groove at the rear of the insert, over the wired core. Thumb-seat it evenly all the way round.'),
  bullet('The ring is what retains the core against the cable clamp load. It must be fully home and even around its whole circumference.'),
  spacer(80),
  ...photoPlaceholder('Figure 15 — Retaining ring refitted and seated flush in its groove.')
]));

children.push(...step(16, 'Pull test', 'Journal 19', [
  p('A simple go / no-go check that the retaining ring is correctly installed.'),
  bullet('Hold the connector body and give the cable a firm, steady pull in line with the connector.'),
  bullet('The core must not move or lift out.'),
  bullet('If it shifts, the retaining ring is not properly seated. Back out and refit it (Step 15), then repeat this test.'),
  spacer(80),
  callout('Do not', [
    'Do not jerk the cable or lever it sideways. Pull by hand only, in line with the connector axis.'
  ], WARNBG, RED),
  spacer(120),
  checkbox('Pull test passed — core does not move')
]));

children.push(...step(17, 'Reassemble the housing and tighten the inner core', 'Journal 20', [
  p('Insert the reassembled core into the red shell and screw it home. Then use the bulkhead as a tool once more — the Step 7 trick in reverse.'),
  bullet('Engage the bulkhead on the connector.'),
  bullet('Twist to drive the inner core down tight into the red body.'),
  bullet('Tighten firm by hand via the bulkhead. Do not overtighten — these are plastic threads.'),
  spacer(80),
  ...photoPlaceholder('Figure 16 — Connector reassembled: gold pins proud, red seal ring visible behind the pin face.')
]));

children.push(...step(18, 'Refit the back cable clamp', 'Journal 21', [
  p('Screw the back cable clamp back down onto the red body and tighten firm by hand. This restores the cable strain relief and the rear seal.'),
  spacer(60),
  checkbox('Back cable clamp fully seated and tight'),
  checkbox('Cable exits the rear gland cleanly, no jacket damage')
]));

children.push(new Paragraph({ children: [new PageBreak()] }));

// STAGE F
children.push(h2('Stage F — Verify and Release'));

children.push(...step(19, 'Confirm the connector mates', 'Journal 21', [
  p('Offer the modified connector to the legacy bulkhead and mate it fully.'),
  spacer(60),
  checkbox('Connector seats fully — no gap at the flange'),
  checkbox('Coupling nut runs down freely onto the bulkhead'),
  checkbox('Assembly locks positively and does not rock or rotate when mated'),
  spacer(100),
  ...photoPlaceholder('Figure 17 — Completed assembly. Externally near-identical to an unmodified connector — hence the labelling requirement.')
]));

children.push(...step(20, 'Verify the O-ring and sealing', '—', [
  p('The finished assembly must retain its original environmental rating.'),
  checkbox('Red O-ring present, undamaged, correctly seated'),
  checkbox('No debris or swarf between the mating faces'),
  checkbox('Rear gland tight, cable jacket undamaged'),
  checkbox('No cracks in the red body or the coupling nut from tool pressure')
]));

children.push(...step(21, 'Continuity test — mandatory', 'Journal 21', [
  callout('⚠  Do not skip this step', [
    'Every retrofitted assembly must be continuity tested end to end before it is returned to service. Do not assume the pinout from the moulded numbering on the bulkhead face — the numbering is no longer a reliable guide once a retrofitted connector is mated to it.'
  ], WARNBG, RED),
  spacer(140),
  p('Expected result:'),
  bullet('Pins 1, 2, 3, 6 and 7 in their standard positions.'),
  bulletRich([{ t: 'Pins 4 and 5 ' }, { t: 'transposed', b: true }, { t: ' — the known and accepted outcome of this method.' }]),
  spacer(100),
  p('Record the measured result:'),
  spacer(60),
  table(
    ['Bulkhead pin', 'Conductor colour measured', 'Expected function', 'Pass'],
    [
      ['1', '', '', ''],
      ['2', '', '', ''],
      ['3', '', '', ''],
      ['4  (swapped)', '', '', ''],
      ['5  (swapped)', '', '', ''],
      ['6', '', '', ''],
      ['7', '', '', '']
    ],
    [1700, 3000, 3020, CW - 1700 - 3000 - 3020],
    { boldCol: 0 }
  ),
  spacer(140),
  callout('Open item', [
    'Complete the "Expected function" column once the signal assignment for the seven pins — and in particular pins 4 and 5 — has been confirmed. Until then this table records measured colours only.'
  ], NOTEBG, 'A67C00')
]));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 7. Verification summary ----------
children.push(h1('7.  Acceptance Checklist'));
children.push(p('A retrofitted assembly may be released for service only when every item below is satisfied.'));
children.push(spacer(120));
children.push(checkbox('Installed bulkhead confirmed as legacy YM-20-J07SX-02-401'));
children.push(checkbox('Pin encasement side wall fully removed, disc face and hole webs undamaged'));
children.push(checkbox('New groove cut at the correct position, indexed alignment-pin-up'));
children.push(checkbox('Groove extended onto the connecting piece at the same angular position'));
children.push(checkbox('All swarf and loose plastic removed'));
children.push(checkbox('Pin carrier fully seated, pins square and evenly proud'));
children.push(checkbox('Retaining ring fully seated; pull test passed'));
children.push(checkbox('Red O-ring present, undamaged, correctly seated'));
children.push(checkbox('Inner core tightened via the bulkhead; back cable clamp refitted'));
children.push(checkbox('Connector mates fully with the legacy bulkhead, no gap at the flange'));
children.push(checkbox('Continuity tested end to end; pin 4 / pin 5 transposition confirmed'));
children.push(checkbox('Physical label fitted to the cable (Section 8)'));
children.push(checkbox('Modification recorded against the asset / serial number'));

children.push(spacer(300));

// ---------- 8. Labelling ----------
children.push(h1('8.  Labelling of Retrofitted Assemblies'));
children.push(p('A retrofitted connector is visually almost indistinguishable from an unmodified one once reassembled. The only practical defence against a future technician being caught out by the pin 4 / pin 5 swap is a durable physical label.'));
children.push(spacer(120));
children.push(h2('8.1  Minimum label content'));
children.push(bullet('The word RETROFIT, prominent.'));
children.push(bullet('"PIN 4 / PIN 5 SWAPPED".'));
children.push(bullet('Reference to this procedure and its revision.'));
children.push(bullet('Date of modification and the initials of the technician.'));
children.push(spacer(120));
children.push(h2('8.2  Placement and durability'));
children.push(bullet('Fit to the cable immediately adjacent to the connector, where it cannot be missed by anyone about to mate or unmate the assembly.'));
children.push(bullet('Use a UV-stable, outdoor-rated wrap-around cable label. The assembly is deployed outdoors.'));
children.push(spacer(140));
children.push(callout('Open item', [
  'The exact labelling convention — wording, label stock and whether an asset register entry is also mandated — has not yet been agreed. Confirm and fix in this section before the procedure is issued for field use.'
], NOTEBG, 'A67C00'));

children.push(spacer(300));

// ---------- 9. Open items ----------
children.push(h1('9.  Open Items'));
children.push(p('The following were identified during the first retrofit but not resolved. Each should be closed before this document is issued as a controlled field procedure.'));
children.push(spacer(120));
children.push(table(
  ['#', 'Open item', 'Section', 'Why it matters'],
  [
    ['1', 'Signal function carried on pins 4 and 5', '2, 6 (Step 21)', 'A warning naming the affected signals is far harder to overlook than one naming bare pin numbers'],
    ['2', 'Full wire colour to pin number mapping', '6 (Step 9, 21)', 'Needed for continuity testing and fault-finding'],
    ['3', 'Angular offset, depth and width of the new groove', '6 (Step 12)', 'Clock positions alone are not a reliable instruction; this is the step most likely to be got wrong'],
    ['4', 'Thread direction and presence of thread-lock on the inner shaft', '6 (Step 7)', 'Avoids a technician working against a left-hand thread or a bonded joint'],
    ['5', 'Labelling convention for retrofitted assemblies', '8', 'The only defence against the 4↔5 swap catching out a future technician'],
    ['6', 'Photographs to be inserted into the placeholder frames', '6', 'The procedure is difficult to follow from text alone'],
    ['7', 'Identity and purpose of the second (white) cable in the carton', '6 (Step 1)', 'Not needed for the retrofit, but should be accounted for on the packing list']
  ],
  [500, 3200, 1500, CW - 500 - 3200 - 1500],
  { boldCol: 0 }
));

children.push(spacer(300));

// ---------- 10. Revision history ----------
children.push(h1('10.  Revision History'));
children.push(table(
  ['Rev', 'Date', 'Author', 'Description'],
  [
    ['1.0', '20 Aug 2026', 'Kelvin', 'First issue. Compiled from the working journal and photographs recorded during the first physical retrofit.']
  ],
  [700, 1500, 1500, CW - 700 - 1500 - 1500],
  { boldCol: 0 }
));

children.push(spacer(240));
children.push(p('End of document.', { italics: true, color: GREY, align: AlignmentType.CENTER }));

// =============================================================================
const doc = new Document({
  creator: 'Kelvin',
  title: 'Pointcast v2 (Jonsa) Polariser — CNLINKO 7-Pin Connector Retrofit Procedure',
  description: 'Procedure for retrofitting the new CNLINKO 7-pin connector to the legacy CNLINKO bulkhead',
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 460, hanging: 260 } } } },
        { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 900, hanging: 260 } } } }
      ]
    }]
  },
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 21 } }
    }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1300, right: 1440, bottom: 1300, left: 1440, header: 700, footer: 600 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          spacing: { after: 60 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'C5CEDA', space: 4 } },
          children: [
            new TextRun({ text: 'Pointcast v2 (Jonsa) Polariser — CNLINKO 7-Pin Connector Retrofit', size: 16, color: GREY, font: 'Calibri' }),
            new TextRun({ text: '\t\tRev 1.0', size: 16, color: GREY, font: 'Calibri' })
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Page ', size: 16, color: GREY, font: 'Calibri' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GREY, font: 'Calibri' }),
            new TextRun({ text: ' of ', size: 16, color: GREY, font: 'Calibri' }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: GREY, font: 'Calibri' }),
            new TextRun({ text: '   ·   Internal engineering document', size: 16, color: GREY, font: 'Calibri' })
          ]
        })]
      })
    },
    children
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(process.argv[2], buf);
  console.log('written', process.argv[2], buf.length, 'bytes');
});
