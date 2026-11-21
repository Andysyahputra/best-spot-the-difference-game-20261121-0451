/* The 7 differences of "The Lighthouse Keeper's Desk".
 *
 * Each difference is a hotspot in scene coordinates (the canvases are 560x420).
 * `left` and `right` name what each picture shows, so the game can describe
 * a find and the dossier can list them. The hotspots are shared by both
 * pictures: clicking either picture at the spot counts.
 */
'use strict';

var DIFFERENCES = [
  {
    id: 'cat',
    name: 'The sleeping cat',
    x: 280, y: 362, r: 34,
    left: 'a grey cat asleep on the rug',
    right: 'no cat — only the empty rug'
  },
  {
    id: 'clock',
    name: 'The wall clock',
    x: 452, y: 72, r: 40,
    left: 'the clock shows 9:00',
    right: 'the clock shows 6:30'
  },
  {
    id: 'candle',
    name: 'The candle flame',
    x: 262, y: 232, r: 30,
    left: 'the candle is lit, flame glowing',
    right: 'the candle is unlit, only a wisp of smoke'
  },
  {
    id: 'book',
    name: 'The top book',
    x: 190, y: 252, r: 34,
    left: 'the top book is red',
    right: 'the top book is green'
  },
  {
    id: 'moon',
    name: 'The moon',
    x: 96, y: 76, r: 30,
    left: 'a full moon in the round window',
    right: 'a crescent moon in the round window'
  },
  {
    id: 'teacup',
    name: 'The teacup handle',
    x: 356, y: 272, r: 28,
    left: 'the teacup has a handle',
    right: 'the teacup has no handle'
  },
  {
    id: 'ship',
    name: 'The framed ship picture',
    x: 350, y: 100, r: 42,
    left: 'the ship picture hangs straight',
    right: 'the ship picture hangs tilted'
  }
];

var TOTAL_DIFFERENCES = DIFFERENCES.length;
