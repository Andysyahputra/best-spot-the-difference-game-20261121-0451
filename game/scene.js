/* The lighthouse keeper's desk, drawn in code on a canvas.
 *
 * One function, drawScene, paints the whole picture. It takes a variant,
 * 'left' or 'right': the two pictures share everything except the 7
 * differences listed in differences.js. Found markers and the keyboard
 * focus ring are drawn on top by drawOverlays.
 */
'use strict';

var SCENE_WIDTH = 560;
var SCENE_HEIGHT = 420;

function drawWall(ctx) {
  var g = ctx.createLinearGradient(0, 0, 0, 300);
  g.addColorStop(0, '#232c47');
  g.addColorStop(0.7, '#3a3348');
  g.addColorStop(1, '#54432f');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCENE_WIDTH, 300);
  // Wainscot line where wall meets desk.
  ctx.fillStyle = '#6b543a';
  ctx.fillRect(0, 296, SCENE_WIDTH, 6);
}

function drawDesk(ctx) {
  ctx.fillStyle = '#7a5a34';
  ctx.fillRect(0, 300, SCENE_WIDTH, 120);
  ctx.fillStyle = '#6b4c2a';
  for (var y = 322; y < 420; y += 24) ctx.fillRect(0, y, SCENE_WIDTH, 2);
  ctx.fillStyle = '#8a6a42';
  ctx.fillRect(0, 300, SCENE_WIDTH, 4);
}

