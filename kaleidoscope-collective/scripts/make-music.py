"""Synthesize the original soundtrack for the Kaleidoscope Collective promo.

120 BPM, D minor (Dm - Bb - F - C), 40 seconds. One bar = 2 s = 60 video
frames at 30 fps, so every scene cut in the video lands on a downbeat.

Usage: python3 scripts/make-music.py public/music.wav
"""

import sys
import wave

import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM  # 0.5 s
BAR = 4 * BEAT  # 2 s
LENGTH = 40.0
N = int(LENGTH * SR)
rng = np.random.default_rng(7)

# Song sections (seconds) - mirrors the scene timeline in src/timeline.ts
INTRO_END = 4.0
GROOVE_START = 8.0
STRAINS = 16.0
ROLL = 22.0  # "and 1st place goes to..." drum roll
DROP = 24.0  # Permanent Marker winner reveal
BREAK = 30.0  # calm breakdown under the trichome footage
END_CARD = 34.0

CHORDS = [  # MIDI notes, one chord per bar
    [62, 65, 69],  # Dm
    [58, 62, 65],  # Bb
    [65, 69, 72],  # F
    [60, 64, 67],  # C
]
ROOTS = [38, 34, 41, 36]  # D1/Bb0/F1/C1 region for sub bass


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def t_axis(n):
    return np.arange(n) / SR


def place(buf, sig, start_s, gain=1.0):
    i = int(start_s * SR)
    if i >= buf.shape[-1]:
        return
    j = min(buf.shape[-1], i + sig.shape[-1])
    buf[..., i:j] += gain * sig[..., : j - i]


def fft_filter(x, lo=None, hi=None, order=2):
    """Zero-phase Butterworth-shaped band filter in the frequency domain."""
    X = np.fft.rfft(x, axis=-1)
    f = np.fft.rfftfreq(x.shape[-1], 1 / SR)
    H = np.ones_like(f)
    if hi is not None:
        H *= 1 / np.sqrt(1 + (f / hi) ** (2 * order))
    if lo is not None:
        with np.errstate(divide="ignore"):
            H *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-6)) ** (2 * order))
    return np.fft.irfft(X * H, n=x.shape[-1], axis=-1)


def fft_convolve(x, ir):
    n = x.shape[-1] + ir.shape[-1] - 1
    nfft = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)
    return y[: x.shape[-1]]


def saw(freq, n, phase=0.0):
    ph = (np.arange(n) * freq / SR + phase) % 1.0
    return 2 * ph - 1


def adsr(n, a, d, s, r):
    env = np.full(n, s, dtype=float)
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na = min(na, n)
    env[:na] = np.linspace(0, 1, na, endpoint=False)
    nd = min(nd, n - na)
    env[na : na + nd] = np.linspace(1, s, nd, endpoint=False)
    if nr > 0 and nr < n:
        env[-nr:] *= np.linspace(1, 0, nr)
    return env


# ---------------------------------------------------------------- instruments


def kick():
    n = int(0.55 * SR)
    t = t_axis(n)
    f = 45 + 140 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 6.5)
    click = fft_filter(rng.standard_normal(n), lo=1500) * np.exp(-t * 300) * 0.25
    return np.tanh((body + click) * 1.6)


def clap():
    n = int(0.6 * SR)
    t = t_axis(n)
    noise = fft_filter(rng.standard_normal(n), lo=900, hi=6000)
    env = np.zeros(n)
    for k, off in enumerate([0.0, 0.011, 0.022, 0.034]):
        i = int(off * SR)
        env[i:] += np.exp(-(t[: n - i]) * (90 if k < 3 else 14))
    return noise * env * 0.5


def hat(open_=False):
    n = int((0.35 if open_ else 0.07) * SR)
    t = t_axis(n)
    noise = fft_filter(rng.standard_normal(n), lo=7000)
    return noise * np.exp(-t * (12 if open_ else 70)) * 0.35


def pluck(freq, dur=0.32):
    n = int(dur * SR)
    t = t_axis(n)
    tone = 0.6 * np.sign(np.sin(2 * np.pi * freq * t)) + 0.4 * saw(freq * 1.003, n)
    tone = fft_filter(tone, hi=2600 + 1200 * rng.random())
    return tone * np.exp(-t * 11) * adsr(n, 0.003, 0, 1, 0.02)


def pad_note(freq, dur):
    n = int(dur * SR)
    out = np.zeros((2, n))
    for ch, detunes in enumerate([(-0.11, 0.0, 0.07), (-0.06, 0.03, 0.12)]):
        for d in detunes:
            out[ch] += saw(freq * 2 ** (d / 12), n, rng.random())
    out = fft_filter(out, hi=1400)
    return out * adsr(n, 0.6, 0.4, 0.8, 0.8) / 3


def impact(size=1.0):
    n = int(3.2 * SR)
    t = t_axis(n)
    boom_f = 30 + 70 * np.exp(-t * 9)
    boom = np.sin(2 * np.pi * np.cumsum(boom_f) / SR) * np.exp(-t * 2.2)
    crash = fft_filter(rng.standard_normal(n), lo=3000) * np.exp(-t * 1.6) * 0.35
    return np.tanh(boom * 1.4) * size + crash * size


