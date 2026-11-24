"use strict";
const canvas = document.querySelector("#game"),
  ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.setTransform(2, 0, 0, 2, 0, 0);
const bg = new Image();
bg.src = "assets/chelm-16bit.png";
const caveArt = new Image();
caveArt.src = "assets/chalk-cave-16bit.png";
const officeArt = new Image();
officeArt.src = "assets/starostwo-16bit.png";
const plazaArt = new Image();
plazaArt.src = "assets/luczkowski-evening-16bit.png";
const W = 768,
  H = 432,
  keys = new Set();
let WORLD = 6400;
function targetCount() {
  return level === 9 ? 10 : rockPositions.length;
}
function gateX() {
  return WORLD - 105;
}
const townLedges = [
  [180, 310, 160],
  [390, 244, 90],
  [550, 182, 180],
  [800, 300, 190],
  [1030, 232, 85],
  [1190, 278, 175],
  [1510, 308, 170],
  [1730, 238, 90],
  [1890, 174, 185],
  [2150, 254, 160],
  [2370, 314, 190],
  [2610, 246, 85],
  [2780, 286, 175],
];
let platforms = [
  { x: 0, y: 374, w: 650, h: 60 },
  { x: 730, y: 374, w: 650, h: 60 },
  { x: 1470, y: 374, w: 650, h: 60 },
  { x: 2210, y: 374, w: 990, h: 60 },
  ...townLedges.map(([x, y, w]) => ({ x, y, w, h: 18 })),
];
let rockPositions = [
  [120, 348],
  ...townLedges.flatMap(([x, y, w], i) =>
    i < 10
      ? [
          [x + 24, y - 24],
          [x + w - 24, y - 24],
        ]
      : [[x + w / 2, y - 24]],
  ),
];
let ghostDefs = [
  { x: 360, y: 205, r: 55, s: 1.1 },
  { x: 690, y: 285, r: 42, s: 1.0 },
  { x: 1080, y: 160, r: 60, s: 1.15 },
  { x: 1615, y: 240, r: 48, s: 1.2 },
  { x: 2320, y: 200, r: 60, s: 1.05 },
  { x: 2970, y: 320, r: 45, s: 1.1 },
  { x: 475, y: 343, r: 85, s: 1.5 },
  { x: 925, y: 265, r: 75, s: 1.3 },
  { x: 1190, y: 342, r: 90, s: 1.5 },
  { x: 1800, y: 340, r: 100, s: 1.4 },
  { x: 2080, y: 210, r: 65, s: 1.2 },
  { x: 2520, y: 342, r: 110, s: 1.6 },
  { x: 2850, y: 255, r: 60, s: 1.4 },
];
// All chapters share the same movement and collision rules.
const town = { platforms, rockPositions, ghostDefs };
const caveLedges = [
  [190, 308, 130],
  [400, 244, 130],
  [610, 288, 120],
  [820, 224, 130],
  [1040, 286, 140],
  [1240, 222, 130],
  [1500, 304, 140],
  [1710, 240, 140],
  [1930, 180, 130],
  [2150, 244, 140],
  [2390, 306, 130],
  [2600, 244, 140],
  [2820, 290, 130],
];
const underground = {
  platforms: [
    { x: 0, y: 374, w: 3200, h: 60 },
    ...caveLedges.map(([x, y, w]) => ({ x, y, w, h: 18 })),
  ],
  rockPositions: [
    [120, 348],
    ...caveLedges.flatMap(([x, y, w], i) =>
      i < 10
        ? [
            [x + 35, y - 24],
            [x + w - 30, y - 24],
          ]
        : [[x + w / 2, y - 24]],
    ),
  ],
  ghostDefs: [
    { x: 430, y: 344, r: 70, s: 1.1 },
    { x: 560, y: 208, r: 45, s: 1.0 },
    { x: 870, y: 310, r: 60, s: 1.3 },
    { x: 1050, y: 180, r: 50, s: 1.1 },
    { x: 1250, y: 345, r: 65, s: 1.2 },
    { x: 1620, y: 220, r: 45, s: 1.2 },
    { x: 1780, y: 342, r: 75, s: 1.4 },
    { x: 2020, y: 145, r: 50, s: 1.1 },
    { x: 2260, y: 315, r: 45, s: 1.3 },
    { x: 2440, y: 240, r: 55, s: 1.1 },
    { x: 2670, y: 344, r: 80, s: 1.2 },
    { x: 2860, y: 215, r: 45, s: 1.2 },
    { x: 2970, y: 335, r: 40, s: 1.0 },
  ],
};
const officeLedges = [
  [180, 310, 140],
  [390, 250, 140],
  [610, 190, 130],
  [820, 266, 150],
  [1040, 314, 130],
  [1250, 250, 140],
  [1500, 302, 140],
  [1710, 240, 150],
  [1930, 178, 140],
  [2160, 242, 140],
  [2380, 304, 140],
  [2600, 242, 140],
  [2820, 290, 150],
];
const office = {
  platforms: [
    { x: 0, y: 374, w: 680, h: 60 },
    { x: 770, y: 374, w: 590, h: 60 },
    { x: 1450, y: 374, w: 670, h: 60 },
    { x: 2210, y: 374, w: 990, h: 60 },
    ...officeLedges.map(([x, y, w]) => ({ x, y, w, h: 20 })),
  ],
  rockPositions: [
    [120, 348],
    ...officeLedges.flatMap(([x, y, w], i) =>
      i < 10
        ? [
            [x + 35, y - 24],
            [x + w - 30, y - 24],
          ]
        : [[x + w / 2, y - 24]],
    ),
  ],
  ghostDefs: [
    { x: 460, y: 343, r: 65, s: 1.2 },
    { x: 625, y: 155, r: 45, s: 1 },
    { x: 900, y: 230, r: 55, s: 1.15 },
    { x: 1090, y: 342, r: 65, s: 1.25 },
    { x: 1290, y: 210, r: 50, s: 1.1 },
    { x: 1740, y: 342, r: 65, s: 1.3 },
    { x: 1910, y: 145, r: 45, s: 1 },
    { x: 2190, y: 205, r: 55, s: 1.2 },
    { x: 2490, y: 340, r: 75, s: 1.25 },
    { x: 2720, y: 210, r: 45, s: 1.1 },
    { x: 2970, y: 330, r: 40, s: 1.1 },
  ],
};
// Double the town route; the other chapters retain their original dimensions.
const originalTownPlatforms = town.platforms.slice();
town.platforms.push(
  ...originalTownPlatforms.map((p) => ({ ...p, x: p.x + 3200 })),
);
town.rockPositions.push(...town.rockPositions.map(([x, y]) => [x + 3200, y]));
town.ghostDefs.push(...town.ghostDefs.map((g) => ({ ...g, x: g.x + 3200 })));
// A shorter, open route with four slow vertical lifts.
town.width = 4800;
town.platforms = town.platforms
  .filter((p) => p.x < (p.h > 20 ? 4800 : 4600))
  .map((p) => ({ ...p, w: Math.min(p.w, 4800 - p.x) }));
const townSteps = town.platforms.filter((p) => p.h <= 20);
townSteps.forEach((p, i) => {
  if ([3, 8, 13, 18].includes(i)) {
    p.baseY = p.y;
    p.travel = 28;
    p.phase = i * 0.7;
  }
});
// Lower the final lift enough to board from the street at its bottom stop.
townSteps[18].y += 12;
townSteps[18].baseY += 12;
town.rockPositions = [
  [120, 348],
  ...townSteps.flatMap((p) => [
    [p.x + 24, p.y - 24],
    [p.x + p.w - 24, p.y - 24],
  ]),
];
town.ghostDefs = town.ghostDefs.filter((g) => g.x < 4600);
// Continuous invisible street floor: visible pavement comes from the background.
town.platforms = [
  { x: 0, y: 400, w: town.width, h: 34, street: true },
  ...town.platforms.filter((p) => p.h <= 20),
];
town.rockPositions = town.rockPositions.map(([x, y]) => [
  x,
  y === 348 ? 374 : y,
]);
// Town-only trial: dry gaps, a few stepped silhouettes and two sideways lifts.
town.pits = [
  { x: 660, w: 90 },
  { x: 1320, w: 100 },
  { x: 2040, w: 100 },
  { x: 3020, w: 100 },
  { x: 4160, w: 100 },
];
const townFloor = [];
let streetCursor = 0;
for (const pit of town.pits) {
  townFloor.push({
    x: streetCursor,
    y: 400,
    w: pit.x - streetCursor,
    h: 34,
    street: true,
  });
  streetCursor = pit.x + pit.w;
}
townFloor.push({
  x: streetCursor,
  y: 400,
  w: town.width - streetCursor,
  h: 34,
  street: true,
});
const townElevated = town.platforms.filter((p) => !p.street),
  townShaped = [];
townElevated.forEach((p, i) => {
  if ([3, 13].includes(i)) {
    p.axis = "x";
    p.baseX = p.x;
    p.baseY = p.y;
    p.travel = 46;
    p.liftSpeed = i === 3 ? 0.7 : 0.91;
  }
  if ([0, 6, 12, 15].includes(i)) {
    const u = [6, 15].includes(i),
      rise = 26,
      side = 34,
      group = "town-shape-" + i;
    // Each piece is both drawn and collidable, rather than a decorative outline.
    townShaped.push({
      x: p.x,
      y: p.y - rise,
      w: side,
      h: p.h + rise,
      shapePiece: true,
      group,
    });
    townShaped.push({
      x: p.x + side,
      y: p.y,
      w: p.w - side - (u ? side : 0),
      h: p.h,
      shapePiece: true,
      group,
      ladderAccess: true,
    });
    if (u)
      townShaped.push({
        x: p.x + p.w - side,
        y: p.y - rise,
        w: side,
        h: p.h + rise,
        shapePiece: true,
        group,
      });
  } else townShaped.push(p);
});
town.platforms = [...townFloor, ...townShaped];
town.rockPositions = town.rockPositions.map(([x, y]) => {
  const surface = townShaped.find(
    (p) =>
      p.shapePiece && x >= p.x && x < p.x + p.w && Math.abs(p.y - y - 24) <= 26,
  );
  return [x, surface ? surface.y - 24 : y];
});
office.platforms = [
  { x: 0, y: 400, w: 3200, h: 34, street: true },
  ...office.platforms.filter((p) => p.h <= 20),
];
office.rockPositions = office.rockPositions.map(([x, y]) => [
  x,
  y === 348 ? 374 : y,
]);
// Match the town route's length and collection workload, with four lifts per stage.
for (const [chapter, extra] of [
  [
    underground,
    [
      [3090, 230, 150],
      [3340, 302, 160],
      [3580, 242, 150],
      [3820, 190, 150],
      [4080, 270, 170],
      [4360, 310, 170],
    ],
  ],
  [
    office,
    [
      [3090, 248, 160],
      [3340, 308, 160],
      [3580, 246, 150],
      [3820, 188, 150],
      [4080, 268, 170],
      [4360, 310, 170],
    ],
  ],
]) {
  chapter.width = 4800;
  chapter.platforms[0].w = chapter.width;
  chapter.platforms.push(...extra.map(([x, y, w]) => ({ x, y, w, h: 18 })));
  const ledges = chapter.platforms.filter((p) => p.h <= 20);
  const liftSlots = chapter === underground ? [1, 6, 10, 16] : [4, 7, 12, 15];
  ledges.forEach((p, i) => {
    const slot = liftSlots.indexOf(i);
    if (slot >= 0) {
      p.baseY = p.y;
      p.travel = 28;
      p.phase = (chapter === underground ? 0.4 : 1.6) + slot * 1.3;
      p.liftSpeed = (chapter === underground ? 0.66 : 0.78) + slot * 0.07;
    }
  });
  chapter.rockPositions = [
    [120, chapter === underground ? 348 : 374],
    ...ledges.flatMap((p) => [
      [p.x + 24, p.y - 24],
      [p.x + p.w - 24, p.y - 24],
    ]),
  ];
  chapter.ghostDefs.push(
    ...extra.map(([x, y], i) => ({
      x: x + 60,
      y: y - 30,
      r: 42,
      s: 1 + i * 0.07,
    })),
  );
}
// Evening route: nineteen timber ledges, with a distinct lift sequence.
const plazaLedges = [
  [160, 316, 160],
  [390, 258, 150],
  [620, 204, 170],
  [860, 286, 180],
  [1110, 238, 150],
  [1350, 308, 180],
  [1600, 252, 160],
  [1840, 194, 160],
  [2080, 270, 180],
  [2340, 318, 160],
  [2580, 260, 160],
  [2820, 210, 170],
  [3070, 292, 180],
  [3320, 238, 160],
  [3570, 304, 170],
  [3820, 248, 160],
  [4070, 192, 170],
  [4320, 276, 180],
  [4560, 318, 130],
];
const plaza = {
  width: 4800,
  platforms: [
    { x: 0, y: 400, w: 4800, h: 34, street: true },
    ...plazaLedges.map(([x, y, w]) => ({ x, y, w, h: 20 })),
  ],
  rockPositions: [],
  ghostDefs: [],
};
plaza.platforms.slice(1).forEach((p, i) => {
  const slot = [2, 5, 11, 17].indexOf(i);
  if (slot >= 0) {
    p.baseY = p.y;
    p.travel = 26;
    p.phase = 0.9 + slot * 1.1;
    p.liftSpeed = 0.72 + slot * 0.08;
  }
});
plaza.rockPositions = [
  [100, 374],
  ...plaza.platforms.slice(1).flatMap((p) => [
    [p.x + 24, p.y - 24],
    [p.x + p.w - 24, p.y - 24],
  ]),
];
plaza.ghostDefs = plazaLedges.map(([x, y, w], i) => ({
  x: x + w / 2,
  y: i % 3 === 0 ? 362 : y - 29,
  r: 42,
  s: 1,
}));
const chapters = [town, underground, office, plaza],
  chapterNames = [
    "KOŚCIÓŁ NA GÓRCE",
    "PODZIEMIA KREDOWE",
    "GMACH",
    "PLAC ŁUCZKOWSKIEGO",
  ];
// Each remaining chapter gets its own gap, shape and sideways-lift pattern.
const varietyPlans = [
  {
    chapter: underground,
    floor: 374,
    pits: [
      [490, 80],
      [1190, 85],
      [2260, 80],
      [3290, 90],
      [3900, 95],
    ],
    shapes: [
      [2, "L"],
      [7, "U"],
      [12, "L"],
      [17, "U"],
    ],
    horizontal: [6, 16],
  },
  {
    chapter: office,
    floor: 400,
    pits: [
      [700, 85],
      [1380, 90],
      [2140, 90],
      [3270, 85],
      [4440, 85],
    ],
    shapes: [
      [1, "U"],
      [6, "L"],
      [10, "U"],
      [17, "L"],
    ],
    horizontal: [4, 12],
  },
  {
    chapter: plaza,
    floor: 400,
    pits: [
      [510, 85],
      [1250, 90],
      [1980, 85],
      [2910, 95],
      [3910, 90],
    ],
    shapes: [
      [0, "L"],
      [6, "U"],
      [10, "L"],
      [15, "U"],
    ],
    horizontal: [5, 17],
  },
];
for (const plan of varietyPlans) {
  const c = plan.chapter,
    ledges = c.platforms.filter((p) => p.h <= 20),
    ground = c.platforms[0],
    pieces = [];
  c.pits = plan.pits.map(([x, w]) => ({ x, w }));
  c.floorY = plan.floor;
  // Preserve original useful ladders, then add access inside shaped platforms.
  ledges
    .filter((p) => !p.travel)
    .forEach((p, i) => {
      if (i % 3 === 0 || i === 1 || (c === underground && p.x === 3090))
        p.ladderAccess = true;
    });
  ledges.forEach((p, i) => {
    if (plan.horizontal.includes(i)) {
      p.axis = "x";
      p.baseX = p.x;
      p.baseY = p.y;
      p.travel = 40;
    }
    const shape = plan.shapes.find(([index]) => index === i);
    if (!shape) {
      pieces.push(p);
      return;
    }
    const u = shape[1] === "U",
      side = 34,
      rise = 26,
      group = "stage-" + chapters.indexOf(c) + "-shape-" + i;
    pieces.push({
      x: p.x,
      y: p.y - rise,
      w: side,
      h: p.h + rise,
      shapePiece: true,
      group,
    });
    pieces.push({
      x: p.x + side,
      y: p.y,
      w: p.w - side - (u ? side : 0),
      h: p.h,
      shapePiece: true,
      group,
      ladderAccess: true,
    });
    if (u)
      pieces.push({
        x: p.x + p.w - side,
        y: p.y - rise,
        w: side,
        h: p.h + rise,
        shapePiece: true,
        group,
      });
  });
  const floorPieces = [];
  let cursor = 0;
  for (const pit of c.pits) {
    floorPieces.push({ ...ground, x: cursor, w: pit.x - cursor });
    cursor = pit.x + pit.w;
  }
  floorPieces.push({ ...ground, x: cursor, w: c.width - cursor });
  c.platforms = [...floorPieces, ...pieces];
  c.rockPositions = c.rockPositions.map(([x, y]) => {
    const surface = pieces.find(
      (p) =>
        p.shapePiece &&
        x >= p.x &&
        x < p.x + p.w &&
        Math.abs(p.y - y - 24) <= 26,
    );
    return [x, surface ? surface.y - 24 : y];
  });
  if (c === underground)
    for (const g of c.ghostDefs) {
      const raised = pieces.filter(
        (p) =>
          p.shapePiece &&
          p.h > 20 &&
          g.x + g.r >= p.x &&
          g.x - g.r <= p.x + p.w &&
          Math.abs(p.y - g.y) < 60,
      );
      if (raised.length) g.y = Math.min(g.y, ...raised.map((p) => p.y - 42));
    }
}
const itemNames = ["MEDALIKI", "KAWAŁKI KREDY", "DOKUMENTY", "NAPOJE"],
  itemColors = ["#ffda77", "#f6f0db", "#edf6ff", "#fcb46f"];
// Walkers are bound to actual surfaces, with patrol endpoints inside their edges.
for (const chapter of [town, office, plaza])
  chapter.walkers = chapter.ghostDefs.map((g, i) => {
    const candidates = chapter.platforms.filter(
      (p) => !p.travel && g.x >= p.x + 6 && g.x <= p.x + p.w - 32,
    );
    const floor =
      candidates.sort(
        (a, b) => Math.abs(a.y - g.y - 29) - Math.abs(b.y - g.y - 29),
      )[0] || chapter.platforms[0];
    const left = Math.max(
      floor.x + 8,
      Math.min(g.x - g.r, floor.x + floor.w - 40),
    );
    const right = Math.max(
      left + 1,
      Math.min(floor.x + floor.w - 34, g.x + g.r),
    );
    return {
      left,
      right,
      floor: floor.y,
      speed: 25 + (i % 4) * 5,
      phase: i * 0.137,
    };
  });
// Priests patrol selected lower and upper garden ledges; generous landing margins.
for (const [i, p] of townElevated
  .filter((p) => p.h <= 20 && !p.travel && p.w >= 120)
  .entries())
  if (i % 2 === 0) {
    town.walkers.push({
      left: p.x + 26,
      right: p.x + p.w - 53,
      floor: p.y,
      speed: 32 + (i % 3) * 5,
      phase: 0.35,
      kind: "priest",
    });
  }
// Replace every town nun one-for-one, preserving patrols and total enemy count.
for (const walker of town.walkers) walker.kind = "priest";
// Rebind all 24 priests to safe spans on the revised actual surfaces.
const townPatrolSurfaces = town.platforms.filter((p) => !p.travel && p.w >= 66);
town.walkers = town.walkers.map((g) => {
  const mid = (g.left + g.right) / 2 + 13;
  const surface = townPatrolSurfaces.slice().sort((a, b) => {
    const score = (p) =>
      Math.abs(p.y - g.floor) * 2 +
      Math.max(p.x + 26 - mid, 0, mid - (p.x + p.w - 26));
    return score(a) - score(b);
  })[0];
  let left = Math.max(
    surface.x + 8,
    Math.min(g.left, surface.x + surface.w - 40),
  );
  let right = Math.max(
    left + 1,
    Math.min(surface.x + surface.w - 34, Math.max(left + 20, g.right)),
  );
  // A pit edge must not compress a priest into a tiny back-and-forth patrol.
  if (right - left < 40) {
    left = Math.max(surface.x + 8, right - 84);
    right = Math.min(surface.x + surface.w - 34, Math.max(right, left + 84));
  }
  return { ...g, left, right, floor: surface.y };
});
for (const walker of plaza.walkers) walker.kind = "tourist";
// Keep workers and tourists on safe uninterrupted surfaces after reshaping.
for (const c of [office, plaza]) {
  const surfaces = c.platforms.filter((p) => !p.travel && p.w >= 66);
  c.walkers = c.walkers.map((g) => {
    const mid = (g.left + g.right) / 2 + 13,
      score = (p) =>
        Math.abs(p.y - g.floor) * 2 +
        Math.max(p.x + 26 - mid, 0, mid - (p.x + p.w - 26));
    const floor = surfaces.slice().sort((a, b) => score(a) - score(b))[0];
    let left = Math.max(floor.x + 8, Math.min(g.left, floor.x + floor.w - 40)),
      right = Math.max(
        left + 1,
        Math.min(floor.x + floor.w - 34, Math.max(left + 20, g.right)),
      );
    if (c === plaza && right - left < 40) {
      left = Math.max(floor.x + 8, right - 84);
      right = Math.min(floor.x + floor.w - 34, Math.max(right, left + 84));
    }
    return { ...g, left, right, floor: floor.y };
  });
}
let ladders = [],
  climbing = false,
  climbCooldown = 0;
function nearLadder() {
  return ladders.find(
    (l) =>
      Math.abs(player.x + player.w / 2 - l.x) < 14 &&
      player.y + player.h >= l.top - 3 &&
      player.y < l.bottom + 2,
  );
}
function makeLadders() {
  return platforms
    .filter((p) => p.h <= 20 && !p.travel && p.ladderOffset !== undefined)
    .map((p) => ({ x: p.x + p.ladderOffset, top: p.y, bottom: 400 }));
}
// Stable chapter IDs keep each location's artwork and mechanics together.
const stageOrder = [2, 0, 3, 5, 4, 8, 6, 7, 1, 9];
function stageNumber(id = level) {
  return stageOrder.indexOf(id) + 1;
}
function nextStage() {
  return stageOrder[stageNumber()];
}
let level = 2,
  transition = 0,
  chapterStart = 0,
  banner = 0;
function upShouldJump() {
  const ladder = nearLadder();
  return (
    !ladder ||
    ((player.ground || coyote > 0) && player.y + player.h <= ladder.top + 3)
  );
}
function loadLevel(n) {
  level = n;
  document.body.classList.add("taller-town");
  const data = chapters[n];
  WORLD = data.width || 3200;
  platforms = data.platforms;
  rockPositions = data.rockPositions;
  ghostDefs = data.ghostDefs;
  ladders = makeLadders();
  reset();
  if (n === 4) resetRoad();
  if (n === 9) resetFinale();
  document.body.classList.toggle("road-level", n === 4);
  banner = n ? 4 : 0;
  $("#chapter").textContent =
    "POZIOM " + String(stageNumber(n)).padStart(1, "0");
  $("#chapterNumber").textContent = String(stageNumber(n)).padStart(1, "0");
  $("#kicker").textContent =
    "POZIOM " +
    String(stageNumber(n)).padStart(1, "0") +
    " - " +
    chapterNames[n];
  updateDevLevelButtons();
}
function restartLevel() {
  unlockAudio();
  if (state === "won" || state === "title") {
    elapsed = chapterStart = 0;
    loadLevel(stageOrder[0]);
  } else {
    elapsed = chapterStart;
    loadLevel(level);
  }
  state = "playing";
  $("#overlay").hidden = true;
  canvas.focus();
}
let player,
  rocks,
  particles = [],
  camera = 0,
  time = 0,
  elapsed = 0,
  state = "title",
  lives = 3,
  collected = 0,
  checkpoint = false,
  invincible = 0,
  coyote = 0,
  jumpBuffer = 0,
  last = 0,
  acc = 0,
  sound = true,
  audioCtx;
const $ = (s) => document.querySelector(s);
function unlockAudio() {
  if (!sound) return;
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  } catch {}
}
// Original composition: "Bells over Chełm". 16 bars, 3/4, 96 BPM.
// Band-limited chip voices; no recording or borrowed song melody.
const musicBuffers = [];
let musicEnabled = true,
  musicBuffer = null,
  musicSource = null,
  musicGain = null,
  musicStarted = 0,
  musicOffset = 0;
function buildMusicBuffer(ac, stage = 0) {
  if (stage !== 0) return buildStageMusic(ac, stage);
  const beat = 60 / 96,
    bars = [
      [
        [76, 1],
        [79, 0.5],
        [77, 0.5],
        [72, 1],
      ],
      [
        [74, 0.5],
        [77, 0.5],
        [81, 1],
        [79, 1],
      ],
      [
        [76, 1.5],
        [72, 0.5],
        [74, 1],
      ],
      [
        [71, 1],
        [74, 1],
        [79, 1],
      ],
      [
        [77, 0.5],
        [81, 0.5],
        [79, 1],
        [76, 1],
      ],
      [
        [74, 1],
        [72, 0.5],
        [69, 0.5],
        [72, 1],
      ],
      [
        [71, 0.5],
        [74, 0.5],
        [77, 1],
        [74, 1],
      ],
      [
        [76, 1],
        [72, 2],
      ],
      [
        [79, 1],
        [84, 0.5],
        [83, 0.5],
        [79, 1],
      ],
      [
        [81, 0.5],
        [77, 0.5],
        [74, 1],
        [77, 1],
      ],
      [
        [76, 1],
        [79, 1],
        [72, 1],
      ],
      [
        [74, 0.5],
        [71, 0.5],
        [67, 1],
        [71, 1],
      ],
      [
        [77, 1],
        [81, 0.5],
        [79, 0.5],
        [77, 1],
      ],
      [
        [76, 0.5],
        [74, 0.5],
        [72, 1],
        [69, 1],
      ],
      [
        [71, 1],
        [74, 0.5],
        [77, 0.5],
        [74, 1],
      ],
      [
        [76, 1],
        [72, 2],
      ],
    ];
  const chords = [
    [48, 55, 60],
    [50, 57, 62],
    [45, 52, 60],
    [43, 50, 59],
    [41, 48, 57],
    [45, 52, 60],
    [43, 50, 59],
    [48, 55, 60],
  ];
  const length = bars.length * 3 * beat,
    buffer = ac.createBuffer(
      1,
      Math.ceil(length * ac.sampleRate),
      ac.sampleRate,
    ),
    out = buffer.getChannelData(0),
    rate = ac.sampleRate;
  function note(midi, start, duration, volume, chip) {
    const hz = 440 * Math.pow(2, (midi - 69) / 12),
      first = Math.floor(start * rate),
      count = Math.floor(duration * rate);
    for (let j = 0; j < count && first + j < out.length; j++) {
      const t = j / rate,
        phase = 2 * Math.PI * hz * t,
        attack = Math.min(1, t / 0.012),
        release = Math.min(1, (duration - t) / 0.07),
        env = attack * release * (0.85 + 0.15 * Math.exp(-t * 4));
      const wave = chip
        ? (Math.sin(phase) +
            Math.sin(phase * 3) / 3 +
            Math.sin(phase * 5) / 5) /
          1.54
        : (Math.sin(phase) -
            Math.sin(phase * 3) / 9 +
            Math.sin(phase * 5) / 25) /
          1.15;
      out[first + j] += wave * volume * env;
    }
  }
  bars.forEach((bar, i) => {
    let cursor = i * 3 * beat;
    bar.forEach(([pitch, duration]) => {
      note(pitch, cursor, duration * beat * 0.91, 0.007, true);
      cursor += duration * beat;
    });
    const chord = chords[i % 8];
    note(chord[0], i * 3 * beat, beat * 2.7, 0.003, false);
    for (let step = 0; step < 6; step++)
      note(
        chord[1 + (step % 2)],
        (i * 3 + step * 0.5) * beat,
        beat * 0.42,
        0.002,
        false,
      );
  });
  return balanceMusic(buffer);
}
// Match the typical effect loudness without clipping stacked chip voices.
function balanceMusic(buffer) {
  const out = buffer.getChannelData(0);
  let sum = 0,
    peak = 0;
  for (const v of out) {
    sum += v * v;
    peak = Math.max(peak, Math.abs(v));
  }
  const gain = Math.min(
    0.02 / Math.max(0.00001, Math.sqrt(sum / out.length)),
    0.12 / Math.max(0.00001, peak),
  );
  for (let i = 0; i < out.length; i++) out[i] *= gain;
  return buffer;
}
// Original orchestral adventure loop: "The Hidden Passage".
// Soft woodwind/brass lead, string chords, rounded bass and restrained drums.
function buildCaveMusic(ac) {
  const beat = 60 / 112,
    rate = ac.sampleRate,
    bars = 16;
  const buffer = ac.createBuffer(1, Math.ceil(bars * 4 * beat * rate), rate),
    out = buffer.getChannelData(0);
  const harmony = [
    [50, 57, 62, 65],
    [46, 53, 58, 62],
    [53, 60, 65, 69],
    [48, 55, 60, 64],
    [50, 57, 62, 65],
    [43, 50, 58, 62],
    [46, 53, 58, 62],
    [45, 52, 61, 64],
    [53, 60, 65, 69],
    [48, 55, 60, 64],
    [43, 50, 55, 58],
    [50, 57, 62, 65],
    [46, 53, 58, 62],
    [48, 55, 60, 64],
    [45, 52, 61, 64],
    [50, 57, 62, 65],
  ];
  const melody = [
    [
      [69, 0.5],
      [74, 1],
      [77, 0.5],
      [76, 1],
      [74, 1],
    ],
    [
      [70, 1.5],
      [74, 0.5],
      [77, 2],
    ],
    [
      [72, 0.5],
      [77, 1],
      [81, 0.5],
      [79, 1],
      [77, 1],
    ],
    [
      [76, 2],
      [72, 1],
      [null, 0.5],
      [69, 0.5],
    ],
    [
      [74, 1],
      [77, 0.5],
      [81, 0.5],
      [79, 1],
      [77, 1],
    ],
    [
      [74, 1.5],
      [70, 0.5],
      [67, 1],
      [70, 1],
    ],
    [
      [74, 0.5],
      [77, 0.5],
      [79, 1],
      [77, 1],
      [74, 1],
    ],
    [
      [73, 2],
      [69, 1],
      [null, 1],
    ],
    [
      [77, 1],
      [81, 1],
      [84, 1.5],
      [81, 0.5],
    ],
    [
      [79, 1.5],
      [76, 0.5],
      [72, 2],
    ],
    [
      [74, 0.5],
      [79, 0.5],
      [82, 1],
      [81, 1],
      [79, 1],
    ],
    [
      [77, 1.5],
      [74, 0.5],
      [69, 1],
      [74, 1],
    ],
    [
      [77, 1],
      [74, 1],
      [70, 1],
      [74, 1],
    ],
    [
      [76, 0.5],
      [79, 0.5],
      [77, 1],
      [76, 1],
      [72, 1],
    ],
    [
      [73, 1],
      [76, 1],
      [81, 1],
      [73, 1],
    ],
    [
      [74, 3],
      [null, 1],
    ],
  ];
  function adventureVoice(midi, start, duration, volume, voice) {
    const hz = 440 * Math.pow(2, (midi - 69) / 12),
      first = Math.round(start * rate),
      count = Math.ceil(duration * rate);
    for (let j = 0; j < count; j++) {
      const t = j / rate,
        life = t / duration;
      const env =
        Math.min(1, t / (voice === "strings" ? 0.13 : 0.025)) *
        Math.min(1, (duration - t) / (voice === "strings" ? 0.22 : 0.1));
      const ph =
        2 * Math.PI * hz * t +
        (voice === "lead"
          ? 0.016 * Math.sin(2 * Math.PI * 5 * t) * Math.min(1, t * 3)
          : 0);
      let wave;
      if (voice === "strings")
        wave =
          (Math.sin(ph) + Math.sin(ph * 1.0025)) * 0.42 +
          0.12 * Math.sin(ph * 2) +
          0.055 * Math.sin(ph * 3);
      else if (voice === "bass") wave = Math.sin(ph) + 0.16 * Math.sin(ph * 2);
      else
        wave =
          Math.sin(ph) +
          0.28 * Math.sin(ph * 2) * Math.exp(-t * 1.8) +
          0.095 * Math.sin(ph * 3);
      out[(first + j) % out.length] +=
        wave * env * volume * (voice === "bass" ? Math.exp(-life * 1.7) : 1);
    }
  }
  function drum(start, accent) {
    const duration = accent ? 0.17 : 0.1,
      first = Math.round(start * rate);
    let seed = first + 7143,
      low = 0;
    for (let j = 0; j < duration * rate; j++) {
      const t = j / rate;
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
      low = 0.86 * low + 0.14 * ((seed >>> 0) / 2147483648 - 1);
      const wave = accent
        ? Math.sin(2 * Math.PI * (85 * t - 130 * t * t))
        : low;
      out[(first + j) % out.length] +=
        wave * Math.exp(-t * (accent ? 25 : 35)) * (accent ? 0.009 : 0.01);
    }
  }
  for (let bar = 0; bar < bars; bar++) {
    const start = bar * 4 * beat,
      ch = harmony[bar];
    let cursor = start;
    for (const [pitch, len] of melody[bar]) {
      if (pitch !== null)
        adventureVoice(pitch, cursor, len * beat * 0.98, 0.017, "lead");
      cursor += len * beat;
    }
    for (const pitch of ch.slice(1))
      adventureVoice(pitch, start, 4 * beat + 0.16, 0.0026, "strings");
    adventureVoice(ch[0] - 12, start, beat * 1.7, 0.01, "bass");
    adventureVoice(ch[0] - 12, start + 2 * beat, beat * 1.6, 0.008, "bass");
    drum(start, true);
    drum(start + 2 * beat, true);
    drum(start + beat, false);
    drum(start + 3 * beat, false);
    // Gentle low string pulses give momentum without a second competing melody.
    for (let pulse = 0; pulse < 4; pulse++)
      adventureVoice(
        ch[1],
        start + (pulse + 0.5) * beat,
        beat * 0.33,
        0.0018,
        "strings",
      );
  }
  // Short diffuse room tails, wrapped into the loop so the ambience stays seamless.
  const dry = out.slice();
  for (const [seconds, gain] of [
    [0.113, 0.12],
    [0.229, 0.075],
    [0.367, 0.045],
  ]) {
    const delay = Math.round(seconds * rate);
    for (let i = 0; i < out.length; i++)
      out[(i + delay) % out.length] += dry[i] * gain;
  }
  return balanceMusic(buffer);
}
// Original themes: "Chalk Echoes" and "Paperwork Parade".
function buildStageMusic(ac, stage) {
  if (stage === 9) return buildFinaleMusic(ac);
  if (stage === 8) return buildParkMusic(ac);
  if (stage === 7) return buildDiscoveryMusic(ac);
  if (stage === 6) return buildCinemaMusic(ac);
  if (stage === 5) return buildSummerMusic(ac);
  if (stage === 4) return buildRoadMusic(ac);
  if (stage === 3) return buildPartyMusic(ac);
  if (stage === 1) return buildCaveMusic(ac);
  const eerie = stage === 1,
    beat = 60 / (eerie ? 100 : 116),
    bars = 16,
    length = bars * 4 * beat;
  const buffer = ac.createBuffer(
      1,
      Math.ceil(length * ac.sampleRate),
      ac.sampleRate,
    ),
    out = buffer.getChannelData(0),
    rate = ac.sampleRate;
  function note(midi, start, duration, volume, voice = 0) {
    if (midi === null) return;
    const hz = 440 * Math.pow(2, (midi - 69) / 12),
      first = Math.floor(start * rate),
      count = Math.floor(duration * rate);
    for (let j = 0; j < count; j++) {
      const t = j / rate,
        phase = 2 * Math.PI * hz * t,
        env =
          Math.min(1, t / 0.008) *
          Math.min(1, (duration - t) / 0.08) *
          Math.exp(-t * (voice === 2 ? 7 : 1.5));
      const wave =
        voice === 1
          ? Math.sin(phase) - Math.sin(3 * phase) / 9
          : voice === 2
            ? Math.sin(phase) + 0.3 * Math.sin(2 * phase)
            : Math.sin(phase) +
              Math.sin(3 * phase) / 3 +
              Math.sin(5 * phase) / 5;
      out[(first + j) % out.length] += wave * env * volume;
    }
  }
  const roots = eerie
    ? [45, 41, 46, 40, 45, 48, 46, 40]
    : [48, 53, 50, 55, 48, 57, 53, 55];
  const motifs = eerie
    ? [
        [81, 84, 88, null, 87, 84, 83, 80],
        [77, null, 84, 80, 79, 77, 76, null],
        [82, 86, 89, 86, null, 84, 82, 81],
        [76, 80, 83, null, 86, 83, 80, 83],
      ]
    : [
        [76, 79, 74, 76, 72, null, 74, 79],
        [77, 81, 79, null, 76, 74, 72, 74],
        [74, null, 77, 81, 79, 77, 76, 74],
        [79, 76, 74, 71, 74, null, 72, null],
      ];
  for (let bar = 0; bar < bars; bar++) {
    const root = roots[bar % 8],
      start = bar * 4 * beat;
    if (!eerie) note(root, start, beat * 3.7, 0.012, 1);
    for (let step = 0; step < 8; step++) {
      const t = start + step * 0.5 * beat,
        pitch = motifs[bar % motifs.length][step];
      if (motifs[bar % motifs.length][step] !== null) {
        note(pitch, t, beat * (eerie ? 0.28 : 0.3), 0.014, 2);
      }
      if (!eerie)
        note(root + 12 + [0, 4, 7, 12][step % 4], t, beat * 0.23, 0.004, 1);
      // Cave arrangement keeps only the leading tune.
      if (!eerie) {
        note(
          step % 4 === 0 ? 36 : step % 2 === 0 ? 43 : 90,
          t,
          0.055,
          step % 2 ? 0.002 : 0.006,
          step % 2 ? 0 : 1,
        );
      }
    }
  }
  return balanceMusic(buffer);
}
// Original driving minor-key theme: "Across the Rush", 136 BPM.
function buildRoadMusic(ac) {
  const beat = 60 / 136,
    rate = ac.sampleRate,
    bars = 16,
    buffer = ac.createBuffer(1, Math.ceil(bars * 4 * beat * rate), rate),
    out = buffer.getChannelData(0);
  const chords = [
    [45, 52, 57, 60],
    [41, 48, 53, 57],
    [50, 57, 62, 65],
    [40, 47, 56, 59],
    [45, 52, 57, 60],
    [43, 50, 55, 59],
    [41, 48, 53, 57],
    [40, 47, 56, 59],
    [48, 55, 60, 64],
    [43, 50, 55, 59],
    [50, 57, 62, 65],
    [45, 52, 57, 60],
    [41, 48, 53, 57],
    [50, 57, 62, 65],
    [40, 47, 56, 59],
    [45, 52, 57, 60],
  ];
  const phrases = [
    [
      [69, 0.75],
      [72, 0.25],
      [76, 1.5],
      [74, 0.5],
      [72, 1],
    ],
    [
      [69, 1.5],
      [65, 0.5],
      [69, 1],
      [72, 1],
    ],
    [
      [74, 0.5],
      [77, 0.5],
      [76, 1.5],
      [74, 0.5],
      [69, 1],
    ],
    [
      [68, 1.5],
      [71, 0.5],
      [76, 1],
      [null, 1],
    ],
    [
      [69, 0.5],
      [72, 0.5],
      [76, 1],
      [79, 0.5],
      [76, 0.5],
      [74, 1],
    ],
    [
      [71, 1],
      [74, 0.5],
      [76, 0.5],
      [74, 1],
      [71, 1],
    ],
    [
      [72, 1.5],
      [69, 0.5],
      [65, 1],
      [69, 1],
    ],
    [
      [68, 0.5],
      [71, 0.5],
      [74, 1],
      [71, 1],
      [null, 1],
    ],
    [
      [76, 1],
      [79, 0.5],
      [81, 0.5],
      [79, 1.5],
      [76, 0.5],
    ],
    [
      [74, 1.5],
      [71, 0.5],
      [67, 1],
      [71, 1],
    ],
    [
      [77, 0.5],
      [76, 0.5],
      [74, 1],
      [69, 0.5],
      [74, 0.5],
      [77, 1],
    ],
    [
      [76, 2],
      [72, 1],
      [69, 1],
    ],
    [
      [72, 0.5],
      [69, 0.5],
      [65, 1],
      [69, 0.5],
      [72, 0.5],
      [76, 1],
    ],
    [
      [74, 1],
      [77, 0.5],
      [76, 0.5],
      [74, 1],
      [69, 1],
    ],
    [
      [68, 0.5],
      [71, 0.5],
      [76, 1],
      [74, 0.5],
      [71, 0.5],
      [68, 1],
    ],
    [
      [69, 2.5],
      [null, 1.5],
    ],
  ];
  function roadVoice(midi, start, duration, vol, kind) {
    const hz = 440 * Math.pow(2, (midi - 69) / 12),
      at = Math.round(start * rate);
    for (let j = 0; j < duration * rate; j++) {
      const t = j / rate,
        p = 2 * Math.PI * hz * t,
        attack = kind === "pad" ? 0.11 : 0.012,
        release = kind === "pad" ? 0.18 : 0.045;
      const env =
        Math.min(1, t / attack) *
        Math.min(1, (duration - t) / release) *
        (kind === "bass"
          ? Math.exp(-t * 4)
          : kind === "pulse"
            ? Math.exp(-t * 7)
            : 1);
      const wave =
        kind === "pad"
          ? 0.5 * (Math.sin(p) + Math.sin(p * 1.003)) + 0.08 * Math.sin(p * 2)
          : Math.sin(p) + 0.22 * Math.sin(p * 2) + 0.07 * Math.sin(p * 3);
      out[(at + j) % out.length] += wave * env * vol;
    }
  }
  function roadDrum(start, kind) {
    const len = kind === 0 ? 0.18 : kind === 1 ? 0.12 : 0.035,
      at = Math.round(start * rate);
    let seed = at + 1949,
      low = 0;
    for (let j = 0; j < len * rate; j++) {
      const t = j / rate;
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
      low = low * 0.72 + 0.28 * ((seed >>> 0) / 2147483648 - 1);
      const wave =
        kind === 0 ? Math.sin(2 * Math.PI * (95 * t - 180 * t * t)) : low;
      out[(at + j) % out.length] +=
        wave *
        Math.exp(-t * (kind === 0 ? 25 : kind === 1 ? 32 : 90)) *
        (kind === 0 ? 0.018 : kind === 1 ? 0.018 : 0.006);
    }
  }
  for (let bar = 0; bar < bars; bar++) {
    const start = bar * 4 * beat,
      ch = chords[bar];
    let cursor = start;
    for (const [pitch, len] of phrases[bar]) {
      if (pitch !== null)
        roadVoice(pitch, cursor, len * beat * 0.95, 0.012, "lead");
      cursor += len * beat;
    }
    for (const pitch of ch.slice(1))
      roadVoice(pitch, start, beat * 4 + 0.1, 0.0018, "pad");
    for (let step = 0; step < 8; step++) {
      const t = start + step * 0.5 * beat;
      roadVoice(
        ch[0] - (step % 4 === 3 ? 0 : 12),
        t,
        beat * 0.39,
        0.01,
        "bass",
      );
      roadVoice(ch[1], t + beat * 0.25, beat * 0.19, 0.002, "pulse");
      roadDrum(t, 2);
    }
    for (const b of [0, 1.5, 2, 3.5]) roadDrum(start + b * beat, 0);
    for (const b of [1, 3]) roadDrum(start + b * beat, 1);
    if (bar % 4 === 3)
      for (const b of [3.25, 3.75]) roadDrum(start + b * beat, 1);
  }
  const dry = out.slice();
  for (const [delay, gain] of [
    [0.107, 0.07],
    [0.219, 0.035],
  ]) {
    const n = Math.round(delay * rate);
    for (let i = 0; i < out.length; i++)
      out[(i + n) % out.length] += dry[i] * gain;
  }
  return balanceMusic(buffer);
}

// Original upbeat four-on-the-floor chip loop: "Evening at the Well".
function buildPartyMusic(ac) {
  const beat = 60 / 128,
    bars = 16,
    rate = ac.sampleRate,
    buffer = ac.createBuffer(1, Math.ceil(bars * 4 * beat * rate), rate),
    out = buffer.getChannelData(0);
  function voice(midi, start, duration, volume, bass = false) {
    const f = 440 * Math.pow(2, (midi - 69) / 12),
      first = Math.floor(start * rate);
    for (let j = 0; j < duration * rate; j++) {
      const t = j / rate,
        phase = 2 * Math.PI * f * t,
        env =
          Math.min(1, t / 0.006) *
          Math.min(1, (duration - t) / 0.045) *
          Math.exp(-t * 3);
      out[(first + j) % out.length] +=
        (Math.sin(phase) + Math.sin(phase * 3) * (bass ? -0.11 : 0.28)) *
        env *
        volume;
    }
  }
  function drum(start, type) {
    const duration = type === 0 ? 0.16 : type === 1 ? 0.1 : 0.035,
      first = Math.floor(start * rate);
    let seed = 12345 + first;
    for (let j = 0; j < duration * rate; j++) {
      const t = j / rate;
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
      const n = (seed >>> 0) / 2147483648 - 1;
      const wave =
        type === 0
          ? Math.sin(2 * Math.PI * (90 * t - (30 * t * t) / duration))
          : n;
      out[(first + j) % out.length] +=
        wave *
        Math.exp(-t * (type === 0 ? 24 : type === 1 ? 38 : 95)) *
        (type === 0 ? 0.024 : type === 1 ? 0.01 : 0.004);
    }
  }
  const roots = [48, 55, 57, 53],
    melodies = [
      [72, 76, 79, 76, 84, 79, 76, 79],
      [74, 79, 83, 79, 86, 83, 79, 74],
      [76, 81, 84, 81, 88, 84, 81, 76],
      [77, 81, 84, 81, 86, 84, 81, 77],
    ];
  for (let bar = 0; bar < bars; bar++) {
    const root = roots[bar % 4],
      start = bar * 4 * beat;
    for (let step = 0; step < 8; step++) {
      const t = start + step * 0.5 * beat;
      voice(
        melodies[bar % 4][step] + (bar >= 8 ? 12 : 0),
        t,
        beat * 0.3,
        0.012,
      );
      voice(
        root + (step % 2 ? 12 : 0),
        t + beat * 0.25,
        beat * 0.21,
        0.013,
        true,
      );
      voice(root + 12 + [0, 4, 7, 12][step % 4], t, beat * 0.16, 0.004);
      drum(t, 2);
      if (step % 2 === 0) drum(t, 0);
      if (step % 4 === 2) drum(t, 1);
    }
  }
  return balanceMusic(buffer);
}
function stopMusic(reset = false) {
  if (musicSource) {
    musicOffset =
      (musicOffset + audioCtx.currentTime - musicStarted) %
      musicBuffer.duration;
    const source = musicSource,
      gain = musicGain;
    musicSource = musicGain = null;
    gain.gain.cancelScheduledValues(audioCtx.currentTime);
    gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.008);
    source.stop(audioCtx.currentTime + 0.04);
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
    };
  }
  if (reset) musicOffset = 0;
}
function syncMusic() {
  const shouldPlay =
    musicEnabled &&
    sound &&
    (state === "playing" ||
      (level === 9 &&
        bossDefeated &&
        !victoryDismissed &&
        (state === "boss-falling" || state === "won"))) &&
    audioCtx &&
    audioCtx.state === "running";
  if (!shouldPlay) {
    stopMusic(state === "transition" || state === "won");
    return;
  }
  if (musicSource) return;
  const track = level === 9 && bossDefeated ? 10 : level;
  musicBuffer = musicBuffers[track] ??=
    track === 10
      ? buildFinaleMusic(audioCtx, true)
      : buildMusicBuffer(audioCtx, level);
  musicGain = audioCtx.createGain();
  musicGain.gain.setValueAtTime(0, audioCtx.currentTime);
  musicGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.12);
  musicGain.connect(audioCtx.destination);
  musicSource = audioCtx.createBufferSource();
  musicSource.buffer = musicBuffer;
  musicSource.loop = true;
  musicSource.connect(musicGain);
  musicStarted = audioCtx.currentTime;
  musicSource.start(0, musicOffset);
}
// Keep the music gain steady while effects play; repeated ducking sounded like stutter.

function tone(freq, end, duration, type = "square", delay = 0, volume = 0.04) {
  if (!sound) return;
  try {
    unlockAudio();
    if (!audioCtx) return;
    const t = audioCtx.currentTime + delay,
      o = audioCtx.createOscillator(),
      g = audioCtx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(end, t + duration);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(t);
    o.stop(t + duration + 0.01);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  } catch {}
}
function beep(freq, duration = 0.08, type = "square") {
  tone(freq, freq * 0.6, duration, type);
}
function jumpSound() {
  tone(190, 740, 0.16, "square", 0, 0.035);
  tone(380, 1050, 0.12, "triangle", 0.035, 0.025);
}
function collectSound() {
  tone(1046, 1046, 0.1, "triangle", 0, 0.075);
  tone(1568, 1568, 0.18, "square", 0.065, 0.025);
  tone(2093, 2093, 0.22, "sine", 0.12, 0.04);
}
function hud() {
  document.body.classList.toggle("finale-level", level === 9);
  $("#itemLabel").textContent = itemNames[level];
  canvas.setAttribute(
    "aria-label",
    chapterNames[level] +
      ": collect " +
      targetCount() +
      " " +
      itemNames[level].toLowerCase() +
      (level === 4
        ? " and cross four traffic lanes and outer bike lanes to the bus stop. Arrow keys or WASD move; the median is safe."
        : " and reach the gate"),
  );
  $("#rocks").textContent =
    String(collected).padStart(2, "0") + " / " + targetCount();
  $("#hearts").textContent = "♥ ".repeat(lives) + "· ".repeat(3 - lives);
  $("#status").textContent = checkpoint
    ? [
        "KOŚCIÓŁ NA GÓRCE",
        "PODZIEMIA KREDOWE",
        "GMACH",
        "PLAC ŁUCZKOWSKIEGO",
        "REJOWIECKA",
        "CHEŁMSKI PARK WODNY",
        "KINO ZORZA",
        "WEJŚCIE DO PODZIEMI",
        "PARK MIEJSKI",
        "STRAŻNIK PODZIEMI",
      ][level]
    : chapterNames[level];
  if (level === 9)
    canvas.setAttribute(
      "aria-label",
      "Final chamber: collect 10 chalk fragments from changing platforms to defeat the Chalk Guardian.",
    );
}
function reset() {
  stopMusic(true);
  bossDefeated = bossGone = victoryDismissed = false;
  for (const p of platforms)
    if (p.travel) {
      p.y = p.baseY;
      if (p.baseX !== undefined) p.x = p.baseX;
    }
  player = {
    x: 50,
    y: 330,
    w: 22,
    h: 30,
    vx: 0,
    vy: 0,
    ground: false,
    face: 1,
  };
  rocks = rockPositions.map(([x, y]) => {
    const support = platforms.find(
      (p) => p.travel && x >= p.x && x <= p.x + p.w && y === p.baseY - 24,
    );
    return {
      x,
      y,
      animationPhase: x,
      taken: false,
      support,
      offsetX: support ? x - support.x : 0,
    };
  });
  particles = [];
  camera = time = collected = 0;
  lives = 3;
  checkpoint = false;
  invincible = 0;
  coyote = jumpBuffer = 0;
  transition = 0;
  climbing = false;
  climbCooldown = 0;
  keys.clear();
  hud();
}
function start() {
  unlockAudio();
  if (state === "paused") {
    state = "playing";
    $("#overlay").hidden = true;
    return;
  }
  restartLevel();
}
function overlay(title, description, button) {
  $("#message").textContent = title;
  $("#description").textContent = description;
  $("#start").textContent = button;
  $("#overlay").hidden = false;
}
function gameOverSound() {
  tone(392, 392, 0.16, "sine", 0.2, 0.022);
  tone(330, 330, 0.18, "sine", 0.34, 0.019);
  tone(262, 247, 0.4, "triangle", 0.5, 0.014);
}
function pauseSound() {
  tone(660, 660, 0.09, "sine", 0, 0.018);
  tone(440, 440, 0.14, "sine", 0.075, 0.014);
}
function pause() {
  if (state === "playing") {
    state = "paused";
    pauseSound();
    keys.clear();
    overlay(
      "Czas na małą przerwę?",
      "Twoja przygoda została zatrzymana, nie każ nam długo czekać",
      "WRÓĆ DO GRY →",
    );
  } else if (state === "paused") {
    state = "playing";
    $("#overlay").hidden = true;
  }
}
function burst(x, y, color) {
  for (let i = 0; i < 10; i++)
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 130,
      vy: -Math.random() * 130,
      t: 0.5,
      color,
    });
}
function hit() {
  if (invincible > 0) return;
  releaseGameInput();
  lives--;
  beep(100, 0.25, "sawtooth");
  burst(player.x, player.y, "#fff1ce");
  hud();
  if (lives === 0) {
    state = "over";
    gameOverSound();
    overlay(
      [
        "Zostaje nadzieja, że ładnie prowadzisz zeszyt do religii.",
        "Następnym razem nie zaplącz się w prześcieradło.",
        "Wygląda na to, że utoniesz w papierach.",
        "Atrakcją turystyczną raczej nie zostaniesz.",
        "Rozejrzyj się przed przejściem przez drogę.",
        "Tym razem nikt Cię nie uratuje.",
        "Twoja droga na srebrny ekran dobiegła końca.",
        "Czyżby górnicy Cię wykopali?",
        "Przegrywasz pojedynek z ortalionowymi rycerzami.",
        "Znikasz w mrokach podziemi.",
      ][level],
      "Ale nie martw się, w każdej chwili możesz powtórzyć poziom.",
      "SPRÓBUJ JESZCZE RAZ →",
    );
    return;
  }
  player.x = checkpoint ? WORLD / 2 + 10 : 50;
  player.y = 330;
  player.vx = player.vy = 0;
  climbing = false;
  climbCooldown = 0.3;
  invincible = 2;
  if (level === 9) resetFinalePatrol();
}
function ghosts() {
  if (level === 1)
    return ghostDefs.map((g, i) => ({
      x: g.x + Math.sin(time * g.s + i) * g.r,
      y: g.y + Math.sin(time * 2 + i) * 9,
      w: 26,
      h: 29,
      kind: "ghost",
    }));
  return chapters[level].walkers.map((g) => {
    const span = g.right - g.left,
      phase = (time * g.speed + g.phase * span * 2) % (span * 2),
      forward = phase < span;
    return {
      x: g.left + (forward ? phase : span * 2 - phase),
      y: g.floor - 38,
      w: 26,
      h: 38,
      face: forward ? 1 : -1,
      kind: g.kind || (level === 0 ? "priest" : "worker"),
    };
  });
}
function overlap(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}
function movePlayer(dt) {
  climbCooldown = Math.max(0, climbCooldown - dt);
  const dir =
    (keys.has("ArrowRight") || keys.has("KeyD") ? 1 : 0) -
    (keys.has("ArrowLeft") || keys.has("KeyA") ? 1 : 0);
  const vertical =
    (keys.has("ArrowDown") || keys.has("KeyS") ? 1 : 0) -
    (keys.has("ArrowUp") || keys.has("KeyW") ? 1 : 0);
  const ladder = nearLadder();
  // At the ladder top, Up/W jumps; Down/S deliberately enters the ladder.
  const canEnterLadder =
    ladder &&
    (vertical > 0 || (vertical < 0 && player.y + player.h > ladder.top + 3));
  if (canEnterLadder && climbCooldown === 0 && !dir && jumpBuffer <= 0)
    climbing = true;
  if (!ladder || dir) climbing = false;
  player.vx = dir * 175;
  if (dir) player.face = dir;
  if (jumpBuffer > 0 && (coyote > 0 || climbing)) {
    player.vy = -430;
    player.ground = false;
    climbing = false;
    climbCooldown = 0.25;
    coyote = jumpBuffer = 0;
    jumpSound();
    burst(player.x + 11, player.y + 29, "#fff0c2");
  }
  if (climbing && ladder) {
    player.x = ladder.x - player.w / 2;
    player.vx = 0;
    player.vy = vertical * 105;
    player.y += player.vy * dt;
    player.ground = false;
    if (player.y + player.h <= ladder.top) {
      player.y = ladder.top - player.h;
      player.vy = 0;
      player.ground = true;
      climbing = false;
    }
    if (player.y + player.h >= ladder.bottom) {
      player.y = ladder.bottom - player.h;
      player.vy = 0;
      player.ground = true;
      climbing = false;
    }
    return;
  }
  const prevBottom = player.y + player.h,
    prevX = player.x;
  player.x = Math.max(0, Math.min(WORLD - player.w, player.x + player.vx * dt));
  // Stepped walls stop sideways entry; ordinary platforms keep their one-way behavior.
  for (const p of platforms)
    if (
      p.shapePiece &&
      player.y + player.h > p.y + 1 &&
      player.y < p.y + p.h - 1
    ) {
      if (prevX + player.w <= p.x + 0.1 && player.x + player.w > p.x)
        player.x = p.x - player.w;
      else if (prevX >= p.x + p.w - 0.1 && player.x < p.x + p.w)
        player.x = p.x + p.w;
    }
  player.vy = Math.min(520, player.vy + 1000 * dt);
  player.y += player.vy * dt;
  player.ground = false;
  for (const p of platforms)
    if (
      player.vy >= 0 &&
      prevBottom <= p.y + 1 &&
      player.y + player.h >= p.y &&
      player.x + player.w > p.x &&
      player.x < p.x + p.w
    ) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.ground = true;
    }
}
function moveLifts() {
  for (const p of platforms) {
    if (!p.travel) continue;
    const oldX = p.x,
      oldY = p.y,
      delta = Math.sin(time * (p.liftSpeed ?? 0.85) + p.phase) * p.travel;
    const riding =
      player.ground &&
      Math.abs(player.y + player.h - oldY) < 1 &&
      player.x + player.w > oldX &&
      player.x < oldX + p.w;
    if (p.axis === "x") p.x = p.baseX + delta;
    else p.y = p.baseY + delta;
    if (riding) {
      player.x += p.x - oldX;
      player.y += p.y - oldY;
    }
  }
  for (const r of rocks)
    if (r.support) {
      r.x = r.support.x + r.offsetX;
      r.y = r.support.y - 24;
    }
}
function update(dt) {
  if (level === 9) {
    updateFinale(dt);
    return;
  }
  if (level === 4 && state !== "transition") {
    updateRoad(dt);
    return;
  }
  if (state === "playing") time += dt;
  if (state === "transition") {
    transition -= dt;
    if (transition <= 0) {
      chapterStart = elapsed;
      loadLevel(nextStage());
      state = "playing";
    }
    return;
  }
  if (state !== "playing") return;
  banner = Math.max(0, banner - dt);
  elapsed += dt;
  invincible = Math.max(0, invincible - dt);
  jumpBuffer = Math.max(0, jumpBuffer - dt);
  coyote = player.ground ? 0.1 : Math.max(0, coyote - dt);
  moveLifts();
  movePlayer(dt);
  if (player.y > H + 60) {
    invincible = 0;
    hit();
  }
  for (const r of rocks)
    if (!r.taken && overlap(player, { x: r.x - 7, y: r.y - 9, w: 14, h: 18 })) {
      r.taken = true;
      collected++;
      collectSound();
      burst(r.x, r.y, itemColors[level]);
      hud();
    }
  if (player.x > WORLD / 2 - 20 && !checkpoint) {
    checkpoint = true;
    beep(660, 0.2);
    hud();
    burst(WORLD / 2, 330, "#caff79");
  }
  for (const g of ghosts())
    if (
      overlap(
        { x: player.x + 3, y: player.y + 3, w: 16, h: 25 },
        {
          x: g.x + 4,
          y: g.y + (g.kind === "ghost" ? 4 : 3),
          w: 18,
          h: g.kind === "ghost" ? 22 : g.h - 5,
        },
      )
    ) {
      hit();
      break;
    }
  if (
    overlap(player, { x: gateX(), y: 321, w: 52, h: 79 }) &&
    collected === targetCount() &&
    state === "playing"
  ) {
    beep(1040, 0.4, "triangle");
    keys.clear();
    if (nextStage() !== undefined) {
      state = "transition";
      transition = 1.2;
      player.vx = 0;
    } else {
      state = "won";
      overlay(
        "A quiet moment in Chełm.",
        "All ten chapters complete! All medallions, chalk pieces, papers, drinks, maps, tickets, liferings, film reels and leaves collected in " +
          Math.floor(elapsed / 60) +
          ":" +
          String(Math.floor(elapsed % 60)).padStart(2, "0") +
          ".",
        "PLAY AGAIN →",
      );
    }
  }

  camera = Math.max(0, Math.min(WORLD - W, player.x - W * 0.35));
  for (const p of particles) {
    p.t -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 300 * dt;
  }
  particles = particles.filter((p) => p.t > 0);
}
function rect(x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}
function label(text, x, y, color = "#f5efd6") {
  ctx.font = "9px monospace";
  ctx.fillStyle = "#15303b";
  ctx.fillRect(x - 4, y - 11, ctx.measureText(text).width + 8, 15);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}
// Detailed sprites are rasterized at double the logical game resolution.
const bearFrames = [],
  sheetFrames = [];
function spriteCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")];
}
function oval(c, x, y, rx, ry, color) {
  c.fillStyle = color;
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fill();
}
function poly(c, points, color) {
  c.fillStyle = color;
  c.beginPath();
  points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.fill();
}
function makeBear(frame) {
  const [c, g] = spriteCanvas(72, 84),
    step = Math.sin((frame * Math.PI) / 3) * 4;
  // Rounded silhouette, articulated legs, fur highlights and embroidered scarf.
  oval(g, 33, 51, 21, 24, "#263951");
  oval(g, 33, 49, 19, 23, "#8fb6d3");
  oval(g, 30, 46, 16, 21, "#cee3ef");
  oval(g, 27, 43, 13, 18, "#f4f8fa");
  oval(g, 27, 42, 10, 15, "#fffef4");
  for (const [x, dy] of [
    [22, step],
    [44, -step],
  ]) {
    oval(g, x, 70 + dy, 10, 10, "#293d55");
    oval(g, x, 69 + dy, 8, 8, "#adcde1");
    oval(g, x - 2, 67 + dy, 6, 6, "#f8fbf4");
    oval(g, x + 1, 74 + dy, 8, 3, "#dcebf0");
    for (let j = 0; j < 3; j++) {
      g.fillStyle = "#779db9";
      g.fillRect(x - 4 + j * 4, 75 + dy, 1, 2);
    }
  }
  oval(g, 20, 15, 10, 11, "#293d55");
  oval(g, 46, 15, 9, 10, "#293d55");
  oval(g, 20, 14, 8, 9, "#d2e5ee");
  oval(g, 46, 14, 7, 8, "#e9f2f1");
  oval(g, 20, 15, 4, 5, "#d49aab");
  oval(g, 46, 15, 4, 5, "#e7a9b2");
  oval(g, 34, 29, 23, 21, "#293d55");
  oval(g, 33, 28, 21, 19, "#9fc4de");
  oval(g, 30, 26, 18, 17, "#dcecf2");
  oval(g, 28, 24, 15, 15, "#fffdf0");
  oval(g, 45, 33, 17, 10, "#789eb9");
  oval(g, 46, 31, 16, 9, "#e4e6d9");
  oval(g, 46, 29, 13, 7, "#fff8e1");
  oval(g, 57, 26, 7, 5, "#203048");
  oval(g, 55, 24, 3, 1.5, "#6b8097");
  oval(g, 41, 22, 4, 5, "#263850");
  oval(g, 42, 21, 1.4, 1.7, "#ffffff");
  g.fillStyle = "#5c7c9a";
  g.fillRect(49, 35, 8, 1);
  g.fillRect(48, 34, 2, 1);
  oval(g, 32, 31, 4, 2, "#e9b3b0");
  for (let j = 0; j < 22; j++) {
    const x = 14 + ((j * 13) % 29),
      y = 15 + ((j * 7) % 28);
    if (x < 35) {
      g.fillStyle = j % 2 ? "#ffffff" : "#bdd8e5";
      g.fillRect(x, y, 2, 1);
    }
  }
  poly(
    g,
    [
      [13, 42],
      [48, 43],
      [49, 49],
      [37, 52],
      [13, 48],
    ],
    "#9f294e",
  );
  poly(
    g,
    [
      [13, 42],
      [48, 42],
      [47, 46],
      [15, 46],
    ],
    "#ff8063",
  );
  g.fillStyle = "#ffc386";
  g.fillRect(18, 43, 20, 1);
  poly(
    g,
    [
      [16, 46],
      [5, 48],
      [1, 54 + step],
      [16, 52],
    ],
    "#e94b56",
  );
  poly(
    g,
    [
      [5, 48],
      [1, 51 + step],
      [14, 49],
    ],
    "#ffab75",
  );
  g.fillStyle = "#ffe2ac";
  g.fillRect(4, 51 + step, 2, 3);
  oval(g, 44, 46, 4, 4, "#d93451");
  oval(g, 17, 53 - step / 2, 7, 12, "#6b98b8");
  oval(g, 15, 51 - step / 2, 6, 10, "#d0e4ee");
  oval(g, 13, 49 - step / 2, 4, 7, "#fffdf0");
  g.fillStyle = "#8db4ce";
  g.fillRect(12, 57 - step / 2, 1, 3);
  g.fillRect(15, 57 - step / 2, 1, 3);
  return c;
}
// Snap after camera subtraction; a rider shares the platform's pixel anchor.
function worldPixelX(x) {
  return Math.round(x - camera) + Math.round(camera);
}
function bearDrawPosition(x, y) {
  const support = player.ground
    ? platforms.find(
        (p) =>
          Math.abs(player.y + player.h - p.y) < 0.01 &&
          player.x + player.w > p.x &&
          player.x < p.x + p.w,
      )
    : null;
  return support
    ? {
        x: worldPixelX(support.x) + Math.round(x - support.x),
        y: Math.round(support.y) + Math.round(y - support.y),
      }
    : { x: worldPixelX(x), y: Math.round(y) };
}
function bear(x, y) {
  if (!bearFrames.length)
    for (let i = 0; i < 6; i++) bearFrames.push(makeBear(i));
  let f =
    (player.ground &&
      (Math.abs(player.vx) > 0 || (level === 4 && Math.abs(player.vy) > 0))) ||
    (climbing && Math.abs(player.vy) > 0)
      ? Math.floor(time * 12) % 6
      : 0;
  ctx.save();
  const drawPos = bearDrawPosition(x, y);
  ctx.translate(drawPos.x + 11, drawPos.y + 30);
  ctx.scale(player.face, 1);
  ctx.drawImage(bearFrames[f], -18, -40, 36, 42);
  ctx.restore();
}
function makeSheet(frame) {
  const [c, g] = spriteCanvas(64, 72),
    wave = Math.sin((frame * Math.PI) / 3) * 3;
  poly(
    g,
    [
      [7, 27],
      [12, 12],
      [22, 5],
      [39, 4],
      [51, 13],
      [56, 29],
      [59, 61],
      [50, 66 + wave],
      [39, 59],
      [30, 66 - wave],
      [21, 59],
      [9, 66 + wave],
      [3, 59],
    ],
    "#7a90bd",
  );
  poly(
    g,
    [
      [9, 27],
      [14, 13],
      [24, 7],
      [38, 6],
      [49, 14],
      [53, 29],
      [55, 59],
      [49, 63 + wave],
      [39, 55],
      [30, 63 - wave],
      [21, 56],
      [10, 62 + wave],
      [6, 58],
    ],
    "#c1d4eb",
  );
  poly(
    g,
    [
      [14, 28],
      [18, 13],
      [28, 8],
      [39, 10],
      [46, 17],
      [45, 42],
      [49, 58],
      [39, 53],
      [31, 58],
      [22, 51],
      [12, 58],
    ],
    "#f7fcfa",
  );
  poly(
    g,
    [
      [15, 25],
      [17, 40],
      [13, 56],
      [20, 52],
      [23, 30],
    ],
    "#dce8f2",
  );
  poly(
    g,
    [
      [39, 27],
      [41, 44],
      [46, 56],
      [39, 52],
      [35, 36],
    ],
    "#a9c4df",
  );
  poly(
    g,
    [
      [25, 34],
      [27, 51],
      [30, 57],
      [33, 36],
    ],
    "#e3eff7",
  );
  oval(g, 23, 27, 5, 7, "#526686");
  oval(g, 39, 27, 5, 7, "#526686");
  oval(g, 23, 26, 3, 5, "#172947");
  oval(g, 39, 26, 3, 5, "#172947");
  oval(g, 22, 24, 1, 1, "#d6f4ff");
  oval(g, 38, 24, 1, 1, "#d6f4ff");
  oval(g, 31, 40, 3, 4, "#839bb9");
  g.fillStyle = "#ffffff";
  g.fillRect(24, 12, 8, 2);
  return c;
}
function ghost(g) {
  if (!sheetFrames.length)
    for (let i = 0; i < 6; i++) sheetFrames.push(makeSheet(i));
  const f = Math.floor(time * 7 + g.x * 0.01) % 6;
  ctx.save();
  ctx.shadowColor = "#b8d9ff";
  ctx.shadowBlur = level ? 9 : 3;
  ctx.drawImage(
    sheetFrames[f],
    Math.round(g.x - 3),
    Math.round(g.y - 4),
    32,
    36,
  );
  ctx.restore();
}
// Rounded, irregular fieldstones: no rectangular brick courses.
// Hand-authored pixel clusters: small weathered stones set in warm soil.
const earthPixels = [
  "baHHHHabbbHHHaab",
  "aHMMMMHabHMMMMHa",
  "aMMMMMLabMMMMMLa",
  "aMMLLLLabMMLLLLa",
  "baLLLLabbbLLLLab",
  "bbaaaabccbaaaabb",
  "ccaHHHHaabbccbbb",
  "baHMMMMMLabHHHab",
  "baMMMMMLLaHMMMHa",
  "baMMLLLLLabMMMLa",
  "bbaLLLLLabMLLLLa",
  "bccaaaaaabbLLLab",
  "baHHHaabccbaaaab",
  "aHMMMMHabHHHHaab",
  "aMMMMLLabMMMMLab",
  "baLLLLaabLLLLabb",
];
const earthPalette = {
  b: "#79513b",
  c: "#906143",
  d: "#a2744d",
  a: "#523f35",
  H: "#b6aa8c",
  M: "#928a76",
  L: "#6c6c5d",
};
const earthTiles = [];
function earthTile(variant) {
  if (earthTiles[variant]) return earthTiles[variant];
  const [c, g] = spriteCanvas(16, 16);
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      let xx = (x + variant * 5) % 16,
        yy = (y + variant * 3) % 16;
      g.fillStyle = earthPalette[earthPixels[yy][xx]];
      g.fillRect(x, y, 1, 1);
    }
  return (earthTiles[variant] = c);
}
// Larger red staggered brickwork, with a bare masonry top and no grass.
function cobblePlatform(p) {
  const height = p.shapePiece ? p.h : p.h <= 20 ? 32 : p.h;
  rect(p.x, p.y, p.w, height, "#55433e");
  for (let row = 0; row < Math.ceil(height / 16); row++)
    for (let x = -(row % 2) * 18; x < p.w; x += 36) {
      const left = Math.max(0, x + 1),
        right = Math.min(p.w, x + 35),
        w = right - left,
        y = p.y + row * 16 + 1,
        h = Math.min(14, height - row * 16 - 1);
      if (w <= 0 || h <= 0) continue;
      const xx = p.x + left,
        n = noise(p.x + x, row + 21);
      rect(
        xx,
        y,
        w,
        h,
        n > 0.66 ? "#b44e3f" : n > 0.33 ? "#a54437" : "#923c33",
      );
      rect(xx, y, w, 1, "#d67a5d");
      rect(xx, y, 1, h, "#c3654e");
      rect(xx, y + h - 1, w, 1, "#6b302c");
      if (w > 8 && h > 4) {
        rect(xx + 3, y + 3, 3, 1, "#c76a50");
        rect(xx + w - 5, y + 5, 2, 1, "#7b352d");
      }
    }
  rect(p.x, p.y, p.w, 1, "#df9673");
  rect(p.x, p.y + height - 1, p.w, 1, "#542c2b");
}
function timberPlatform(p) {
  rect(p.x, p.y, p.w, p.h, "#493634");
  for (let x = 0; x < p.w; x += 32) {
    const w = Math.min(31, p.w - x),
      xx = p.x + x;
    rect(xx, p.y + 1, w, p.h - 3, noise(xx, 8) > 0.5 ? "#ad764b" : "#99613e");
    rect(xx, p.y, w, 2, "#dfac70");
    rect(xx, p.y + p.h - 4, w, 2, "#70462f");
    for (let dy = 5; dy < p.h - 4; dy += 5) {
      const dx = 3 + Math.floor(noise(xx, dy) * 5);
      rect(xx + dx, p.y + dy, Math.max(1, w - dx - 3), 1, "#815135");
      rect(xx + dx + 1, p.y + dy + 1, Math.max(1, w - dx - 7), 1, "#bf8953");
    }
    if (w > 15) {
      rect(xx + 10, p.y + 8, 4, 3, "#704a34");
      rect(xx + 11, p.y + 9, 2, 1, "#c28e58");
    }
    if (w > 6) {
      rect(xx + 3, p.y + 3, 2, 2, "#45434a");
      rect(xx + w - 5, p.y + 3, 2, 2, "#45434a");
    }
  }
  rect(p.x, p.y + p.h - 2, p.w, 2, "#493634");
}
function pavementPlatform(p) {
  rect(p.x, p.y, p.w, p.h, "#667781");
  for (let x = 0; x < p.w; x += 38) {
    const w = Math.min(37, p.w - x),
      xx = p.x + x,
      n = noise(xx, 7);
    rect(xx, p.y, w, p.h - 2, n > 0.5 ? "#bcc5c8" : "#aebcc2");
    rect(xx + 1, p.y + 1, Math.max(1, w - 2), 3, "#e4e7dc");
    rect(xx + 1, p.y + 4, 1, p.h - 7, "#d3dad7");
    rect(xx + 2, p.y + p.h - 5, Math.max(1, w - 3), 3, "#87979f");
    rect(xx + w - 1, p.y + 3, 1, p.h - 4, "#75858e");
    for (let dx = 5; dx < w - 3; dx += 7) {
      const dy = 6 + Math.floor(noise(xx + dx, 11) * (p.h - 12));
      rect(
        xx + dx,
        p.y + dy,
        2,
        1,
        noise(xx + dx, 5) > 0.5 ? "#cfd6d2" : "#98a9b0",
      );
    }
  }
  rect(p.x, p.y + p.h - 2, p.w, 2, "#596b77");
}
// Keep geometry and procedural grain anchored to the platform, not its changing height.
function renderPlatform(p) {
  if (level === 1 && !p.shapePiece && p.h > 20) {
    finaleChalkGround(p);
    return;
  }
  const anchor = Math.round(p.baseY ?? p.y),
    anchorX = Math.round(p.baseX ?? p.x);
  ctx.save();
  ctx.translate(worldPixelX(p.x) - anchorX, Math.round(p.y) - anchor);
  const local = { ...p, x: anchorX, y: anchor };
  ctx.save();
  if (level === 1) {
    const outline = chalkOutline(local);
    ctx.beginPath();
    outline.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.clip();
  }
  platform(local);
  platformDetails(local);
  ctx.restore();
  ctx.restore();
}
function platform(p) {
  if (level === 9) {
    chalkPlatform(p);
    return;
  }
  if (level === 8) {
    benchPlatform(p);
    return;
  }
  if (level === 7) {
    mineBeam(p);
    return;
  }
  if (level === 6) {
    trussPlatform(p);
    return;
  }
  if (level === 5) {
    poolPlatform(p);
    return;
  }
  if (level === 0) {
    cobblePlatform(p);
    return;
  }
  if (level === 1) {
    chalkPlatform(p);
    return;
  }
  if (level === 2) {
    pavementPlatform(p);
    return;
  }
  if (level === 3) {
    timberPlatform(p);
    return;
  }
  rect(p.x - 2, p.y, p.w + 4, p.h, "#203347");
  rect(p.x, p.y + 4, p.w, p.h - 4, "#72535c");
  // Individually highlighted chalk blocks with offset mortar joints.
  for (let row = 0; row < Math.ceil((p.h - 4) / 12); row++) {
    const yy = p.y + 5 + row * 12;
    for (let xx = p.x - (row % 2) * 13; xx < p.x + p.w; xx += 26) {
      let left = Math.max(p.x, xx + 1),
        right = Math.min(p.x + p.w, xx + 25),
        ww = right - left;
      if (ww <= 0) continue;
      let hh = Math.min(10, p.y + p.h - yy);
      if (hh <= 0) continue;
      const warm = (Math.floor(xx / 26) + row) % 3 === 0;
      rect(left, yy, ww, hh, warm ? "#c99d7d" : "#b58270");
      rect(left, yy, ww, 2, warm ? "#f5d1a0" : "#e4b48d");
      rect(left, yy, 2, hh, "#e9bc91");
      rect(left + ww - 2, yy + 2, 2, Math.max(1, hh - 2), "#8d6260");
      if (ww > 10 && hh > 5) {
        rect(left + 5, yy + 5, 3, 1, "#f1c399");
        rect(left + ww - 7, yy + 3, 2, 2, "#986a63");
      }
    }
  }
  for (let yy = p.y + 7; yy < p.y + p.h - 1; yy += 2)
    for (let xx = p.x + 2; xx < p.x + p.w - 2; xx += 4) {
      let n = noise(xx, yy);
      if (n > 0.68) rect(xx, yy, 1.5, 0.5, n > 0.88 ? "#ffe0ad" : "#916968");
    }
  rect(p.x - 2, p.y, p.w + 4, 3, "#eff7bd");
  rect(p.x, p.y + 3, p.w, 3, "#84be65");
  for (let x = p.x + 4; x < p.x + p.w - 5; x += 17) {
    rect(x, p.y - 2, 5, 3, "#b9e978");
    rect(x + 2, p.y - 4, 2, 3, "#e0fa98");
    rect(x + 4, p.y - 3, 1, 3, "#4c8b53");
    rect(x - 1, p.y - 1, 2, 1, "#fff1aa");
    rect(x + 7, p.y + 5, 3, 2, "#537e57");
  }
  if (p.h > 20) {
    for (let x = p.x + 25; x < p.x + p.w - 12; x += 97) {
      rect(x, p.y - 5, 2, 5, "#589b62");
      rect(x - 1, p.y - 7, 4, 3, "#ffd26e");
      rect(x, p.y - 7, 2, 1, "#fff6b1");
    }
  } else {
    for (let x = p.x + 15; x < p.x + p.w - 8; x += 64) {
      rect(x, p.y + 14, 2, 8, "#40886e");
      rect(x - 2, p.y + 18, 3, 3, "#6cbd75");
      rect(x + 1, p.y + 21, 4, 3, "#8ed37a");
    }
  }
}
// Artwork establishes irregular chalk geology; small moving layers add depth.
function caveBackground() {
  rect(0, 0, W, H, "#123844");
  if (caveArt.complete && caveArt.naturalWidth)
    ctx.drawImage(
      caveArt,
      -Math.round(camera * (256 / (WORLD - W))),
      -40,
      1024,
      512,
    );
  for (let i = 0; i < 30; i++) {
    const x = (((i * 137 - camera * 0.31) % W) + W) % W,
      y = 60 + ((i * 53) % 300) + Math.sin(time * 0.5 + i) * 7;
    rect(x, y, 1, 1, i % 3 ? "#e5eddb66" : "#fff8d899");
  }
  // Subtle drifting ground mist stays below the playing surface.
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = "#b4dce10a";
    ctx.beginPath();
    ctx.ellipse(
      170 + i * 290 + Math.sin(time * 0.3 + i) * 25,
      406,
      230,
      15,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}
function noise(x, y) {
  let v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return v - Math.floor(v);
}
function chalkOutline(p) {
  const tall = p.h > 20 || p.shapePiece,
    depth = p.shapePiece ? p.h : tall ? p.h : 25,
    bottom = p.y + depth,
    rough = p.shapePiece || !tall,
    points = [
      [p.x, p.y],
      [p.x + p.w, p.y],
    ];
  const edge = (x) =>
    bottom + (rough ? Math.floor(noise(x, bottom) * 9) - 4 : 0);
  points.push([p.x + p.w, edge(p.x + p.w)]);
  for (let x = Math.floor((p.x + p.w) / 12) * 12; x > p.x; x -= 12)
    points.push([x, edge(x)]);
  points.push([p.x, edge(p.x)]);
  return points;
}
function chalkPlatform(p) {
  const tall = p.h > 20 || p.shapePiece,
    depth = p.shapePiece ? p.h : tall ? p.h : 25,
    points = chalkOutline(p);
  poly(ctx, points, "#536d87");
  const inner = [
    [p.x, p.y + 2],
    [p.x + p.w, p.y + 2],
  ];
  for (let x = p.x + p.w; x >= p.x; x -= 12)
    inner.push([
      x,
      p.y +
        depth -
        6 +
        (p.shapePiece || !tall ? Math.floor(noise(x, p.y + depth) * 7) - 4 : 0),
    ]);
  poly(ctx, inner, "#9aabb6");
  for (let x = p.x; x < p.x + p.w; x += 28) {
    const w = Math.min(28, p.x + p.w - x),
      n = noise(x, p.y),
      d = tall ? depth - 8 : 14 + n * 8;
    poly(
      ctx,
      [
        [x, p.y + 4],
        [x + w, p.y + 3],
        [x + w - 2, p.y + d - 5],
        [x + w * 0.4, p.y + d],
        [x, p.y + d - 3],
      ],
      n > 0.5 ? "#c5cbc6" : "#b3c0c5",
    );
    poly(
      ctx,
      [
        [x, p.y + 4],
        [x + w, p.y + 3],
        [x + w - 4, p.y + 8],
        [x + 3, p.y + 9],
      ],
      "#e1dfcc",
    );
    if (w > 10) {
      poly(
        ctx,
        [
          [x + 8, p.y + 10],
          [x + 13, p.y + 14],
          [x + 11, p.y + 19],
          [x + 14, p.y + 23],
          [x + 10, p.y + 19],
          [x + 11, p.y + 14],
        ],
        "#7c8d9f",
      );
      rect(x + 17, p.y + 12, 4, 1, "#f0e8d6");
    }
  }
  if (tall)
    for (let yy = p.y + 23; yy < p.y + depth - 16; yy += 14)
      for (let x = p.x + 2; x < p.x + p.w - 9; x += 19) {
        let n = noise(x, yy);
        rect(x, yy + n * 5, 7 + n * 8, 2, n > 0.5 ? "#d8d9c9" : "#8fa3b2");
        if (n > 0.7) rect(x + 2, yy + 6, 3, 2, "#6e879d");
      }
  rect(p.x, p.y, p.w, 2, "#fff3d4");
  rect(p.x, p.y + 2, p.w, 2, "#e3dfc7");
  for (let x = p.x + 6; x < p.x + p.w - 5; x += 23) {
    rect(x, p.y - 1, 3, 1, "#f6efd9");
    rect(x + 3, p.y + 5, 5, 1, "#f7eddb");
  }
}
function gem(r) {
  const phase = r.animationPhase ?? r.x,
    x = r.support
      ? worldPixelX(r.support.x) + Math.round(r.offsetX)
      : worldPixelX(r.x),
    y = Math.round(r.y) + Math.sin(time * 4.8 + phase) * 3.5;
  ctx.save();
  ctx.translate(x, y);
  if (level === 8) {
    ctx.rotate(Math.sin(time * 2.2 + phase) * 0.22 - 0.35);
    poly(
      ctx,
      [
        [0, 10],
        [-7, 5],
        [-8, -2],
        [-4, -8],
        [1, -12],
        [7, -7],
        [9, -1],
        [6, 6],
      ],
      "#314b2a",
    );
    poly(
      ctx,
      [
        [0, 8],
        [-6, 4],
        [-6, -2],
        [-3, -7],
        [1, -10],
        [6, -6],
        [7, -1],
        [4, 5],
      ],
      "#8ec452",
    );
    poly(
      ctx,
      [
        [0, 8],
        [1, -10],
        [6, -6],
        [7, -1],
        [4, 5],
      ],
      "#62a244",
    );
    ctx.strokeStyle = "#e1e79b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(1, -8);
    for (const y of [-4, 0, 4]) {
      ctx.moveTo(0.5, y + 2);
      ctx.lineTo(-4, y - 1);
      ctx.moveTo(0.5, y + 2);
      ctx.lineTo(5, y - 1);
    }
    ctx.stroke();
  } else if (level === 7) {
    drawTicketArtwork();
  } else if (level === 6) {
    ctx.rotate(time * 0.8 + phase);
    oval(ctx, 0, 1, 10, 10, "#35455e");
    oval(ctx, 0, 0, 9, 9, "#c9d6df");
    oval(ctx, -1, -1, 8, 8, "#edf0e4");
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      oval(ctx, Math.cos(a) * 5.2, Math.sin(a) * 5.2, 2.2, 2.2, "#52647c");
    }
    oval(ctx, 0, 0, 1.5, 1.5, "#33485f");
    ctx.rotate(-time * 0.8 - phase);
    rect(7, 5, 5, 3, "#4b5063");
    rect(10, 7, 4, 2, "#d3d2c2");
  } else if (level === 5) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#b05232";
    ctx.beginPath();
    ctx.arc(0, 1, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#fff5d8";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#ed6542";
    for (let a = 0; a < 4; a++) {
      ctx.beginPath();
      ctx.arc(0, 0, 8, (a * Math.PI) / 2 - 0.25, (a * Math.PI) / 2 + 0.25);
      ctx.stroke();
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#eadba8";
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.stroke();
  } else if (level === 0) {
    // An elongated devotional pendant with a suspension loop and embossed cross.
    const width = 2 + Math.abs(Math.cos(time * 2.2 + phase)) * 4;
    oval(ctx, 0, -8, 2, 2.5, "#9b6b35");
    oval(ctx, 0, -8, 1, 1.5, "#e1b86a");
    oval(ctx, 0, 1, width + 1, 8, "#80512e");
    oval(ctx, 0, 0.5, width, 7.5, "#d6ac58");
    oval(ctx, -0.4, 0, Math.max(1, width - 1.2), 6.3, "#f0d389");
    oval(ctx, 0.3, 1, Math.max(0.7, width - 2), 5, "#bf9144");
    rect(0, -3, 1, 8, "#8e652f");
    rect(
      -Math.max(1, width * 0.45),
      -1,
      Math.max(2, width * 0.9),
      1,
      "#8e652f",
    );
    rect(-1, -4, 1, 8, "#fff0b7");
    rect(
      -Math.max(1, width * 0.45) - 1,
      -2,
      Math.max(2, width * 0.9),
      1,
      "#fff0b7",
    );
    rect(-width + 1, -2, 1, 4, "#ffedb2");
  } else if (level === 3) {
    // Lidded takeaway fruit drink, with an unmistakable bent straw.
    rect(2, -14, 2, 10, "#fff0d3");
    rect(3, -14, 5, 2, "#f27d84");
    rect(2, -10, 2, 2, "#f27d84");
    poly(
      ctx,
      [
        [-7, -6],
        [7, -6],
        [5, 9],
        [-5, 9],
      ],
      "#7d455d",
    );
    poly(
      ctx,
      [
        [-6, -5],
        [6, -5],
        [4, 8],
        [-4, 8],
      ],
      "#efa75c",
    );
    rect(-4, -3, 2, 9, "#ffe8a2");
    rect(-4, 2, 8, 3, "#ee7781");
    rect(-7, -7, 14, 2, "#f4ebd3");
    rect(-5, -8, 10, 1, "#fff7df");
  } else if (level === 2) {
    ctx.rotate(Math.sin(time * 2 + phase) * 0.09);
    poly(
      ctx,
      [
        [-7, -9],
        [3, -9],
        [8, -4],
        [8, 9],
        [-7, 9],
      ],
      "#536a87",
    );
    poly(
      ctx,
      [
        [-6, -8],
        [2, -8],
        [7, -3],
        [7, 8],
        [-6, 8],
      ],
      "#f9f5df",
    );
    poly(
      ctx,
      [
        [2, -8],
        [2, -3],
        [7, -3],
      ],
      "#a7c1d4",
    );
    rect(-3, -3, 4, 1, "#65859d");
    rect(-3, 0, 7, 1, "#91aabb");
    rect(-3, 3, 6, 1, "#91aabb");
    rect(2, 5, 2, 1, "#bd6d63");
  } else {
    poly(
      ctx,
      [
        [-6, -5],
        [-2, -9],
        [5, -6],
        [7, 2],
        [2, 8],
        [-6, 5],
        [-8, 0],
      ],
      "#8796a5",
    );
    poly(
      ctx,
      [
        [-5, -5],
        [-2, -8],
        [4, -5],
        [6, 2],
        [1, 7],
        [-5, 4],
        [-7, 0],
      ],
      "#eee9d9",
    );
    poly(
      ctx,
      [
        [-2, -8],
        [4, -5],
        [1, 0],
        [-6, 0],
      ],
      "#fffdf0",
    );
    poly(
      ctx,
      [
        [1, 0],
        [4, -5],
        [6, 2],
        [1, 7],
      ],
      "#c6cbd0",
    );
    poly(
      ctx,
      [
        [-6, 0],
        [1, 0],
        [1, 7],
        [-5, 4],
      ],
      "#e2e2d9",
    );
    rect(-3, -6, 2, 4, "#ffffff");
    rect(-4, 1, 2, 1, "#bdc6cc");
    rect(2, 3, 1, 2, "#9daab7");
  }
  if (Math.sin(time * 4 + phase) > 0.9) {
    rect(8, -9, 1, 5, "#fffde1");
    rect(6, -7, 5, 1, "#fffde1");
  }
  ctx.restore();
}
const walkerFrames = {
  tracksuit: [],
  miner: [],
  director: [],
  lifeguard: [],
  nun: [],
  worker: [],
  priest: [],
  tourist: [],
};
function makeTourist(frame) {
  const [c, g] = spriteCanvas(64, 84),
    step = Math.sin((frame * Math.PI) / 3) * 5;
  // Walking shoes, bare calves, khaki shorts and a colourful holiday shirt.
  for (const [x, d] of [
    [23, step],
    [40, -step],
  ]) {
    poly(
      g,
      [
        [x - 4, 54],
        [x + 4, 54],
        [x + 4 + d, 75],
        [x - 4 + d, 75],
      ],
      "#ddad88",
    );
    oval(g, x + d + 2, 77, 7, 4, "#e1e4d5");
    g.fillStyle = "#587384";
    g.fillRect(x + d - 4, 78, 12, 2);
  }
  poly(
    g,
    [
      [17, 49],
      [45, 49],
      [44, 65],
      [33, 65],
      [31, 56],
      [29, 65],
      [17, 65],
    ],
    "#a28a5a",
  );
  poly(
    g,
    [
      [18, 52],
      [29, 52],
      [27, 64],
      [18, 64],
    ],
    "#c1a773",
  );
  poly(
    g,
    [
      [20, 30],
      [42, 30],
      [48, 52],
      [16, 53],
    ],
    "#358d91",
  );
  poly(
    g,
    [
      [21, 33],
      [29, 33],
      [28, 51],
      [17, 51],
    ],
    "#70b6ad",
  );
  for (const [x, y] of [
    [23, 37],
    [38, 35],
    [20, 45],
    [41, 46],
  ]) {
    g.fillStyle = "#f3d898";
    g.fillRect(x, y, 3, 3);
    g.fillRect(x - 1, y + 1, 5, 1);
  }
  poly(
    g,
    [
      [19, 32],
      [11, 39],
      [13, 51 - step / 2],
      [18, 52 - step / 2],
      [23, 39],
    ],
    "#479da0",
  );
  oval(g, 15, 54 - step / 2, 3, 5, "#e9bc97");
  poly(
    g,
    [
      [42, 32],
      [49, 38],
      [48, 51 + step / 2],
      [43, 52 + step / 2],
      [38, 38],
    ],
    "#2e767f",
  );
  oval(g, 46, 54 + step / 2, 3, 5, "#e9bc97");
  oval(g, 32, 20, 11, 13, "#c19174");
  oval(g, 31, 19, 10, 12, "#f0c9a3");
  g.fillStyle = "#4a4146";
  g.fillRect(35, 18, 2, 2);
  g.fillRect(34, 25, 4, 1);
  poly(
    g,
    [
      [20, 13],
      [23, 4],
      [38, 4],
      [43, 13],
    ],
    "#d3bc85",
  );
  poly(
    g,
    [
      [16, 13],
      [44, 11],
      [47, 16],
      [19, 18],
    ],
    "#efdab0",
  );
  g.fillStyle = "#9a855e";
  g.fillRect(22, 10, 19, 2);
  // Camera hangs visibly from two neck straps across the chest.
  poly(
    g,
    [
      [25, 30],
      [27, 30],
      [30, 43],
      [28, 44],
    ],
    "#263c49",
  );
  poly(
    g,
    [
      [38, 30],
      [40, 30],
      [37, 44],
      [35, 43],
    ],
    "#263c49",
  );
  g.fillStyle = "#26343f";
  g.fillRect(25, 42, 17, 11);
  g.fillStyle = "#78949c";
  g.fillRect(26, 43, 15, 3);
  g.fillStyle = "#d2dcda";
  g.fillRect(27, 43, 4, 2);
  oval(g, 35, 48, 5, 5, "#162d3c");
  oval(g, 35, 48, 3, 3, "#569cb6");
  oval(g, 34, 47, 1, 1, "#d9f5ee");
  g.fillStyle = "#26343f";
  g.fillRect(29, 40, 6, 3);
  return c;
}
function makeWalker(kind, frame) {
  if (kind === "tracksuit") return makeTracksuit(frame);
  if (kind === "miner") return makeMiner(frame);
  if (kind === "director") return makeDirector(frame);
  if (kind === "lifeguard") return makeLifeguard(frame);
  if (kind === "tourist") return makeTourist(frame);
  const [c, g] = spriteCanvas(64, 84),
    step = Math.sin((frame * Math.PI) / 3) * 5;
  // Alternating feet stay aligned with the surface while the upper body sways.
  for (const [x, d] of [
    [23, step],
    [40, -step],
  ]) {
    poly(
      g,
      [
        [x - 4, 54],
        [x + 4, 54],
        [x + 4 + d, 76],
        [x - 4 + d, 76],
      ],
      "#30374c",
    );
    oval(g, x + d + 2, 77, 7, 4, "#1e293b");
    g.fillStyle = "#71808e";
    g.fillRect(x + d - 3, 77, 7, 1);
  }
  if (kind === "nun") {
    poly(
      g,
      [
        [20, 29],
        [42, 29],
        [48, 73],
        [42, 77],
        [16, 77],
        [11, 73],
      ],
      "#151f35",
    );
    poly(
      g,
      [
        [21, 34],
        [30, 34],
        [28, 73],
        [16, 74],
      ],
      "#34435a",
    );
    poly(
      g,
      [
        [34, 36],
        [41, 36],
        [45, 73],
        [35, 75],
      ],
      "#252e43",
    );
    poly(
      g,
      [
        [22, 52],
        [23, 71],
        [20, 73],
      ],
      "#657182",
    );
    oval(g, 31, 20, 15, 20, "#182337");
    poly(
      g,
      [
        [17, 17],
        [13, 42],
        [23, 36],
        [41, 36],
        [49, 42],
        [45, 17],
      ],
      "#202a3e",
    );
    oval(g, 31, 20, 12, 16, "#f0f2e8");
    oval(g, 32, 21, 8, 11, "#e3bda0");
    oval(g, 33, 19, 7, 9, "#f2d2b0");
    g.fillStyle = "#4b4050";
    g.fillRect(34, 18, 2, 2);
    g.fillRect(36, 25, 3, 1);
    poly(
      g,
      [
        [22, 31],
        [31, 35],
        [41, 31],
        [38, 40],
        [24, 40],
      ],
      "#fffbea",
    );
    poly(
      g,
      [
        [18, 38],
        [13, 40],
        [12, 56 - step / 2],
        [18, 59 - step / 2],
        [24, 48],
      ],
      "#344055",
    );
    oval(g, 17, 57 - step / 2, 3, 4, "#e5bd9a");
    poly(
      g,
      [
        [41, 39],
        [47, 42],
        [48, 55 + step / 2],
        [43, 57 + step / 2],
        [37, 45],
      ],
      "#202a3f",
    );
    oval(g, 45, 56 + step / 2, 3, 4, "#e5bd9a");
    g.fillStyle = "#d8c896";
    g.fillRect(31, 41, 1, 9);
    g.fillRect(28, 45, 7, 1);
  } else if (kind === "priest") {
    // Black cassock, white clerical collar, gold cross and a small prayer book.
    poly(
      g,
      [
        [21, 31],
        [42, 31],
        [48, 74],
        [40, 78],
        [16, 77],
        [12, 73],
      ],
      "#172335",
    );
    poly(
      g,
      [
        [22, 35],
        [29, 35],
        [26, 73],
        [17, 74],
      ],
      "#3d4c61",
    );
    poly(
      g,
      [
        [35, 36],
        [41, 36],
        [45, 73],
        [35, 76],
      ],
      "#29354b",
    );
    oval(g, 32, 19, 11, 14, "#b88670");
    oval(g, 31, 18, 10, 12, "#edc5a1");
    oval(g, 29, 15, 7, 8, "#f7dbb5");
    poly(
      g,
      [
        [21, 15],
        [22, 7],
        [29, 4],
        [39, 6],
        [43, 13],
        [41, 18],
        [37, 10],
        [27, 10],
      ],
      "#57413b",
    );
    g.fillStyle = "#312e39";
    g.fillRect(34, 18, 2, 2);
    g.fillRect(34, 25, 4, 1);
    g.fillStyle = "#fffbe4";
    g.fillRect(28, 31, 9, 4);
    g.fillStyle = "#263144";
    g.fillRect(28, 35, 9, 3);
    g.fillStyle = "#bd9b57";
    g.fillRect(33, 39, 1, 16);
    g.fillRect(30, 48, 7, 2);
    g.fillStyle = "#f8df9a";
    g.fillRect(33, 47, 1, 6);
    poly(
      g,
      [
        [20, 36],
        [13, 41],
        [12, 56 - step / 2],
        [18, 59 - step / 2],
        [25, 42],
      ],
      "#3d4c61",
    );
    oval(g, 16, 56 - step / 2, 3, 4, "#efc8a5");
    poly(
      g,
      [
        [41, 36],
        [48, 40],
        [48, 53 + step / 2],
        [42, 56 + step / 2],
        [37, 41],
      ],
      "#26344b",
    );
    oval(g, 45, 54 + step / 2, 3, 4, "#efc8a5");
    g.fillStyle = "#743e39";
    g.fillRect(40, 55 + step / 2, 12, 14);
    g.fillStyle = "#f1dca6";
    g.fillRect(42, 57 + step / 2, 9, 2);
    g.fillStyle = "#c7a264";
    g.fillRect(45, 61 + step / 2, 2, 6);
    g.fillRect(43, 63 + step / 2, 6, 1);
  } else {
    poly(
      g,
      [
        [18, 32],
        [43, 32],
        [47, 59],
        [37, 63],
        [16, 59],
      ],
      "#28384b",
    );
    poly(
      g,
      [
        [20, 34],
        [28, 35],
        [29, 60],
        [18, 57],
      ],
      "#60758b",
    );
    poly(
      g,
      [
        [34, 35],
        [42, 34],
        [44, 58],
        [33, 61],
      ],
      "#3e536b",
    );
    poly(
      g,
      [
        [25, 32],
        [33, 45],
        [38, 32],
      ],
      "#f6f0dc",
    );
    poly(
      g,
      [
        [30, 36],
        [33, 37],
        [34, 51],
        [30, 49],
      ],
      "#b8444a",
    );
    oval(g, 32, 20, 12, 14, "#ba8b79");
    oval(g, 31, 18, 11, 12, "#efc5a0");
    poly(
      g,
      [
        [21, 15],
        [22, 6],
        [34, 4],
        [42, 10],
        [43, 17],
        [37, 12],
        [27, 11],
      ],
      "#4a3b3b",
    );
    g.fillStyle = "#684c46";
    g.fillRect(24, 18, 5, 2);
    g.fillRect(35, 18, 5, 2);
    poly(
      g,
      [
        [24, 15],
        [30, 18],
        [30, 20],
        [24, 17],
      ],
      "#3a3039",
    );
    poly(
      g,
      [
        [35, 18],
        [41, 15],
        [41, 17],
        [35, 20],
      ],
      "#3a3039",
    );
    g.fillStyle = "#f4f3de";
    g.fillRect(25, 20, 3, 2);
    g.fillRect(36, 20, 3, 2);
    g.fillStyle = "#263446";
    g.fillRect(27, 20, 1, 2);
    g.fillRect(38, 20, 1, 2);
    poly(
      g,
      [
        [29, 28],
        [34, 26],
        [38, 28],
        [34, 28],
      ],
      "#6f3c40",
    );
    poly(
      g,
      [
        [18, 34],
        [12, 39],
        [11, 54 - step / 2],
        [17, 56 - step / 2],
        [23, 40],
      ],
      "#60758b",
    );
    oval(g, 14, 55 - step / 2, 3, 4, "#e8bc98");
    poly(
      g,
      [
        [42, 35],
        [49, 40],
        [48, 53 + step / 2],
        [43, 55 + step / 2],
        [37, 40],
      ],
      "#3a4d62",
    );
    oval(g, 46, 54 + step / 2, 3, 4, "#e8bc98");
    g.fillStyle = "#453c42";
    g.fillRect(42, 56 + step / 2, 9, 5);
    g.fillStyle = "#a9794d";
    g.fillRect(38, 60 + step / 2, 18, 13);
    g.fillStyle = "#d7ac6e";
    g.fillRect(39, 60 + step / 2, 16, 2);
    g.fillStyle = "#5e4a43";
    g.fillRect(38, 69 + step / 2, 18, 2);
    g.fillStyle = "#f2d18c";
    g.fillRect(46, 65 + step / 2, 2, 3);
  }
  return c;
}
function walker(e) {
  const frames = walkerFrames[e.kind];
  if (!frames.length)
    for (let i = 0; i < 6; i++) frames.push(makeWalker(e.kind, i));
  ctx.save();
  ctx.translate(Math.round(e.x + 13), Math.round(e.y + e.h));
  ctx.scale(e.face, 1);
  ctx.drawImage(
    frames[Math.floor(time * 9 + e.x * 0.01) % 6],
    -16,
    -42,
    32,
    42,
  );
  ctx.restore();
}
// Decorative wildlife is drawn behind the level and never participates in collisions.
// A distant high-wing light aircraft: one pass, then a quiet interval.
const skyArt = new Image();
skyArt.src = "assets/sky-vehicles.png";
function distantPlane() {
  if (!skyArt.complete || !skyArt.naturalWidth) return;
  const elapsed = time - 8;
  if (elapsed < 0) return;
  const pass = Math.floor(elapsed / 42),
    phase = elapsed % 42,
    duration = 16;
  if (phase >= duration) return;
  const direction = pass % 2 === 0 ? 1 : -1,
    progress = phase / duration;
  const x =
    direction === 1
      ? -60 + progress * (W + 120)
      : W + 60 - progress * (W + 120);
  const y = 44 + (pass % 3) * 9 + Math.sin(progress * Math.PI * 2) * 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(direction * 0.7, 0.7);
  ctx.drawImage(skyArt, 60, 0, 1192, 400, -52, -18, 104, 34.9);
  // Propeller is animated independently at the spinner, never baked into the sprite.
  ctx.save();
  ctx.translate(47, -0.3);
  const spin = time * 48;
  ctx.strokeStyle = "#dce8ee";
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(Math.cos(spin) * 1.8, Math.sin(spin) * 12);
  ctx.lineTo(-Math.cos(spin) * 1.8, -Math.sin(spin) * 12);
  ctx.stroke();
  ctx.globalAlpha = 0.18;
  ctx.beginPath();
  ctx.ellipse(0, 0, 2.2, 12, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}

const aquaLeafSpans = [
  [0, 0, 74],
  [91, 0, 5],
  [108, 0, 1],
  [124, 0, 47],
  [192, 0, 62],
  [1400, 0, 130],
  [1533, 0, 3],
  [0, 1, 74],
  [91, 1, 6],
  [106, 1, 3],
  [124, 1, 47],
  [194, 1, 59],
  [1368, 1, 5],
  [1401, 1, 87],
  [1492, 1, 3],
  [1497, 1, 33],
  [0, 2, 73],
  [90, 2, 7],
  [105, 2, 4],
  [124, 2, 46],
  [192, 2, 60],
  [1364, 2, 10],
  [1376, 2, 2],
  [1402, 2, 129],
  [0, 3, 72],
  [90, 3, 7],
  [104, 3, 4],
  [124, 3, 46],
  [171, 3, 2],
  [192, 3, 59],
  [1364, 3, 10],
  [1375, 3, 4],
  [1404, 3, 129],
  [0, 4, 76],
  [91, 4, 6],
  [104, 4, 3],
  [123, 4, 51],
  [191, 4, 57],
  [1364, 4, 15],
  [1405, 4, 129],
  [0, 5, 77],
  [91, 5, 6],
  [103, 5, 3],
  [123, 5, 51],
  [190, 5, 63],
  [1365, 5, 15],
  [1401, 5, 135],
  [0, 6, 79],
  [87, 6, 10],
  [102, 6, 3],
  [123, 6, 10],
  [134, 6, 41],
  [189, 6, 66],
  [1365, 6, 16],
  [1399, 6, 137],
  [0, 7, 80],
  [86, 7, 3],
  [90, 7, 7],
  [101, 7, 3],
  [123, 7, 8],
  [134, 7, 43],
  [189, 7, 70],
  [1365, 7, 16],
  [1398, 7, 138],
  [0, 8, 23],
  [24, 8, 57],
  [90, 8, 6],
  [100, 8, 3],
  [111, 8, 4],
  [124, 8, 6],
  [134, 8, 44],
  [188, 8, 71],
  [1365, 8, 17],
  [1397, 8, 46],
  [1444, 8, 92],
  [0, 9, 23],
  [25, 9, 57],
  [92, 9, 4],
  [99, 9, 4],
  [111, 9, 6],
  [125, 9, 4],
  [133, 9, 46],
  [188, 9, 70],
  [1367, 9, 14],
  [1397, 9, 46],
  [1444, 9, 92],
  [0, 10, 82],
  [93, 10, 2],
  [99, 10, 3],
  [110, 10, 7],
  [126, 10, 2],
  [133, 10, 46],
  [188, 10, 70],
  [1368, 10, 13],
  [1396, 10, 45],
  [1442, 10, 1],
  [1444, 10, 92],
  [0, 11, 82],
  [94, 11, 1],
  [98, 11, 3],
  [105, 11, 10],
  [132, 11, 48],
  [188, 11, 72],
  [1368, 11, 13],
  [1387, 11, 1],
  [1395, 11, 19],
  [1416, 11, 120],
  [0, 12, 83],
  [94, 12, 1],
  [97, 12, 3],
  [105, 12, 10],
  [132, 12, 49],
  [188, 12, 73],
  [1368, 12, 13],
  [1386, 12, 3],
  [1394, 12, 18],
  [1416, 12, 46],
  [1464, 12, 72],
  [0, 13, 83],
  [96, 13, 4],
  [105, 13, 10],
  [132, 13, 49],
  [188, 13, 15],
  [208, 13, 52],
  [1357, 13, 6],
  [1368, 13, 13],
  [1385, 13, 7],
  [1394, 13, 15],
  [1416, 13, 45],
  [1465, 13, 71],
  [0, 14, 83],
  [96, 14, 3],
  [105, 14, 10],
  [132, 14, 49],
  [188, 14, 15],
  [208, 14, 52],
  [1357, 14, 9],
  [1368, 14, 12],
  [1384, 14, 24],
  [1414, 14, 46],
  [1465, 14, 71],
  [0, 15, 65],
  [70, 15, 14],
  [95, 15, 4],
  [105, 15, 5],
  [132, 15, 38],
  [171, 15, 10],
  [188, 15, 14],
  [207, 15, 33],
  [241, 15, 19],
  [1348, 15, 6],
  [1357, 15, 23],
  [1383, 15, 20],
  [1404, 15, 3],
  [1413, 15, 31],
  [1446, 15, 13],
  [1465, 15, 14],
  [1486, 15, 50],
  [0, 16, 4],
  [6, 16, 59],
  [71, 16, 13],
  [94, 16, 4],
  [132, 16, 36],
  [189, 16, 13],
  [207, 16, 34],
  [243, 16, 19],
  [1348, 16, 32],
  [1382, 16, 20],
  [1412, 16, 33],
  [1446, 16, 14],
  [1465, 16, 13],
  [1486, 16, 41],
  [1529, 16, 6],
  [6, 17, 20],
  [28, 17, 38],
  [72, 17, 5],
  [78, 17, 6],
  [94, 17, 4],
  [133, 17, 35],
  [189, 17, 1],
  [191, 17, 10],
  [206, 17, 35],
  [247, 17, 16],
  [1348, 17, 57],
  [1412, 17, 48],
  [1465, 17, 13],
  [1486, 17, 41],
  [1530, 17, 6],
  [7, 18, 19],
  [31, 18, 2],
  [34, 18, 32],
  [73, 18, 3],
  [78, 18, 6],
  [93, 18, 5],
  [121, 18, 3],
  [127, 18, 4],
  [132, 18, 38],
  [189, 18, 1],
  [192, 18, 8],
  [206, 18, 35],
  [247, 18, 5],
  [253, 18, 10],
  [1348, 18, 58],
  [1412, 18, 48],
  [1465, 18, 16],
  [1486, 18, 41],
  [1530, 18, 6],
  [8, 19, 18],
  [34, 19, 33],
  [79, 19, 4],
  [93, 19, 4],
  [120, 19, 51],
  [189, 19, 1],
  [192, 19, 8],
  [206, 19, 34],
  [248, 19, 3],
  [254, 19, 8],
  [1346, 19, 59],
  [1411, 19, 49],
  [1466, 19, 17],
  [1484, 19, 1],
  [1486, 19, 11],
  [1499, 19, 28],
  [1531, 19, 5],
  [10, 20, 16],
  [34, 20, 33],
  [92, 20, 5],
  [119, 20, 53],
  [192, 20, 6],
  [207, 20, 14],
  [226, 20, 15],
  [255, 20, 3],
  [1345, 20, 59],
  [1410, 20, 50],
  [1466, 20, 32],
  [1501, 20, 26],
  [1532, 20, 4],
  [8, 21, 18],
  [34, 21, 34],
  [92, 21, 5],
  [104, 21, 2],
  [116, 21, 17],
  [134, 21, 40],
  [192, 21, 5],
  [208, 21, 13],
  [226, 21, 16],
  [1344, 21, 58],
  [1409, 21, 53],
  [1467, 21, 30],
  [1504, 21, 23],
  [1532, 21, 4],
  [14, 22, 11],
  [29, 22, 2],
  [34, 22, 34],
  [92, 22, 5],
  [103, 22, 4],
  [116, 22, 15],
  [135, 22, 40],
  [193, 22, 2],
  [207, 22, 14],
  [226, 22, 17],
  [1342, 22, 59],
  [1409, 22, 54],
  [1468, 22, 28],
  [1505, 22, 15],
  [1523, 22, 4],
  [15, 23, 9],
  [28, 23, 4],
  [35, 23, 11],
  [48, 23, 20],
  [91, 23, 6],
  [102, 23, 6],
  [116, 23, 15],
  [140, 23, 34],
  [207, 23, 14],
  [226, 23, 18],
  [1342, 23, 58],
  [1410, 23, 54],
  [1467, 23, 2],
  [1470, 23, 12],
  [1485, 23, 10],
  [1505, 23, 10],
  [1516, 23, 3],
  [16, 24, 6],
  [27, 24, 5],
  [36, 24, 10],
  [50, 24, 17],
  [91, 24, 5],
  [100, 24, 10],
  [115, 24, 16],
  [139, 24, 35],
  [208, 24, 13],
  [226, 24, 18],
  [1342, 24, 58],
  [1415, 24, 49],
  [1468, 24, 1],
  [1475, 24, 4],
  [1487, 24, 4],
  [1494, 24, 1],
  [1505, 24, 8],
  [27, 25, 4],
  [36, 25, 10],
  [53, 25, 19],
  [91, 25, 5],
  [100, 25, 12],
  [115, 25, 16],
  [139, 25, 36],
  [208, 25, 12],
  [226, 25, 18],
  [1343, 25, 16],
  [1360, 25, 39],
  [1415, 25, 49],
  [1468, 25, 2],
  [1506, 25, 2],
  [0, 26, 3],
  [27, 26, 4],
  [37, 26, 9],
  [55, 26, 18],
  [90, 26, 5],
  [99, 26, 14],
  [115, 26, 16],
  [139, 26, 37],
  [209, 26, 10],
  [227, 26, 16],
  [1349, 26, 9],
  [1360, 26, 39],
  [1415, 26, 49],
  [1469, 26, 1],
  [1494, 26, 1],
  [1502, 26, 7],
  [1535, 26, 1],
  [0, 27, 7],
  [27, 27, 4],
  [37, 27, 8],
  [54, 27, 20],
  [90, 27, 5],
  [99, 27, 31],
  [139, 27, 37],
  [213, 27, 5],
  [228, 27, 1],
  [230, 27, 14],
  [1350, 27, 1],
  [1360, 27, 38],
  [1414, 27, 50],
  [1471, 27, 3],
  [1494, 27, 1],
  [1500, 27, 9],
  [1533, 27, 3],
  [0, 28, 9],
  [26, 28, 4],
  [37, 28, 8],
  [52, 28, 25],
  [89, 28, 5],
  [99, 28, 31],
  [139, 28, 37],
  [213, 28, 5],
  [230, 28, 15],
  [1360, 28, 38],
  [1410, 28, 1],
  [1413, 28, 51],
  [1471, 28, 4],
  [1494, 28, 1],
  [1499, 28, 10],
  [1532, 28, 4],
  [0, 29, 9],
  [26, 29, 3],
  [38, 29, 6],
  [51, 29, 29],
  [89, 29, 5],
  [100, 29, 32],
  [139, 29, 20],
  [161, 29, 13],
  [214, 29, 4],
  [231, 29, 14],
  [1356, 29, 1],
  [1360, 29, 39],
  [1409, 29, 55],
  [1472, 29, 4],
  [1494, 29, 1],
  [1498, 29, 11],
  [1532, 29, 4],
  [0, 30, 9],
  [25, 30, 3],
  [48, 30, 31],
  [88, 30, 5],
  [99, 30, 36],
  [138, 30, 20],
  [166, 30, 8],
  [214, 30, 3],
  [232, 30, 12],
  [1355, 30, 44],
  [1407, 30, 38],
  [1448, 30, 16],
  [1472, 30, 5],
  [1493, 30, 2],
  [1497, 30, 12],
  [1532, 30, 4],
  [0, 31, 9],
  [15, 31, 1],
  [25, 31, 3],
  [47, 31, 29],
  [88, 31, 5],
  [99, 31, 28],
  [132, 31, 3],
  [138, 31, 19],
  [166, 31, 8],
  [215, 31, 1],
  [232, 31, 11],
  [1356, 31, 43],
  [1404, 31, 39],
  [1448, 31, 16],
  [1473, 31, 5],
  [1493, 31, 2],
  [1497, 31, 12],
  [1532, 31, 4],
  [0, 32, 10],
  [14, 32, 2],
  [24, 32, 4],
  [47, 32, 29],
  [87, 32, 5],
  [99, 32, 30],
  [133, 32, 2],
  [139, 32, 18],
  [166, 32, 9],
  [235, 32, 8],
  [1357, 32, 42],
  [1404, 32, 38],
  [1448, 32, 17],
  [1474, 32, 5],
  [1493, 32, 3],
  [1497, 32, 12],
  [1531, 32, 5],
  [0, 33, 10],
  [14, 33, 2],
  [24, 33, 4],
  [47, 33, 30],
  [87, 33, 5],
  [99, 33, 29],
  [140, 33, 16],
  [167, 33, 7],
  [236, 33, 7],
  [1353, 33, 1],
  [1356, 33, 43],
  [1405, 33, 37],
  [1448, 33, 16],
  [1474, 33, 13],
  [1493, 33, 15],
  [1528, 33, 8],
  [0, 34, 10],
  [13, 34, 2],
  [23, 34, 5],
  [46, 34, 32],
  [86, 34, 5],
  [100, 34, 27],
  [141, 34, 15],
  [171, 34, 2],
  [239, 34, 4],
  [1351, 34, 48],
  [1407, 34, 35],
  [1447, 34, 15],
  [1475, 34, 16],
  [1493, 34, 15],
  [1527, 34, 9],
  [0, 35, 11],
  [12, 35, 3],
  [22, 35, 6],
  [46, 35, 32],
  [86, 35, 5],
  [99, 35, 12],
  [112, 35, 15],
  [142, 35, 14],
  [171, 35, 2],
  [239, 35, 4],
  [1347, 35, 2],
  [1351, 35, 34],
  [1388, 35, 10],
  [1408, 35, 24],
  [1434, 35, 7],
  [1446, 35, 15],
  [1476, 35, 15],
  [1492, 35, 14],
  [1527, 35, 9],
  [0, 36, 15],
  [21, 36, 2],
  [24, 36, 4],
  [46, 36, 33],
  [85, 36, 6],
  [99, 36, 26],
  [138, 36, 19],
  [241, 36, 1],
  [1346, 36, 37],
  [1388, 36, 10],
  [1408, 36, 23],
  [1434, 36, 7],
  [1446, 36, 14],
  [1467, 36, 3],
  [1476, 36, 30],
  [1529, 36, 7],
  [0, 37, 15],
  [21, 37, 2],
  [24, 37, 3],
  [46, 37, 33],
  [85, 37, 5],
  [100, 37, 24],
  [136, 37, 23],
  [163, 37, 6],
  [1346, 37, 38],
  [1389, 37, 8],
  [1408, 37, 23],
  [1435, 37, 6],
  [1446, 37, 10],
  [1461, 37, 12],
  [1477, 37, 28],
  [1507, 37, 8],
  [1529, 37, 7],
  [0, 38, 14],
  [20, 38, 3],
  [24, 38, 3],
  [34, 38, 5],
  [46, 38, 33],
  [84, 38, 6],
  [100, 38, 24],
  [134, 38, 36],
  [1343, 38, 42],
  [1389, 38, 7],
  [1406, 38, 24],
  [1435, 38, 6],
  [1446, 38, 8],
  [1461, 38, 14],
  [1477, 38, 39],
  [1528, 38, 8],
  [0, 39, 14],
  [20, 39, 3],
  [24, 39, 3],
  [29, 39, 10],
  [46, 39, 14],
  [64, 39, 15],
  [84, 39, 6],
  [98, 39, 26],
  [134, 39, 38],
  [179, 39, 3],
  [184, 39, 4],
  [1342, 39, 43],
  [1389, 39, 6],
  [1406, 39, 23],
  [1435, 39, 6],
  [1446, 39, 7],
  [1461, 39, 55],
  [1528, 39, 8],
  [0, 40, 14],
  [20, 40, 19],
  [46, 40, 14],
  [66, 40, 13],
  [84, 40, 6],
  [93, 40, 31],
  [134, 40, 38],
  [178, 40, 11],
  [1342, 40, 43],
  [1390, 40, 5],
  [1406, 40, 15],
  [1422, 40, 6],
  [1435, 40, 6],
  [1446, 40, 7],
  [1462, 40, 55],
  [1529, 40, 7],
  [0, 41, 14],
  [19, 41, 20],
  [46, 41, 13],
  [66, 41, 14],
  [83, 41, 23],
  [107, 41, 17],
  [134, 41, 39],
  [178, 41, 15],
  [1344, 41, 25],
  [1372, 41, 14],
  [1390, 41, 5],
  [1406, 41, 15],
  [1422, 41, 5],
  [1432, 41, 9],
  [1447, 41, 6],
  [1463, 41, 54],
  [1529, 41, 7],
  [0, 42, 15],
  [18, 42, 22],
  [46, 42, 13],
  [67, 42, 37],
  [106, 42, 18],
  [134, 42, 39],
  [177, 42, 16],
  [1346, 42, 23],
  [1372, 42, 14],
  [1391, 42, 4],
  [1406, 42, 12],
  [1430, 42, 10],
  [1448, 42, 5],
  [1463, 42, 54],
  [1529, 42, 7],
  [0, 43, 15],
  [18, 43, 23],
  [46, 43, 12],
  [67, 43, 33],
  [105, 43, 20],
  [134, 43, 10],
  [146, 43, 27],
  [176, 43, 16],
  [1345, 43, 24],
  [1373, 43, 14],
  [1392, 43, 3],
  [1406, 43, 12],
  [1429, 43, 10],
  [1450, 43, 3],
  [1464, 43, 53],
  [1529, 43, 6],
  [0, 44, 16],
  [17, 44, 28],
  [49, 44, 9],
  [67, 44, 31],
  [104, 44, 25],
  [134, 44, 9],
  [146, 44, 27],
  [175, 44, 17],
  [1344, 44, 25],
  [1373, 44, 14],
  [1406, 44, 10],
  [1428, 44, 12],
  [1451, 44, 2],
  [1464, 44, 53],
  [1530, 44, 5],
  [0, 45, 16],
  [17, 45, 28],
  [50, 45, 7],
  [67, 45, 26],
  [103, 45, 28],
  [134, 45, 9],
  [147, 45, 45],
  [1343, 45, 25],
  [1374, 45, 12],
  [1405, 45, 9],
  [1427, 45, 12],
  [1452, 45, 1],
  [1465, 45, 52],
  [1530, 45, 4],
  [0, 46, 44],
  [50, 46, 7],
  [67, 46, 22],
  [103, 46, 29],
  [134, 46, 9],
  [147, 46, 43],
  [1342, 46, 26],
  [1373, 46, 13],
  [1405, 46, 8],
  [1427, 46, 13],
  [1467, 46, 49],
  [0, 47, 43],
  [50, 47, 6],
  [67, 47, 19],
  [103, 47, 30],
  [134, 47, 10],
  [147, 47, 41],
  [1342, 47, 15],
  [1359, 47, 9],
  [1373, 47, 13],
  [1405, 47, 4],
  [1428, 47, 11],
  [1466, 47, 50],
  [0, 48, 41],
  [50, 48, 2],
  [66, 48, 15],
  [102, 48, 31],
  [134, 48, 10],
  [147, 48, 10],
  [158, 48, 28],
  [1341, 48, 16],
  [1359, 48, 8],
  [1373, 48, 13],
  [1405, 48, 3],
  [1429, 48, 8],
  [1460, 48, 1],
  [1464, 48, 52],
  [0, 49, 38],
  [64, 49, 14],
  [102, 49, 42],
  [148, 49, 8],
  [157, 49, 35],
  [1342, 49, 14],
  [1359, 49, 7],
  [1373, 49, 13],
  [1406, 49, 1],
  [1431, 49, 4],
  [1458, 49, 59],
  [0, 50, 4],
  [5, 50, 32],
  [56, 50, 20],
  [96, 50, 48],
  [148, 50, 5],
  [156, 50, 40],
  [1342, 50, 13],
  [1360, 50, 5],
  [1373, 50, 13],
  [1432, 50, 3],
  [1454, 50, 65],
  [1528, 50, 1],
  [0, 51, 4],
  [5, 51, 69],
  [95, 51, 49],
  [156, 51, 40],
  [1341, 51, 13],
  [1360, 51, 4],
  [1373, 51, 12],
  [1453, 51, 67],
  [1525, 51, 6],
  [0, 52, 4],
  [5, 52, 68],
  [95, 52, 48],
  [155, 52, 41],
  [1340, 52, 13],
  [1360, 52, 4],
  [1373, 52, 12],
  [1453, 52, 68],
  [1525, 52, 9],
  [5, 53, 16],
  [22, 53, 50],
  [80, 53, 6],
  [94, 53, 47],
  [154, 53, 43],
  [1340, 53, 12],
  [1361, 53, 2],
  [1373, 53, 11],
  [1453, 53, 69],
  [1525, 53, 10],
  [6, 54, 14],
  [22, 54, 44],
  [67, 54, 3],
  [79, 54, 8],
  [94, 54, 43],
  [154, 54, 45],
  [1341, 54, 7],
  [1375, 54, 8],
  [1454, 54, 69],
  [1526, 54, 9],
  [6, 55, 14],
  [27, 55, 2],
  [37, 55, 2],
  [40, 55, 22],
  [63, 55, 1],
  [77, 55, 10],
  [94, 55, 41],
  [153, 55, 47],
  [1375, 55, 6],
  [1453, 55, 70],
  [1528, 55, 7],
  [4, 56, 16],
  [38, 56, 22],
  [75, 56, 13],
  [93, 56, 43],
  [153, 56, 47],
  [1376, 56, 4],
  [1453, 56, 70],
  [1529, 56, 7],
  [4, 57, 14],
  [44, 57, 16],
  [74, 57, 13],
  [93, 57, 45],
  [152, 57, 48],
  [1376, 57, 3],
  [1452, 57, 71],
  [3, 58, 14],
  [52, 58, 8],
  [74, 58, 13],
  [93, 58, 47],
  [152, 58, 48],
  [1452, 58, 19],
  [1473, 58, 50],
  [2, 59, 14],
  [56, 59, 3],
  [74, 59, 8],
  [93, 59, 12],
  [106, 59, 37],
  [152, 59, 32],
  [185, 59, 15],
  [1452, 59, 18],
  [1473, 59, 49],
  [1534, 59, 2],
  [1, 60, 14],
  [93, 60, 10],
  [104, 60, 39],
  [152, 60, 18],
  [171, 60, 13],
  [187, 60, 14],
  [1451, 60, 19],
  [1473, 60, 36],
  [1512, 60, 1],
  [1514, 60, 1],
  [1517, 60, 3],
  [1530, 60, 6],
  [0, 61, 14],
  [21, 61, 2],
  [93, 61, 9],
  [106, 61, 36],
  [151, 61, 17],
  [171, 61, 13],
  [188, 61, 13],
  [1450, 61, 14],
  [1465, 61, 4],
  [1473, 61, 36],
  [1530, 61, 6],
  [0, 62, 12],
  [20, 62, 4],
  [41, 62, 4],
  [94, 62, 8],
  [105, 62, 14],
  [123, 62, 20],
  [151, 62, 16],
  [171, 62, 13],
  [189, 62, 12],
  [1450, 62, 14],
  [1466, 62, 3],
  [1473, 62, 36],
  [1530, 62, 6],
  [0, 63, 10],
  [19, 63, 8],
  [40, 63, 5],
  [47, 63, 5],
  [97, 63, 4],
  [105, 63, 14],
  [123, 63, 21],
  [151, 63, 16],
  [171, 63, 15],
  [1449, 63, 14],
  [1473, 63, 37],
  [1531, 63, 5],
  [0, 64, 6],
  [19, 64, 9],
  [38, 64, 14],
  [105, 64, 14],
  [122, 64, 23],
  [151, 64, 6],
  [158, 64, 10],
  [172, 64, 15],
  [1449, 64, 13],
  [1469, 64, 2],
  [1473, 64, 38],
  [1512, 64, 1],
  [1529, 64, 2],
  [1532, 64, 4],
  [0, 65, 6],
  [14, 65, 2],
  [19, 65, 9],
  [37, 65, 15],
  [105, 65, 13],
  [122, 65, 22],
  [152, 65, 4],
  [158, 65, 10],
  [172, 65, 15],
  [1449, 65, 12],
  [1468, 65, 3],
  [1473, 65, 42],
  [1518, 65, 2],
  [1522, 65, 1],
  [1528, 65, 7],
  [0, 66, 5],
  [13, 66, 15],
  [37, 66, 15],
  [104, 66, 13],
  [122, 66, 12],
  [135, 66, 9],
  [152, 66, 1],
  [158, 66, 9],
  [173, 66, 14],
  [1409, 66, 1],
  [1432, 66, 3],
  [1450, 66, 2],
  [1456, 66, 5],
  [1468, 66, 4],
  [1473, 66, 43],
  [1519, 66, 5],
  [1525, 66, 9],
  [0, 67, 4],
  [13, 67, 16],
  [36, 67, 16],
  [95, 67, 3],
  [104, 67, 12],
  [122, 67, 12],
  [137, 67, 7],
  [158, 67, 8],
  [173, 67, 13],
  [1407, 67, 8],
  [1417, 67, 1],
  [1420, 67, 3],
  [1431, 67, 5],
  [1459, 67, 1],
  [1468, 67, 49],
  [1519, 67, 15],
  [0, 68, 9],
  [13, 68, 18],
  [36, 68, 20],
  [104, 68, 11],
  [122, 68, 13],
  [141, 68, 3],
  [159, 68, 5],
  [173, 68, 13],
  [1407, 68, 12],
  [1420, 68, 3],
  [1430, 68, 7],
  [1438, 68, 2],
  [1468, 68, 49],
  [1519, 68, 7],
  [1528, 68, 6],
  [0, 69, 10],
  [14, 69, 17],
  [35, 69, 21],
  [104, 69, 11],
  [121, 69, 14],
  [143, 69, 1],
  [159, 69, 5],
  [173, 69, 13],
  [1407, 69, 17],
  [1430, 69, 11],
  [1468, 69, 20],
  [1489, 69, 28],
  [1519, 69, 6],
  [1528, 69, 1],
  [1530, 69, 4],
  [0, 70, 11],
  [13, 70, 18],
  [34, 70, 22],
  [104, 70, 11],
  [120, 70, 15],
  [160, 70, 4],
  [174, 70, 12],
  [1407, 70, 18],
  [1429, 70, 12],
  [1468, 70, 20],
  [1489, 70, 28],
  [1519, 70, 1],
  [1522, 70, 5],
  [1531, 70, 2],
  [0, 71, 12],
  [13, 71, 18],
  [33, 71, 22],
  [104, 71, 10],
  [120, 71, 15],
  [160, 71, 4],
  [177, 71, 8],
  [1409, 71, 17],
  [1428, 71, 14],
  [1467, 71, 21],
  [1489, 71, 15],
  [1507, 71, 9],
  [1523, 71, 2],
  [1526, 71, 1],
  [1528, 71, 2],
  [1534, 71, 2],
  [0, 72, 12],
  [14, 72, 41],
  [70, 72, 2],
  [105, 72, 9],
  [120, 72, 16],
  [161, 72, 2],
  [177, 72, 9],
  [1411, 72, 15],
  [1428, 72, 14],
  [1467, 72, 21],
  [1489, 72, 15],
  [1508, 72, 2],
  [1512, 72, 4],
  [1524, 72, 1],
  [1528, 72, 2],
  [1535, 72, 1],
  [0, 73, 12],
  [14, 73, 37],
  [69, 73, 3],
  [105, 73, 8],
  [121, 73, 16],
  [178, 73, 8],
  [1410, 73, 17],
  [1428, 73, 14],
  [1466, 73, 22],
  [1489, 73, 15],
  [1510, 73, 9],
  [1520, 73, 1],
  [1535, 73, 1],
  [0, 74, 51],
  [68, 74, 6],
  [106, 74, 7],
  [122, 74, 2],
  [125, 74, 11],
  [181, 74, 5],
  [1409, 74, 33],
  [1465, 74, 23],
  [1490, 74, 12],
  [1505, 74, 1],
  [1510, 74, 8],
  [1521, 74, 1],
  [1523, 74, 4],
  [0, 75, 51],
  [68, 75, 7],
  [106, 75, 6],
  [125, 75, 10],
  [183, 75, 2],
  [1409, 75, 33],
  [1464, 75, 26],
  [1492, 75, 9],
  [1510, 75, 8],
  [1522, 75, 8],
  [0, 76, 48],
  [68, 76, 7],
  [81, 76, 2],
  [84, 76, 4],
  [107, 76, 4],
  [126, 76, 9],
  [1414, 76, 28],
  [1464, 76, 36],
  [1504, 76, 1],
  [1509, 76, 10],
  [1522, 76, 11],
  [0, 77, 53],
  [65, 77, 10],
  [80, 77, 12],
  [108, 77, 2],
  [128, 77, 7],
  [1413, 77, 29],
  [1464, 77, 34],
  [1503, 77, 2],
  [1509, 77, 10],
  [1522, 77, 14],
  [0, 78, 55],
  [65, 78, 10],
  [80, 78, 12],
  [108, 78, 1],
  [129, 78, 6],
  [1402, 78, 3],
  [1412, 78, 30],
  [1463, 78, 34],
  [1503, 78, 2],
  [1509, 78, 10],
  [1522, 78, 14],
  [0, 79, 56],
  [64, 79, 11],
  [80, 79, 11],
  [129, 79, 5],
  [1399, 79, 7],
  [1412, 79, 30],
  [1449, 79, 8],
  [1463, 79, 28],
  [1493, 79, 3],
  [1509, 79, 6],
  [1517, 79, 2],
  [1523, 79, 13],
  [0, 80, 59],
  [64, 80, 11],
  [76, 80, 15],
  [130, 80, 4],
  [1399, 80, 7],
  [1413, 80, 29],
  [1445, 80, 13],
  [1462, 80, 30],
  [1509, 80, 4],
  [1514, 80, 1],
  [1517, 80, 2],
  [1523, 80, 13],
  [0, 81, 60],
  [64, 81, 26],
  [131, 81, 2],
  [1394, 81, 2],
  [1399, 81, 8],
  [1416, 81, 26],
  [1444, 81, 15],
  [1462, 81, 30],
  [1494, 81, 1],
  [1512, 81, 1],
  [1517, 81, 1],
  [1524, 81, 12],
  [0, 82, 59],
  [63, 82, 26],
  [1393, 82, 5],
  [1399, 82, 11],
  [1414, 82, 45],
  [1463, 82, 35],
  [1501, 82, 2],
  [1512, 82, 1],
  [1517, 82, 1],
  [1524, 82, 12],
  [0, 83, 59],
  [63, 83, 26],
  [1392, 83, 68],
  [1464, 83, 35],
  [1502, 83, 1],
  [1508, 83, 1],
  [1516, 83, 1],
  [1525, 83, 11],
  [0, 84, 60],
  [63, 84, 26],
  [1391, 84, 69],
  [1464, 84, 35],
  [1500, 84, 3],
  [1508, 84, 1],
  [1525, 84, 11],
  [0, 85, 62],
  [63, 85, 26],
  [1391, 85, 69],
  [1465, 85, 16],
  [1484, 85, 14],
  [1500, 85, 3],
  [1508, 85, 1],
  [1526, 85, 10],
  [0, 86, 85],
  [1390, 86, 70],
  [1465, 86, 18],
  [1485, 86, 13],
  [1501, 86, 2],
  [1520, 86, 2],
  [1526, 86, 10],
  [0, 87, 85],
  [1388, 87, 73],
  [1465, 87, 10],
  [1479, 87, 6],
  [1486, 87, 12],
  [1502, 87, 1],
  [1507, 87, 1],
  [1518, 87, 5],
  [1526, 87, 10],
  [0, 88, 85],
  [1387, 88, 73],
  [1461, 88, 1],
  [1465, 88, 8],
  [1478, 88, 21],
  [1507, 88, 1],
  [1513, 88, 23],
  [0, 89, 85],
  [87, 89, 7],
  [1387, 89, 73],
  [1466, 89, 6],
  [1484, 89, 4],
  [1489, 89, 10],
  [1507, 89, 1],
  [1513, 89, 23],
  [0, 90, 96],
  [1389, 90, 71],
  [1467, 90, 4],
  [1486, 90, 2],
  [1489, 90, 10],
  [1512, 90, 18],
  [1531, 90, 5],
  [0, 91, 50],
  [51, 91, 46],
  [1390, 91, 1],
  [1393, 91, 67],
  [1464, 91, 9],
  [1477, 91, 1],
  [1487, 91, 12],
  [1512, 91, 18],
  [1532, 91, 4],
  [0, 92, 14],
  [15, 92, 82],
  [1394, 92, 79],
  [1477, 92, 1],
  [1487, 92, 13],
  [1512, 92, 19],
  [1532, 92, 4],
  [0, 93, 14],
  [16, 93, 3],
  [20, 93, 77],
  [1394, 93, 79],
  [1486, 93, 15],
  [1513, 93, 18],
  [1532, 93, 4],
  [0, 94, 1],
  [2, 94, 12],
  [16, 94, 81],
  [1395, 94, 8],
  [1406, 94, 66],
  [1485, 94, 18],
  [1513, 94, 23],
  [3, 95, 11],
  [18, 95, 80],
  [1403, 95, 34],
  [1438, 95, 32],
  [1484, 95, 21],
  [1513, 95, 23],
  [3, 96, 11],
  [16, 96, 84],
  [1403, 96, 34],
  [1438, 96, 29],
  [1483, 96, 23],
  [1508, 96, 4],
  [1513, 96, 23],
  [4, 97, 96],
  [1403, 97, 50],
  [1454, 97, 3],
  [1458, 97, 4],
  [1483, 97, 24],
  [1508, 97, 28],
  [5, 98, 95],
  [1403, 98, 50],
  [1454, 98, 1],
  [1459, 98, 2],
  [1465, 98, 3],
  [1470, 98, 4],
  [1483, 98, 16],
  [1502, 98, 34],
  [5, 99, 95],
  [1401, 99, 49],
  [1454, 99, 1],
  [1459, 99, 10],
  [1470, 99, 6],
  [1483, 99, 16],
  [1503, 99, 33],
  [7, 100, 76],
  [84, 100, 17],
  [1399, 100, 50],
  [1451, 100, 27],
  [1483, 100, 16],
  [1505, 100, 31],
  [6, 101, 77],
  [85, 101, 17],
  [1399, 101, 50],
  [1451, 101, 24],
  [1476, 101, 3],
  [1483, 101, 5],
  [1489, 101, 10],
  [1506, 101, 2],
  [1509, 101, 27],
  [2, 102, 38],
  [41, 102, 43],
  [86, 102, 16],
  [1399, 102, 48],
  [1450, 102, 2],
  [1453, 102, 26],
  [1483, 102, 2],
  [1489, 102, 9],
  [1508, 102, 28],
  [1, 103, 2],
  [4, 103, 80],
  [90, 103, 12],
  [1388, 103, 5],
  [1399, 103, 47],
  [1453, 103, 27],
  [1488, 103, 10],
  [1508, 103, 28],
  [0, 104, 69],
  [70, 104, 14],
  [90, 104, 12],
  [1387, 104, 8],
  [1399, 104, 46],
  [1453, 104, 27],
  [1488, 104, 9],
  [1507, 104, 29],
  [0, 105, 69],
  [70, 105, 15],
  [91, 105, 4],
  [1387, 105, 9],
  [1399, 105, 42],
  [1443, 105, 2],
  [1452, 105, 28],
  [1488, 105, 8],
  [1507, 105, 29],
  [0, 106, 68],
  [71, 106, 14],
  [1381, 106, 5],
  [1387, 106, 10],
  [1399, 106, 42],
  [1443, 106, 2],
  [1452, 106, 28],
  [1488, 106, 6],
  [1507, 106, 29],
  [0, 107, 65],
  [72, 107, 13],
  [1381, 107, 59],
  [1443, 107, 1],
  [1452, 107, 28],
  [1488, 107, 4],
  [1507, 107, 29],
  [0, 108, 34],
  [35, 108, 32],
  [73, 108, 12],
  [1381, 108, 56],
  [1451, 108, 30],
  [1488, 108, 3],
  [1506, 108, 30],
  [0, 109, 23],
  [24, 109, 10],
  [38, 109, 30],
  [74, 109, 11],
  [1380, 109, 47],
  [1430, 109, 7],
  [1451, 109, 14],
  [1466, 109, 15],
  [1505, 109, 31],
  [0, 110, 5],
  [6, 110, 17],
  [24, 110, 10],
  [37, 110, 32],
  [75, 110, 10],
  [1378, 110, 48],
  [1434, 110, 6],
  [1448, 110, 17],
  [1467, 110, 14],
  [1505, 110, 31],
  [0, 111, 4],
  [5, 111, 14],
  [20, 111, 2],
  [24, 111, 1],
  [26, 111, 1],
  [30, 111, 2],
  [33, 111, 1],
  [36, 111, 34],
  [76, 111, 9],
  [1378, 111, 48],
  [1428, 111, 4],
  [1447, 111, 18],
  [1467, 111, 14],
  [1505, 111, 31],
  [0, 112, 8],
  [9, 112, 5],
  [16, 112, 5],
  [31, 112, 2],
  [35, 112, 35],
  [77, 112, 7],
  [1377, 112, 49],
  [1428, 112, 4],
  [1447, 112, 18],
  [1468, 112, 13],
  [1503, 112, 31],
  [0, 113, 8],
  [10, 113, 3],
  [16, 113, 5],
  [32, 113, 1],
  [35, 113, 36],
  [79, 113, 5],
  [1375, 113, 52],
  [1428, 113, 5],
  [1446, 113, 19],
  [1468, 113, 13],
  [1503, 113, 31],
  [0, 114, 1],
  [2, 114, 5],
  [11, 114, 1],
  [16, 114, 6],
  [34, 114, 37],
  [80, 114, 4],
  [1374, 114, 53],
  [1429, 114, 4],
  [1446, 114, 19],
  [1468, 114, 14],
  [1503, 114, 30],
  [0, 115, 3],
  [4, 115, 3],
  [10, 115, 2],
  [16, 115, 6],
  [33, 115, 39],
  [81, 115, 2],
  [1375, 115, 52],
  [1429, 115, 4],
  [1435, 115, 2],
  [1446, 115, 19],
  [1469, 115, 10],
  [1480, 115, 2],
  [1503, 115, 30],
  [0, 116, 3],
  [4, 116, 1],
  [6, 116, 1],
  [10, 116, 1],
  [15, 116, 7],
  [32, 116, 40],
  [1378, 116, 55],
  [1436, 116, 2],
  [1447, 116, 18],
  [1469, 116, 12],
  [1502, 116, 14],
  [1519, 116, 2],
  [1522, 116, 12],
  [0, 117, 1],
  [9, 117, 1],
  [15, 117, 7],
  [32, 117, 41],
  [1379, 117, 54],
  [1436, 117, 2],
  [1439, 117, 2],
  [1448, 117, 17],
  [1472, 117, 6],
  [1501, 117, 14],
  [1523, 117, 11],
  [1535, 117, 1],
  [0, 118, 2],
  [8, 118, 1],
  [15, 118, 7],
  [32, 118, 27],
  [60, 118, 13],
  [1379, 118, 11],
  [1394, 118, 47],
  [1442, 118, 1],
  [1450, 118, 15],
  [1473, 118, 5],
  [1501, 118, 11],
  [1524, 118, 4],
  [1530, 118, 6],
  [8, 119, 1],
  [15, 119, 6],
  [32, 119, 27],
  [60, 119, 13],
  [1379, 119, 10],
  [1394, 119, 50],
  [1450, 119, 14],
  [1476, 119, 3],
  [1502, 119, 5],
  [1525, 119, 2],
  [1530, 119, 6],
  [1, 120, 1],
  [3, 120, 1],
  [15, 120, 6],
  [31, 120, 28],
  [61, 120, 12],
  [1394, 120, 50],
  [1450, 120, 14],
  [1477, 120, 2],
  [1530, 120, 3],
  [15, 121, 5],
  [31, 121, 3],
  [37, 121, 22],
  [62, 121, 11],
  [99, 121, 1],
  [1391, 121, 54],
  [1450, 121, 13],
  [16, 122, 4],
  [30, 122, 4],
  [38, 122, 21],
  [65, 122, 2],
  [69, 122, 4],
  [96, 122, 4],
  [108, 122, 2],
  [112, 122, 2],
  [1391, 122, 54],
  [1450, 122, 13],
  [1526, 122, 1],
  [16, 123, 4],
  [30, 123, 4],
  [37, 123, 4],
  [42, 123, 18],
  [70, 123, 2],
  [95, 123, 5],
  [107, 123, 8],
  [1391, 123, 54],
  [1451, 123, 12],
  [1525, 123, 2],
  [17, 124, 2],
  [29, 124, 4],
  [38, 124, 2],
  [43, 124, 17],
  [95, 124, 6],
  [103, 124, 12],
  [1391, 124, 55],
  [1452, 124, 9],
  [1524, 124, 2],
  [5, 125, 3],
  [28, 125, 4],
  [44, 125, 3],
  [49, 125, 11],
  [93, 125, 8],
  [102, 125, 13],
  [1391, 125, 55],
  [1452, 125, 8],
  [1523, 125, 4],
  [4, 126, 5],
  [27, 126, 5],
  [44, 126, 3],
  [49, 126, 11],
  [81, 126, 3],
  [92, 126, 22],
  [1389, 126, 57],
  [1453, 126, 5],
  [1522, 126, 7],
  [4, 127, 5],
  [26, 127, 5],
  [38, 127, 21],
  [78, 127, 7],
  [92, 127, 22],
  [1387, 127, 40],
  [1429, 127, 18],
  [1454, 127, 2],
  [1520, 127, 13],
  [0, 128, 9],
  [25, 128, 6],
  [35, 128, 1],
  [39, 128, 12],
  [54, 128, 5],
  [77, 128, 9],
  [92, 128, 21],
  [1387, 128, 40],
  [1430, 128, 17],
  [1518, 128, 16],
  [0, 129, 12],
  [24, 129, 6],
  [39, 129, 11],
  [56, 129, 4],
  [76, 129, 12],
  [93, 129, 19],
  [1387, 129, 41],
  [1431, 129, 15],
  [1479, 129, 3],
  [1484, 129, 1],
  [1518, 129, 16],
  [0, 130, 14],
  [22, 130, 8],
  [39, 130, 10],
  [57, 130, 2],
  [76, 130, 12],
  [93, 130, 19],
  [1380, 130, 2],
  [1388, 130, 40],
  [1433, 130, 12],
  [1479, 130, 7],
  [1488, 130, 2],
  [1517, 130, 17],
  [0, 131, 14],
  [21, 131, 8],
  [37, 131, 12],
  [57, 131, 2],
  [75, 131, 13],
  [93, 131, 17],
  [1379, 131, 7],
  [1388, 131, 17],
  [1406, 131, 23],
  [1435, 131, 10],
  [1479, 131, 11],
  [1492, 131, 3],
  [1517, 131, 17],
  [0, 132, 13],
  [21, 132, 8],
  [37, 132, 11],
  [74, 132, 14],
  [93, 132, 16],
  [1379, 132, 23],
  [1404, 132, 1],
  [1406, 132, 13],
  [1420, 132, 10],
  [1436, 132, 9],
  [1479, 132, 17],
  [1503, 132, 3],
  [1516, 132, 18],
  [0, 133, 12],
  [23, 133, 5],
  [37, 133, 10],
  [74, 133, 14],
  [93, 133, 16],
  [1375, 133, 30],
  [1406, 133, 25],
  [1436, 133, 9],
  [1479, 133, 17],
  [1502, 133, 5],
  [1516, 133, 17],
  [0, 134, 10],
  [23, 134, 5],
  [39, 134, 7],
  [55, 134, 2],
  [66, 134, 3],
  [74, 134, 35],
  [1374, 134, 31],
  [1407, 134, 12],
  [1420, 134, 12],
  [1440, 134, 5],
  [1480, 134, 16],
  [1502, 134, 6],
  [1516, 134, 15],
  [0, 135, 12],
  [22, 135, 6],
  [40, 135, 5],
  [53, 135, 6],
  [66, 135, 3],
  [73, 135, 34],
  [1374, 135, 32],
  [1407, 135, 11],
  [1422, 135, 11],
  [1442, 135, 4],
  [1480, 135, 16],
  [1502, 135, 8],
  [1516, 135, 14],
  [0, 136, 14],
  [22, 136, 5],
  [40, 136, 4],
  [51, 136, 9],
  [65, 136, 6],
  [73, 136, 33],
  [1374, 136, 44],
  [1422, 136, 11],
  [1480, 136, 16],
  [1502, 136, 12],
  [1516, 136, 13],
  [0, 137, 15],
  [22, 137, 5],
  [42, 137, 1],
  [50, 137, 56],
  [113, 137, 5],
  [1372, 137, 35],
  [1409, 137, 8],
  [1422, 137, 11],
  [1466, 137, 1],
  [1481, 137, 15],
  [1500, 137, 18],
  [1520, 137, 8],
  [0, 138, 16],
  [21, 138, 5],
  [49, 138, 71],
  [1371, 138, 36],
  [1410, 138, 4],
  [1421, 138, 12],
  [1461, 138, 7],
  [1481, 138, 16],
  [1499, 138, 19],
  [1521, 138, 6],
  [0, 139, 17],
  [21, 139, 5],
  [49, 139, 73],
  [1371, 139, 36],
  [1410, 139, 4],
  [1420, 139, 13],
  [1461, 139, 11],
  [1481, 139, 16],
  [1498, 139, 20],
  [1522, 139, 3],
  [0, 140, 17],
  [20, 140, 6],
  [48, 140, 75],
  [1369, 140, 38],
  [1410, 140, 4],
  [1419, 140, 14],
  [1462, 140, 10],
  [1482, 140, 36],
  [1522, 140, 2],
  [0, 141, 18],
  [20, 141, 5],
  [48, 141, 74],
  [1369, 141, 39],
  [1410, 141, 3],
  [1419, 141, 15],
  [1462, 141, 10],
  [1483, 141, 36],
  [1523, 141, 1],
  [0, 142, 25],
  [48, 142, 75],
  [1369, 142, 10],
  [1382, 142, 26],
  [1419, 142, 15],
  [1458, 142, 1],
  [1462, 142, 11],
  [1484, 142, 35],
  [0, 143, 18],
  [19, 143, 5],
  [49, 143, 74],
  [1382, 143, 26],
  [1419, 143, 15],
  [1454, 143, 1],
  [1456, 143, 5],
  [1462, 143, 11],
  [1486, 143, 33],
  [1532, 143, 1],
  [1535, 143, 1],
  [0, 144, 18],
  [19, 144, 5],
  [49, 144, 75],
  [1381, 144, 27],
  [1419, 144, 15],
  [1453, 144, 21],
  [1481, 144, 38],
  [1532, 144, 4],
  [0, 145, 23],
  [50, 145, 75],
  [1381, 145, 27],
  [1420, 145, 14],
  [1452, 145, 24],
  [1479, 145, 40],
  [1532, 145, 4],
  [0, 146, 23],
  [51, 146, 43],
  [95, 146, 30],
  [1380, 146, 28],
  [1421, 146, 12],
  [1451, 146, 25],
  [1477, 146, 42],
  [1525, 146, 11],
  [0, 147, 13],
  [17, 147, 6],
  [52, 147, 11],
  [65, 147, 26],
  [94, 147, 31],
  [1378, 147, 30],
  [1422, 147, 11],
  [1451, 147, 69],
  [1523, 147, 13],
  [0, 148, 12],
  [16, 148, 8],
  [55, 148, 8],
  [64, 148, 28],
  [94, 148, 17],
  [112, 148, 14],
  [1378, 148, 30],
  [1423, 148, 10],
  [1448, 148, 88],
  [8, 149, 2],
  [15, 149, 11],
  [54, 149, 7],
  [64, 149, 28],
  [94, 149, 17],
  [113, 149, 14],
  [1379, 149, 12],
  [1396, 149, 13],
  [1423, 149, 10],
  [1447, 149, 89],
  [15, 150, 12],
  [50, 150, 11],
  [62, 150, 30],
  [94, 150, 2],
  [97, 150, 13],
  [114, 150, 13],
  [1379, 150, 12],
  [1396, 150, 12],
  [1425, 150, 7],
  [1447, 150, 87],
  [1535, 150, 1],
  [14, 151, 14],
  [45, 151, 12],
  [59, 151, 33],
  [97, 151, 14],
  [118, 151, 3],
  [123, 151, 4],
  [1378, 151, 13],
  [1396, 151, 12],
  [1426, 151, 5],
  [1448, 151, 86],
  [1535, 151, 1],
  [13, 152, 16],
  [42, 152, 4],
  [60, 152, 32],
  [95, 152, 17],
  [1378, 152, 13],
  [1396, 152, 11],
  [1427, 152, 4],
  [1449, 152, 85],
  [12, 153, 7],
  [22, 153, 7],
  [40, 153, 6],
  [60, 153, 22],
  [83, 153, 8],
  [96, 153, 17],
  [1377, 153, 14],
  [1397, 153, 10],
  [1428, 153, 2],
  [1450, 153, 84],
  [11, 154, 8],
  [23, 154, 6],
  [38, 154, 8],
  [60, 154, 22],
  [84, 154, 7],
  [96, 154, 17],
  [1378, 154, 13],
  [1397, 154, 9],
  [1452, 154, 1],
  [1454, 154, 80],
  [11, 155, 7],
  [23, 155, 6],
  [35, 155, 10],
  [50, 155, 1],
  [59, 155, 23],
  [84, 155, 7],
  [96, 155, 17],
  [1378, 155, 12],
  [1398, 155, 8],
  [1455, 155, 6],
  [1463, 155, 71],
  [10, 156, 8],
  [24, 156, 4],
  [30, 156, 12],
  [50, 156, 5],
  [59, 156, 8],
  [69, 156, 13],
  [85, 156, 6],
  [97, 156, 16],
  [1378, 156, 9],
  [1401, 156, 5],
  [1456, 156, 3],
  [1463, 156, 71],
  [9, 157, 8],
  [22, 157, 16],
  [52, 157, 5],
  [58, 157, 9],
  [69, 157, 22],
  [97, 157, 16],
  [1377, 157, 9],
  [1402, 157, 3],
  [1463, 157, 71],
  [8, 158, 28],
  [48, 158, 18],
  [68, 158, 23],
  [97, 158, 16],
  [1377, 158, 8],
  [1403, 158, 1],
  [1463, 158, 70],
  [6, 159, 28],
  [47, 159, 19],
  [68, 159, 23],
  [98, 159, 15],
  [1377, 159, 6],
  [1463, 159, 45],
  [1510, 159, 2],
  [1513, 159, 17],
  [3, 160, 30],
  [46, 160, 20],
  [68, 160, 23],
  [99, 160, 14],
  [1377, 160, 5],
  [1463, 160, 44],
  [1513, 160, 16],
  [1, 161, 25],
  [46, 161, 20],
  [68, 161, 23],
  [99, 161, 14],
  [1379, 161, 1],
  [1460, 161, 47],
  [1513, 161, 16],
  [0, 162, 22],
  [23, 162, 3],
  [46, 162, 19],
  [69, 162, 23],
  [100, 162, 13],
  [1448, 162, 2],
  [1452, 162, 2],
  [1459, 162, 33],
  [1493, 162, 14],
  [1515, 162, 14],
  [0, 163, 19],
  [46, 163, 19],
  [76, 163, 16],
  [109, 163, 4],
  [1448, 163, 7],
  [1458, 163, 34],
  [1493, 163, 14],
  [1515, 163, 14],
  [0, 164, 13],
  [16, 164, 2],
  [46, 164, 21],
  [76, 164, 17],
  [110, 164, 2],
  [1447, 164, 9],
  [1458, 164, 34],
  [1493, 164, 14],
  [1515, 164, 13],
  [0, 165, 12],
  [45, 165, 24],
  [76, 165, 18],
  [97, 165, 1],
  [111, 165, 1],
  [1444, 165, 48],
  [1493, 165, 12],
  [1515, 165, 13],
  [0, 166, 11],
  [45, 166, 28],
  [76, 166, 23],
  [1443, 166, 50],
  [1494, 166, 11],
  [1515, 166, 12],
  [0, 167, 10],
  [46, 167, 27],
  [76, 167, 22],
  [1441, 167, 52],
  [1495, 167, 8],
  [1516, 167, 11],
  [0, 168, 10],
  [46, 168, 25],
  [76, 168, 22],
  [1440, 168, 27],
  [1470, 168, 31],
  [1508, 168, 1],
  [1517, 168, 10],
  [0, 169, 10],
  [12, 169, 7],
  [21, 169, 2],
  [46, 169, 24],
  [76, 169, 22],
  [1437, 169, 25],
  [1470, 169, 31],
  [1514, 169, 3],
  [1518, 169, 8],
  [0, 170, 23],
  [47, 170, 23],
  [76, 170, 23],
  [1437, 170, 26],
  [1470, 170, 22],
  [1493, 170, 9],
  [1511, 170, 7],
  [1519, 170, 7],
  [0, 171, 23],
  [46, 171, 11],
  [59, 171, 12],
  [76, 171, 23],
  [1441, 171, 22],
  [1470, 171, 22],
  [1493, 171, 8],
  [1512, 171, 7],
  [1521, 171, 4],
  [1526, 171, 1],
  [0, 172, 22],
  [48, 172, 8],
  [59, 172, 12],
  [76, 172, 23],
  [1444, 172, 1],
  [1446, 172, 17],
  [1470, 172, 13],
  [1484, 172, 2],
  [1491, 172, 1],
  [1493, 172, 8],
  [1504, 172, 1],
  [1511, 172, 9],
  [1522, 172, 6],
  [0, 173, 22],
  [29, 173, 3],
  [49, 173, 6],
  [59, 173, 12],
  [76, 173, 3],
  [80, 173, 19],
  [1447, 173, 16],
  [1471, 173, 11],
  [1484, 173, 1],
  [1494, 173, 9],
  [1510, 173, 10],
  [1524, 173, 2],
  [0, 174, 21],
  [27, 174, 6],
  [49, 174, 5],
  [59, 174, 12],
  [76, 174, 2],
  [83, 174, 4],
  [88, 174, 11],
  [1447, 174, 17],
  [1471, 174, 11],
  [1484, 174, 1],
  [1494, 174, 8],
  [1509, 174, 12],
  [0, 175, 1],
  [2, 175, 19],
  [26, 175, 8],
  [49, 175, 3],
  [59, 175, 12],
  [84, 175, 2],
  [88, 175, 11],
  [1445, 175, 19],
  [1471, 175, 10],
  [1484, 175, 1],
  [1495, 175, 5],
  [1508, 175, 13],
  [0, 176, 1],
  [2, 176, 18],
  [25, 176, 10],
  [59, 176, 12],
  [88, 176, 11],
  [1443, 176, 21],
  [1471, 176, 10],
  [1495, 176, 3],
  [1507, 176, 14],
  [0, 177, 1],
  [2, 177, 18],
  [24, 177, 13],
  [59, 177, 12],
  [89, 177, 10],
  [1442, 177, 22],
  [1471, 177, 10],
  [1506, 177, 16],
  [0, 178, 19],
  [23, 178, 14],
  [62, 178, 9],
  [90, 178, 9],
  [1439, 178, 25],
  [1472, 178, 9],
  [1505, 178, 17],
  [0, 179, 18],
  [23, 179, 18],
  [62, 179, 8],
  [91, 179, 8],
  [1438, 179, 26],
  [1472, 179, 10],
  [1484, 179, 1],
  [1504, 179, 22],
  [0, 180, 18],
  [22, 180, 19],
  [63, 180, 6],
  [94, 180, 4],
  [1438, 180, 26],
  [1473, 180, 9],
  [1503, 180, 24],
  [0, 181, 19],
  [22, 181, 19],
  [64, 181, 5],
  [96, 181, 1],
  [1438, 181, 26],
  [1473, 181, 9],
  [1503, 181, 23],
  [0, 182, 38],
  [65, 182, 4],
  [1438, 182, 26],
  [1473, 182, 10],
  [1502, 182, 24],
  [0, 183, 38],
  [66, 183, 2],
  [1438, 183, 25],
  [1473, 183, 11],
  [1500, 183, 26],
  [1533, 183, 1],
  [1535, 183, 1],
  [0, 184, 37],
  [1436, 184, 15],
  [1452, 184, 11],
  [1472, 184, 13],
  [1499, 184, 26],
  [1533, 184, 1],
  [1535, 184, 1],
  [0, 185, 34],
  [1435, 185, 16],
  [1452, 185, 9],
  [1467, 185, 18],
  [1499, 185, 25],
  [1532, 185, 4],
  [0, 186, 34],
  [1435, 186, 15],
  [1453, 186, 5],
  [1465, 186, 20],
  [1500, 186, 23],
  [1532, 186, 4],
  [0, 187, 37],
  [1435, 187, 14],
  [1453, 187, 4],
  [1465, 187, 21],
  [1501, 187, 22],
  [1531, 187, 5],
  [0, 188, 3],
  [5, 188, 13],
  [19, 188, 19],
  [1435, 188, 14],
  [1453, 188, 4],
  [1465, 188, 21],
  [1501, 188, 21],
  [1530, 188, 6],
  [0, 189, 2],
  [6, 189, 2],
  [9, 189, 10],
  [20, 189, 19],
  [1435, 189, 9],
  [1446, 189, 3],
  [1454, 189, 3],
  [1464, 189, 23],
  [1500, 189, 22],
  [1527, 189, 1],
  [1530, 189, 6],
  [0, 190, 3],
  [6, 190, 1],
  [10, 190, 9],
  [20, 190, 23],
  [1435, 190, 7],
  [1455, 190, 1],
  [1464, 190, 23],
  [1500, 190, 14],
  [1516, 190, 6],
  [1527, 190, 9],
  [1, 191, 2],
  [10, 191, 8],
  [20, 191, 24],
  [1435, 191, 3],
  [1464, 191, 22],
  [1499, 191, 15],
  [1517, 191, 5],
  [1528, 191, 8],
  [1, 192, 3],
  [10, 192, 9],
  [20, 192, 24],
  [1463, 192, 12],
  [1477, 192, 9],
  [1499, 192, 15],
  [1518, 192, 3],
  [1527, 192, 9],
  [10, 193, 8],
  [19, 193, 25],
  [1461, 193, 14],
  [1478, 193, 8],
  [1500, 193, 13],
  [1525, 193, 11],
  [10, 194, 35],
  [1461, 194, 13],
  [1478, 194, 8],
  [1499, 194, 14],
  [1523, 194, 13],
  [10, 195, 4],
  [16, 195, 12],
  [29, 195, 17],
  [1462, 195, 12],
  [1478, 195, 8],
  [1499, 195, 14],
  [1523, 195, 13],
  [5, 196, 7],
  [16, 196, 13],
  [30, 196, 16],
  [1462, 196, 13],
  [1479, 196, 7],
  [1498, 196, 14],
  [1522, 196, 13],
  [5, 197, 7],
  [16, 197, 14],
  [31, 197, 15],
  [1462, 197, 13],
  [1481, 197, 4],
  [1498, 197, 10],
  [1522, 197, 13],
  [4, 198, 8],
  [16, 198, 15],
  [32, 198, 15],
  [1462, 198, 11],
  [1483, 198, 2],
  [1498, 198, 9],
  [1521, 198, 13],
  [3, 199, 9],
  [16, 199, 15],
  [34, 199, 13],
  [1463, 199, 9],
  [1498, 199, 4],
  [1521, 199, 13],
  [0, 200, 13],
  [16, 200, 15],
  [38, 200, 9],
  [1463, 200, 9],
  [1498, 200, 3],
  [1521, 200, 13],
  [0, 201, 13],
  [16, 201, 16],
  [1463, 201, 8],
  [1499, 201, 1],
  [1521, 201, 13],
  [0, 202, 13],
  [16, 202, 17],
  [1463, 202, 4],
  [1521, 202, 13],
  [0, 203, 14],
  [17, 203, 16],
  [1463, 203, 4],
  [1521, 203, 13],
  [0, 204, 15],
  [18, 204, 15],
  [1463, 204, 3],
  [1522, 204, 12],
  [0, 205, 15],
  [18, 205, 15],
  [1522, 205, 10],
  [0, 206, 15],
  [19, 206, 14],
  [1523, 206, 8],
  [0, 207, 15],
  [19, 207, 14],
  [1523, 207, 7],
  [0, 208, 14],
  [22, 208, 10],
  [1524, 208, 6],
  [0, 209, 14],
  [23, 209, 9],
  [1525, 209, 4],
  [0, 210, 13],
  [24, 210, 8],
  [1526, 210, 2],
  [0, 211, 12],
  [25, 211, 7],
  [2, 212, 10],
  [27, 212, 4],
  [3, 213, 9],
  [28, 213, 2],
  [4, 214, 6],
  [5, 215, 4],
  [5, 216, 4],
  [6, 217, 3],
  [7, 218, 1],
];
function drawAquaLeaves() {
  if (!aquaArt.complete || !aquaArt.naturalWidth) return;
  ctx.save();
  ctx.translate(-Math.round(camera * (85 / (WORLD - W))), 0);
  ctx.scale(860 / aquaArt.naturalWidth, H / aquaArt.naturalHeight);
  ctx.beginPath();
  for (const [x, y, w] of aquaLeafSpans) ctx.rect(x, y, w, 1);
  ctx.clip();
  ctx.drawImage(aquaArt, 0, 0);
  ctx.restore();
}
function aquaparkBalloon() {
  if (!skyArt.complete || !skyArt.naturalWidth) return;
  const cycle = 160,
    phase = time % cycle,
    pass = Math.floor(time / cycle),
    progress = phase / cycle;
  const x =
    pass % 2 === 0 ? -74 + progress * (W + 148) : W + 74 - progress * (W + 148);
  const y = 14 + Math.sin(time * 0.18) * 4;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time * 0.13) * 0.018);
  ctx.drawImage(skyArt, 350, 405, 600, 794, -35, 0, 70, 92.63);
  ctx.restore();
}
// Brief decorative bursts separated by quiet intervals; no screen-wide flashes.
function fireworks() {
  const elapsed = time - 6;
  if (elapsed < 0) return;
  const cycle = Math.floor(elapsed / 15),
    t = elapsed % 15;
  if (t > 3.4) return;
  const x = 260 + ((cycle * 173) % 360),
    y = 35 + ((cycle * 17) % 32),
    colors = ["#ffcf81", "#f8a7ce", "#91dce6"];
  if (t < 0.8) {
    rect(x, y + 85 * (1 - t / 0.8), 2, 4, "#ffe7b2");
    return;
  }
  const age = t - 0.8,
    radius = age * 23,
    fade = Math.max(0, 1 - age / 2.6);
  ctx.save();
  ctx.globalAlpha = fade;
  for (let i = 0; i < 18; i++) {
    const angle = (i * Math.PI * 2) / 18;
    for (let tail = 0; tail < 3; tail++) {
      const r = Math.max(0, radius - tail * 3);
      rect(
        x + Math.cos(angle) * r,
        y + Math.sin(angle) * r + age * age * 5,
        tail ? 1 : 2,
        tail ? 1 : 2,
        colors[(cycle + (i % 2)) % 3],
      );
    }
  }
  ctx.restore();
}
function wildlife() {
  if (level === 1) {
    caveBats();
    return;
  }
  if (level === 5) {
    aquaparkBalloon();
    drawAquaLeaves();
    return;
  }
  if (level >= 5) return;
  if (level === 3) {
    fireworks();
    return;
  }
  if (level === 2) {
    distantPlane();
    return;
  }
  const bats = level === 1,
    count = bats ? 3 : 3;
  for (let i = 0; i < count; i++) {
    const speed = 9 + i * 1.7,
      x =
        ((((i * 139 + time * speed - camera * 0.18) % (W + 80)) + W + 80) %
          (W + 80)) -
        40,
      y =
        (bats ? 65 : 37) +
        ((i * 29) % (bats ? 70 : 90)) +
        Math.sin(time * 0.75 + i) * 10,
      flap = Math.sin(time * (bats ? 10 : 6) + i) * 5,
      scale = 0.65 + (i % 3) * 0.18;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(scale, scale);
    if (bats) {
      poly(
        ctx,
        [
          [-2, 0],
          [-15, -7 - flap],
          [-12, 1],
          [-8, -1],
          [-5, 5],
          [0, 3],
          [5, 5],
          [8, -1],
          [12, 1],
          [15, -7 - flap],
          [2, 0],
        ],
        "#332942",
      );
      poly(
        ctx,
        [
          [-2, 0],
          [-12, -5 - flap],
          [-7, 0],
          [-4, 3],
        ],
        "#73576e",
      );
      poly(
        ctx,
        [
          [2, 0],
          [12, -5 - flap],
          [7, 0],
          [4, 3],
        ],
        "#73576e",
      );
      oval(ctx, 0, 1, 2.5, 4, "#241f37");
      poly(
        ctx,
        [
          [-2, 0],
          [-3, -5],
          [0, -2],
          [3, -5],
          [2, 0],
        ],
        "#30233c",
      );
    } else {
      // Stocky blue-grey pigeon: short tail, rounded wings, dark wing bars, iridescent neck.
      poly(
        ctx,
        [
          [-5, 2],
          [-12, 4],
          [-11, 7],
          [-3, 5],
        ],
        "#46536b",
      );
      oval(ctx, 0, 2, 6, 3.8, "#8695aa");
      poly(
        ctx,
        [
          [-2, 1],
          [-8, -3 - flap],
          [-6, -6 - flap],
          [1, -2],
          [4, 2],
        ],
        "#a3afbd",
      );
      poly(
        ctx,
        [
          [-5, -2 - flap],
          [-3, -3 - flap],
          [2, 0],
          [1, 2],
        ],
        "#3f4b61",
      );
      poly(
        ctx,
        [
          [-7, -4 - flap],
          [-5, -5 - flap],
          [-1, -1],
          [0, 1],
        ],
        "#4c586d",
      );
      oval(ctx, 5, 0, 2.8, 4, "#526a78");
      rect(4, 1, 3, 2, "#608d80");
      rect(5, 3, 2, 1, "#82758f");
      oval(ctx, 6, -3, 2.7, 2.7, "#78889a");
      rect(7, -4, 1, 1, "#eeaf68");
      rect(8, -2, 3, 1, "#41495b");
      rect(8, -3, 1, 1, "#c8c9be");
    }
    ctx.restore();
  }
}
function wornWoodLadder(l) {
  const x = l.x - 11,
    top = l.top - 5;
  for (const rail of [x, x + 20]) {
    rect(rail - 1, top, 5, l.bottom - top, "#49372f");
    rect(rail, top, 3, l.bottom - top, "#8c6b49");
    rect(rail, top, 1, l.bottom - top, "#b29669");
    for (let y = top + 5; y < l.bottom - 6; y += 19) {
      rect(rail + 1, y, 1, 9, "#5c4433");
      rect(rail, y + 3, 1, 3, "#594534");
      rect(rail + 2, y + 11, 1, 3, "#c1a176");
    }
  }
  for (let y = top + 10, i = 0; y < l.bottom - 2; y += 11, i++) {
    const drop = i % 4 === 1 ? 1 : 0;
    rect(x + 3, y + 1, 17, 4, "#40332d");
    rect(x + 3, y, 17, 3, "#9b7c55");
    rect(x + 4, y, 15, 1, "#c3a77a");
    rect(x + 10, y + drop, 8, 2, "#96744c");
    rect(x + 12, y + drop, 5, 1, "#b79b6a");
    rect(x + 6, y + 2, 4, 1, "#5a4333");
    if (i % 3 === 0) {
      rect(x + 15, y, 2, 1, "#513e30");
      rect(x + 17, y + 3, 1, 2, "#ad8b5c");
    }
    rect(x + 2, y, 2, 2, "#555047");
    rect(x + 19, y, 2, 2, "#555047");
  }
  // Old lashings and a short repair plate, without gaps in usable rungs.
  for (const y of [top + 18, Math.min(l.bottom - 16, top + 55)]) {
    rect(x - 1, y, 5, 1, "#c0ab7c");
    rect(x - 1, y + 2, 5, 1, "#a38c60");
  }
}
function rustyMetalLadder(l) {
  const x = l.x - 11,
    top = l.top - 5;
  for (const rail of [x, x + 20]) {
    rect(rail - 1, top, 5, l.bottom - top, "#303f49");
    rect(rail, top, 3, l.bottom - top, "#7e929b");
    rect(rail, top, 1, l.bottom - top, "#bdcbd0");
    rect(rail + 2, top, 1, l.bottom - top, "#536976");
    for (let y = top + 8; y < l.bottom - 8; y += 23) {
      rect(rail, y, 3, 5, "#99573b");
      rect(rail + 1, y + 2, 2, 5, "#b77749");
      rect(rail, y + 6, 1, 3, "#693f32");
    }
  }
  for (let y = top + 10, i = 0; y < l.bottom - 2; y += 11, i++) {
    rect(x + 2, y + 1, 19, 4, "#354a56");
    rect(x + 3, y, 17, 3, "#8c9fa4");
    rect(x + 3, y, 17, 1, "#c7d1cd");
    rect(x + 3, y + 2, 17, 1, "#536d78");
    const rx = x + 4 + ((i * 7) % 12);
    rect(rx, y + 1, 3, 2, "#a0603e");
    rect(rx + 1, y, 2, 1, "#bd8351");
    rect(x + 1, y, 2, 2, "#d1d7cf");
    rect(x + 20, y, 2, 2, "#d1d7cf");
  }
}
function stoneLadder(l) {
  const x = l.x - 11,
    top = l.top - 5;
  for (const rail of [x, x + 20]) {
    rect(rail - 1, top, 5, l.bottom - top, "#55536b");
    rect(rail, top, 3, l.bottom - top, "#9690a0");
    rect(rail, top, 1, l.bottom - top, "#d3c6bb");
    for (let y = top + 13; y < l.bottom; y += 16)
      rect(rail, y, 3, 1, "#625b73");
  }
  for (let y = top + 10; y < l.bottom - 2; y += 11) {
    rect(x + 2, y, 19, 4, "#79758b");
    rect(x + 3, y, 17, 1, "#e0cdb4");
    rect(x + 3, y + 1, 16, 2, "#aca1aa");
    rect(x + 3, y + 3, 17, 1, "#59566d");
    rect(x + 8, y + 2, 3, 1, "#847b91");
  }
}
function drawLadder(l) {
  if (level === 7 || level === 8) {
    wornWoodLadder(l);
    return;
  }
  if (level >= 5) {
    poolLadder(l);
    return;
  }
  if (l.x < camera - 25 || l.x > camera + W + 25) return;
  if (level === 3) {
    stoneLadder(l);
    return;
  }
  if (level === 1) {
    wornWoodLadder(l);
    return;
  }
  if (level === 2) {
    rustyMetalLadder(l);
    return;
  }
  const x = l.x - 11,
    top = l.top - 5,
    h = l.bottom - top;
  for (const rail of [x, x + 20]) {
    rect(rail - 1, top, 5, h, "#3b3440");
    rect(rail, top, 3, h, level === 1 ? "#94765a" : "#ab744d");
    rect(rail, top, 1, h, "#efc68b");
    for (let y = top + 12; y < l.bottom; y += 26) {
      rect(rail + 1, y, 1, 8, "#654f46");
      rect(rail - 1, y + 8, 5, 3, "#53606a");
      rect(rail, y + 8, 1, 1, "#d0d2bd");
    }
  }
  for (let y = top + 10; y < l.bottom - 2; y += 11) {
    rect(x + 3, y + 1, 17, 4, "#463c43");
    rect(x + 3, y, 17, 3, "#bd986c");
    rect(x + 3, y, 17, 1, "#f0d1a0");
    rect(x + 5, y + 2, 12, 1, "#896341");
  }
}
function chalkMineralDetails(p) {
  const elevated = p.h <= 20;
  // Creamy mineral veins, flint nodules and coarse fractures replace uniform noise.
  for (let x = p.x + 10; x < p.x + p.w - 12; x += 37) {
    let y = p.y + 8 + noise(x, p.y) * 6;
    poly(
      ctx,
      [
        [x, y],
        [x + 5, y - 2],
        [x + 10, y + 1],
        [x + 8, y + 5],
        [x + 3, y + 6],
      ],
      "#66738c",
    );
    poly(
      ctx,
      [
        [x + 1, y],
        [x + 5, y - 1],
        [x + 8, y + 1],
        [x + 3, y + 2],
      ],
      "#a6afbb",
    );
    rect(x + 5, y + 4, 2, 1, "#414f66");
  }
  if (!elevated)
    for (let x = p.x + 13; x < p.x + p.w - 17; x += 57) {
      let y = p.y + 29;
      poly(
        ctx,
        [
          [x, y],
          [x + 10, y - 4],
          [x + 24, y],
          [x + 30, y - 2],
          [x + 24, y + 3],
          [x + 10, y - 1],
        ],
        "#eee4c7",
      );
      rect(x + 10, y + 1, 8, 1, "#8797a9");
    }
}
function platformDetails(p) {
  if (level >= 5) return;
  if (level === 0 || level === 2 || level === 3) return;
  const elevated = p.h <= 20;
  if (level === 1) {
    chalkMineralDetails(p);
    return;
  }
  if (elevated && Math.floor(p.x / 180) % 3 === 1) {
    // Timber balcony deck: individual planks, end grain, iron straps and braces.
    rect(p.x, p.y + 4, p.w, p.h - 4, "#69494a");
    for (let x = p.x + 1; x < p.x + p.w - 4; x += 18) {
      let w = Math.min(16, p.x + p.w - x);
      rect(x, p.y + 5, w, 9, "#ba8758");
      rect(x, p.y + 5, w, 1, "#f3c08a");
      rect(x + 2, p.y + 8, w - 3, 1, "#78533e");
      rect(x + 5, p.y + 10, 4, 2, "#956342");
    }
    for (const x of [p.x + 10, p.x + p.w - 15]) {
      rect(x, p.y + 3, 5, 14, "#47505e");
      rect(x + 1, p.y + 5, 2, 2, "#c3c9b2");
      rect(x + 1, p.y + 12, 2, 2, "#9daba3");
      poly(
        ctx,
        [
          [x, p.y + 17],
          [x + 5, p.y + 17],
          [x + 14, p.y + 31],
          [x + 10, p.y + 31],
        ],
        "#694b43",
      );
      rect(x, p.y + 17, 3, 21, "#b6895a");
    }
  } else {
    // Dressed masonry with large varied stones and recessed seams.
    const colors =
      level === 2
        ? ["#b9bec1", "#cdd0c6", "#a8b3b8"]
        : ["#b98c74", "#c4a184", "#a87c69"];
    for (let row = 0; row < (elevated ? 1 : 3); row++)
      for (let x = p.x + (row % 2 ? 8 : 0) + 2; x < p.x + p.w - 8; x += 29) {
        let w = Math.min(26, p.x + p.w - x - 1),
          y = p.y + 7 + row * 16;
        rect(x, y, w, 13, colors[Math.floor(noise(x, y) * 3)]);
        rect(x, y, w, 1, "#efdcba");
        rect(x, y, 1, 11, "#e0c3a1");
        rect(x + w - 1, y + 1, 1, 12, "#625b62");
        rect(x + 3, y + 8, 5, 1, "#8a7470");
        if (noise(x, row) > 0.55) {
          rect(x + 13, y + 3, 1, 4, "#736978");
          rect(x + 14, y + 6, 3, 1, "#736978");
        }
        rect(x + 4, y + 3, 3, 1, "#e4c7a5");
      }
    if (elevated) {
      rect(p.x + 3, p.y + p.h - 2, p.w - 6, 3, "#61535e");
      for (const x of [p.x + 12, p.x + p.w - 23]) {
        rect(x, p.y + p.h + 1, 10, 4, "#c3a688");
        rect(x + 2, p.y + p.h + 5, 6, 5, "#927b73");
        rect(x + 3, p.y + p.h + 10, 4, 3, "#6e6269");
      }
    }
  }
  // Broken cobble cap, moss clusters and trailing ivy.
  rect(p.x, p.y, p.w, 3, level === 2 ? "#eee2c2" : "#e6d6aa");
  for (let x = p.x + 1; x < p.x + p.w - 3; x += 11) {
    rect(x, p.y, 9, 1, "#fff0c8");
    rect(x + 9, p.y, 1, 3, "#9b9b84");
  }
  for (let x = p.x + 8; x < p.x + p.w - 10; x += 41) {
    rect(x, p.y + 2, 9, 3, "#4e7959");
    rect(x + 2, p.y + 1, 4, 2, "#9cbd70");
    if (elevated) {
      let len = 11 + noise(x, 2) * 17;
      rect(x + 3, p.y + 5, 1, len, "#426956");
      for (let y = p.y + 7; y < p.y + len; y += 5) {
        rect(x + (Math.floor(y) % 2 ? 0 : 4), y, 4, 2, "#6b9c64");
        rect(x + 1, y, 2, 1, "#accb77");
      }
    }
  }
}

// Scroll the original ground at world speed, repeating only horizontally.
function drawGroundStrip(art, groundY, width) {
  const sourceY = (art.naturalHeight * groundY) / H;
  const offset = -(Math.round(camera) % width);
  for (let x = offset; x < W; x += width) {
    ctx.drawImage(
      art,
      0,
      sourceY,
      art.naturalWidth,
      art.naturalHeight - sourceY,
      x,
      groundY,
      width,
      H - groundY,
    );
  }
}
// Distant scenery retains its slower parallax above the ground.
function drawPits() {
  const groundY =
    level === 8
      ? PARK_GROUND_Y
      : level === 7
        ? MINE_GROUND_Y
        : level === 6
          ? CINEMA_ROAD_Y
          : level === 5
            ? 396
            : level === 1
              ? 400
              : level >= 2
                ? 380
                : 400;
  for (const pit of chapters[level].pits || []) {
    if (pit.x + pit.w < camera || pit.x > camera + W) continue;
    // Dry earthen cut: dark depth, broken pavement lip and exposed soil. No water.
    rect(pit.x, groundY, pit.w, H - groundY, "#151521");
    rect(pit.x, groundY, 7, H - groundY, level === 1 ? "#74747d" : "#594237");
    rect(
      pit.x + pit.w - 7,
      groundY,
      7,
      H - groundY,
      level === 1 ? "#515665" : "#43332f",
    );
    for (let y = groundY + 5; y < H; y += 8) {
      rect(pit.x + 1, y, 4, 2, "#83634b");
      rect(pit.x + pit.w - 5, y + 3, 3, 2, "#71523e");
    }
    const lipY = level >= 6 ? groundY : groundY - 2;
    rect(pit.x - 4, lipY, 9, 3, "#b39b7e");
    rect(pit.x + pit.w - 5, lipY, 9, 3, "#b39b7e");
    rect(pit.x + 7, groundY + 2, pit.w - 14, 4, "#22202a");
  }
}
function drawTownBackground() {
  const streetY = 400,
    sourceY = (bg.naturalHeight * streetY) / H,
    bx = -Math.round(camera * (256 / (WORLD - W)));
  ctx.drawImage(bg, 0, 0, bg.naturalWidth, sourceY, bx, 0, 1024, streetY);
  drawGroundStrip(bg, streetY, 1024);
}
// Original lawn scrolls with the platforms beneath the distant office scenery.
function drawOfficeBackground() {
  const lawnY = 380,
    sourceY = (officeArt.naturalHeight * lawnY) / H;
  ctx.drawImage(
    officeArt,
    0,
    0,
    officeArt.naturalWidth,
    sourceY,
    -Math.round(camera * (85 / (WORLD - W))),
    0,
    860,
    lawnY,
  );
  drawGroundStrip(officeArt, lawnY, 860);
}
function drawPlazaBackground() {
  const groundY = 380,
    sourceY = (plazaArt.naturalHeight * groundY) / H;
  ctx.drawImage(
    plazaArt,
    0,
    0,
    plazaArt.naturalWidth,
    sourceY,
    -Math.round(camera * (85 / (WORLD - W))),
    0,
    860,
    groundY,
  );
  drawGroundStrip(plazaArt, groundY, 860);
}
// Small pixel emblem based on the city's crowned shield, bear and three oaks.
function chelmEmblem(x, y) {
  poly(
    ctx,
    [
      [x, y + 3],
      [x + 12, y + 3],
      [x + 12, y + 10],
      [x + 9, y + 13],
      [x + 6, y + 14],
      [x + 3, y + 13],
      [x, y + 10],
    ],
    "#c7b773",
  );
  poly(
    ctx,
    [
      [x + 1, y + 4],
      [x + 11, y + 4],
      [x + 11, y + 10],
      [x + 6, y + 13],
      [x + 1, y + 10],
    ],
    "#205d39",
  );
  rect(x + 3, y + 1, 7, 2, "#e8bc53");
  rect(x + 3, y, 1, 2, "#f6d379");
  rect(x + 6, y - 1, 1, 3, "#f6d379");
  rect(x + 5, y, 3, 1, "#f6d379");
  rect(x + 9, y, 1, 2, "#f6d379");
  for (const dx of [2, 6, 10]) {
    rect(x + dx, y + 6, 1, 5, "#8c7845");
    rect(x + dx - 1, y + 4, 3, 3, "#55934b");
    rect(x + dx, y + 3, 1, 1, "#72ad58");
  }
  rect(x + 2, y + 8, 7, 3, "#f5f1da");
  rect(x + 1, y + 7, 3, 2, "#fff9e9");
  rect(x, y + 8, 1, 1, "#f5f1da");
  rect(x + 2, y + 10, 1, 2, "#e6e8d9");
  rect(x + 7, y + 10, 1, 2, "#e6e8d9");
  rect(x + 1, y + 7, 1, 1, "#384b39");
  rect(x + 6, y + 7, 1, 5, "#927744");
  rect(x + 4, y + 5, 4, 2, "#55934b");
}
function woodBeam(x, y, w, h) {
  rect(x, y, w, h, "#795039");
  rect(x, y, w, 1, "#c19363");
  rect(x, y, 1, h, "#b38557");
  rect(x + w - 1, y + 1, 1, h - 1, "#4b352d");
  rect(x, y + h - 1, w, 1, "#4b352d");
  if (h > w) {
    for (let dy = 6; dy < h - 4; dy += 13) {
      rect(x + 2, y + dy, 1, 7, "#a4754b");
      if (w > 4) rect(x + w - 3, y + dy + 3, 1, 5, "#5c3e30");
    }
  } else {
    for (let dx = 7; dx < w - 5; dx += 15) {
      rect(x + dx, y + 2, 9, 1, "#a4754b");
      rect(x + dx + 3, y + h - 3, 6, 1, "#5c3e30");
    }
  }
}
function checkpointFlag() {
  const x = WORLD / 2 - 2;
  woodBeam(x, 319, 4, 55);
  rect(x - 1, 317, 6, 3, "#b88a59");
  rect(x + 4, 321, 28, 18, checkpoint ? "#3b9851" : "#287440");
  rect(x + 4, 321, 28, 1, "#76b96d");
  rect(x + 4, 338, 28, 1, "#194c31");
  rect(x + 5, 323, 1, 13, "#4e9959");
  rect(x + 29, 324, 2, 12, "#22633b");
  chelmEmblem(x + 12, 323);
}
function exitFrameBeam(x, y, length, vertical) {
  ctx.save();
  ctx.translate(x, y);
  if (vertical) {
    ctx.translate(8, 0);
    ctx.rotate(Math.PI / 2);
  }
  ctx.beginPath();
  ctx.rect(0, 0, length, 8);
  ctx.clip();
  platform({ x: 0, y: 0, w: length, h: 8, shapePiece: true });
  ctx.restore();
}
function woodenExit() {
  const x = gateX(),
    open = collected === targetCount();
  rect(x + 6, 302, 40, 72, open ? "#b8fa8766" : "#163940aa");
  exitFrameBeam(x, 301, 73, true);
  exitFrameBeam(x + 44, 301, 73, true);
  exitFrameBeam(x, 295, 52, false);

}
function draw() {
  if (level === 9) {
    drawFinale();
    return;
  }
  if (level === 4) {
    drawRoad();
    return;
  }
  ctx.clearRect(0, 0, W, H);
  rect(0, 0, W, H, "#396879");
  if (level === 1) caveBackground();
  if (level === 0 && bg.complete && bg.naturalWidth) {
    drawTownBackground();
  }
  if (level === 2 && officeArt.complete && officeArt.naturalWidth)
    drawOfficeBackground();
  if (level === 3 && plazaArt.complete && plazaArt.naturalWidth)
    drawPlazaBackground();
  if (level === 5 && aquaArt.complete && aquaArt.naturalWidth)
    drawAquaBackground();
  if (level === 6 && cinemaArt.complete && cinemaArt.naturalWidth)
    drawCinemaBackground();
  if (level === 7 && mineArt.complete && mineArt.naturalWidth)
    drawMineBackground();
  if (level === 8 && parkArt.complete && parkArt.naturalWidth)
    drawParkBackground();
  wildlife();
  rect(0, 0, W, H, "#112c440c");
  ctx.save();
  ctx.translate(-Math.round(camera), 0);
  for (const p of platforms)
    if (
      !p.street &&
      !p.shapePiece &&
      p.h > 20 &&
      p.x + p.w > camera - 30 &&
      p.x < camera + W + 30
    )
      renderPlatform(p);
  drawPits();
  for (const l of ladders) drawLadder(l);
  for (const p of platforms)
    if (
      !p.street &&
      (p.shapePiece || p.h <= 20) &&
      p.x + p.w > camera - 30 &&
      p.x < camera + W + 30
    ) {
      renderPlatform(p);
    }

  ctx.save();
  ctx.translate(0, 26);
  checkpointFlag();
  woodenExit();
  ctx.restore();
  for (const r of rocks)
    if (!r.taken && r.x > camera - 20 && r.x < camera + W + 20) gem(r);
  for (const g of ghosts())
    if (g.x > camera - 40 && g.x < camera + W + 40) {
      if (g.kind === "ghost") ghost(g);
      else walker(g);
    }
  if (invincible <= 0 || Math.floor(time * 12) % 2 === 0)
    bear(player.x, player.y);
  for (const p of particles) rect(p.x, p.y, 3, 3, p.color);
  ctx.restore();
  if (state === "transition") {
    rect(0, 0, W, H, "#101f29cc");
    label("NEXT STOP: " + chapterNames[nextStage()] + "...", 180, 210);
  }
}
let menuOpen = false,
  menuWasPlaying = false,
  menuPreviousState = "title",
  menuOverlayHidden = true,
  clockStamp = "";
// Temporary direct entry points for testing each chapter.
function updateDevLevelButtons() {
  for (const b of document.querySelectorAll("[data-dev-level]"))
    b.setAttribute(
      "aria-pressed",
      String(Number(b.dataset.devLevel) === level),
    );
}
function devJumpToLevel(n) {
  if (infoOpen) closeInfo(false);
  if (!Number.isInteger(n) || n < 0 || n >= chapters.length) return;
  unlockAudio();
  menuOpen = menuWasPlaying = false;
  $("#consoleMenu").hidden = true;
  $("#select").setAttribute("aria-expanded", "false");
  elapsed = chapterStart = 0;
  loadLevel(n);
  state = "playing";
  $("#overlay").hidden = true;
  consoleHud();
  syncMusic();
  canvas.focus();
}
function consoleStart() {
  if (infoOpen) {
    closeInfo();
    return;
  }
  if (menuOpen) {
    toggleConsoleMenu();
    return;
  }
  if (state === "playing" || state === "paused") pause();
  else start();
}
function toggleConsoleMenu() {
  if (infoOpen) closeInfo(false);
  if (!menuOpen) {
    menuPreviousState = state;
    menuOverlayHidden = $("#overlay").hidden;
    menuWasPlaying = state === "playing" || state === "paused";
    if (state === "playing") pauseSound();
    releaseGameInput();
    state = "paused";
    menuOpen = true;
    $("#overlay").hidden = true;
    $("#consoleMenu").hidden = false;
    $("#select").setAttribute("aria-expanded", "true");
    $("#closeMenu").focus();
  } else {
    menuOpen = false;
    $("#consoleMenu").hidden = true;
    $("#select").setAttribute("aria-expanded", "false");
    state = menuWasPlaying ? "playing" : menuPreviousState;
    if (state === "title") start();
    else if (state === "playing") unlockAudio();
    $("#overlay").hidden = state === "playing" ? true : menuOverlayHidden;
    releaseGameInput();
    canvas.focus();
  }
  consoleHud();
  syncMusic();
}
function consoleHud() {
  const stamp = level + ":" + state + ":" + Math.floor(elapsed);
  if (stamp === clockStamp) return;
  clockStamp = stamp;
  $("#stageHud").textContent = stageNumber() + "—" + chapters.length;
  $("#clockHud").textContent =
    Math.floor(elapsed / 60) +
    ":" +
    String(Math.floor(elapsed % 60)).padStart(2, "0");
  $("#pause").textContent =
    state === "playing" ? "PAUZA" : state === "paused" ? "WRÓĆ" : "START";
}
const worldSigns = document.getElementById("world-signs");
const checkpointSign = worldSigns.querySelector(".checkpoint-sign");
const passageSign = worldSigns.querySelector(".passage-sign");

function updateWorldSigns() {
  worldSigns.hidden = level === 9 || state === "transition";
  if (worldSigns.hidden) return;
  const road = level === 4;
  const open = collected === targetCount();
  worldSigns.classList.toggle("road-signs", road);
  checkpointSign.hidden = road;
  checkpointSign.style.left = (road ? 210 : WORLD / 2 - Math.round(camera)) / W * 100 + "%";
  passageSign.style.left = (road ? 674 : gateX() + 26 - Math.round(camera)) / W * 100 + "%";
  for (const line of checkpointSign.children) {
    line.hidden = line.dataset.kind !== (road ? "road" : "flag") ||
      line.dataset.saved !== String(checkpoint);
  }
  for (const line of passageSign.children) {
    line.hidden = line.dataset.kind !== (road ? "road" : "gate") ||
      line.dataset.open !== String(open);
  }
  if (passageSign.dataset.stage !== String(level)) {
    passageSign.dataset.stage = level;
    passageSign.querySelector("[data-count]").textContent = targetCount();
    passageSign.querySelector("[data-item]").textContent = itemNames[level];
    for (const name of passageSign.querySelectorAll("[data-destination]")) {
      name.hidden = Number(name.dataset.destination) !== nextStage();
    }
  }
}

function frame(t) {
  let dt = Math.min((t - last) / 1000, 0.05);
  last = t;
  acc += dt;
  while (acc >= 1 / 120) {
    update(1 / 120);
    acc -= 1 / 120;
  }
  syncMusic();
  consoleHud();
  draw();
  updateWorldSigns();
  requestAnimationFrame(frame);
}
const handled = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "KeyS",
  "Space",
  "KeyA",
  "KeyD",
  "KeyW",
  "KeyP",
  "KeyR",
];
// Native menus can swallow keyup. Drop held input before browser control takes over.
function releaseGameInput() {
  keys.clear();
  jumpBuffer = 0;
  climbing = false;
  if (player) player.vx = 0;
}
addEventListener("contextmenu", releaseGameInput, true);
addEventListener(
  "pointerdown",
  (e) => {
    if (e.button === 2) releaseGameInput();
  },
  true,
);
addEventListener("keydown", (e) => {
  if (infoOpen) {
    if (["Enter", "Escape", "KeyP"].includes(e.code)) {
      e.preventDefault();
      if (!e.repeat) closeInfo();
    } else if (e.code === "Tab") {
      e.preventDefault();
      $("#infoResume").focus();
    } else if (handled.includes(e.code)) e.preventDefault();
    return;
  }
  if (
    e.target &&
    e.target.dataset &&
    e.target.dataset.devLevel !== undefined &&
    (e.code === "Space" || e.code === "Enter")
  )
    return;
  if (
    ["Enter", "Backspace", "Escape"].includes(e.code) &&
    !(e.code === "Enter" && e.target && e.target.tagName === "BUTTON")
  ) {
    e.preventDefault();
    if (e.repeat) return;
    if (e.code === "Enter") consoleStart();
    else if (e.code !== "Escape" || menuOpen) toggleConsoleMenu();
    return;
  }
  if (menuOpen) {
    if (e.code === "Tab") {
      const buttons = Array.from($("#consoleMenu").querySelectorAll("button"));
      const first = buttons[0],
        last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    return;
  }
  if (!handled.includes(e.code)) return;
  e.preventDefault();
  if (e.repeat) return;
  if (e.code === "KeyP") {
    pause();
    return;
  }
  if (e.code === "KeyR") {
    restartLevel();
    return;
  }
  if (
    (state === "title" || state === "over" || state === "won") &&
    (e.code === "Space" || e.code === "ArrowUp")
  ) {
    start();
    return;
  }
  keys.add(e.code);
  if (
    e.code === "Space" ||
    (["ArrowUp", "KeyW"].includes(e.code) && upShouldJump())
  )
    jumpBuffer = 0.13;
});
addEventListener("keyup", (e) => {
  keys.delete(e.code);
  if (["Space", "ArrowUp", "KeyW"].includes(e.code) && player.vy < -140)
    player.vy = -140;
});
addEventListener("blur", () => {
  releaseGameInput();
  if (state === "playing") pause();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    releaseGameInput();
    if (state === "playing") pause();
  }
});
$("#music").onclick = () => {
  musicEnabled = !musicEnabled;
  $("#music").textContent = musicEnabled ? "MUZYKA WŁ." : "MUZYKA WYŁ.";
  $("#music").setAttribute("aria-pressed", String(musicEnabled));
  unlockAudio();
  syncMusic();
};
$("#start").onclick = start;
$("#pause").onclick = consoleStart;
$("#select").onclick = toggleConsoleMenu;
$("#closeMenu").onclick = toggleConsoleMenu;
$("#restart").onclick = () => {
  if (menuOpen) {
    menuWasPlaying = false;
    toggleConsoleMenu();
  }
  restartLevel();
};
$("#sound").onclick = () => {
  sound = !sound;
  $("#sound").textContent = sound ? "DŹWIĘK WŁ." : "DŹWIĘK WYŁ.";
  $("#sound").setAttribute("aria-pressed", String(sound));
  if (sound) beep(640);
};
for (const b of document.querySelectorAll("[data-key]")) {
  b.onpointerdown = (e) => {
    e.preventDefault();
    b.setPointerCapture(e.pointerId);
    keys.add(b.dataset.key);
    if (b.dataset.key === "Space") jumpBuffer = 0.13;
  };
  const release = () => {
    keys.delete(b.dataset.key);
    if (b.dataset.key === "Space" && player.vy < -140) player.vy = -140;
  };
  b.onpointerup = release;
  b.onpointercancel = release;
  b.onlostpointercapture = release;
}

// Editable HELP outlines, keyed by the stable location ID.
const levelHelp = [
  "Zbierz medaliki, uważając przy tym na spacerujących księży. Użyj drabinek, aby dostać się na platformy. Gdy będziesz mieć już wszystkie medaliki, skieruj się do przejścia na kolejny poziom.",
  "Pozbieraj kawałki kredy rozrzucone po podziemiach, ale uważaj na wszędobylskie duchy. Gdy będziesz mieć już wszystkie fragmenty, skieruj się do przejścia na kolejny poziom.",
  "Zbierz dokumenty rozrzucone przed gmachem i uniknij urzędników. Użyj drabinek, aby dostać się na platformy. Gdy będziesz mieć już wszystkie strony, skieruj się do przejścia na kolejny poziom.",
  "Zbierz napoje czekające na placu, postaraj się nie wpaść na turystów. Gdy będziesz mieć już wszystkie napoje, skieruj się do przejścia na kolejny poziom.",
  "Zbierz wszystkie mapy i udaj się na przystanek autobusowy. Rozglądaj się przed przejściem przez ulicę, uważaj na ścieżce rowerowej. Pas zieleni jest bezpiecznym miejscem pomiędzy pasami ruchu.",
  "Zbierz koła ratunkowe przed parkiem wodnym, nie stawaj na drodze ratownikom. Użyj drabinek, aby dostać się na platformy. Gdy będziesz mieć już wszystkie koła, skieruj się do przejścia na kolejny poziom.",
  "Zbierz rolki filmu, których pilnują reżyserowie. Gdy będziesz mieć już wszystkie rolki, skieruj się do przejścia na kolejny poziom.",
  "Zbierz bilety przed wejściem do podziemi, wystrzegaj się kredowych górników. Gdy będziesz mieć już wszystkie bilety, skieruj się do przejścia na kolejny poziom.",
  "Zbierz liście w parku, łobuzy w szeleszczących ubraniach nie będą przychylni. Użyj drabinek, aby dostać się na platformy. Gdy będziesz mieć już wszystkie liście, skieruj się do przejścia na kolejny poziom.",
  "Zbierz kredowe fragmenty, aby pokonać Strażnika podziemi. Co 3 sekundy jeden fragment pojawia się na innej platformie. Nie stój zbyt długo w jednym miejscu, bo duchy zaczną się do ciebie zbliżać.",
];
const aboutText =
  "Kod, grafika i muzyka są dziełem ChatGPT. Pomysł, prompty oraz spory z AI przypadają jednoosobowemu zespołowi, czyli mnie (MK). Interfejs to wspólny wysiłek człowieka i maszyny, natomiast teksty, jakkolwiek skromne, są wytworem wyłącznie ludzkim. Dziękuję wszystkim, którzy dobrowolnie obcowali z grą, zmuszonych proszę o wybaczenie.";
let infoOpen = false,
  infoPreviousState = "title",
  infoOverlayHidden = true,
  infoTrigger = null;
function showInfo(kind) {
  if (menuOpen) toggleConsoleMenu();
  if (!infoOpen) {
    infoPreviousState = state;
    infoOverlayHidden = $("#overlay").hidden;
    if (state === "playing") pauseSound();
    releaseGameInput();
    state = "paused";
  }
  infoOpen = true;
  infoTrigger = $("#" + kind);
  $("#overlay").hidden = true;
  const kicker = $("#infoKicker");
  if (kind === "about") {
    const logo = new Image(300, 120);
    logo.src = "SkoczDoChelma_logo_min.png";
    logo.alt = "Skocz do Chełma";
    logo.style.cssText = "display:block;width:auto;height:auto;max-width:100%;max-height:min(120px,16vh)";
    kicker.replaceChildren(logo);
  } else {
    kicker.textContent = "POZIOM " + stageNumber() + " - " + chapterNames[level];
  }
  $("#infoTitle").textContent = kind === "help" ? "Jak grać" : "O grze";
  $("#infoText").textContent = kind === "help" ? levelHelp[level] : aboutText;
  $("#infoPanel").hidden = false;
  $("#infoResume").focus();
  consoleHud();
  syncMusic();
}
function closeInfo(resume = true) {
  if (!infoOpen) return;
  infoOpen = false;
  $("#infoPanel").hidden = true;
  state =
    resume && ["playing", "paused"].includes(infoPreviousState)
      ? "playing"
      : infoPreviousState;
  if (resume && state === "title") start();
  else if (resume && state === "playing") unlockAudio();
  $("#overlay").hidden = state === "playing" ? true : infoOverlayHidden;
  releaseGameInput();
  consoleHud();
  syncMusic();
  if (infoTrigger) infoTrigger.focus();
}
$("#help").onclick = () => showInfo("help");
$("#about").onclick = () => showInfo("about");
$("#infoResume").onclick = () => closeInfo();

// Level 5: a fixed-camera street-crossing minigame. Traffic uses generated sprite art.
const roadRows = [358, 319, 292, 265, 230, 167, 140, 113, 76];
const roadTicketDefs = [
  [5, 1],
  [16, 1],
  [3, 3],
  [10, 3],
  [19, 3],
  [4, 5],
  [12, 5],
  [6, 7],
  [15, 7],
  [20, 7],
];
const roadSprites = [
  [218, 6, 1100, 282],
  [531, 296, 456, 187],
  [479, 488, 567, 174],
  [458, 673, 588, 169],
  [450, 850, 610, 174],
];
let roadAtlas = new Image(),
  roadExtraAtlas = new Image(),
  cyclistArt = new Image(),
  roadRow = 0,
  roadCol = 10,
  roadSafeX = 357,
  roadTraffic = [];
const roadPeriod = 2800,
  roadWidths = [260, 99, 117, 125, 122, 93, 125, 106, 131];
roadSprites.push(
  [500, 17, 515, 237],
  [429, 273, 666, 258],
  [465, 540, 585, 216],
  [410, 775, 687, 249],
);
roadExtraAtlas.src = "assets/traffic-extra.png";

cyclistArt.src = "assets/cyclist.png";
const scooterArt = new Image();
scooterArt.src = "assets/scooter.png";
// Wheel centers/rim radii in the original sprite atlases; tires and shadows stay fixed.
const roadWheels = [
  [
    [521, 250, 23],
    [1060, 250, 23],
  ],
  [
    [610, 450, 20],
    [882, 450, 20],
  ],
  [
    [600, 630, 20],
    [922, 629, 20],
  ],
  [
    [585, 808, 20],
    [924, 807, 20],
  ],
  [
    [585, 983, 20],
    [932, 983, 20],
  ],
  [
    [581, 211, 29],
    [901, 211, 29],
  ],
  [
    [570, 475, 36],
    [965, 475, 36],
  ],
  [
    [575, 704, 31],
    [923, 704, 31],
  ],
  [
    [554, 977, 30],
    [978, 977, 30],
  ],
];
roadAtlas.src = "assets/traffic-vehicles.png";
const roadLaneDefs = [
  {
    y: 113,
    dir: -1,
    speed: 155.52,
    offset: 75,
    types: [1, 5, 0, 4, 7, 2, 8, 6],
  },
  {
    y: 167,
    dir: -1,
    speed: 191.97,
    offset: 230,
    types: [3, 6, 1, 2, 5, 8, 4, 7],
  },
  {
    y: 265,
    dir: 1,
    speed: 145.8,
    offset: 140,
    types: [2, 6, 4, 3, 5, 0, 7, 8],
  },
  {
    y: 319,
    dir: 1,
    speed: 172.53,
    offset: 520,
    types: [5, 2, 8, 3, 1, 6, 4, 7],
  },
];
const roadChapter = {
  width: W,
  platforms: [],
  ghostDefs: [],
  walkers: [],
  pits: [],
  rockPositions: roadTicketDefs.map(([col, row]) => [
    48 + col * 32,
    roadRows[row],
  ]),
};
chapters.push(roadChapter);
chapterNames.push("REJOWIECKA");
itemNames.push("MAPY");
itemColors.push("#ffe6a0");
function resetRoad() {
  roadRow = 0;
  roadCol = 10;
  roadSafeX = 357;
  roadTraffic = [];
  for (const [lane, d] of roadLaneDefs.entries())
    for (let i = 0; i < d.types.length; i++)
      roadTraffic.push({ lane, type: d.types[i], phase: d.offset + i * 350 });
  roadPlaceBear();
  invincible = 0;
}
function roadPlaceBear() {
  player.x = 48 + roadCol * 32 - 11;
  player.y = roadRows[roadRow] - 24;
  player.vx = player.vy = 0;
  player.ground = true;
}
function roadVehicle(v, t = time) {
  const lane = roadLaneDefs[v.lane],
    w = roadWidths[v.type];
  return {
    x:
      ((((v.phase + lane.dir * lane.speed * t) % roadPeriod) + roadPeriod) %
        roadPeriod) -
      220,
    y: lane.y,
    w,
    h: (w * roadSprites[v.type][3]) / roadSprites[v.type][2],
    dir: lane.dir,
    type: v.type,
  };
}
function roadHit() {
  if (invincible > 0) return;
  releaseGameInput();
  lives--;
  beep(100, 0.25, "sawtooth");
  burst(player.x + 11, player.y + 24, "#fff1ce");
  keys.clear();
  if (lives <= 0) {
    hud();
    state = "over";
    gameOverSound();
    overlay(
      "Uważaj na drodze!",
      "Ale nie martw się, w każdej chwili możesz powtórzyć poziom.",
      "SPRÓBUJ JESZCZE RAZ →",
    );
    return;
  }
  roadRow = checkpoint ? 4 : 0;
  roadCol = 10;
  roadPlaceBear();
  if (checkpoint) player.x = roadSafeX;
  invincible = 1.5;
  hud();
}
function roadFinish() {
  state = "transition";
  transition = 1.2;
  keys.clear();
  player.vx = player.vy = 0;
  beep(880, 0.3, "triangle");
}
function updateRoad(dt) {
  if (state !== "playing" || !roadArtReady()) return;
  time += dt;
  elapsed += dt;
  banner = Math.max(0, banner - dt);
  invincible = Math.max(0, invincible - dt);
  jumpBuffer = 0;
  const dx =
      (keys.has("ArrowRight") || keys.has("KeyD") ? 1 : 0) -
      (keys.has("ArrowLeft") || keys.has("KeyA") ? 1 : 0),
    dy =
      (keys.has("ArrowDown") || keys.has("KeyS") ? 1 : 0) -
      (keys.has("ArrowUp") || keys.has("KeyW") ? 1 : 0),
    length = Math.hypot(dx, dy) || 1;
  player.vx = (dx / length) * 175;
  player.vy = (dy / length) * 175;
  if (dx) player.face = dx;
  player.ground = true;
  player.x = Math.max(37, Math.min(709, player.x + player.vx * dt));
  player.y = Math.max(11, Math.min(396, player.y + player.vy * dt));
  const footY = player.y + 24;
  roadCol = Math.round((player.x + 11 - 48) / 32);
  roadRow = roadRows.reduce(
    (best, y, i) =>
      Math.abs(y - footY) < Math.abs(roadRows[best] - footY) ? i : best,
    0,
  );
  if (footY >= 206 && footY <= 230) {
    if (!checkpoint) {
      checkpoint = true;
      beep(660, 0.16, "triangle");
      hud();
    }
    roadSafeX = player.x;
  }
  for (const p of particles) {
    p.t -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 300 * dt;
  }
  particles = particles.filter((p) => p.t > 0);
  // Collide at the bear's feet, not its tall illustrated head. Tested at 120 Hz.
  const feet = { x: player.x + 3, y: player.y + 18, w: 16, h: 12 };
  for (const v of roadTraffic) {
    const c = roadVehicle(v),
      bodyHeight = Math.min(44, Math.max(16, c.h - 9));
    if (
      overlap(feet, {
        x: c.x + 6,
        y: c.y + 22 - bodyHeight,
        w: c.w - 12,
        h: bodyHeight,
      })
    ) {
      roadHit();
      break;
    }
  }
  if (state !== "playing") return;
  if (invincible <= 0)
    for (const b of roadRiders()) {
      const box = bikeCollisionBox(b);
      if (box.w > 0 && overlap(feet, box)) {
        roadHit();
        break;
      }
    }
  if (state !== "playing") return;
  for (const r of rocks)
    if (
      !r.taken &&
      overlap(
        { x: player.x, y: player.y + 14, w: 22, h: 22 },
        { x: r.x - 10, y: r.y - 9, w: 20, h: 18 },
      )
    ) {
      r.taken = true;
      collected++;
      collectSound();
      burst(r.x, r.y, itemColors[level]);
      hud();
    }
  if (
    player.y + 24 >= 70 &&
    player.y + 24 <= 82 &&
    collected === targetCount() &&
    player.x + 11 >= 618 &&
    player.x + 11 <= 730
  )
    roadFinish();
}
function roadArtReady() {
  return (
    roadAtlas.complete &&
    roadAtlas.naturalWidth &&
    roadExtraAtlas.complete &&
    roadExtraAtlas.naturalWidth &&
    cyclistArt.complete &&
    cyclistArt.naturalWidth &&
    scooterArt.complete &&
    scooterArt.naturalWidth
  );
}
// Alternate full crossings: the faster scooter never catches a cyclist on screen.
function roadRiders(t = time) {
  const riders = [];
  for (const lane of [
    { dir: -1, speed: 96, y: 62, phase: 2 },
    { dir: 1, speed: 111.36, y: 430, phase: 7 },
  ]) {
    const bikeDuration = 1000 / lane.speed,
      scooterSpeed = lane.speed * 1.4,
      scooterDuration = 1000 / scooterSpeed;
    const cycle = bikeDuration + scooterDuration + 1.2,
      u = (((t + lane.phase) % cycle) + cycle) % cycle;
    let scooter = false,
      age = u;
    if (u >= bikeDuration + 0.6) {
      scooter = true;
      age = u - bikeDuration - 0.6;
    } else if (u >= bikeDuration) continue;
    if (scooter && age >= scooterDuration) continue;
    const speed = scooter ? scooterSpeed : lane.speed,
      w = scooter ? 36.51 : 61.4;
    riders.push({
      ...lane,
      speed,
      w,
      h: 58,
      scooter,
      x: lane.dir > 0 ? -100 + age * speed : W + 100 - w - age * speed,
    });
  }
  return riders;
}
function roadCyclists(t = time) {
  return roadRiders(t).filter((b) => !b.scooter);
}
function drawRoadScooter(b) {
  if (b.x + b.w <= 0 || b.x >= W) return;
  ctx.save();
  ctx.translate(b.dir > 0 ? b.x : b.x + b.w, b.y);
  ctx.scale(b.dir, 1);
  oval(ctx, b.w / 2, -1, b.w * 0.46, 2, "#15232c66");
  ctx.drawImage(scooterArt, 381, 14, 671, 1066, 0, -b.h, b.w, b.h);
  ctx.restore();
}
function bikeCollisionBox(b) {
  const left = Math.max(0, b.x + 4),
    right = Math.min(W, b.x + b.w - 4);
  return { x: left, y: b.y - 16, w: Math.max(0, right - left), h: 14 };
}
function drawBikePaths() {
  for (const [y, h] of [
    [0, 64],
    [368, 64],
  ]) {
    rect(0, y, W, h, "#424e56");
    rect(0, y === 0 ? 62 : 368, W, 2, "#d9d1b7");
    for (let yy = y + 7; yy < y + h; yy += 9)
      for (let x = 9; x < W; x += 21)
        if (noise(x, yy) > 0.55) rect(x, yy, 2, 1, "#56616a");
    for (const x of [100, 280, 480, 670]) {
      const cy = y + 46;
      ctx.save();
      ctx.translate(x, cy);
      ctx.scale(y === 0 ? -1 : 1, 1);
      ctx.translate(-x, -cy);
      ctx.strokeStyle = "#bdcec8";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x - 7, cy, 4, 0, Math.PI * 2);
      ctx.moveTo(x + 11, cy);
      ctx.arc(x + 7, cy, 4, 0, Math.PI * 2);
      ctx.moveTo(x - 7, cy);
      ctx.lineTo(x - 2, cy - 7);
      ctx.lineTo(x + 3, cy);
      ctx.lineTo(x - 7, cy);
      ctx.moveTo(x - 2, cy - 7);
      ctx.lineTo(x + 5, cy - 7);
      ctx.lineTo(x + 7, cy);
      ctx.moveTo(x + 5, cy - 7);
      ctx.lineTo(x + 4, cy - 11);
      ctx.lineTo(x + 8, cy - 11);
      // Complete saddle and seat post, clearly separated from the handlebar.
      ctx.moveTo(x - 2, cy - 7);
      ctx.lineTo(x - 2, cy - 11);
      ctx.moveTo(x - 6, cy - 11);
      ctx.lineTo(x + 1, cy - 11);
      ctx.stroke();
      ctx.restore();
      const dir = y === 0 ? -1 : 1;
      ctx.save();
      ctx.translate(x + 28, cy - 3);
      ctx.scale(dir, 1);
      poly(
        ctx,
        [
          [-6, -1],
          [2, -1],
          [2, -4],
          [7, 0],
          [2, 4],
          [2, 1],
          [-6, 1],
        ],
        "#bdcec8",
      );
      ctx.restore();
    }
  }
}
function drawRoadCyclist(b) {
  if (b.x + b.w <= 0 || b.x >= W) return;
  ctx.save();
  // Only clip to the screen: never cut a helmet off at a lane boundary.
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
  ctx.clip();
  ctx.translate(b.dir > 0 ? b.x : b.x + b.w, b.y);
  ctx.scale(b.dir, 1);
  oval(ctx, b.w / 2, -1, b.w * 0.46, 2, "#15232c66");
  ctx.drawImage(cyclistArt, 166, 33, 1106, 1045, 0, -b.h, b.w, b.h);
  const scale = b.w / 1106;
  for (const sx of [376, 1069]) {
    ctx.save();
    ctx.translate((sx - 166) * scale, -b.h + (877 - 33) * scale);
    ctx.rotate((time * b.speed) / 7);
    ctx.strokeStyle = "#c3d2ce";
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.7;
    for (let k = 0; k < 3; k++) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}
function drawTicketArtwork() {
  oval(ctx, 0, 5, 12, 4, "#111b2b66");
  rect(-12, -8, 24, 16, "#493f32");
  rect(-11, -9, 22, 16, "#fff0ba");
  rect(-11, -9, 22, 3, "#da935b");
  rect(-7, -3, 10, 2, "#626e78");
  rect(-7, 1, 7, 1, "#929081");
  for (let k = -6; k < 6; k += 3) rect(6, k, 1, 1, "#947b56");
  rect(-13, -2, 3, 4, "#3b4856");
  rect(10, -2, 3, 4, "#3b4856");
}
function drawMapArtwork() {
  oval(ctx, 0, 8, 13, 3, "#111b2b66");
  const panel = (points, color) => {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (const p of points.slice(1)) ctx.lineTo(...p);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#405a51";
    ctx.lineWidth = 1;
    ctx.stroke();
  };
  panel(
    [
      [-13, -9],
      [-4, -6],
      [-4, 11],
      [-13, 8],
    ],
    "#e4edbd",
  );
  panel(
    [
      [-4, -6],
      [4, -10],
      [4, 7],
      [-4, 11],
    ],
    "#f9f3d8",
  );
  panel(
    [
      [4, -10],
      [13, -7],
      [13, 10],
      [4, 7],
    ],
    "#c9dda8",
  );
  ctx.strokeStyle = "#69b8d1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-11, -5);
  ctx.lineTo(-7, 1);
  ctx.lineTo(0, 0);
  ctx.lineTo(5, 4);
  ctx.lineTo(11, 3);
  ctx.stroke();
  ctx.strokeStyle = "#b08b59";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-10, 5);
  ctx.lineTo(-2, 3);
  ctx.lineTo(4, -3);
  ctx.lineTo(10, -3);
  ctx.stroke();
  rect(6, -5, 4, 4, "#c95048");
  rect(7, -4, 2, 2, "#fff2cf");
}
function roadTicket(r) {
  const y = r.y + Math.sin(time * 4.8 + r.x) * 2.5;
  ctx.save();
  ctx.translate(r.x, y);
  drawMapArtwork();
  ctx.restore();
}
function roadText(text, x, y, size = 9, color = "#fff1c8", align = "left") {
  ctx.font = "bold " + size + "px monospace";
  ctx.textAlign = align;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.textAlign = "left";
}
function roadPlant(x, y) {
  oval(ctx, x + 3, y + 3, 12, 7, "#233c35");
  for (const [dx, dy, r, c] of [
    [0, 0, 10, "#355c42"],
    [-5, -3, 7, "#558151"],
    [5, -4, 6, "#71935b"],
  ])
    oval(ctx, x + dx, y + dy, r, r * 0.65, c);
}
function roadPaving(y, h) {
  rect(0, y, W, h, "#a49b89");
  for (let yy = y; yy < y + h; yy += 12)
    for (let x = -((Math.floor(yy / 12) % 2) * 18); x < W; x += 36) {
      rect(x + 1, yy + 1, 34, 10, noise(x, yy) > 0.5 ? "#b9ae97" : "#c9bda4");
      rect(x + 2, yy + 1, 32, 1, "#ddd0b5");
    }
}
// Occupants use atlas coordinates, clipped inside glass and transformed with each vehicle.
const roadOccupantWindows = [
  [
    [460, 139, 574, 184, 510, 153],
    [600, 139, 734, 185, 664, 151],
    [889, 140, 1007, 184, 950, 152],
    [1038, 140, 1120, 184, 1085, 154],
    [1207, 140, 1238, 183, 1224, 152],
  ],
  [[735, 347, 799, 380, 758, 354]],
  [[735, 526, 798, 557, 758, 533]],
  [[735, 710, 796, 736, 758, 715]],
  [[735, 887, 796, 915, 758, 892]],
  [[725, 84, 789, 119, 750, 90]],
  [[762, 319, 817, 360, 784, 327]],
  [[729, 584, 779, 610, 748, 587]],
  [[839, 833, 886, 869, 859, 838]],
];
function drawRoadOccupants(car, crop) {
  const scale = car.w / crop[2];
  ctx.save();
  ctx.translate(0, 25 - crop[3] * scale);
  ctx.scale(scale, scale);
  ctx.translate(-crop[0], -crop[1]);
  for (const [i, a] of roadOccupantWindows[car.type].entries()) {
    const [l, t, r, b, x, y] = a;
    ctx.save();
    ctx.beginPath();
    ctx.rect(l, t, r - l, b - t);
    ctx.clip();
    // Size heads from the visible glass height, keeping the crown below its top edge.
    const h = b - t,
      rx = Math.min(9, (r - l) * 0.23),
      ry = Math.min(9, h * 0.25),
      cy = t + ry + 2;
    ctx.globalAlpha = 0.96;
    ctx.fillStyle = "#172b35";
    // Broad, rounded seated shoulders, with a narrow neck distinctly above them.
    const shoulderY = cy + ry + 5;
    ctx.beginPath();
    ctx.moveTo(x - 4, shoulderY - 2);
    ctx.bezierCurveTo(
      x - 12,
      shoulderY - 2,
      x - 18,
      shoulderY + 2,
      x - 18,
      b + 4,
    );
    ctx.lineTo(x + 19, b + 4);
    ctx.bezierCurveTo(
      x + 18,
      shoulderY + 2,
      x + 11,
      shoulderY - 2,
      x + 4,
      shoulderY - 2,
    );
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#425661";
    ctx.fillRect(x - 3, cy + ry - 1, 6, 7);
    // Oval head and small forward-facing nose; lighter glass tint separates head from torso.
    ctx.fillStyle = "#50616b";
    ctx.beginPath();
    ctx.ellipse(x, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + rx - 2, cy - 2);
    ctx.lineTo(x + rx + 3, cy + 2);
    ctx.lineTo(x + rx - 2, cy + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1c303b";
    ctx.beginPath();
    ctx.ellipse(x - 1, cy - 2, rx, ry * 0.8, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#82949b";
    ctx.globalAlpha = 0.65;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(x, cy, rx, ry, 0, Math.PI * 0.95, Math.PI * 1.8);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
function drawRoadWheels(car, crop, atlas, speed) {
  const scale = car.w / crop[2],
    top = 25 - crop[3] * scale;
  for (const [sx, sy, r] of roadWheels[car.type]) {
    const radius = r * scale;
    ctx.save();
    ctx.translate((sx - crop[0]) * scale, top + (sy - crop[1]) * scale);
    // Tire, outer rim and hub remain fixed; only balanced inner details rotate.
    const disk = (r, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    };
    disk(radius, "#66747c");
    disk(radius * 0.94, "#c2cbd0");
    disk(radius * 0.81, "#35434b");
    ctx.save();
    ctx.rotate((time * speed) / (radius * 1.3));
    if (car.type === 0) {
      disk(radius * 0.8, "#929fa8");
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4;
        ctx.fillStyle = "#35434c";
        ctx.beginPath();
        ctx.arc(
          Math.cos(a) * radius * 0.61,
          Math.sin(a) * radius * 0.61,
          radius * 0.13,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    } else {
      const spokes = [0, 5, 7, 6, 8, 5, 6, 5, 6][car.type];
      ctx.strokeStyle = "#b8c2c9";
      ctx.lineWidth = radius * 0.17;
      ctx.lineCap = "butt";
      for (let k = 0; k < spokes; k++) {
        const a = (k * Math.PI * 2) / spokes;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * radius * 0.21, Math.sin(a) * radius * 0.21);
        ctx.lineTo(Math.cos(a) * radius * 0.8, Math.sin(a) * radius * 0.8);
        ctx.stroke();
      }
    }
    ctx.restore();
    disk(radius * 0.27, "#b8c3ca");
    disk(radius * 0.12, "#61727e");
    ctx.restore();
  }
}
function drawRoad() {
  ctx.clearRect(0, 0, W, H);
  rect(0, 0, W, H, "#344351");
  roadPaving(0, 86);
  roadPaving(346, 86);
  drawBikePaths();
  // Two wider lanes each way; a narrower median still fits the complete bear sprite.
  for (const [top, bottom] of [
    [86, 194],
    [238, 346],
  ]) {
    rect(0, top, W, bottom - top, "#3c4a56");
    for (let y = top + 4; y < bottom; y += 7)
      for (let x = 3; x < W; x += 19)
        if (noise(x, y) > 0.5) rect(x, y, 2, 1, "#52606b");
    for (let y = top + 54; y < bottom; y += 54)
      for (let x = 12; x < W; x += 64) rect(x, y - 1, 31, 2, "#bdc6c2");
    rect(0, top, W, 2, "#e4d9ad");
    rect(0, bottom - 2, W, 2, "#e4d9ad");
  }
  roadPaving(194, 44);
  rect(0, 196, W, 3, "#e1d5b9");
  rect(0, 235, W, 3, "#7c8275");
  for (const y of [82, 191, 236, 345]) {
    rect(0, y, W, 4, "#59616a");
    for (let x = 0; x < W; x += 32) rect(x + 1, y, 29, 2, "#d7cfb6");
  }
  for (const d of roadLaneDefs)
    for (const x of [110, 385, 660]) {
      ctx.save();
      ctx.translate(x, d.y);
      ctx.scale(d.dir, 1);
      poly(
        ctx,
        [
          [-10, -2],
          [2, -2],
          [2, -6],
          [11, 0],
          [2, 6],
          [2, 2],
          [-10, 2],
        ],
        "#697780",
      );
      ctx.restore();
    }
  // Sidewalk greenery and street furniture stay outside the crossing route.
  for (const x of [10, 27, 741, 758]) {
    roadPlant(x, 218);
    if (x < 384) {
      roadPlant(x, 77);
      roadPlant(x, 358);
    }
  }
  // Paint the editable median wording beneath the traffic and player sprites.
  const medianMessage = checkpointSign.querySelector(
    '[data-kind="road"][data-saved="' + checkpoint + '"]'
  );
  if (medianMessage) {
    roadText(medianMessage.textContent.trim(), 210, 222, 12, "#3a514f", "center");
  }
  // Far-side bus shelter and finish pad.
  const ready = collected === targetCount();
  rect(618, 66, 112, 18, ready ? roadExitPulse(time) : "#647c88");
  rect(618, 65, 112, 2, "#244c66");

  rect(599, 67, 3, 17, "#344753");
  rect(591, 66, 20, 15, "#2d7592");
  rect(594, 68, 14, 8, "#dae8d7");
  rect(596, 69, 10, 4, "#35556c");
  rect(596, 75, 2, 2, "#1d354a");
  rect(603, 75, 2, 2, "#1d354a");


  // Sort by lane to keep all vehicle silhouettes readable.
  for (const v of roadTraffic) {
    const c = roadVehicle(v);
    if (c.x + c.w < 0 || c.x > W) continue;
    const crop = roadSprites[c.type];
    ctx.save();
    ctx.translate(c.dir > 0 ? c.x : c.x + c.w, c.y);
    ctx.scale(c.dir, 1);
    oval(ctx, c.w / 2, 20, c.w * 0.46, 7, "#15232c99");
    const atlas = c.type >= 5 ? roadExtraAtlas : roadAtlas;
    if (atlas.complete && atlas.naturalWidth) {
      ctx.drawImage(
        atlas,
        ...crop,
        0,
        25 - (c.w * crop[3]) / crop[2],
        c.w,
        (c.w * crop[3]) / crop[2],
      );
      drawRoadOccupants(c, crop);
      drawRoadWheels(c, crop, atlas, roadLaneDefs[v.lane].speed);
    }
    ctx.restore();
  }
  for (const b of roadRiders())
    if (b.scooter) {
      if (scooterArt.complete && scooterArt.naturalWidth) drawRoadScooter(b);
    } else if (cyclistArt.complete && cyclistArt.naturalWidth)
      drawRoadCyclist(b);
  for (const r of rocks) if (!r.taken) roadTicket(r);
  if (invincible <= 0 || Math.floor(time * 12) % 2 === 0)
    bear(player.x, player.y);
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.t / 0.5);
    rect(p.x, p.y, 3, 3, p.color);
    ctx.restore();
  }

  if (state === "transition") {
    rect(0, 0, W, H, "#101f29cc");
    label("NEXT STOP: " + chapterNames[nextStage()] + "...", 225, 210);
  }
  if (!roadArtReady()) label("LOADING VEHICLES...", 305, 215);
}

// Level 6 — an original aquapark route, independent of the earlier layouts.
const aquaArt = new Image();
aquaArt.src = "assets/aquapark-16bit.png";
const aquaLedges = [
  [175, 314, 170],
  [420, 252, 160],
  [660, 292, 180],
  [900, 218, 170],
  [1155, 304, 160],
  [1400, 244, 180],
  [1660, 310, 170],
  [1900, 250, 160],
  [2155, 190, 170],
  [2405, 300, 180],
  [2670, 242, 170],
  [2915, 310, 170],
  [3165, 252, 180],
  [3420, 194, 160],
  [3670, 290, 180],
  [3930, 232, 170],
  [4190, 306, 180],
  [4445, 252, 160],
  [4650, 318, 130],
];
const aquapark = {
  width: 4800,
  floorY: 400,
  pits: [
    { x: 560, w: 85 },
    { x: 1510, w: 90 },
    { x: 2080, w: 90 },
    { x: 3350, w: 85 },
    { x: 4090, w: 90 },
  ],
  platforms: [],
  rockPositions: [[110, 374]],
  ghostDefs: [],
  walkers: [],
};
let aquaCursor = 0;
for (const pit of aquapark.pits) {
  aquapark.platforms.push({
    x: aquaCursor,
    y: 400,
    w: pit.x - aquaCursor,
    h: 34,
    street: true,
  });
  aquaCursor = pit.x + pit.w;
}
aquapark.platforms.push({
  x: aquaCursor,
  y: 400,
  w: 4800 - aquaCursor,
  h: 34,
  street: true,
});
aquaLedges.forEach(([x, y, w], i) => {
  const p = { x, y, w, h: 20, ladderAccess: true };
  const lift = [2, 7, 12, 16].indexOf(i);
  if (lift >= 0) {
    Object.assign(p, {
      baseX: x,
      baseY: y,
      travel: lift % 2 ? 26 : 40,
      axis: lift % 2 ? "y" : "x",
      phase: 0.6 + lift * 1.27,
      liftSpeed: 0.65 + lift * 0.09,
    });
  }
  const shaped = [1, 5, 10, 14].includes(i),
    u = [5, 14].includes(i);
  if (shaped) {
    const group = "aqua-shape-" + i;
    aquapark.platforms.push(
      { x, y: y - 26, w: 34, h: 46, shapePiece: true, group },
      {
        x: x + 34,
        y,
        w: w - 34 - (u ? 34 : 0),
        h: 20,
        shapePiece: true,
        group,
        ladderAccess: true,
      },
    );
    if (u)
      aquapark.platforms.push({
        x: x + w - 34,
        y: y - 26,
        w: 34,
        h: 46,
        shapePiece: true,
        group,
      });
  } else aquapark.platforms.push(p);
  aquapark.rockPositions.push(
    [x + 24, y - 24 - (shaped ? 26 : 0)],
    [x + w - 24, y - 24 - (u ? 26 : 0)],
  );
});
// Ground patrols and wider raised surfaces, with no pit-edge pacing traps.
for (const [i, p] of aquapark.platforms
  .filter((p) => !p.travel && p.w >= 130)
  .entries()) {
  if (p.street) {
    if (p.x === 0)
      aquapark.walkers.push({
        left: 300,
        right: 460,
        floor: 400,
        speed: 29,
        phase: 0.2,
        kind: "lifeguard",
      });
    else
      aquapark.walkers.push({
        left: p.x + 45,
        right: Math.min(p.x + p.w - 60, p.x + 205),
        floor: 400,
        speed: 30 + (i % 3) * 4,
        phase: i * 0.17,
        kind: "lifeguard",
      });
  } else
    aquapark.walkers.push({
      left: p.x + 20,
      right: p.x + p.w - 48,
      floor: p.y,
      speed: 25 + (i % 4) * 3,
      phase: i * 0.23,
      kind: "lifeguard",
    });
}
chapters.push(aquapark);
chapterNames.push("CHEŁMSKI PARK WODNY");
itemNames.push("KOŁA RATUNKOWE");
itemColors.push("#ff9569");
function drawAquaBackground() {
  const y = 394,
    sy = (aquaArt.naturalHeight * y) / H;
  ctx.drawImage(
    aquaArt,
    0,
    0,
    aquaArt.naturalWidth,
    sy,
    -Math.round(camera * (85 / (WORLD - W))),
    0,
    860,
    y,
  );
  drawGroundStrip(aquaArt, y, 860);
}
function poolPlatform(p) {
  rect(p.x, p.y, p.w, p.h, "#325e67");
  for (let y = 0; y < p.h; y += 10)
    for (let x = 0; x < p.w; x += 18) {
      const w = Math.min(17, p.w - x),
        h = Math.min(9, p.h - y);
      rect(
        p.x + x,
        p.y + y,
        w,
        h,
        (x / 18 + y / 10) % 3 === 0 ? "#7dc3c2" : "#4b999f",
      );
      rect(p.x + x, p.y + y, w, 1, "#b8e1d3");
      rect(p.x + x, p.y + y, 1, h, "#91cdc7");
    }
  rect(p.x, p.y, p.w, 3, "#f4e9c5");
  rect(p.x, p.y + 3, p.w, 1, "#c6bc9c");
  rect(p.x, p.y + p.h - 2, p.w, 2, "#315764");
}
function poolLadder(l) {
  for (const x of [l.x - 10, l.x + 8]) {
    rect(x, l.top - 5, 3, l.bottom - l.top + 5, "#516f80");
    rect(x, l.top - 5, 1, l.bottom - l.top + 5, "#e4eeeb");
  }
  for (let y = l.top + 5; y < l.bottom; y += 13) {
    rect(l.x - 9, y, 18, 3, "#718e9d");
    rect(l.x - 9, y, 18, 1, "#e4eeeb");
  }
}
function makeLifeguard(frame) {
  const [c, g] = spriteCanvas(64, 84),
    step = Math.sin((frame * Math.PI) / 3) * 5;
  for (const [x, d] of [
    [23, step],
    [40, -step],
  ]) {
    poly(
      g,
      [
        [x - 4, 52],
        [x + 4, 52],
        [x + 4 + d, 75],
        [x - 4 + d, 75],
      ],
      "#dca47d",
    );
    oval(g, x + d + 2, 77, 7, 3, "#344b5b");
    g.fillStyle = "#f6d7a8";
    g.fillRect(x + d - 3, 74, 8, 2);
  }
  poly(
    g,
    [
      [18, 48],
      [45, 48],
      [44, 64],
      [34, 64],
      [31, 55],
      [28, 64],
      [18, 64],
    ],
    "#bd3e44",
  );
  poly(
    g,
    [
      [19, 49],
      [29, 49],
      [27, 61],
      [19, 61],
    ],
    "#ee6260",
  );
  poly(
    g,
    [
      [19, 30],
      [43, 30],
      [47, 51],
      [16, 51],
    ],
    "#f3cb59",
  );
  poly(
    g,
    [
      [20, 32],
      [29, 32],
      [27, 50],
      [17, 50],
    ],
    "#ffe18b",
  );
  for (const [x, d] of [
    [15, -step / 2],
    [47, step / 2],
  ]) {
    poly(
      g,
      [
        [x - 3, 34],
        [x + 3, 34],
        [x + 3, 51 + d],
        [x - 3, 51 + d],
      ],
      "#edb990",
    );
    oval(g, x, 53 + d, 3, 4, "#edb990");
  }
  oval(g, 32, 19, 11, 13, "#bb825e");
  oval(g, 31, 18, 10, 12, "#f0c49a");
  poly(
    g,
    [
      [21, 13],
      [23, 5],
      [36, 4],
      [42, 12],
    ],
    "#dc4d4d",
  );
  g.fillStyle = "#fa7470";
  g.fillRect(21, 11, 24, 3);
  g.fillStyle = "#314b5c";
  g.fillRect(26, 17, 16, 3);
  g.fillRect(29, 20, 3, 1);
  g.fillRect(36, 20, 3, 1);
  g.fillStyle = "#935d51";
  g.fillRect(34, 26, 4, 1);
  poly(
    g,
    [
      [26, 30],
      [28, 30],
      [33, 42],
      [38, 30],
      [40, 30],
      [34, 45],
      [32, 45],
    ],
    "#e8f0de",
  );
  g.fillStyle = "#426773";
  g.fillRect(32, 42, 5, 3);
  g.fillStyle = "#b73b40";
  g.fillRect(30, 33, 7, 2);
  return c;
}
// Original "Long Summer Afternoon": 32-bar bright pop-adventure theme.
// A/A'/B/return phrasing, warm keyboard lead, guitar, bass and soft drums.
// Every release and echo wraps into the loop, so the last chord is never cut.
function buildSummerMusic(ac) {
  const rate = ac.sampleRate,
    beat = 60 / 120,
    length = 128 * beat,
    n = Math.round(length * rate),
    buffer = ac.createBuffer(1, n, rate),
    out = buffer.getChannelData(0);
  let seed = 53155;
  function note(m, start, dur, vol, voice = 0) {
    const hz = 440 * 2 ** ((m - 69) / 12),
      at = Math.round(start * beat * rate),
      hold = dur * beat,
      release = voice === 1 ? 0.15 : 0.24,
      count = Math.ceil((hold + release) * rate);
    for (let j = 0; j < count; j++) {
      const t = j / rate,
        p = 2 * Math.PI * hz * t,
        attack = Math.min(1, t / 0.012),
        tail = t > hold ? Math.max(0, 1 - (t - hold) / release) ** 2 : 1;
      let wave, env;
      if (voice === 0) {
        wave = Math.sin(p) + 0.22 * Math.sin(2 * p) + 0.08 * Math.sin(3 * p);
        env = attack * (0.55 + 0.45 * Math.exp(-t * 7)) * tail;
      } else if (voice === 1) {
        wave = Math.sin(p) + 0.35 * Math.sin(2 * p) + 0.13 * Math.sin(3 * p);
        env = attack * Math.exp(-t * 7) * tail;
      } else {
        wave = Math.sin(p) + 0.18 * Math.sin(2 * p);
        env = attack * (0.7 + 0.3 * Math.exp(-t * 9)) * tail;
      }
      const sample = wave * env * vol;
      out[(at + j) % n] += sample;
      if (voice === 0) {
        out[(at + j + Math.round(beat * 0.75 * rate)) % n] += sample * 0.16;
        out[(at + j + Math.round(beat * 1.5 * rate)) % n] += sample * 0.07;
      }
    }
  }
  function drum(start, type) {
    const at = Math.round(start * beat * rate),
      dur = type === 0 ? 0.23 : type === 1 ? 0.16 : 0.045;
    let phase = 0;
    for (let j = 0; j < dur * rate; j++) {
      const t = j / rate;
      seed = (1664525 * seed + 1013904223) >>> 0;
      const noise = seed / 2147483648 - 1;
      phase += (2 * Math.PI * (48 + 65 * Math.exp(-t * 35))) / rate;
      const value =
        type === 0
          ? Math.sin(phase) * Math.exp(-t * 22) * 0.015
          : type === 1
            ? (noise * 0.65 + Math.sin(2 * Math.PI * 180 * t) * 0.35) *
              Math.exp(-t * 30) *
              0.007
            : noise * Math.exp(-t * 100) * 0.0025;
      out[(at + j) % n] +=
        value * Math.min(1, t / 0.004) * Math.min(1, (dur - t) / 0.012);
    }
  }
  const chords = [
      [60, 64, 67],
      [55, 59, 62],
      [57, 60, 64],
      [53, 57, 60],
      [60, 64, 67],
      [62, 65, 69],
      [53, 57, 60],
      [55, 59, 62],
    ],
    verse = [
      [
        [76, 0, 0.75],
        [79, 1, 0.5],
        [81, 1.75, 0.75],
        [79, 2.75, 1],
      ],
      [
        [74, 0, 1],
        [76, 1.5, 0.5],
        [74, 2.25, 0.5],
        [71, 3, 0.75],
      ],
      [
        [72, 0, 0.5],
        [76, 0.75, 0.5],
        [79, 1.5, 1.25],
        [76, 3, 0.75],
      ],
      [
        [77, 0, 1.5],
        [76, 2, 0.5],
        [72, 2.75, 1],
      ],
      [
        [76, 0, 0.75],
        [79, 1, 0.5],
        [84, 1.75, 1.25],
        [81, 3.25, 0.5],
      ],
      [
        [81, 0, 0.5],
        [79, 0.75, 0.75],
        [77, 1.75, 0.5],
        [74, 2.5, 1],
      ],
      [
        [77, 0, 0.75],
        [76, 1, 0.75],
        [72, 2, 1.5],
      ],
      [
        [74, 0, 1],
        [71, 1.5, 0.5],
        [72, 2.5, 1],
      ],
    ],
    bridge = [
      [
        [81, 0, 1],
        [84, 1.5, 0.5],
        [83, 2.25, 0.75],
        [79, 3.25, 0.5],
      ],
      [
        [79, 0, 1.5],
        [77, 2, 0.5],
        [74, 3, 0.75],
      ],
      [
        [76, 0, 0.5],
        [79, 0.75, 0.5],
        [81, 1.5, 1],
        [84, 3, 0.75],
      ],
      [
        [81, 0, 2],
        [79, 2.5, 1],
      ],
      [
        [84, 0, 0.75],
        [83, 1, 0.5],
        [79, 1.75, 0.75],
        [76, 2.75, 1],
      ],
      [
        [77, 0, 1],
        [81, 1.5, 1],
        [79, 3, 0.75],
      ],
      [
        [77, 0, 0.5],
        [76, 0.75, 0.5],
        [74, 1.5, 0.75],
        [72, 2.5, 1],
      ],
      [
        [74, 0, 1.5],
        [71, 2, 0.75],
        [67, 3, 0.75],
      ],
    ];
  for (let bar = 0; bar < 32; bar++) {
    const t = bar * 4,
      ch = chords[bar % 8],
      mel = bar >= 16 && bar < 24 ? bridge[bar % 8] : verse[bar % 8];
    for (const [pitch, offset, dur] of mel) note(pitch, t + offset, dur, 0.011);
    if (bar >= 8 && bar < 16 && bar % 2 === 0)
      note(ch[2] + 12, t + 3.75, 0.18, 0.004, 1);
    for (const offset of [0, 0.75, 1.5, 2.5, 3.25])
      for (const pitch of ch) note(pitch, t + offset, 0.32, 0.0025, 1);
    for (const [offset, pitch] of [
      [0, ch[0] - 24],
      [1.5, ch[0] - 12],
      [2, ch[0] - 24],
      [3.25, ch[2] - 24],
    ])
      note(pitch, t + offset, 0.55, 0.009, 2);
    for (const offset of [0, 2, 2.75]) drum(t + offset, 0);
    for (const offset of [1, 3]) drum(t + offset, 1);
    for (let i = 0; i < 8; i++) drum(t + i * 0.5, 2);
    if (bar % 8 === 7) for (const offset of [3.5, 3.75]) drum(t + offset, 1);
  }
  return balanceMusic(buffer);
}

const CINEMA_ROAD_Y = H * (923 / 1024);
const cinemaArt = new Image();
cinemaArt.src = "assets/zorza-16bit.png";
const cinemaLedges = [
  [155, 316, 180],
  [395, 258, 170],
  [640, 200, 180],
  [885, 286, 170],
  [1130, 230, 180],
  [1380, 308, 170],
  [1625, 246, 180],
  [1880, 192, 170],
  [2130, 286, 180],
  [2385, 318, 170],
  [2640, 256, 180],
  [2895, 196, 170],
  [3150, 290, 180],
  [3410, 232, 180],
  [3670, 306, 170],
  [3925, 246, 180],
  [4180, 188, 170],
  [4435, 278, 180],
  [4660, 318, 130],
];
const cinemapark = {
  width: 4800,
  floorY: 400,
  pits: [
    { x: 735, w: 85 },
    { x: 1290, w: 90 },
    { x: 2210, w: 85 },
    { x: 3290, w: 90 },
    { x: 4320, w: 85 },
  ],
  platforms: [],
  rockPositions: [[110, 374]],
  ghostDefs: [],
  walkers: [],
};
let cinemaCursor = 0;
for (const pit of cinemapark.pits) {
  cinemapark.platforms.push({
    x: cinemaCursor,
    y: 400,
    w: pit.x - cinemaCursor,
    h: 34,
    street: true,
  });
  cinemaCursor = pit.x + pit.w;
}
cinemapark.platforms.push({
  x: cinemaCursor,
  y: 400,
  w: 4800 - cinemaCursor,
  h: 34,
  street: true,
});
cinemaLedges.forEach(([x, y, w], i) => {
  const p = { x, y, w, h: 20, ladderAccess: true };
  const lift = [3, 6, 13, 17].indexOf(i);
  if (lift >= 0) {
    Object.assign(p, {
      baseX: x,
      baseY: y,
      travel: lift % 2 ? 26 : 40,
      axis: lift % 2 ? "y" : "x",
      phase: 0.6 + lift * 1.27,
      liftSpeed: 0.65 + lift * 0.09,
    });
  }
  const shaped = [0, 4, 9, 15].includes(i),
    u = [4, 15].includes(i);
  if (shaped) {
    const group = "cinema-shape-" + i;
    cinemapark.platforms.push(
      { x, y: y - 26, w: 34, h: 46, shapePiece: true, group },
      {
        x: x + 34,
        y,
        w: w - 34 - (u ? 34 : 0),
        h: 20,
        shapePiece: true,
        group,
        ladderAccess: true,
      },
    );
    if (u)
      cinemapark.platforms.push({
        x: x + w - 34,
        y: y - 26,
        w: 34,
        h: 46,
        shapePiece: true,
        group,
      });
  } else cinemapark.platforms.push(p);
  cinemapark.rockPositions.push(
    [x + 24, y - 24 - (shaped ? 26 : 0)],
    [x + w - 24, y - 24 - (u ? 26 : 0)],
  );
});
// Ground patrols and wider raised surfaces, with no pit-edge pacing traps.
for (const [i, p] of cinemapark.platforms
  .filter((p) => !p.travel && p.w >= 130)
  .entries()) {
  if (p.street) {
    if (p.x === 0)
      cinemapark.walkers.push({
        left: 300,
        right: 460,
        floor: 400,
        speed: 29,
        phase: 0.2,
        kind: "director",
      });
    else
      cinemapark.walkers.push({
        left: p.x + 45,
        right: Math.min(p.x + p.w - 60, p.x + 205),
        floor: 400,
        speed: 30 + (i % 3) * 4,
        phase: i * 0.17,
        kind: "director",
      });
  } else
    cinemapark.walkers.push({
      left: p.x + 20,
      right: p.x + p.w - 48,
      floor: p.y,
      speed: 25 + (i % 4) * 3,
      phase: i * 0.23,
      kind: "director",
    });
}
chapters.push(cinemapark);
chapterNames.push("KINO ZORZA");
itemNames.push("ROLKI FILMU");
itemColors.push("#c9e1f2");
// The curb ends at source row 923; everything below it is scrolling road.
function drawCinemaBackground() {
  const y = CINEMA_ROAD_Y,
    sy = (cinemaArt.naturalHeight * y) / H;
  ctx.drawImage(
    cinemaArt,
    0,
    0,
    cinemaArt.naturalWidth,
    sy,
    -Math.round(camera * (85 / (WORLD - W))),
    0,
    860,
    y,
  );
  drawGroundStrip(cinemaArt, y, 860);
  cinemaRoofBirds();
}

function trussPlatform(p) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(p.x, p.y, p.w, p.h);
  ctx.clip();
  // Open lattice: the background remains visible between the structural beams.
  for (let x = p.x; x < p.x + p.w; x += 24) {
    const right = Math.min(x + 24, p.x + p.w);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#3b4f68";
    ctx.beginPath();
    ctx.moveTo(x, p.y + 3);
    ctx.lineTo(right, p.y + p.h - 3);
    ctx.moveTo(x, p.y + p.h - 3);
    ctx.lineTo(right, p.y + 3);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#bccddb";
    ctx.stroke();
    rect(x, p.y, 3, p.h, "#8297ab");
    rect(x, p.y, 1, p.h, "#d2e2e7");
  }
  for (const y of [p.y, p.y + p.h - 4]) {
    rect(p.x, y, p.w, 4, "#4c627b");
    rect(p.x, y, p.w, 1, "#e0e9e6");
    rect(p.x, y + 1, p.w, 1, "#a9bdca");
  }
  for (let x = p.x + 5; x < p.x + p.w - 3; x += 24) {
    rect(x, p.y + 1, 2, 2, "#f4edc9");
    rect(x, p.y + p.h - 3, 2, 2, "#293d52");
  }
  ctx.restore();
}
function makeDirector(frame) {
  const [c, g] = spriteCanvas(64, 84),
    step = Math.sin((frame * Math.PI) / 3) * 5;
  for (const [x, d] of [
    [23, step],
    [40, -step],
  ]) {
    poly(
      g,
      [
        [x - 4, 52],
        [x + 4, 52],
        [x + 4 + d, 76],
        [x - 4 + d, 76],
      ],
      "#293c53",
    );
    poly(
      g,
      [
        [x - 3, 55],
        [x, 55],
        [x + d, 74],
        [x - 3 + d, 74],
      ],
      "#52667a",
    );
    oval(g, x + d + 2, 78, 7, 3, "#172a3c");
  }
  poly(
    g,
    [
      [19, 30],
      [43, 30],
      [47, 58],
      [16, 58],
    ],
    "#313b50",
  );
  poly(
    g,
    [
      [20, 32],
      [28, 32],
      [27, 56],
      [17, 56],
    ],
    "#5d6176",
  );
  poly(
    g,
    [
      [28, 30],
      [32, 37],
      [37, 30],
      [38, 35],
      [32, 42],
      [26, 35],
    ],
    "#e7d5a8",
  );
  g.fillStyle = "#d3b485";
  g.fillRect(29, 37, 4, 16);
  for (const [x, d] of [
    [15, -step / 2],
    [46, step / 2],
  ]) {
    poly(
      g,
      [
        [x - 3, 34],
        [x + 3, 34],
        [x + 3, 53 + d],
        [x - 3, 53 + d],
      ],
      "#414c62",
    );
    oval(g, x, 54 + d, 3, 4, "#edbc95");
  }
  oval(g, 32, 20, 11, 13, "#ad7c68");
  oval(g, 31, 19, 10, 12, "#efc49d");
  poly(
    g,
    [
      [23, 24],
      [28, 28],
      [38, 27],
      [41, 23],
      [39, 32],
      [30, 34],
      [24, 30],
    ],
    "#65504b",
  );
  oval(g, 29, 7, 13, 6, "#293448");
  oval(g, 26, 5, 9, 3, "#536071");
  g.fillStyle = "#172c3e";
  g.fillRect(20, 11, 22, 3);
  g.fillRect(25, 18, 17, 3);
  g.fillStyle = "#8eb5c8";
  g.fillRect(27, 18, 4, 1);
  g.fillRect(36, 18, 4, 1);
  // Black-and-white clapperboard, carried clearly beside the body.
  g.fillStyle = "#182a3e";
  g.fillRect(39, 54 + step / 2, 20, 17);
  g.fillStyle = "#dbe0db";
  g.fillRect(41, 61 + step / 2, 15, 1);
  g.fillRect(41, 65 + step / 2, 11, 1);
  g.fillStyle = "#e6e8dd";
  g.fillRect(38, 51 + step / 2, 21, 5);
  g.fillStyle = "#283749";
  for (let x = 39; x < 59; x += 7)
    poly(
      g,
      [
        [x, 51 + step / 2],
        [x + 4, 51 + step / 2],
        [x + 1, 56 + step / 2],
        [x - 3, 56 + step / 2],
      ],
      "#283749",
    );
  return c;
}
// Original "The Lights Go Down": cinematic 32-bar score, no borrowed melody.
function buildCinemaMusic(ac) {
  const rate = ac.sampleRate,
    beat = 60 / 108,
    n = Math.round(128 * beat * rate),
    buffer = ac.createBuffer(1, n, rate),
    out = buffer.getChannelData(0);
  function note(m, start, dur, vol, voice) {
    const hz = 440 * 2 ** ((m - 69) / 12),
      at = Math.round(start * beat * rate),
      hold = dur * beat,
      release = voice === 1 ? 0.45 : 0.22;
    for (let j = 0; j < (hold + release) * rate; j++) {
      const t = j / rate,
        p = 2 * Math.PI * hz * t,
        env =
          Math.min(1, t / (voice === 1 ? 0.12 : 0.025)) *
          (t > hold ? Math.max(0, 1 - (t - hold) / release) ** 2 : 1);
      let wave;
      if (voice === 1)
        wave =
          (Math.sin(p) +
            0.18 * Math.sin(p * 1.002) +
            0.22 * Math.sin(2 * p) +
            0.1 * Math.sin(3 * p)) *
          0.7;
      else if (voice === 2)
        wave = (Math.sin(p) + 0.3 * Math.sin(2 * p)) * Math.exp(-t * 8);
      else
        wave =
          (Math.sin(p) + 0.3 * Math.sin(2 * p) + 0.12 * Math.sin(3 * p)) *
          (0.65 + 0.35 * Math.exp(-t * 4));
      const sample = wave * env * vol;
      out[(at + j) % n] += sample;
      if (voice === 0) {
        out[(at + j + Math.round(0.75 * beat * rate)) % n] += sample * 0.16;
        out[(at + j + Math.round(1.5 * beat * rate)) % n] += sample * 0.07;
      }
    }
  }
  const chords = [
      [57, 60, 64],
      [53, 57, 60],
      [60, 64, 67],
      [55, 59, 62],
      [62, 65, 69],
      [57, 60, 64],
      [53, 57, 60],
      [55, 59, 62],
    ],
    themes = [
      [
        [76, 0, 1.5],
        [72, 2, 0.75],
        [74, 3, 0.75],
      ],
      [
        [77, 0, 2],
        [76, 2.5, 0.5],
        [72, 3.25, 0.5],
      ],
      [
        [79, 0, 1],
        [76, 1.5, 0.75],
        [84, 2.5, 1],
      ],
      [
        [79, 0, 2],
        [74, 2.5, 1],
      ],
      [
        [77, 0, 0.75],
        [81, 1, 0.75],
        [79, 2, 0.75],
        [77, 3, 0.75],
      ],
      [
        [76, 0, 1.5],
        [72, 2, 0.5],
        [69, 3, 0.75],
      ],
      [
        [72, 0, 1],
        [77, 1.5, 1],
        [76, 3, 0.75],
      ],
      [
        [74, 0, 1.5],
        [71, 2, 0.75],
        [76, 3, 0.75],
      ],
    ];
  for (let bar = 0; bar < 32; bar++) {
    const t = bar * 4,
      ch = chords[bar % 8],
      bridge = bar >= 16 && bar < 24;
    for (const pitch of ch) note(pitch, t, 3.7, 0.0025, 1);
    note(ch[0] - 24, t, 1.7, 0.007, 1);
    note(ch[0] - 12, t + 2, 1.7, 0.004, 1);
    for (let i = 0; i < 8; i++)
      note(ch[i % 3] + 12, t + i * 0.5, 0.28, 0.0024, 2);
    for (const [m, o, d] of themes[(bar + (bridge ? 4 : 0)) % 8])
      note(
        m + (bridge ? 0 : bar >= 24 ? 12 : 0),
        t + o,
        d,
        bar >= 24 ? 0.007 : 0.01,
        0,
      );
    for (const off of [0, 2]) note(36, t + off, 0.18, 0.008, 2);
    if (bar % 4 === 3)
      for (const off of [3, 3.5, 3.75]) note(43, t + off, 0.12, 0.004, 2);
  }
  return balanceMusic(buffer);
}

const MINE_GROUND_Y = H * (923 / 1024);
const mineArt = new Image();
mineArt.src = "assets/podziemia-entrance-16bit.png";
const mineLedges = [
  [170, 316, 170],
  [415, 254, 180],
  [665, 310, 170],
  [905, 248, 180],
  [1155, 190, 170],
  [1400, 292, 180],
  [1650, 234, 180],
  [1905, 308, 170],
  [2150, 250, 180],
  [2410, 190, 170],
  [2660, 284, 180],
  [2915, 312, 180],
  [3170, 250, 180],
  [3430, 192, 170],
  [3680, 292, 180],
  [3940, 246, 180],
  [4200, 310, 180],
  [4445, 252, 170],
  [4655, 318, 130],
];
const minepark = {
  width: 4800,
  floorY: 400,
  pits: [
    { x: 590, w: 85 },
    { x: 1320, w: 85 },
    { x: 2260, w: 90 },
    { x: 3335, w: 85 },
    { x: 4110, w: 85 },
  ],
  platforms: [],
  rockPositions: [[110, 374]],
  ghostDefs: [],
  walkers: [],
};
let mineCursor = 0;
for (const pit of minepark.pits) {
  minepark.platforms.push({
    x: mineCursor,
    y: 400,
    w: pit.x - mineCursor,
    h: 34,
    street: true,
  });
  mineCursor = pit.x + pit.w;
}
minepark.platforms.push({
  x: mineCursor,
  y: 400,
  w: 4800 - mineCursor,
  h: 34,
  street: true,
});
mineLedges.forEach(([x, y, w], i) => {
  const p = { x, y, w, h: 20, ladderAccess: true };
  const lift = [1, 8, 11, 15].indexOf(i);
  if (lift >= 0) {
    Object.assign(p, {
      baseX: x,
      baseY: y,
      travel: lift % 2 ? 26 : 40,
      axis: lift % 2 ? "y" : "x",
      phase: 0.6 + lift * 1.27,
      liftSpeed: 0.65 + lift * 0.09,
    });
  }
  const shaped = [3, 6, 12, 17].includes(i),
    u = [6, 17].includes(i);
  if (shaped) {
    const group = "mine-shape-" + i;
    minepark.platforms.push(
      { x, y: y - 26, w: 34, h: 46, shapePiece: true, group },
      {
        x: x + 34,
        y,
        w: w - 34 - (u ? 34 : 0),
        h: 20,
        shapePiece: true,
        group,
        ladderAccess: true,
      },
    );
    if (u)
      minepark.platforms.push({
        x: x + w - 34,
        y: y - 26,
        w: 34,
        h: 46,
        shapePiece: true,
        group,
      });
  } else minepark.platforms.push(p);
  minepark.rockPositions.push(
    [x + 24, y - 24 - (shaped ? 26 : 0)],
    [x + w - 24, y - 24 - (u ? 26 : 0)],
  );
});
// Ground patrols and wider raised surfaces, with no pit-edge pacing traps.
for (const [i, p] of minepark.platforms
  .filter((p) => !p.travel && p.w >= 130)
  .entries()) {
  if (p.street) {
    if (p.x === 0)
      minepark.walkers.push({
        left: 300,
        right: 460,
        floor: 400,
        speed: 29,
        phase: 0.2,
        kind: "miner",
      });
    else
      minepark.walkers.push({
        left: p.x + 45,
        right: Math.min(p.x + p.w - 60, p.x + 205),
        floor: 400,
        speed: 30 + (i % 3) * 4,
        phase: i * 0.17,
        kind: "miner",
      });
  } else
    minepark.walkers.push({
      left: p.x + 20,
      right: p.x + p.w - 48,
      floor: p.y,
      speed: 25 + (i % 4) * 3,
      phase: i * 0.23,
      kind: "miner",
    });
}
chapters.push(minepark);
chapterNames.push("WEJŚCIE DO PODZIEMI");
itemNames.push("BILETY");
itemColors.push("#ffe6a0");

function drawMineBackground() {
  const y = MINE_GROUND_Y,
    sy = (mineArt.naturalHeight * y) / H;
  ctx.drawImage(
    mineArt,
    0,
    0,
    mineArt.naturalWidth,
    sy,
    -Math.round(camera * (85 / (WORLD - W))),
    0,
    860,
    y,
  );
  drawGroundStrip(mineArt, y, 860);
  entranceCats();
}
function mineBeam(p) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(p.x, p.y, p.w, p.h);
  ctx.clip();
  rect(p.x, p.y, p.w, p.h, "#55372c");
  // Heavy hewn timbers with grain, end-grain knots, pegged joints and iron straps.
  for (let y = p.y; y < p.y + p.h; y += 18) {
    const h = Math.min(17, p.y + p.h - y);
    rect(p.x, y, p.w, h, "#936342");
    rect(p.x, y, p.w, 2, "#c79763");
    rect(p.x, y + h - 2, p.w, 2, "#62412e");
    for (let x = p.x + 8; x < p.x + p.w; x += 31) {
      rect(x, y + 5, 20, 1, "#b38353");
      rect(x + 5, y + 9, 18, 1, "#6d4932");
      rect(x + 1, y + 12, 12, 1, "#c08d59");
    }
    for (let x = p.x + 41; x < p.x + p.w; x += 89) {
      oval(ctx, x, y + 9, 5, 2.5, "#6e4930");
      oval(ctx, x, y + 8, 3, 1, "#b38150");
    }
  }
  for (const x of [p.x + 7, p.x + p.w - 13]) {
    rect(x, p.y + 2, 6, p.h - 4, "#4e514d");
    rect(x, p.y + 2, 1, p.h - 4, "#8b8b75");
    rect(x + 2, p.y + 4, 2, 2, "#c4bd91");
    rect(x + 2, p.y + p.h - 6, 2, 2, "#a59c79");
  }
  ctx.restore();
}
function makeMiner(frame) {
  const [c, g] = spriteCanvas(64, 84),
    step = Math.sin((frame * Math.PI) / 3) * 5;
  for (const [x, d] of [
    [23, step],
    [40, -step],
  ]) {
    poly(
      g,
      [
        [x - 4, 54],
        [x + 4, 54],
        [x + 4 + d, 76],
        [x - 4 + d, 76],
      ],
      "#676458",
    );
    oval(g, x + d + 2, 77, 7, 4, "#46362d");
    g.fillStyle = "#a78860";
    g.fillRect(x + d - 3, 75, 8, 1);
  }
  poly(
    g,
    [
      [19, 29],
      [43, 29],
      [48, 61],
      [15, 61],
    ],
    "#88744e",
  );
  poly(
    g,
    [
      [20, 32],
      [28, 32],
      [26, 59],
      [16, 59],
    ],
    "#b49a69",
  );
  poly(
    g,
    [
      [27, 33],
      [38, 33],
      [43, 63],
      [23, 63],
    ],
    "#5f4231",
  );
  poly(
    g,
    [
      [29, 36],
      [36, 36],
      [40, 60],
      [26, 60],
    ],
    "#84603e",
  );
  g.fillStyle = "#c3ab7b";
  g.fillRect(17, 46, 29, 3);
  g.fillStyle = "#d7bf83";
  g.fillRect(30, 45, 5, 5);
  g.fillStyle = "#594731";
  g.fillRect(31, 46, 3, 3);
  for (const [x, d] of [
    [15, -step / 2],
    [46, step / 2],
  ]) {
    poly(
      g,
      [
        [x - 3, 34],
        [x + 3, 34],
        [x + 3, 52 + d],
        [x - 3, 52 + d],
      ],
      "#a18a5d",
    );
    oval(g, x, 54 + d, 3, 4, "#e3b58e");
  }
  oval(g, 32, 20, 11, 14, "#b78965");
  oval(g, 31, 19, 10, 12, "#e9be93");
  poly(
    g,
    [
      [23, 23],
      [28, 27],
      [39, 25],
      [40, 23],
      [39, 32],
      [31, 35],
      [24, 30],
    ],
    "#6c5140",
  );
  g.fillStyle = "#473b32";
  g.fillRect(35, 18, 2, 2);
  g.fillStyle = "#d1b386";
  g.fillRect(21, 11, 22, 4);
  poly(
    g,
    [
      [22, 12],
      [24, 5],
      [33, 3],
      [41, 7],
      [43, 12],
    ],
    "#8d7854",
  );
  poly(
    g,
    [
      [24, 10],
      [27, 5],
      [33, 4],
      [35, 10],
    ],
    "#c5ab7d",
  );
  // A short wooden-handled iron pick: no modern hardhat or electric headlamp.
  g.fillStyle = "#5b3e2b";
  g.fillRect(49, 39, 3, 33);
  g.fillStyle = "#bb915b";
  g.fillRect(49, 39, 1, 32);
  poly(
    g,
    [
      [40, 38],
      [45, 33],
      [54, 33],
      [61, 38],
      [56, 36],
      [46, 36],
    ],
    "#52636b",
  );
  poly(
    g,
    [
      [42, 36],
      [46, 33],
      [54, 33],
      [58, 35],
      [48, 35],
    ],
    "#abb6ad",
  );
  return c;
}
// Original "The Hidden Door": a curious, warm Dorian waltz, 32 bars in 3/4.
function buildDiscoveryMusic(ac) {
  const rate = ac.sampleRate,
    beat = 60 / 104,
    n = Math.round(96 * beat * rate),
    buffer = ac.createBuffer(1, n, rate),
    out = buffer.getChannelData(0);
  function note(m, start, dur, vol, voice) {
    const hz = 440 * 2 ** ((m - 69) / 12),
      at = Math.round(start * beat * rate),
      hold = dur * beat,
      release = 0.28;
    for (let j = 0; j < (hold + release) * rate; j++) {
      const t = j / rate,
        p = 2 * Math.PI * hz * t,
        env =
          Math.min(1, t / (voice === 0 ? 0.045 : 0.012)) *
          (t > hold ? Math.max(0, 1 - (t - hold) / release) ** 2 : 1);
      const wave =
        voice === 0
          ? Math.sin(p + 0.008 * Math.sin(2 * Math.PI * 4 * t)) +
            0.12 * Math.sin(2 * p)
          : (Math.sin(p) + 0.25 * Math.sin(2 * p) + 0.07 * Math.sin(3 * p)) *
            Math.exp(-t * (voice === 1 ? 5 : 1));
      const v = wave * env * vol;
      out[(at + j) % n] += v;
      if (voice !== 2) {
        out[(at + j + Math.round(0.75 * beat * rate)) % n] += v * 0.13;
        out[(at + j + Math.round(1.5 * beat * rate)) % n] += v * 0.045;
      }
    }
  }
  const chords = [
      [62, 65, 69],
      [60, 64, 67],
      [55, 59, 62],
      [62, 65, 69],
      [65, 69, 72],
      [60, 64, 67],
      [55, 59, 62],
      [57, 61, 64],
    ],
    theme = [
      [
        [74, 0, 0.75],
        [77, 1, 0.5],
        [81, 2, 0.75],
      ],
      [
        [79, 0, 1],
        [76, 1.5, 0.5],
        [72, 2.25, 0.5],
      ],
      [
        [74, 0, 0.5],
        [79, 0.75, 1],
        [77, 2, 0.75],
      ],
      [
        [76, 0, 0.75],
        [74, 1, 1.75],
      ],
      [
        [77, 0, 0.5],
        [81, 0.75, 0.5],
        [84, 1.5, 1],
      ],
      [
        [79, 0, 1.25],
        [76, 1.75, 1],
      ],
      [
        [74, 0, 0.75],
        [71, 1, 0.5],
        [74, 2, 0.75],
      ],
      [
        [73, 0, 0.75],
        [76, 1, 0.75],
        [81, 2, 0.75],
      ],
    ];
  for (let bar = 0; bar < 32; bar++) {
    const t = bar * 3,
      ch = chords[bar % 8],
      phrase = theme[(bar + (bar >= 16 && bar < 24 ? 4 : 0)) % 8];
    for (const [m, o, d] of phrase) note(m, t + o, d, 0.012, 0);
    for (let i = 0; i < 6; i++)
      note(ch[i % 3] + (i > 2 ? 12 : 0), t + i * 0.5, 0.4, 0.0032, 1);
    note(ch[0] - 24, t, 2.65, 0.006, 2);
    if ((bar >= 8 && bar < 16) || bar >= 24) {
      note(ch[1], t + 1, 1.65, 0.0025, 2);
      note(ch[2], t + 1, 1.65, 0.0025, 2);
    }
    if (bar % 8 === 7) note(86, t + 2.5, 0.4, 0.002, 1);
  }
  return balanceMusic(buffer);
}

const PARK_GROUND_Y = H * (888 / 1024);
const parkArt = new Image();
parkArt.src = "assets/park-miejski-16bit.png";
const parkLedges = [
  [150, 318, 180],
  [385, 260, 180],
  [635, 202, 170],
  [880, 296, 190],
  [1135, 238, 170],
  [1380, 310, 180],
  [1635, 252, 180],
  [1890, 194, 170],
  [2140, 286, 180],
  [2400, 318, 180],
  [2660, 258, 170],
  [2910, 200, 180],
  [3170, 292, 180],
  [3430, 234, 180],
  [3690, 310, 180],
  [3950, 252, 180],
  [4210, 194, 170],
  [4450, 280, 170],
  [4655, 318, 130],
];
const parkpark = {
  width: 4800,
  floorY: 400,
  pits: [
    { x: 680, w: 85 },
    { x: 1240, w: 90 },
    { x: 2035, w: 85 },
    { x: 3260, w: 90 },
    { x: 4370, w: 85 },
  ],
  platforms: [],
  rockPositions: [[110, 374]],
  ghostDefs: [],
  walkers: [],
};
let parkCursor = 0;
for (const pit of parkpark.pits) {
  parkpark.platforms.push({
    x: parkCursor,
    y: 400,
    w: pit.x - parkCursor,
    h: 34,
    street: true,
  });
  parkCursor = pit.x + pit.w;
}
parkpark.platforms.push({
  x: parkCursor,
  y: 400,
  w: 4800 - parkCursor,
  h: 34,
  street: true,
});
parkLedges.forEach(([x, y, w], i) => {
  const p = { x, y, w, h: 20, ladderAccess: true };
  const lift = [4, 7, 10, 14].indexOf(i);
  if (lift >= 0) {
    Object.assign(p, {
      baseX: x,
      baseY: y,
      travel: lift % 2 ? 26 : 40,
      axis: lift % 2 ? "y" : "x",
      phase: 0.6 + lift * 1.27,
      liftSpeed: 0.65 + lift * 0.09,
    });
  }
  const shaped = [1, 5, 11, 16].includes(i),
    u = [5, 16].includes(i);
  if (shaped) {
    const group = "park-shape-" + i;
    parkpark.platforms.push(
      { x, y: y - 26, w: 34, h: 46, shapePiece: true, group },
      {
        x: x + 34,
        y,
        w: w - 34 - (u ? 34 : 0),
        h: 20,
        shapePiece: true,
        group,
        ladderAccess: true,
      },
    );
    if (u)
      parkpark.platforms.push({
        x: x + w - 34,
        y: y - 26,
        w: 34,
        h: 46,
        shapePiece: true,
        group,
      });
  } else parkpark.platforms.push(p);
  parkpark.rockPositions.push(
    [x + 24, y - 24 - (shaped ? 26 : 0)],
    [x + w - 24, y - 24 - (u ? 26 : 0)],
  );
});
// Ground patrols and wider raised surfaces, with no pit-edge pacing traps.
for (const [i, p] of parkpark.platforms
  .filter((p) => !p.travel && p.w >= 130)
  .entries()) {
  if (p.street) {
    if (p.x === 0)
      parkpark.walkers.push({
        left: 300,
        right: 460,
        floor: 400,
        speed: 29,
        phase: 0.2,
        kind: "tracksuit",
      });
    else
      parkpark.walkers.push({
        left: p.x + 45,
        right: Math.min(p.x + p.w - 60, p.x + 205),
        floor: 400,
        speed: 30 + (i % 3) * 4,
        phase: i * 0.17,
        kind: "tracksuit",
      });
  } else
    parkpark.walkers.push({
      left: p.x + 20,
      right: p.x + p.w - 48,
      floor: p.y,
      speed: 25 + (i % 4) * 3,
      phase: i * 0.23,
      kind: "tracksuit",
    });
}
chapters.push(parkpark);
chapterNames.push("PARK MIEJSKI");
itemNames.push("LIŚCIE");
itemColors.push("#b3d66c");

function drawParkBackground() {
  const y = PARK_GROUND_Y,
    sy = (parkArt.naturalHeight * y) / H;
  ctx.drawImage(
    parkArt,
    0,
    0,
    parkArt.naturalWidth,
    sy,
    -Math.round(camera * (85 / (WORLD - W))),
    0,
    860,
    y,
  );
  drawGroundStrip(parkArt, y, 860);
  parkSquirrels();
}
function benchPlatform(p) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(p.x, p.y, p.w, p.h);
  ctx.clip();
  // Connected varnished bench slats, narrow gaps and black metal joining brackets.
  rect(p.x, p.y, p.w, p.h, "#253a3b");
  for (let y = p.y; y < p.y + p.h; y += 7) {
    const h = Math.min(6, p.y + p.h - y);
    rect(p.x, y, p.w, h, "#a65b32");
    rect(p.x, y, p.w, 1, "#f2ba76");
    rect(p.x, y + h - 1, p.w, 1, "#6e3f2b");
    for (let x = p.x + 9; x < p.x + p.w; x += 35) {
      rect(x, y + 2, 21, 1, "#cb8550");
      rect(x + 7, y + 4, 14, 1, "#864929");
    }
  }
  for (const x of [p.x + 9, p.x + p.w - 16]) {
    rect(x, p.y + 2, 7, p.h - 4, "#314441");
    rect(x, p.y + 2, 1, p.h - 4, "#647771");
    rect(x + 3, p.y + 3, 2, 2, "#d3caa8");
    rect(x + 3, p.y + p.h - 5, 2, 2, "#b4b89e");
  }
  ctx.restore();
}
function makeTracksuit(frame) {
  const [c, g] = spriteCanvas(64, 84),
    step = Math.sin((frame * Math.PI) / 3) * 5;
  for (const [x, d] of [
    [23, step],
    [40, -step],
  ]) {
    poly(
      g,
      [
        [x - 5, 52],
        [x + 5, 52],
        [x + 4 + d, 75],
        [x - 4 + d, 75],
      ],
      "#263749",
    );
    for (const off of [-3, -1])
      poly(
        g,
        [
          [x + off, 54],
          [x + off + 1, 54],
          [x + off + 1 + d, 74],
          [x + off + d, 74],
        ],
        "#d7dfd6",
      );
    oval(g, x + d + 2, 78, 7, 3, "#e1e4d7");
    g.fillStyle = "#4b5f6c";
    g.fillRect(x + d - 4, 79, 12, 2);
  }
  poly(
    g,
    [
      [16, 31],
      [45, 31],
      [49, 57],
      [14, 57],
    ],
    "#273d51",
  );
  poly(
    g,
    [
      [18, 34],
      [29, 34],
      [28, 55],
      [16, 55],
    ],
    "#4b6378",
  );
  poly(
    g,
    [
      [33, 34],
      [43, 34],
      [47, 55],
      [34, 55],
    ],
    "#364d65",
  );
  poly(
    g,
    [
      [21, 30],
      [23, 25],
      [41, 25],
      [44, 31],
      [38, 39],
      [27, 38],
    ],
    "#526779",
  );
  g.fillStyle = "#c8d5d5";
  g.fillRect(31, 35, 1, 20);
  for (const [x, d] of [
    [13, -step / 2],
    [48, step / 2],
  ]) {
    poly(
      g,
      [
        [x - 4, 34],
        [x + 4, 34],
        [x + 4, 53 + d],
        [x - 3, 53 + d],
      ],
      "#354e67",
    );
    g.fillStyle = "#e0e3d9";
    g.fillRect(x - 2, 35, 1, 16 + d);
    g.fillRect(x, 35, 1, 16 + d);
    oval(g, x, 56 + d, 4, 5, "#e5b18b");
  }
  oval(g, 32, 18, 11, 13, "#ba8e73");
  oval(g, 31, 18, 10, 12, "#e7bb94");
  poly(
    g,
    [
      [21, 13],
      [22, 6],
      [29, 3],
      [38, 5],
      [43, 11],
      [41, 14],
      [37, 10],
      [27, 9],
    ],
    "#5b514d",
  );
  g.fillStyle = "#413b38";
  g.fillRect(25, 16, 5, 2);
  g.fillRect(35, 16, 5, 2);
  g.fillRect(28, 19, 2, 2);
  g.fillRect(36, 19, 2, 2);
  g.fillRect(31, 26, 7, 1);
  g.fillStyle = "#cca181";
  g.fillRect(28, 28, 10, 2);
  return c;
}
// Original "Under the Canopy": calm pastoral melody, 24 bars at 80 BPM.
// Gentle flute-like lead, rounded plucked strings and slowly voiced warm chords.
function buildParkMusic(ac) {
  const rate = ac.sampleRate,
    beat = 60 / 80,
    n = Math.round(96 * beat * rate),
    buffer = ac.createBuffer(1, n, rate),
    out = buffer.getChannelData(0);
  function note(m, start, dur, vol, voice) {
    const hz = 440 * 2 ** ((m - 69) / 12),
      at = Math.round(start * beat * rate),
      hold = dur * beat,
      release = voice === 2 ? 0.6 : 0.35;
    for (let j = 0; j < (hold + release) * rate; j++) {
      const t = j / rate,
        p = 2 * Math.PI * hz * t,
        env =
          Math.min(1, t / (voice === 0 ? 0.06 : voice === 2 ? 0.18 : 0.012)) *
          (t > hold ? Math.max(0, 1 - (t - hold) / release) ** 2 : 1);
      let wave =
        voice === 0
          ? Math.sin(p + 0.012 * Math.sin(2 * Math.PI * 4.3 * t)) +
            0.1 * Math.sin(2 * p)
          : voice === 1
            ? (Math.sin(p) + 0.2 * Math.sin(2 * p) + 0.08 * Math.sin(3 * p)) *
              Math.exp(-t * 4)
            : (Math.sin(p) + 0.12 * Math.sin(2 * p)) * 0.8;
      const v = wave * env * vol;
      out[(at + j) % n] += v;
      if (voice !== 2) {
        out[(at + j + Math.round(beat * 0.8 * rate)) % n] += v * 0.1;
        out[(at + j + Math.round(beat * 1.6 * rate)) % n] += v * 0.04;
      }
    }
  }
  const chords = [
      [55, 59, 62],
      [52, 55, 59],
      [60, 64, 67],
      [57, 60, 64],
      [55, 59, 62],
      [50, 54, 57],
      [60, 64, 67],
      [55, 59, 62],
    ],
    theme = [
      [
        [74, 0, 1.5],
        [71, 2, 0.75],
        [69, 3, 0.75],
      ],
      [
        [67, 0, 1.5],
        [71, 2, 1.5],
      ],
      [
        [72, 0, 1],
        [76, 1.5, 0.75],
        [74, 2.75, 1],
      ],
      [
        [72, 0, 2],
        [69, 2.5, 1],
      ],
      [
        [71, 0, 1],
        [74, 1.5, 1],
        [79, 3, 0.75],
      ],
      [
        [78, 0, 1.5],
        [74, 2, 0.75],
        [69, 3, 0.75],
      ],
      [
        [72, 0, 1.5],
        [71, 2, 0.75],
        [67, 3, 0.75],
      ],
      [
        [69, 0, 1],
        [71, 1.5, 0.75],
        [67, 2.5, 1.25],
      ],
    ];
  for (let bar = 0; bar < 24; bar++) {
    const t = bar * 4,
      ch = chords[bar % 8];
    for (const [m, o, d] of theme[(bar + (bar >= 8 && bar < 16 ? 4 : 0)) % 8])
      note(m, t + o, d, 0.011, 0);
    note(ch[0] - 12, t, 3.7, 0.005, 2);
    for (const pitch of ch.slice(1)) note(pitch, t + 0.1, 3.5, 0.0026, 2);
    for (const [o, i] of [
      [0, 0],
      [0.75, 2],
      [1.5, 1],
      [2.5, 2],
      [3.25, 1],
    ])
      note(ch[i] + 12, t + o, 0.55, 0.003, 1);
    if (bar % 8 === 6) note(ch[2] + 12, t + 3.5, 0.4, 0.0015, 1);
  }
  return balanceMusic(buffer);
}

for (const b of document.querySelectorAll("[data-dev-level]"))
  b.onclick = () => devJumpToLevel(Number(b.dataset.devLevel));
// Seeded variation gives each chapter its own layout, stable across retries.
function diversifyChapter(c, index) {
  if (index === 4) return;
  let seed = (0x7f4a7c15 ^ Math.imul(index + 1, 0x9e3779b9)) >>> 0;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const ground = c.platforms.filter(
    (p) => p.street || (!p.shapePiece && p.h > 20),
  );
  const floorY = ground[0].y;
  const groups = new Map();
  for (const p of c.platforms)
    if (p.group) {
      if (!groups.has(p.group)) groups.set(p.group, []);
      groups.get(p.group).push(p);
    }
  // Reflect both collision pieces of an L; U-shaped platforms keep both arms.
  const ls = shuffle([...groups.values()].filter((p) => p.length === 2));
  ls.forEach((pieces, i) => {
    if (i % 2 === index % 2) {
      const left = Math.min(...pieces.map((p) => p.x)),
        right = Math.max(...pieces.map((p) => p.x + p.w));
      for (const p of pieces) p.x = left + right - p.x - p.w;
    }
  });
  const elevated = c.platforms.filter((p) => !ground.includes(p));
  const existing = elevated.filter((p) => p.travel);
  // New lifts dip within an ordinary jump of the floor; retain all shapes.
  const additions = shuffle(
    elevated.filter((p) => !p.travel && !p.shapePiece && p.y >= floorY - 130),
  ).slice(0, 3);
  for (const p of additions)
    Object.assign(p, {
      baseX: p.x,
      baseY: p.y,
      axis: "y",
      travel: Math.max(24, floorY - 80 - p.y),
    });
  for (const p of [...existing, ...additions]) {
    p.baseX ??= p.x;
    p.baseY ??= p.y;
    p.liftSpeed = 0.48 + random() * 0.87;
    p.phase = random() * Math.PI * 2;
  }
  // Every fixed ledge has safe access, with independently varied ladder anchors.
  let choices = shuffle([0, 1, 2]);
  let choiceIndex = 0;
  for (const p of elevated.filter((p) => !p.travel && p.h <= 20)) {
    if (choiceIndex === 3) {
      choices = shuffle([0, 1, 2]);
      choiceIndex = 0;
    }
    const preferred = choices[choiceIndex++],
      offsets = [24, p.w / 2, p.w - 24];
    const options = [
      preferred,
      ...shuffle([0, 1, 2].filter((i) => i !== preferred)),
    ];
    const slot = options.find((i) =>
      ground.some(
        (f) =>
          p.x + offsets[i] >= f.x + 16 && p.x + offsets[i] <= f.x + f.w - 16,
      ),
    );
    if (slot !== undefined) {
      p.ladderOffset = offsets[slot];
      p.ladderAccess = true;
    }
  }
  // Random 0–3 item clusters replace the repeated pair on every ledge.
  // Preserve each chapter's collection workload and keep all items on surfaces.
  const total = c.rockPositions.length,
    groundCount = 3 + Math.floor(random() * 5);
  const slots = shuffle(
    elevated.flatMap((p) =>
      Array.from(
        { length: Math.min(3, Math.max(1, Math.floor(p.w / 32))) },
        () => p,
      ),
    ),
  );
  const counts = new Map();
  for (const p of slots.slice(0, total - groundCount))
    counts.set(p, (counts.get(p) || 0) + 1);
  c.rockPositions = [];
  for (const [p, count] of counts) {
    const margin = Math.min(20, p.w / 2),
      span = p.w - 2 * margin;
    for (let i = 0; i < count; i++) {
      const fraction = (i + 0.35 + random() * 0.3) / count;
      c.rockPositions.push([p.x + margin + span * fraction, p.y - 24]);
    }
  }
  const floorSlots = shuffle(
    ground.flatMap((f) => {
      const xs = [];
      for (let x = f.x + 50; x < f.x + f.w - 40 && x < c.width - 150; x += 55)
        if (x > 65) xs.push([x + (random() - 0.5) * 16, f.y - 26]);
      return xs;
    }),
  );
  c.rockPositions.push(...floorSlots.slice(0, total - c.rockPositions.length));
  c.rockPositions.sort((a, b) => a[0] - b[0]);
  // Patrols follow mirrored static surfaces; newly moving ledges have no walkers.
  if (c.walkers) {
    const surfaces = c.platforms.filter((p) => !p.travel && p.w >= 90);
    c.walkers = c.walkers.map((g) => {
      const mid = (g.left + g.right) / 2 + 13;
      const score = (p) =>
        Math.abs(p.y - g.floor) * 2 +
        Math.max(p.x + 26 - mid, 0, mid - (p.x + p.w - 26));
      const p = surfaces.slice().sort((a, b) => score(a) - score(b))[0];
      const width = Math.min(Math.max(45, g.right - g.left), p.w - 42),
        left = Math.max(
          p.x + 8,
          Math.min(mid - 13 - width / 2, p.x + p.w - 34 - width),
        );
      return { ...g, left, right: left + width, floor: p.y };
    });
  }
}
chapters.forEach(diversifyChapter);

// Each platforming chapter owns one integer-height band (modulo eight).
// This keeps every resting surface height exclusive, including L/U arms.
function varyPlatformHeights() {
  const residues = [3, 0, 6, 2, 7, 4, 1, 5];
  let stage = 0;
  chapters.forEach((c, index) => {
    if (index === 4) return;
    const residue = residues[stage++];
    let seed = (0x85a17c3 ^ Math.imul(index + 1, 0x9e3779b9)) >>> 0;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const floor = c.platforms.find(
      (p) => p.street || (!p.shapePiece && p.h > 20),
    ).y;
    const elevated = c.platforms.filter((p) => p.shapePiece || p.h <= 20);
    const groups = new Map();
    for (const p of elevated) {
      const key = p.group || p;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    }
    // Capture the patrol's actual supporting piece before changing its elevation.
    const supports = (c.walkers || []).map((g) =>
      c.platforms.find(
        (p) =>
          !p.travel &&
          p.y === g.floor &&
          g.left >= p.x &&
          g.right + 34 <= p.x + p.w,
      ),
    );
    for (const pieces of groups.values()) {
      const oldBase = Math.max(...pieces.map((p) => p.y)),
        moving = pieces.some((p) => p.travel);
      const horizontal = moving && pieces[0].axis === "x";
      const low = horizontal
        ? floor - 82
        : moving
          ? 270
          : Math.max(168, oldBase - 42);
      const high = horizontal
        ? floor - 66
        : moving
          ? 310
          : Math.min(326, oldBase + 42);
      const options = [];
      for (let y = Math.ceil(low); y <= high; y++)
        if (y % 8 === residue) options.push(y);
      if (!options.length) throw Error("No safe chapter height available");
      const base = options[Math.floor(random() * options.length)];
      for (const p of pieces) {
        const raised = p.y < oldBase;
        p.y = base - (raised ? 24 : 0);
        // Preserve the flat underside of joined shapes after the new 24px rise.
        if (raised) p.h -= 2;
        if (p.travel) {
          p.baseY = p.y;
          if (p.axis !== "x") p.travel = Math.max(24, floor - 78 - p.y);
        }
      }
    }
    (c.walkers || []).forEach((g, i) => {
      if (supports[i]) g.floor = supports[i].y;
    });
  });
}
varyPlatformHeights();

function refinePlatformRoutes() {
  chapters.forEach((c, index) => {
    if (index === 4) return;
    const isFloor = (p) => p.street || (!p.shapePiece && p.h > 20),
      groups = new Map();
    for (const p of c.platforms.filter((p) => !isFloor(p))) {
      const k = p.group || p;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(p);
    }
    let highCount = 0;
    for (const pieces of groups.values()) {
      const base = Math.max(...pieces.map((p) => p.y));
      if (base < 224 && highCount++ >= 2) {
        const target = 232 + (base % 8) + 8 * (highCount % 4),
          delta = target - base;
        for (const p of pieces) {
          p.y += delta;
          if (p.baseY !== undefined) p.baseY += delta;
        }
      }
      // Reserve a clear approach before the entire exit, including sideways travel.
      if (
        pieces.some(
          (p) =>
            p.x + p.w + (p.axis === "x" ? p.travel : 0) > c.width - 105 - 48,
        )
      ) {
        c.platforms = c.platforms.filter((p) => !pieces.includes(p));
      }
    }
    const floors = c.platforms.filter(isFloor);
    for (const p of c.platforms.filter(
      (p) => !isFloor(p) && !p.travel && p.h <= 20,
    )) {
      const preferred = p.x + (p.ladderOffset ?? p.w / 2),
        candidates = [];
      for (let x = p.x + 20; x <= p.x + p.w - 20; x += 2) {
        if (!floors.some((f) => x >= f.x + 16 && x <= f.x + f.w - 16)) continue;
        if (
          (c.pits || []).some((pit) => x > pit.x - 72 && x < pit.x + pit.w + 72)
        )
          continue;
        candidates.push(x);
      }
      if (candidates.length) {
        candidates.sort(
          (a, b) => Math.abs(a - preferred) - Math.abs(b - preferred),
        );
        p.ladderOffset = candidates[0] - p.x;
      } else {
        delete p.ladderOffset;
        p.ladderAccess = false;
      }
    }
    // Give narrow ledges one occupant at most; excess walkers patrol roomy ground.
    if (c.walkers) {
      const surfaces = c.platforms.filter((p) => !p.travel && p.w >= 90),
        used = new Map();
      c.walkers = c.walkers
        .map((g) => {
          const mid = (g.left + g.right) / 2 + 13,
            score = (p) =>
              Math.abs(p.y - g.floor) * 2 +
              Math.max(p.x + 26 - mid, 0, mid - (p.x + p.w - 26));
          const available = surfaces.filter(
            (p) =>
              (used.get(p) || 0) <
              (isFloor(p) ? Math.max(1, Math.floor(p.w / 170)) : 1),
          );
          const p = available.sort((a, b) => score(a) - score(b))[0];
          if (!p) return null;
          const slot = used.get(p) || 0;
          used.set(p, slot + 1);
          const capacity = isFloor(p) ? Math.max(1, Math.floor(p.w / 170)) : 1,
            span = p.w / capacity;
          const left = p.x + slot * span + 8,
            right = Math.min(p.x + (slot + 1) * span - 34, left + 100);
          return { ...g, left, right, floor: p.y };
        })
        .filter(Boolean);
    }
  });
}
refinePlatformRoutes();

// The opening 260px are a permanent enemy-free space, including after respawn.
function protectStartingAreas() {
  chapters.forEach((c, index) => {
    if (index === 4) return;
    if (index === 1) {
      for (const g of c.ghostDefs) if (g.x - g.r < 260) g.x = 260 + g.r;
      return;
    }
    const groups = new Map();
    for (const g of c.walkers || []) {
      const p = c.platforms.find(
        (p) =>
          !p.travel &&
          p.y === g.floor &&
          g.left >= p.x &&
          g.right + 34 <= p.x + p.w,
      );
      if (!p) throw Error("Enemy has no safe patrol surface");
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(g);
    }
    c.walkers = [];
    for (const [p, walkers] of groups) {
      if (walkers.every((g) => g.left >= 260)) {
        c.walkers.push(...walkers);
        continue;
      }
      const left = Math.max(260, p.x + 8),
        end = p.x + p.w;
      const count = Math.min(
        walkers.length,
        Math.max(0, Math.floor((end - left) / 90)),
      );
      // Preserve roomy, separate patrols; omit a guard if its ledge lies in spawn.
      for (let i = 0; i < count; i++) {
        const span = (end - left) / count,
          start = left + i * span;
        c.walkers.push({
          ...walkers[i],
          left: start,
          right: Math.min(start + 100, start + span - 34),
        });
      }
    }
  });
}
protectStartingAreas();

// Unique shuffled goals and spacious placements, stable on level retries.
function spreadChapterPickups() {
  let seed = 0x83c4e17;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const totals = shuffle(Array.from({ length: 11 }, (_, i) => 35 + i));
  chapters.forEach((c, index) => {
    if (index === 4) return;
    const total = totals.pop(),
      groundCount = Math.round(total * 0.4);
    // Alternate ground-first and ledge-first openings, with space after spawning.
    const groundStart = [320, 230, 440, 280, 0, 510, 350, 430, 300][index];
    const platformStart = [160, 380, 170, 370, 0, 360, 600, 140, 360][index];
    const ground = c.platforms.filter(
      (p) => p.street || (!p.shapePiece && p.h > 20),
    );
    // Treat every L/U as one ledge, so its separate collision pieces cannot
    // accidentally receive independent clusters packed next to one another.
    const groups = new Map();
    for (const p of c.platforms.filter((p) => !ground.includes(p))) {
      const key = p.group || p;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    }
    // Spread a first pickup across every ledge before adding well-separated pairs.
    const ledges = shuffle(
      [...groups.values()].filter(
        (pieces) => Math.min(...pieces.map((p) => p.x)) >= platformStart,
      ),
    );
    const extraSlots = shuffle(
      ledges.filter(
        (pieces) =>
          Math.max(...pieces.map((p) => p.x + p.w)) -
            Math.min(...pieces.map((p) => p.x)) >=
          125,
      ),
    );
    const slots = [...ledges, ...extraSlots],
      platformCount = total - groundCount;
    if (slots.length < platformCount)
      throw Error("Insufficient spacious platform slots");
    const counts = new Map();
    for (const pieces of slots.slice(0, platformCount))
      counts.set(pieces, (counts.get(pieces) || 0) + 1);
    c.rockPositions = [];
    for (const [pieces, count] of counts) {
      const left = Math.min(...pieces.map((p) => p.x)),
        right = Math.max(...pieces.map((p) => p.x + p.w));
      const xs =
        count === 1
          ? [left + (right - left) * (0.35 + random() * 0.3)]
          : [left + 25 + random() * 7, right - 25 - random() * 7];
      for (const x of xs) {
        const p = pieces.find((p) => x >= p.x && x < p.x + p.w);
        c.rockPositions.push([x, p.y - 24]);
      }
    }
    // At least 105 pixels between ground candidates; keep away from pit edges.
    const floorSlots = shuffle(
      ground.flatMap((f) => {
        const items = [];
        for (
          let x = Math.max(groundStart, f.x + 55);
          x < Math.min(f.x + f.w - 55, c.width - 150);
          x += 125
        )
          items.push([x + (random() - 0.5) * 20, f.y - 26]);
        return items;
      }),
    );
    if (floorSlots.length < groundCount)
      throw Error("Insufficient safe ground pickup positions");
    // Sample evenly along the route rather than bunching ground items in one area.
    floorSlots.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < groundCount; i++) {
      const start = Math.floor((i * floorSlots.length) / groundCount),
        end = Math.floor(((i + 1) * floorSlots.length) / groundCount);
      c.rockPositions.push(
        floorSlots[start + Math.floor(random() * (end - start))],
      );
    }
    c.rockPositions.sort((a, b) => a[0] - b[0]);
  });
}
spreadChapterPickups();

// A single-screen finale: eight stationary ledges, no ladders, timed chalk and a pit boss.
const finaleArt = new Image();
finaleArt.src = "assets/final-chalk-chamber.png";
const BOSS_PIT = { x: W - 96, w: 96 },
  BOSS_SIZE = { w: 96, h: 108 };
let finaleWave = [],
  finaleWaveLeft = 3,
  bossDefeated = false,
  bossGone = false,
  bossY = 70,
  bossVelocity = 0,
  victoryDismissed = false;
const usedHeights = new Set(
  chapters.flatMap((c) =>
    c.platforms
      .filter((p) => p.shapePiece || p.h <= 20)
      .map((p) => p.baseY ?? p.y),
  ),
);
// Uneven, stationary stepping routes; each upper ledge has a jumpable approach.
const finaleLayout = [
  [38, 328, 90],
  [177, 319, 90],
  [82, 249, 82],
  [259, 238, 94],
  [337, 333, 90],
  [497, 321, 90],
  [424, 256, 86],
  [556, 239, 80],
];
const finaleLedges = finaleLayout.map(([x, y, w], finaleId) => ({
  x,
  y,
  w,
  h: 16,
  finaleId,
}));
const finale = {
  width: W,
  platforms: [
    { x: 0, y: 400, w: BOSS_PIT.x, h: 32, street: true },
    ...finaleLedges,
  ],
  rockPositions: [],
  walkers: [],
  pits: [BOSS_PIT],
  ghostDefs: [
    { x: 195, y: 301, r: 75, s: 0.83 },
    { x: 495, y: 300, r: 90, s: 1.04 },
    { x: 260, y: 214, r: 95, s: 0.72 },
    { x: 540, y: 213, r: 70, s: 0.94 },
    { x: 155, y: 255, r: 45, s: 1.19 },
    { x: 580, y: 333, r: 45, s: 0.91 },
    { x: 365, y: 281, r: 80, s: 1.11 },
    { x: 415, y: 205, r: 95, s: 0.87 },
  ],
};
chapters.push(finale);
chapterNames.push("STRAŻNIK PODZIEMI");
itemNames.push("FRAGMENTY KREDY");
itemColors.push("#f6f0db");
function newFinaleWave() {
  const candidates = finaleLedges.filter(
    (p) => !finaleWave.includes(p.finaleId),
  );
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const selected = candidates.slice(0, 1);
  finaleWave = selected.map((p) => p.finaleId);
  finaleWaveLeft = 3;
  rocks = selected.map((p) => ({
    x: p.x + p.w / 2,
    y: p.y - 24,
    taken: false,
    support: p,
    offsetX: p.w / 2,
    animationPhase: p.finaleId * 1.7,
  }));
}
function resetFinale() {
  bossDefeated = bossGone = victoryDismissed = false;
  bossY = 70;
  bossVelocity = 0;
  finaleWave = [];
  newFinaleWave();
  player.x = 48;
  player.y = 370;
  resetFinalePatrol();
  player.ground = true;
  invincible = 1.5;
  camera = 0;
  ladders = [];
  hud();
}
let activeFinaleGhosts = [];
let campX, campY, campTime;

function finalePatrolPositions() {
  return finale.ghostDefs.map((g, i) => ({
    x: g.x + Math.sin(time * g.s + i) * g.r,
    y: g.y + Math.sin(time * 2 + i) * 9,
    w: 26,
    h: 29,
    kind: "ghost",
  }));
}
function resetFinalePatrol() {
  activeFinaleGhosts = finalePatrolPositions();
  campX = player.x;
  campY = player.y;
  campTime = 0;
}

function updateFinalePatrol(dt) {
  // Small shuffles on the same perch still count as lingering.
  if (Math.abs(player.x - campX) > 40 || Math.abs(player.y - campY) > 60) {
    campX = player.x;
    campY = player.y;
    campTime = 0;
  }
  campTime += dt;
  const routes = finalePatrolPositions();
  activeFinaleGhosts.forEach((g, i) => {
    const chasing = campTime >= 2.5 + i * 0.18;
    const angle = i * Math.PI / 4;
    const dx = chasing ? player.x + 8 * Math.cos(angle) - g.x : routes[i].x - g.x;
    const dy = chasing ? player.y + 7 * Math.sin(angle) - g.y : routes[i].y - g.y;
    const speed = chasing ? 88 + i * 4 : 120;
    const step = Math.min(1, speed * dt / (Math.hypot(dx, dy) || 1));
    g.x += dx * step;
    g.y += dy * step;
  });
}

function winFinale() {
  if (bossDefeated) return;
  bossDefeated = true;
  bossY = 70 + Math.sin(time * 1.15) * 9;
  bossVelocity = 0;
  rocks = [];
  releaseGameInput();
  stopMusic(true);
  state = "boss-falling";
  syncMusic();
}
function updateFinale(dt) {
  if (state === "boss-falling") {
    time += dt;
    bossVelocity += 290 * dt;
    bossY += bossVelocity * dt;
    if (bossY > H + 12) {
      bossGone = true;
      state = "won";
      $("#kicker").textContent = "TWOJA PRZYGODA W CHEŁMIE DOBIEGŁA KOŃCA!";
      overlay(
        "Gratulacje!",
        "Strażnik podziemi został pokonany. Masz za sobą wszystkie 10 poziomów! Czy chcesz zagrać jeszcze raz?",
        "ZACZYNAMY OD POCZĄTKU?",
      );
    }
    return;
  }
  if (state !== "playing") return;
  time += dt;
  elapsed += dt;
  banner = Math.max(0, banner - dt);
  invincible = Math.max(0, invincible - dt);
  jumpBuffer = Math.max(0, jumpBuffer - dt);
  coyote = player.ground ? 0.1 : Math.max(0, coyote - dt);
  moveLifts();
  movePlayer(dt);
  updateFinalePatrol(dt);
  finaleWaveLeft -= dt;
  if (finaleWaveLeft <= 0) newFinaleWave();
  for (const r of rocks)
    if (!r.taken && overlap(player, { x: r.x - 7, y: r.y - 9, w: 14, h: 18 })) {
      r.taken = true;
      collected++;
      collectSound();
      burst(r.x, r.y, "#fff4d4");
      hud();
      if (collected >= 10) {
        winFinale();
        return;
      }
    }
  if (player.y > H + 60) {
    invincible = 0;
    hit();
  } else if (
    activeFinaleGhosts.some((g) =>
      overlap(
        { x: player.x + 3, y: player.y + 3, w: 16, h: 25 },
        { x: g.x + 4, y: g.y + 4, w: 18, h: 22 },
      ),
    ) ||
    overlap(player, {
      x: BOSS_PIT.x + 8,
      y: 70 + Math.sin(time * 1.15) * 9,
      w: BOSS_SIZE.w - 16,
      h: BOSS_SIZE.h,
    })
  )
    hit();
  for (const p of particles) {
    p.t -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 300 * dt;
  }
  particles = particles.filter((p) => p.t > 0);
  camera = 0;
}
function drawFinale() {
  ctx.clearRect(0, 0, W, H);
  rect(0, 0, W, H, "#242f47");
  if (finaleArt.complete && finaleArt.naturalWidth)
    ctx.drawImage(finaleArt, 0, 0, W, H);
  rect(0, 0, W, H, "#17233c18");
  caveBats();
  for (const p of finale.platforms.filter((p) => p.street))
    finaleChalkGround(p);
  rect(BOSS_PIT.x, 400, BOSS_PIT.w, H - 400, "#0c1020");
  rect(BOSS_PIT.x, 400, 3, H - 400, "#69788b");
  rect(BOSS_PIT.x + BOSS_PIT.w - 3, 400, 3, H - 400, "#4a586e");
  for (const p of finaleLedges) renderPlatform(p);
  if (!bossDefeated) for (const g of activeFinaleGhosts) ghost(g);
  if (!bossGone) {
    if (!sheetFrames.length)
      for (let i = 0; i < 6; i++) sheetFrames.push(makeSheet(i));
    const y = bossDefeated ? bossY : 70 + Math.sin(time * 1.15) * 9;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, 400);
    ctx.rect(BOSS_PIT.x, 400, BOSS_PIT.w, H - 400);
    ctx.clip();
    ctx.drawImage(
      sheetFrames[Math.floor(time * 5) % 6],
      3,
      4,
      56,
      65,
      BOSS_PIT.x,
      y,
      BOSS_SIZE.w,
      BOSS_SIZE.h,
    );
    ctx.restore();
  }
  for (const r of rocks)
    if (!r.taken) {
      ctx.save();
      ctx.globalAlpha =
        finaleWaveLeft < 0.5 ? 0.65 + 0.35 * Math.sin(time * 22) : 1;
      gem(r);
      ctx.restore();
    }
  if (invincible <= 0 || lives === 3 || Math.floor(time * 12) % 2 === 0)
    bear(player.x, player.y);
  for (const p of particles) rect(p.x, p.y, 3, 3, p.color);
  if (!bossDefeated) {
    rect(W - 106, 50, 100, 6, "#152137");
    rect(W - 104, 52, 96 * (1 - collected / 10), 2, "#d6e8ef");
  }
}
// Original seamless orchestral-chip loops: tense minor pursuit and major fanfare.
function buildFinaleMusic(ac, victory = false) {
  if (!victory) return buildFinaleActionMusic(ac);
  const rate = ac.sampleRate,
    beat = 60 / (victory ? 120 : 112),
    bars = 16,
    n = Math.round(bars * 4 * beat * rate),
    buffer = ac.createBuffer(1, n, rate),
    out = buffer.getChannelData(0);
  function note(m, start, dur, vol, voice = 0) {
    const hz = 440 * 2 ** ((m - 69) / 12),
      at = Math.round(start * beat * rate),
      hold = dur * beat,
      release = 0.16;
    for (let j = 0; j < (hold + release) * rate; j++) {
      const t = j / rate,
        ph = 2 * Math.PI * hz * t,
        env =
          Math.min(1, t / (voice === 1 ? 0.09 : 0.025)) *
          (t > hold ? Math.max(0, 1 - (t - hold) / release) ** 2 : 1);
      const wave =
        voice === 0
          ? Math.sin(ph + 0.012 * Math.sin(t * 31)) +
            0.26 * Math.sin(ph * 2) +
            0.08 * Math.sin(ph * 3)
          : voice === 1
            ? Math.sin(ph) + 0.17 * Math.sin(ph * 3)
            : (Math.sin(ph) + 0.12 * Math.sin(ph * 2)) * Math.exp(-t * 2);
      const v = wave * env * vol;
      out[(at + j) % n] += v;
      out[(at + j + Math.round(beat * 0.75 * rate)) % n] += v * 0.1;
    }
  }
  const roots = victory
    ? [48, 53, 55, 48, 57, 53, 55, 48]
    : [50, 46, 43, 45, 50, 48, 46, 45];
  const themes = victory
    ? [
        [72, 76, 79, 84],
        [77, 81, 79, 77],
        [79, 83, 86, 83],
        [84, 79, 76, 72],
        [81, 84, 88, 84],
        [77, 81, 84, 81],
        [79, 83, 86, 79],
        [76, 79, 84, 84],
      ]
    : [
        [74, 77, 76, 69],
        [70, 74, 77, 74],
        [67, 70, 74, 72],
        [73, 76, 81, 76],
        [77, 81, 79, 77],
        [72, 76, 79, 76],
        [74, 77, 82, 77],
        [73, 76, 81, 73],
      ];
  for (let bar = 0; bar < bars; bar++) {
    const at = bar * 4,
      root = roots[bar % 8],
      third = victory ? 4 : bar % 8 === 3 || bar % 8 === 7 ? 4 : 3;
    const melody = themes[bar % 8];
    for (let k = 0; k < 4; k++)
      note(
        melody[k] + (bar >= 8 && k === 2 ? 12 : 0),
        at + k,
        k === 3 ? 0.85 : 0.7,
        0.011,
        0,
      );
    for (const tone of [root + 12, root + 12 + third, root + 19])
      note(tone, at, 3.65, 0.0023, 1);
    for (let k = 0; k < 4; k++) {
      note(root - 12 + (k % 2 ? 7 : 0), at + k, 0.7, 0.007, 2);
      if (victory)
        note(root + 12 + [0, third, 7, third][k], at + k + 0.5, 0.32, 0.003, 2);
    }
    // Rounded low drum, no piercing beeps or harsh noise.
    for (const off of [0, 2])
      for (let j = 0; j < 0.22 * rate; j++) {
        const t = j / rate;
        out[(Math.round((at + off) * beat * rate) + j) % n] +=
          Math.sin(2 * Math.PI * (75 * t - 90 * t * t)) *
          Math.exp(-t * 22) *
          0.012;
      }
  }
  return balanceMusic(buffer);
}

// "Guardian's March": a new, deliberately consonant D-minor boss theme.
// Every lead note belongs to its current chord; no detuning, pitch bends or echo.
const bossMarchChords = [
  [50, 53, 57],
  [46, 50, 53],
  [48, 53, 57],
  [48, 52, 55],
];
const bossMarchMelody = [
  [
    [62, 0, 0.8],
    [65, 1, 0.65],
    [69, 2, 1.5],
  ],
  [
    [65, 0, 1.3],
    [62, 1.5, 0.8],
    [58, 3, 0.65],
  ],
  [
    [60, 0, 0.8],
    [65, 1, 1.3],
    [69, 2.5, 0.9],
  ],
  [
    [67, 0, 1.3],
    [64, 1.5, 0.8],
    [60, 3, 0.65],
  ],
  [
    [69, 0, 0.8],
    [65, 1, 0.65],
    [62, 2, 1.5],
  ],
  [
    [62, 0, 0.8],
    [65, 1, 1.3],
    [62, 2.5, 0.9],
  ],
  [
    [65, 0, 1.3],
    [69, 1.5, 0.8],
    [65, 3, 0.65],
  ],
  [
    [64, 0, 0.8],
    [67, 1, 0.65],
    [60, 2, 1.5],
  ],
];
function buildFinaleActionMusic(ac) {
  const rate = ac.sampleRate,
    beat = 60 / 112,
    n = Math.round(64 * beat * rate),
    buffer = ac.createBuffer(1, n, rate),
    out = buffer.getChannelData(0);
  function note(midi, start, beats, volume, kind) {
    const hz = 440 * 2 ** ((midi - 69) / 12),
      at = Math.round(start * beat * rate),
      duration = beats * beat;
    for (let j = 0; j < duration * rate; j++) {
      const t = j / rate,
        phase = 2 * Math.PI * hz * t;
      const env =
        Math.min(1, t / (kind === 2 ? 0.09 : 0.025)) *
        Math.min(1, (duration - t) / 0.075);
      const wave =
        Math.sin(phase) +
        (kind === 0 ? 0.1 : kind === 1 ? 0.15 : 0.04) * Math.sin(phase * 2);
      out[(at + j) % n] +=
        wave *
        env *
        volume *
        (kind === 1 ? Math.exp(-t * 2) : 0.85 + 0.15 * Math.exp(-t * 3));
    }
  }
  function drum(start, snare) {
    const at = Math.round(start * beat * rate);
    let seed = at + 4711,
      filtered = 0;
    for (let j = 0; j < 0.16 * rate; j++) {
      const t = j / rate;
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      filtered = filtered * 0.84 + (seed / 2147483648 - 1) * 0.16;
      const wave = snare
        ? filtered * 0.7 + Math.sin(2 * Math.PI * 150 * t) * 0.3
        : Math.sin(2 * Math.PI * (72 * t - 80 * t * t));
      out[(at + j) % n] +=
        wave * Math.exp(-t * (snare ? 30 : 24)) * (snare ? 0.012 : 0.018);
    }
  }
  for (let bar = 0; bar < 16; bar++) {
    const at = bar * 4,
      ch = bossMarchChords[bar % 4];
    for (const [m, t, d] of bossMarchMelody[bar % 8])
      note(m, at + t, d, 0.013, 0);
    for (const m of ch) note(m, at + 0.05, 3.75, 0.0025, 2);
    for (const [t, m] of [
      [0, ch[0] - 12],
      [1.5, ch[2] - 12],
      [2, ch[0] - 12],
      [3, ch[2] - 12],
    ])
      note(m, at + t, 0.65, 0.009, 1);
    drum(at, false);
    drum(at + 1, true);
    drum(at + 2, false);
    drum(at + 3, true);
  }
  return balanceMusic(buffer);
}
function caveBats() {
  hangingBats();
  for (let i = 0; i < 3; i++) {
    const speed = 9 + i * 1.7,
      x =
        ((((i * 139 + time * speed - camera * 0.18) % (W + 80)) + W + 80) %
          (W + 80)) -
        40,
      y = 65 + ((i * 29) % 70) + Math.sin(time * 0.75 + i) * 10,
      flap = Math.sin(time * 10 + i) * 5,
      scale = 0.65 + (i % 3) * 0.18;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(scale, scale);
    poly(
      ctx,
      [
        [-2, 0],
        [-15, -7 - flap],
        [-12, 1],
        [-8, -1],
        [-5, 5],
        [0, 3],
        [5, 5],
        [8, -1],
        [12, 1],
        [15, -7 - flap],
        [2, 0],
      ],
      "#332942",
    );
    poly(
      ctx,
      [
        [-2, 0],
        [-12, -5 - flap],
        [-7, 0],
        [-4, 3],
      ],
      "#73576e",
    );
    poly(
      ctx,
      [
        [2, 0],
        [12, -5 - flap],
        [7, 0],
        [4, 3],
      ],
      "#73576e",
    );
    oval(ctx, 0, 1, 2.5, 4, "#241f37");
    poly(
      ctx,
      [
        [-2, 0],
        [-3, -5],
        [0, -2],
        [3, -5],
        [2, 0],
      ],
      "#30233c",
    );
    ctx.restore();
  }
}
function finaleChalkGround(p) {
  // Fit the complete 60px cave strata into the existing floor strip; collisions stay put.
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(1, p.h / 60);
  ctx.beginPath();
  ctx.rect(0, 0, p.w, 60);
  ctx.clip();
  const rock = { x: 0, y: 0, w: p.w, h: 60 };
  chalkPlatform(rock);
  chalkMineralDetails(rock);
  ctx.restore();
}

function roadExitPulse(t) {
  const mix = (1 + Math.sin(t * 1.8)) / 2;
  return (
    "rgb(" +
    [100, 124, 136]
      .map((v, i) => Math.round(v + ([118, 166, 109][i] - v) * mix))
      .join(",") +
    ")"
  );
}
function hangingBats() {
  for (const [x, y] of [
    [182, 32],
    [626, 46],
  ]) {
    ctx.save();
    ctx.translate(
      x - (WORLD > W ? Math.round(camera * (256 / (WORLD - W))) : 0),
      y,
    );
    rect(-2, 0, 1, 5, "#494151");
    rect(2, 0, 1, 5, "#494151");
    poly(
      ctx,
      [
        [-3, 3],
        [-6, 9],
        [-4, 20],
        [0, 23],
        [4, 20],
        [6, 9],
        [3, 3],
      ],
      "#342b43",
    );
    poly(
      ctx,
      [
        [-3, 5],
        [-4, 13],
        [0, 19],
        [0, 7],
      ],
      "#62546b",
    );
    poly(
      ctx,
      [
        [3, 5],
        [4, 13],
        [1, 19],
        [1, 7],
      ],
      "#4a3e58",
    );
    oval(ctx, 0, 21, 3.5, 4, "#40324d");
    poly(
      ctx,
      [
        [-3, 21],
        [-5, 26],
        [-1, 24],
        [1, 24],
        [5, 26],
        [3, 21],
      ],
      "#40324d",
    );
    rect(-2, 22, 1, 1, "#b9a9b7");
    rect(2, 22, 1, 1, "#b9a9b7");
    ctx.restore();
  }
}
function backgroundAnimalSpace(draw) {
  ctx.save();
  ctx.translate(-Math.round(camera * (85 / (WORLD - W))), 0);
  draw();
  ctx.restore();
}
function sittingWhiteBird(x, y, face) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(face, 1);
  rect(-3, -2, 1, 2, "#bb9577");
  rect(2, -2, 1, 2, "#bb9577");
  poly(
    ctx,
    [
      [-5, -4],
      [-11, -3],
      [-9, -1],
      [-3, -2],
    ],
    "#aebdce",
  );
  oval(ctx, 0, -6, 6, 4, "#dce5ec");
  oval(ctx, 0, -7, 5, 3.5, "#fffdf0");
  poly(
    ctx,
    [
      [-4, -7],
      [2, -6],
      [3, -3],
      [-3, -4],
    ],
    "#c3cfdb",
  );
  oval(ctx, 4, -10, 3, 4, "#f6f7ed");
  oval(ctx, 5, -13, 3, 3, "#fffef0");
  rect(6, -14, 1, 1, "#33475a");
  poly(
    ctx,
    [
      [7, -12],
      [11, -11],
      [7, -10],
    ],
    "#b59872",
  );
  ctx.restore();
}
function cinemaRoofBirds() {
  backgroundAnimalSpace(() => {
    const y = (208 * H) / 1024;
    [242, 553, 934, 1270].forEach((x, i) =>
      sittingWhiteBird((x * 860) / 1536, y, i % 3 === 0 ? -1 : 1),
    );
  });
}
function sittingCat(x, y, tuxedo, face) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(face, 1);
  const dark = tuxedo ? "#222938" : "#9d5029",
    body = tuxedo ? "#394355" : "#d98b43",
    light = tuxedo ? "#f5f1dd" : "#f7c478";
  // Curled tail, seated haunches, upright forelegs and distinct pointed ears.
  ctx.strokeStyle = dark;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-3, -2);
  ctx.bezierCurveTo(-15, 0, -13, -9, -10, -10);
  ctx.stroke();
  oval(ctx, 0, -7, 6, 7, dark);
  oval(ctx, 1, -8, 4.7, 6.5, body);
  poly(
    ctx,
    [
      [-1, -12],
      [4, -12],
      [5, -1],
      [0, -1],
    ],
    light,
  );
  rect(0, -5, 2, 5, body);
  rect(4, -5, 2, 5, body);
  rect(-1, -1, 4, 2, light);
  rect(3, -1, 4, 2, light);
  oval(ctx, 1, -17, 6, 5, body);
  poly(
    ctx,
    [
      [-5, -18],
      [-5, -25],
      [0, -21],
      [4, -21],
      [7, -25],
      [7, -17],
    ],
    dark,
  );
  poly(
    ctx,
    [
      [-4, -20],
      [-4, -23],
      [-1, -20],
    ],
    "#d99d91",
  );
  poly(
    ctx,
    [
      [4, -20],
      [6, -23],
      [6, -19],
    ],
    "#d99d91",
  );
  if (tuxedo)
    poly(
      ctx,
      [
        [1, -21],
        [-1, -16],
        [1, -13],
        [4, -15],
      ],
      light,
    );
  else {
    rect(-3, -20, 2, 3, dark);
    rect(1, -21, 2, 3, dark);
    rect(4, -20, 2, 3, dark);
    rect(-3, -9, 3, 2, dark);
    rect(-4, -5, 3, 2, dark);
  }
  rect(-2, -17, 2, 1, "#d7e899");
  rect(4, -17, 2, 1, "#d7e899");
  rect(1, -15, 2, 1, "#d89391");
  rect(-6, -14, 4, 1, "#e3d1b8");
  rect(4, -14, 5, 1, "#e3d1b8");
  ctx.restore();
}
function entranceCats() {
  backgroundAnimalSpace(() => {
    sittingCat((1194 * 860) / 1536, (302 * H) / 1024, false, 1);
    sittingCat((1315 * 860) / 1536, (302 * H) / 1024, true, -1);
  });
}
function squirrelSprite(x, y, face, phase) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(face * 0.8, 0.8);
  const stride = Math.sin(phase) * 2;
  // Tall curled brush tail makes the small background silhouette recognisable.
  oval(ctx, -8, -11, 5.5, 9, "#804020");
  oval(ctx, -9, -13, 4, 6, "#d2853b");
  oval(ctx, -10, -15, 2.5, 3.5, "#efb66b");
  oval(ctx, 0, -5, 7, 4.5, "#ad592a");
  oval(ctx, 1, -6, 5, 3, "#d38b43");
  oval(ctx, 5, -8, 3.5, 3.5, "#b76832");
  poly(
    ctx,
    [
      [3, -10],
      [3, -15],
      [6, -11],
      [8, -13],
      [8, -8],
    ],
    "#925027",
  );
  rect(6, -9, 1, 1, "#211e23");
  rect(8, -7, 2, 1, "#362b28");
  rect(-3 + stride, -2, 4, 2, "#6e3e28");
  rect(4 - stride, -2, 4, 2, "#6e3e28");
  rect(3, -5, 4, 1, "#edc58c");
  ctx.restore();
}
function parkSquirrels() {
  backgroundAnimalSpace(() => {
    const a = time * 0.52,
      b = time * 0.39 + 2;
    squirrelSprite(
      306 + Math.sin(a) * 48,
      263,
      Math.cos(a) >= 0 ? 1 : -1,
      time * 13,
    );
    squirrelSprite(
      650 + Math.sin(b) * 62,
      282,
      Math.cos(b) >= 0 ? 1 : -1,
      time * 12 + 1,
    );
  });
}

// Lower only the underground floor and its ground pickups; preserve raised ledges.
for (const p of underground.platforms)
  if (!p.shapePiece && p.h > 20) {
    p.y = 400;
    p.h = 32;
  }
underground.floorY = 400;
underground.rockPositions = underground.rockPositions.map(([x, y]) => [
  x,
  y >= 348 ? y + 26 : y,
]);
loadLevel(stageOrder[0]);
consoleHud();
requestAnimationFrame(frame);
