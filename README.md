# Jae Young Yoon

This repository hosts my personal technical blog:

```text
https://jyblue1001.github.io/
```

The blog is a collection of notes, design logs, and circuit-level writeups from my work in analog integrated circuit design. Most of the current posts focus on phase-locked loop design, including VCOs, frequency dividers, phase-frequency detectors, charge pumps, loop filters, and full PLL integration.

My goal is to document the design process in a way that is useful after the simulation window is closed: equations, topology choices, design tradeoffs, SPICE setup, waveform interpretation, and the reasoning behind each revision.

## Main Topics

- Analog CMOS circuit design
- PLL architecture and block-level implementation
- Open-source IC design tools
- Simulation-driven circuit debugging
- Technical notes from ongoing projects

## Current Series

The PLL series is organized as a set of connected posts that move from system-level parameters toward transistor-level implementation. The series is not meant to be a polished textbook; it is closer to a design notebook cleaned up for public reading.

Future posts may expand beyond PLLs into other analog and mixed-signal circuits.

## Repository

The site is built with Astro. Blog posts live under:

```text
astro-blog/src/content/posts/
```

Static images and figures live under:

```text
astro-blog/public/images/
```