def riser(dur):
    n = int(dur * SR)
    t = t_axis(n)
    prog = t / dur
    noise = rng.standard_normal(n)
    # Crossfade three band-limited copies to fake a rising filter sweep.
    lowband = fft_filter(noise, lo=200, hi=1500)
    midband = fft_filter(noise, lo=1500, hi=5000)
    highband = fft_filter(noise, lo=5000)
    sweep = (
        lowband * np.clip(1 - prog * 2, 0, 1)
        + midband * np.sin(np.pi * np.clip(prog, 0, 1))
        + highband * np.clip(prog * 2 - 1, 0, 1)
    )
    tone_f = 200 * 2 ** (prog * 3)
    tone = np.sin(2 * np.pi * np.cumsum(tone_f) / SR) * 0.15
    return (sweep * 0.5 + tone) * prog**2


def reverse_cymbal(dur):
    n = int(dur * SR)
    t = t_axis(n)
    return fft_filter(rng.standard_normal(n), lo=4000) * (t / dur) ** 3 * 0.4


def shimmer(freq, dur):
    n = int(dur * SR)
    t = t_axis(n)
    return np.sin(2 * np.pi * freq * t) * np.exp(-t * 3.5) * adsr(n, 0.002, 0, 1, 0.05)


# ---------------------------------------------------------------- arrangement

drums = np.zeros(N)
bass = np.zeros(N)
arp = np.zeros(N)
pads = np.zeros((2, N))
fx = np.zeros((2, N))
kick_times = []

K, C, H, HO = kick(), clap(), hat(), hat(True)


