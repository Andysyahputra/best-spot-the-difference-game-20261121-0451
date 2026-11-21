/* "The Lighthouse Keeper's Desk" — game state, input and the win flow.
 *
 * Two canvases show the same scene in its 'left' and 'right' variants.
 * Clicking (or keyboard-selecting) a real difference marks it on both
 * pictures, chimes, and updates the counter. Wrong clicks shake the
 * picture and show a gentle hint. Finding all 7 opens the win panel
 * with a time and a star rating.
 */
'use strict';

(function () {
  var leftCanvas = document.getElementById('leftCanvas');
  var rightCanvas = document.getElementById('rightCanvas');
  var leftCtx = leftCanvas.getContext('2d');
  var rightCtx = rightCanvas.getContext('2d');
  var counterEl = document.getElementById('counter');
  var timerEl = document.getElementById('timer');
  var progressFill = document.getElementById('progressFill');
  var hintEl = document.getElementById('hint');
  var foundListEl = document.getElementById('foundList');
  var muteBtn = document.getElementById('muteBtn');
  var resetBtn = document.getElementById('resetBtn');
  var winPanel = document.getElementById('winPanel');
  var winStars = document.getElementById('winStars');
  var winTime = document.getElementById('winTime');
  var winMisclicks = document.getElementById('winMisclicks');
  var winAgainBtn = document.getElementById('winAgainBtn');

  var state = {
    found: [],
    misclicks: 0,
    startedAt: Date.now(),
    elapsedMs: 0,
    won: false,
    focusIndex: -1,
    pulse: null,
    hintTimer: null,
    tickTimer: null
  };

  function foundCount() {
    var n = 0;
    for (var i = 0; i < state.found.length; i++) if (state.found[i]) n++;
    return n;
  }

  function formatTime(ms) {
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60);
    var r = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
  }

  function render() {
    drawScene(leftCtx, 'left');
    drawScene(rightCtx, 'right');
    drawOverlays(leftCtx, state.found, state.focusIndex, state.pulse);
    drawOverlays(rightCtx, state.found, state.focusIndex, state.pulse);
  }

  function updateHud() {
    var n = foundCount();
    counterEl.textContent = 'Found ' + n + ' / ' + TOTAL_DIFFERENCES;
    progressFill.style.width = (n / TOTAL_DIFFERENCES * 100) + '%';
    timerEl.textContent = formatTime(state.elapsedMs);
    var names = [];
    for (var i = 0; i < DIFFERENCES.length; i++) {
      if (state.found[i]) names.push(DIFFERENCES[i].name);
    }
    foundListEl.textContent = names.length === 0
      ? 'Nothing found yet — 7 differences are hiding.'
      : 'Found: ' + names.join(' · ') + '.';
  }

  function showHint(text) {
    hintEl.textContent = text;
    if (state.hintTimer) clearTimeout(state.hintTimer);
    state.hintTimer = setTimeout(function () { hintEl.textContent = ''; }, 1800);
  }

  function starRating() {
    var seconds = state.elapsedMs / 1000;
    if (seconds <= 120 && state.misclicks <= 3) return 3;
    if (seconds <= 240 && state.misclicks <= 8) return 2;
    return 1;
  }

  function showWin() {
    state.won = true;
    var stars = starRating();
    winStars.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    winTime.textContent = 'Finished in ' + formatTime(state.elapsedMs) + '.';
    winMisclicks.textContent = state.misclicks === 0
      ? 'Not a single wrong click — a perfect hunt!'
      : state.misclicks + (state.misclicks === 1 ? ' wrong click.' : ' wrong clicks.');
    winPanel.hidden = false;
    SoundFX.win();
    winAgainBtn.focus();
  }

  function markFound(index) {
    if (state.found[index] || state.won) return;
    state.found[index] = true;
    state.pulse = { index: index, startedAt: Date.now() };
    SoundFX.found();
    var d = DIFFERENCES[index];
    showHint('Found it! ' + d.name + ': ' + d.left + ' — but ' + d.right + '.');
    updateHud();
    render();
    setTimeout(render, 500); // let the pulse ring settle
    if (foundCount() === TOTAL_DIFFERENCES) {
      setTimeout(showWin, 650);
    }
  }

  function missClick(canvas) {
    if (state.won) return;
    state.misclicks++;
    SoundFX.miss();
    showHint('Not a difference — look closer!');
    canvas.classList.remove('shake');
    void canvas.offsetWidth; // restart the shake animation
    canvas.classList.add('shake');
  }

  function differenceAt(x, y) {
    for (var i = 0; i < DIFFERENCES.length; i++) {
      if (state.found[i]) continue;
      var d = DIFFERENCES[i];
      var dx = x - d.x;
      var dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) return i;
    }
    return -1;
  }

  function canvasPoint(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = SCENE_WIDTH / rect.width;
    var scaleY = SCENE_HEIGHT / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  function onCanvasClick(canvas, event) {
    var p = canvasPoint(canvas, event);
    var index = differenceAt(p.x, p.y);
    if (index >= 0) markFound(index);
    else missClick(canvas);
  }

  leftCanvas.addEventListener('click', function (e) { onCanvasClick(leftCanvas, e); });
  rightCanvas.addEventListener('click', function (e) { onCanvasClick(rightCanvas, e); });

  /* Keyboard: Tab / arrows move the focus ring between the difference
   * regions that are still unfound, Enter or Space selects the focused
   * one, Esc clears the ring. */
  document.addEventListener('keydown', function (e) {
    if (!winPanel.hidden) return; // the win panel owns the keyboard then
    var forward = e.key === 'Tab' || e.key === 'ArrowRight' || e.key === 'ArrowDown';
    var backward = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
    if (forward || backward) {
      e.preventDefault();
      var step = backward ? -1 : 1;
      if (e.shiftKey && e.key === 'Tab') step = -1;
      // Step to the next still-unfound difference, wrapping around.
      var next = state.focusIndex;
      for (var tries = 0; tries < TOTAL_DIFFERENCES; tries++) {
        next = next < 0
          ? (step > 0 ? 0 : TOTAL_DIFFERENCES - 1)
          : (next + step + TOTAL_DIFFERENCES) % TOTAL_DIFFERENCES;
        if (!state.found[next]) break;
      }
      if (state.found[next]) return; // everything is already found
      state.focusIndex = next;
      render();
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && state.focusIndex >= 0) {
      e.preventDefault();
      markFound(state.focusIndex);
      return;
    }
    if (e.key === 'Escape' && state.focusIndex >= 0) {
      state.focusIndex = -1;
      render();
    }
  });

  function resetGame() {
    state.found = [];
    for (var i = 0; i < TOTAL_DIFFERENCES; i++) state.found.push(false);
    state.misclicks = 0;
    state.won = false;
    state.focusIndex = -1;
    state.pulse = null;
    state.startedAt = Date.now();
    state.elapsedMs = 0;
    winPanel.hidden = true;
    hintEl.textContent = '';
    foundListEl.textContent = 'Nothing found yet — 7 differences are hiding.';
    updateHud();
    render();
  }

  resetBtn.addEventListener('click', resetGame);
  winAgainBtn.addEventListener('click', resetGame);

  muteBtn.addEventListener('click', function () {
    SoundFX.setMuted(!SoundFX.isMuted());
    muteBtn.textContent = SoundFX.isMuted() ? 'Sound: off' : 'Sound: on';
    muteBtn.setAttribute('aria-pressed', String(SoundFX.isMuted()));
  });

  /* Timer: counts up from the start; pauses at the win. */
  state.tickTimer = setInterval(function () {
    if (!state.won) {
      state.elapsedMs = Date.now() - state.startedAt;
      timerEl.textContent = formatTime(state.elapsedMs);
    }
  }, 250);

  /* Demo states for the maker's screenshots (?shot=mid or ?shot=win):
   * real renders of the game's own code with differences pre-found. */
  function applyDemoShot() {
    var shot = null;
    try {
      shot = new URLSearchParams(window.location.search).get('shot');
    } catch (err) { shot = null; }
    if (shot === 'mid') {
      state.found[0] = true; // the cat
      state.found[2] = true; // the candle
      state.found[4] = true; // the moon
      state.misclicks = 1;
      state.elapsedMs = 83000;
      state.startedAt = Date.now() - 83000;
    } else if (shot === 'win') {
      for (var i = 0; i < TOTAL_DIFFERENCES; i++) state.found[i] = true;
      state.misclicks = 2;
      state.elapsedMs = 142000;
      state.startedAt = Date.now() - 142000;
      updateHud();
      render();
      state.won = true;
      var stars = starRating();
      winStars.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
      winTime.textContent = 'Finished in ' + formatTime(state.elapsedMs) + '.';
      winMisclicks.textContent = state.misclicks + ' wrong clicks.';
      winPanel.hidden = false;
    }
  }

  resetGame();
  applyDemoShot();
  updateHud();
  render();
})();