function drawRoundWindow(ctx, variant) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(110, 90, 62, 0, Math.PI * 2);
  ctx.clip();
  // Night sky.
  var sky = ctx.createLinearGradient(0, 28, 0, 152);
  sky.addColorStop(0, '#0d1530');
  sky.addColorStop(1, '#1d3a5f');
  ctx.fillStyle = sky;
  ctx.fillRect(48, 28, 124, 124);
  // Stars.
  ctx.fillStyle = '#e8ecff';
  var stars = [[70, 55], [140, 48], [155, 80], [60, 105], [128, 118], [88, 40]];
  for (var i = 0; i < stars.length; i++) {
    ctx.beginPath();
    ctx.arc(stars[i][0], stars[i][1], 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  // Sea at the bottom of the window.
  ctx.fillStyle = '#16324e';
  ctx.beginPath();
  ctx.moveTo(48, 128);
  ctx.quadraticCurveTo(80, 118, 110, 128);
  ctx.quadraticCurveTo(140, 138, 172, 128);
  ctx.lineTo(172, 152);
  ctx.lineTo(48, 152);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4d7ea6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(56, 136);
  ctx.quadraticCurveTo(85, 130, 112, 136);
  ctx.quadraticCurveTo(140, 142, 164, 136);
  ctx.stroke();
  // The moon: full on the left picture, crescent on the right.
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.arc(96, 76, 22, 0, Math.PI * 2);
  ctx.fill();
  if (variant === 'right') {
    ctx.fillStyle = '#0d1530';
    ctx.beginPath();
    ctx.arc(104, 72, 20, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  // Window frame and crossbar.
  ctx.strokeStyle = '#5d4126';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(110, 90, 62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(110, 28);
  ctx.lineTo(110, 152);
  ctx.moveTo(48, 90);
  ctx.lineTo(172, 90);
  ctx.stroke();
}

function drawClock(ctx, variant) {
  ctx.save();
  ctx.translate(452, 72);
  // Face.
  ctx.fillStyle = '#f4ecd8';
  ctx.beginPath();
  ctx.arc(0, 0, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5d4126';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 38, 0, Math.PI * 2);
  ctx.stroke();
  // Tick marks.
  ctx.strokeStyle = '#3a2c1a';
  ctx.lineWidth = 2;
  for (var i = 0; i < 12; i++) {
    var a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 31, Math.sin(a) * 31);
    ctx.lineTo(Math.cos(a) * 35, Math.sin(a) * 35);
    ctx.stroke();
  }
  // Hands: 9:00 on the left, 6:30 on the right.
  var hourAngle, minuteAngle;
  if (variant === 'left') {
    hourAngle = -Math.PI / 2; // pointing at 9
    minuteAngle = -Math.PI / 2; // pointing at 12
  } else {
    hourAngle = Math.PI * 0.625; // halfway between 6 and 7
    minuteAngle = Math.PI / 2; // pointing at 6
  }
  ctx.strokeStyle = '#22201c';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(hourAngle) * 20, Math.sin(hourAngle) * 20);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(minuteAngle) * 30, Math.sin(minuteAngle) * 30);
  ctx.stroke();
  ctx.fillStyle = '#22201c';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawShipPicture(ctx, variant) {
  ctx.save();
  ctx.translate(350, 100);
  if (variant === 'right') ctx.rotate(0.14); // about 8 degrees, hanging tilted
  // Frame.
  ctx.fillStyle = '#5d4126';
  ctx.fillRect(-52, -42, 104, 84);
  ctx.fillStyle = '#c9b183';
  ctx.fillRect(-46, -36, 92, 72);
  // Sea and sky inside the frame.
  var sky = ctx.createLinearGradient(0, -36, 0, 36);
  sky.addColorStop(0, '#bcd8e8');
  sky.addColorStop(1, '#7fa8c4');
  ctx.fillStyle = sky;
  ctx.fillRect(-46, -36, 92, 72);
  ctx.fillStyle = '#2e5d7d';
  ctx.fillRect(-46, 12, 92, 24);
  // The ship: hull, mast, sail.
  ctx.fillStyle = '#4a2f1d';
  ctx.beginPath();
  ctx.moveTo(-28, 12);
  ctx.lineTo(28, 12);
  ctx.lineTo(20, 24);
  ctx.lineTo(-20, 24);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3a2415';
  ctx.fillRect(-2, -28, 4, 40);
  ctx.fillStyle = '#f4ecd8';
  ctx.beginPath();
  ctx.moveTo(2, -28);
  ctx.lineTo(2, 6);
  ctx.lineTo(24, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBooks(ctx, variant) {
  // Bottom book (brown), middle book (blue), top book (red left, green right).
  var books = [
    { x: 148, y: 284, w: 88, h: 16, color: '#6b3f22', title: '' },
    { x: 154, y: 268, w: 76, h: 16, color: '#2e4a6b', title: '' },
    { x: 160, y: 252, w: 64, h: 16, color: variant === 'left' ? '#a83232' : '#2e6b3f', title: '' }
  ];
  for (var i = 0; i < books.length; i++) {
    var b = books[i];
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(b.x, b.y, b.w, 3);
    ctx.fillStyle = '#f4ecd8';
    ctx.fillRect(b.x + 4, b.y + 2, 3, b.h - 4);
  }
  // Pages of the top book.
  ctx.fillStyle = '#efe3c2';
  ctx.fillRect(160, 252, 64, 3);
}

function drawTeacup(ctx, variant) {
  // Saucer.
  ctx.fillStyle = '#d8c9a8';
  ctx.beginPath();
  ctx.ellipse(330, 294, 34, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Cup body.
  ctx.fillStyle = '#b8d4e8';
  ctx.beginPath();
  ctx.moveTo(312, 264);
  ctx.lineTo(348, 264);
  ctx.lineTo(344, 292);
  ctx.lineTo(316, 292);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#7fa8c4';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Tea surface.
  ctx.fillStyle = '#8a5a2e';
  ctx.beginPath();
  ctx.ellipse(330, 265, 17, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // Handle: present on the left picture, missing on the right.
  if (variant === 'left') {
    ctx.strokeStyle = '#b8d4e8';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(350, 278, 10, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
}

function drawLamp(ctx) {
  // Warm glow behind the shade.
  var glow = ctx.createRadialGradient(478, 210, 8, 478, 210, 90);
  glow.addColorStop(0, 'rgba(255, 214, 130, 0.55)');
  glow.addColorStop(1, 'rgba(255, 214, 130, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(388, 120, 180, 180);
  // Brass base, stem and shade.
  ctx.fillStyle = '#b08a3e';
  ctx.beginPath();
  ctx.ellipse(478, 298, 26, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(474, 228, 8, 68);
  ctx.fillStyle = '#c9a44a';
  ctx.beginPath();
  ctx.moveTo(452, 228);
  ctx.lineTo(504, 228);
  ctx.lineTo(494, 196);
  ctx.lineTo(462, 196);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.ellipse(478, 229, 24, 4, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawCandle(ctx, variant) {
  // Brass holder and stick.
  ctx.fillStyle = '#b08a3e';
  ctx.beginPath();
  ctx.ellipse(262, 298, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#efe3c2';
  ctx.fillRect(257, 252, 10, 46);
  ctx.fillStyle = '#d8c9a8';
  ctx.fillRect(257, 252, 10, 4);
  if (variant === 'left') {
    // Lit: glowing flame with a halo.
    var halo = ctx.createRadialGradient(262, 238, 2, 262, 238, 26);
    halo.addColorStop(0, 'rgba(255, 220, 120, 0.8)');
    halo.addColorStop(1, 'rgba(255, 220, 120, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(262, 238, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffcf4d';
    ctx.beginPath();
    ctx.moveTo(262, 222);
    ctx.quadraticCurveTo(272, 236, 262, 246);
    ctx.quadraticCurveTo(252, 236, 262, 222);
    ctx.fill();
    ctx.fillStyle = '#fff3c4';
    ctx.beginPath();
    ctx.moveTo(262, 230);
    ctx.quadraticCurveTo(267, 238, 262, 243);
    ctx.quadraticCurveTo(257, 238, 262, 230);
    ctx.fill();
  } else {
    // Unlit: a thin wisp of smoke curling from the wick.
    ctx.strokeStyle = 'rgba(200, 200, 210, 0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(262, 250);
    ctx.quadraticCurveTo(256, 240, 262, 232);
    ctx.quadraticCurveTo(268, 224, 262, 216);
    ctx.stroke();
  }
}

function drawRug(ctx) {
  ctx.fillStyle = '#7d3b3b';
  ctx.beginPath();
  ctx.ellipse(280, 372, 132, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d8b25c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(280, 372, 116, 20, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#d8b25c';
  for (var i = 0; i < 8; i++) {
    var a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(280 + Math.cos(a) * 96, 372 + Math.sin(a) * 15, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCat(ctx) {
  // Sleeping grey cat, curled on the rug: body, head, ears, tail, closed eye.
  ctx.fillStyle = '#8a8f98';
  ctx.beginPath();
  ctx.ellipse(272, 362, 34, 16, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(306, 352, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(296, 344);
  ctx.lineTo(300, 332);
  ctx.lineTo(306, 342);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(310, 340);
  ctx.lineTo(316, 330);
  ctx.lineTo(318, 342);
  ctx.closePath();
  ctx.fill();
  // Stripes on the back.
  ctx.strokeStyle = '#6e7278';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(250, 350);
  ctx.lineTo(252, 360);
  ctx.moveTo(264, 348);
  ctx.lineTo(266, 358);
  ctx.stroke();
  // Tail curled around the body.
  ctx.strokeStyle = '#8a8f98';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(240, 366);
  ctx.quadraticCurveTo(226, 376, 240, 382);
  ctx.stroke();
  // Closed eye and nose.
  ctx.strokeStyle = '#3a3d42';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(302, 352);
  ctx.quadraticCurveTo(305, 354, 308, 352);
  ctx.stroke();
  ctx.fillStyle = '#c98a8a';
  ctx.beginPath();
  ctx.arc(318, 356, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

/** Paint the whole scene for one picture. `variant` is 'left' or 'right'. */
function drawScene(ctx, variant) {
  ctx.clearRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
  drawWall(ctx);
  drawRoundWindow(ctx, variant);
  drawClock(ctx, variant);
  drawShipPicture(ctx, variant);
  drawDesk(ctx);
  drawRug(ctx);
  drawBooks(ctx, variant);
  drawTeacup(ctx, variant);
  drawLamp(ctx);
  drawCandle(ctx, variant);
  if (variant === 'left') drawCat(ctx);
}

/** Draw found markers (bright gold circles) and the keyboard focus ring. */
function drawOverlays(ctx, found, focusIndex, pulse) {
  var now = Date.now();
  for (var i = 0; i < DIFFERENCES.length; i++) {
    if (!found[i]) continue;
    var d = DIFFERENCES[i];
    var r = d.r + 6;
    if (pulse && pulse.index === i) {
      var age = (now - pulse.startedAt) / 450;
      if (age < 1) r = d.r + 6 + age * 14;
    }
    ctx.save();
    ctx.strokeStyle = '#ffd23e';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#ffd23e';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    // Small tick at the circle's top.
    ctx.save();
    ctx.strokeStyle = '#ffd23e';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(d.x - 8, d.y - r - 2);
    ctx.lineTo(d.x - 1, d.y - r + 6);
    ctx.lineTo(d.x + 10, d.y - r - 8);
    ctx.stroke();
    ctx.restore();
  }
  if (focusIndex >= 0 && focusIndex < DIFFERENCES.length) {
    var f = DIFFERENCES[focusIndex];
    ctx.save();
    ctx.strokeStyle = '#7fd4ff';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r + 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