def bar_chord(time_s):
    return int(time_s // BAR) % 4


# Pads: whole song, swelling in during the intro, carrying the outro
for b in range(int(LENGTH // BAR) + 1):
    start = b * BAR
    if start >= LENGTH:
        break
    gain = 0.5 if start < INTRO_END else 0.32
    if start >= END_CARD:
        gain = 0.45
    for m in CHORDS[b % 4]:
        place(pads, pad_note(mtof(m - 12), BAR + 0.9), start, gain)

# Intro shimmer: sparse high bell tones, accelerating into the impact
t = 0.25
step = 0.5
while t < INTRO_END - 0.1:
    m = CHORDS[0][int(t * 3) % 3] + 24
    place(fx, np.stack([shimmer(mtof(m), 1.2)] * 2) * [[0.9], [0.6]], t, 0.18)
    t += step
    step = max(0.125, step * 0.86)

place(fx, np.stack([riser(INTRO_END)] * 2), 0, 0.55)
place(fx, np.stack([reverse_cymbal(1.5)] * 2), INTRO_END - 1.5, 1.0)

# Impacts on the big moments
for when, size in [(INTRO_END, 1.0), (GROOVE_START, 0.6), (STRAINS, 0.7),
                   (DROP, 1.1), (BREAK, 0.35), (END_CARD, 0.9)]:
    place(fx, np.stack([impact(size)] * 2), when, 0.55)

# Risers into the section changes
for target, dur in [(GROOVE_START, 2.0), (STRAINS, 2.0), (DROP, 2.0), (END_CARD, 2.0)]:
    place(fx, np.stack([riser(dur)] * 2), target - dur, 0.35)

# Smaller sparkle hits on each strain card change
for k in range(1, 3):
    place(fx, np.stack([reverse_cymbal(0.5)] * 2), STRAINS + k * BAR - 0.5, 0.6)


def brass_stab(chord, dur):
    """Bright detuned-saw chord for the winner fanfare."""
    n = int(dur * SR)
    out = np.zeros(n)
    for m in chord:
        for d in (-0.08, 0.0, 0.08):
            out += saw(mtof(m) * 2 ** (d / 12), n, rng.random())
    out = fft_filter(out, hi=3200)
    return out * adsr(n, 0.01, 0.25, 0.55, 0.3) / (3 * len(chord))


# Winner fanfare: rising stabs into the reveal, a big chord on the drop
for t_s, chord, dur, g in [
    (DROP - 0.5, [62, 65, 69], 0.22, 0.45),
    (DROP - 0.25, [64, 67, 71], 0.22, 0.5),
    (DROP, [62, 66, 69, 74], 1.6, 0.75),  # D major lift for the win
    (DROP + 2.0, [58, 62, 65, 70], 0.9, 0.45),
    (DROP + 4.0, [65, 69, 72, 77], 0.9, 0.45),
]:
    place(fx, np.stack([brass_stab(chord, dur)] * 2), t_s, g)


def drum_bar(start, full=True):
    for beat in range(4):
        bt = start + beat * BEAT
        place(drums, K, bt)
        kick_times.append(bt)
        if full and beat in (1, 3):
            place(drums, C, bt)
        if full:
            for s in range(4):
                vel = [0.9, 0.4, 0.65, 0.4][s]
                if s == 2 and beat == 3:
                    place(drums, HO, bt + s * BEAT / 4, 0.7)
                else:
                    place(drums, H, bt + s * BEAT / 4, vel)


bar_t = INTRO_END
while bar_t < BREAK - 0.01:
    if bar_t < GROOVE_START:
        drum_bar(bar_t, full=False)
    elif ROLL <= bar_t < DROP:
        pass  # the drum roll owns this bar
    else:
        drum_bar(bar_t, full=True)
    bar_t += BAR

# Drum roll for "and 1st place goes to...": 8ths, then 16ths, then 32nds
roll_hits = [ROLL + k * BEAT / 2 for k in range(4)]
roll_hits += [ROLL + 1.0 + k * BEAT / 4 for k in range(4)]
roll_hits += [ROLL + 1.5 + k * BEAT / 8 for k in range(8)]
for k, rt in enumerate(roll_hits):
    place(drums, C, rt, 0.3 + 0.6 * k / len(roll_hits))
for k in range(4):
    place(drums, K, ROLL + k * BEAT, 0.6)
    kick_times.append(ROLL + k * BEAT)

# Breakdown: soft hats only, building back up for the end card
for k in range(int((END_CARD - BREAK) / (BEAT / 2))):
    ht = BREAK + 1.0 + k * BEAT / 2
    if ht < END_CARD:
        place(drums, H, ht, 0.25 + 0.35 * k / 14)

# Sub bass: on the groove, sustained under each bar, gritty in the drop
for b in range(int(GROOVE_START // BAR), int(BREAK // BAR)):
    start = b * BAR
    root = ROOTS[b % 4]
    n = int(BAR * SR)
    tt = t_axis(n)
    f = mtof(root + 12)
    sig = np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)
    if DROP <= start < BREAK:
        wob = 0.5 + 0.5 * np.sin(2 * np.pi * (4 / BAR) * tt - np.pi / 2)
        grit = fft_filter(np.tanh(saw(f, n) * 3), hi=300 + 900 * wob.mean())
        sig = sig * 0.8 + grit * wob * 0.5
    sig *= adsr(n, 0.01, 0.1, 0.9, 0.05)
    place(bass, sig, start, 0.42)

# Arp: 16th notes over the chord, two octaves, from the title on
pattern = [0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 3, 2, 1, 0, 1]
s16 = BEAT / 4
t = INTRO_END
idx = 0
while t < LENGTH - 2.0:
    chord = CHORDS[bar_chord(t)]
    p = pattern[idx % 16]
    m = chord[p % 3] + (12 if p == 3 else 0) + 12
    g = 0.22 if t < GROOVE_START or t >= BREAK else 0.17
    if DROP <= t < BREAK:
        g = 0.12
    if t >= END_CARD:
        g *= max(0.0, 1 - (t - END_CARD) / (LENGTH - 2.0 - END_CARD))
    place(arp, pluck(mtof(m)), t, g)
    t += s16
    idx += 1

# Sidechain duck for pads and bass
duck = np.ones(N)
for kt in kick_times:
    i = int(kt * SR)
    n = int(0.3 * SR)
    j = min(N, i + n)
    curve = 1 - 0.6 * np.exp(-t_axis(j - i) * 14)
    duck[i:j] = np.minimum(duck[i:j], curve)
pads *= duck
bass *= duck

# Ping-pong delay on the arp (dotted 8th)
d = int(BEAT * 0.75 * SR)
arp_st = np.zeros((2, N))
arp_st[0] += arp
arp_st[1] += arp * 0.8
for k, ch in enumerate([1, 0, 1, 0]):
    shift = d * (k + 1)
    arp_st[ch, shift:] += arp[: N - shift] * (0.45 ** (k + 1))

# Shared reverb
ir_n = int(2.6 * SR)
ir_t = t_axis(ir_n)
ir_l = rng.standard_normal(ir_n) * np.exp(-ir_t * 2.4)
ir_r = rng.standard_normal(ir_n) * np.exp(-ir_t * 2.4)
ir_l, ir_r = fft_filter(ir_l, hi=6000), fft_filter(ir_r, hi=6000)
ir_l /= np.sqrt((ir_l**2).sum())
ir_r /= np.sqrt((ir_r**2).sum())

send = pads * 0.5 + arp_st * 0.6 + fx * 0.5 + drums * 0.08
wet = np.stack([fft_convolve(send[0], ir_l), fft_convolve(send[1], ir_r)])

mix = pads + arp_st + fx + np.stack([drums, drums]) + np.stack([bass, bass]) + wet * 0.35

# Fade out over the end card tail
fade = np.ones(N)
fs, fe = int((LENGTH - 3.0) * SR), N
fade[fs:fe] = np.linspace(1, 0, fe - fs) ** 1.5
mix *= fade
mix[:, : int(0.01 * SR)] *= np.linspace(0, 1, int(0.01 * SR))

mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(mix * 1.3) / np.tanh(1.3) * 0.89

out = sys.argv[1] if len(sys.argv) > 1 else "public/music.wav"
pcm = (mix.T * 32767).astype("<i2")
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", out, f"{LENGTH}s")
