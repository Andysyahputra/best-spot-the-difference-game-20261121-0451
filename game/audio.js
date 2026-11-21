/* Tiny WebAudio chimes for "The Lighthouse Keeper's Desk".
 * No audio files: every sound is synthesized with an oscillator, and the
 * mute toggle silences them. The AudioContext is created lazily on the
 * first user gesture, so browsers never block it.
 */
'use strict';

var SoundFX = (function () {
  var ctx = null;
  var muted = false;

  function ensureContext() {
    if (ctx === null) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, startAt, duration, volume) {
    var ac = ensureContext();
    if (!ac || muted) return;
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(volume, ac.currentTime + startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + startAt);
    osc.stop(ac.currentTime + startAt + duration + 0.05);
  }

  return {
    /* Two-note chime when a difference is found. */
    found: function () {
      tone(880, 0, 0.16, 0.18);
      tone(1318.5, 0.09, 0.22, 0.15);
    },
    /* Soft low thud for a wrong click. */
    miss: function () {
      tone(196, 0, 0.12, 0.10);
    },
    /* Little arpeggio for the win panel. */
    win: function () {
      tone(523.25, 0, 0.18, 0.16);
      tone(659.25, 0.12, 0.18, 0.16);
      tone(783.99, 0.24, 0.18, 0.16);
      tone(1046.5, 0.36, 0.34, 0.18);
    },
    setMuted: function (value) { muted = !!value; },
    isMuted: function () { return muted; }
  };
})();
