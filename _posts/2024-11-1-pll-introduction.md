---
title: "2.4GHz PLL Design Log using Skywater130 PDK with OSIC"
date: 2024-11-01 10:00:00 +0000
categories: [AnalogDesign, PLL]
tags: [PLL, skywater130, OSIC, analog-design]
description: "Detailed log of designing a 2.4GHz Phased-Locked-Loop using Skywater130 PDK with open-source tools, covering every step, mistake, and learning."
pin: true
---

## Before Starting…
This blog is a log record of making a 2.4GHz Phased-Locked-Loop (PLL) using the Skywater130 PDK and open-source IC design tools.

### Objective
The goal of this project was to dive into analog chip design for a PLL without any guidance, demonstrating that analog designs are accessible with free tools on a personal computer.

### What This Blog Covers
1. **Design Process**: A thorough breakdown of the entire process, including all mistakes and design considerations.
2. **Learning Resources**: Key references, including relevant chapters in textbooks for better comprehension.
3. **Practical Tips**: Realistic advice based on challenges and personal decision-making throughout the design.

---

## Things You Need to Know
This project relies on key concepts from:
- **Design of Analog CMOS Integrated Circuits, 2nd Edition – Razavi**
  - Mandatory Chapters: CH15, 16
  - Recommended: CH5, 7, 13
- **Design of CMOS Phase-Locked Loops: From Circuit Level to Architecture Level, 1st Edition – Razavi**
  - Mandatory Chapters: CH3, 7, 8, 9, 15

## Table of Contents
1. [Introduction](#introduction)
2. [PLL Design Parameters](#pll-design-parameters)
3. [VCO](#vco)
4. [Frequency Phase Detector](#frequency-phase-detector)
5. [Charge Pump](#charge-pump)
6. [Divider](#divider)
7. [Full PLL](#full-pll)

## Introduction

### Objective
Attempt to design a 2.4GHz PLL independently using open-source tools.

### Design Considerations
Choosing architectures, target parameters, and testing conditions, this project documents all design decisions in detail.

### Order of the Designs
The design follows a structured order from basic components like the VCO to the full PLL integration.

## PLL Design Parameters
(Include detailed PLL parameter definitions and chosen specifications here.)

## VCO
(Detailed section on VCO design, including challenges, methods, and outcomes.)

## Frequency Phase Detector
(Description of the design considerations, component choices, and performance of the frequency phase detector.)

## Charge Pump
(Details on the charge pump design and any relevant performance tuning.)

## Divider
(Divider design details, including calculations and implementation choices.)

## Full PLL
(Summary of the integrated design and final performance metrics.)

---

*Follow along as I tackle the complexities of analog design with an open mind and hands-on approach!*

