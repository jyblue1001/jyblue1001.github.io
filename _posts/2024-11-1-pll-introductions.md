---
layout: post
title: "PLL Introduction"
date: 2024-11-01
categories: [Analog Design, PLL]
toc: true
comments: true
---

# Table of Contents

1. [Introduction](#introduction)
  
   A. [Objective](#1a-objective-designing-a-24ghz-phased-locked-loop-with-open-source-materials-using-the-skywater130-pdk)  
   B. [Design Considerations](#1b-design-considerations)  
   C. [Order of the Designs](#1c-order-of-the-designs)  

---

## 1.A. Objective: Designing a 2.4GHz Phased-Locked-Loop with open-source materials using the Skywater130 PDK

1. **Why 2.4GHz?**  
I wanted to design a (1) **“familiar”** frequency of interest, such as “Bluetooth,” and in (2) the Gigahertz range.  
This was because design difficulties arise when designing at high frequencies, and I wanted to tackle these challenges. Such difficulties include nanometer design considerations (parasitic capacitances, leakage currents, and topology considerations). These challenges often present very different characteristics than those typically covered in Microelectronics classes.  
  
2. **Which open-source material?**  
Here are the main open-source tools and resources I used for this project:

    **Xschem** (schematics) - [https://xschem.sourceforge.io/stefan/index.html](https://xschem.sourceforge.io/stefan/index.html)  
    **Ngspice** (simulations) - [https://ngspice.sourceforge.io/](https://ngspice.sourceforge.io/)  
    **Magic VLSI** (layout) - [http://opencircuitdesign.com/magic/](http://opencircuitdesign.com/magic/)  
    **Netgen** (netlist comparison, LVS) - [http://opencircuitdesign.com/netgen/](http://opencircuitdesign.com/netgen/)  
    **Skywater130 PDK** (Process Design Kit) - [https://skywater-pdk.readthedocs.io/en/main/](https://skywater-pdk.readthedocs.io/en/main/)


> **IMPORTANT**: This post is a design log and does not cover instructions on how to use these tools. However, here are two YouTube playlists that helped me greatly in self-teaching these tools: **[Playlist 1](https://www.youtube.com/playlist?list=PLgsDG5BJZpBTEUaxjfvYUiMPpUPU_vQpr)** and **[Playlist 2](https://www.youtube.com/watch?v=bYbkz8FXnsQ)**.

---

## 1.B. Design Considerations

Before starting off designing 2.4GHz PLL, there are some priorities that we need to have in mind all the time when designing this PLL. This might sound a bit ambiguous right now, but it will be clear after the following explanation:

  1. Design Limitations - Minimum Dimension of the Transistors  
  Skywater130 PDK uses transistors with a minimum dimension of Width (420nm) and Length (150nm) that can pass the DRC. This means we are unable to design anything below that size, which imposes limitations on topology choices and maximum achievable frequencies.

  2. Design Limitations - Limits in Inductor Implementation  
  Currently, Skywater130 PDK does not support inductor devices. Simply put, we can’t implement designs that require inductors. However, there have been successful tape-outs using alternative methods, as mentioned in [this thread](#). Though this approach seems interesting, I have not attempted it. Implementing this could be exhaustive, so it should be a future project of its own, so for now, we will proceed without inductors.

  3. Layout Considerations  
  In IC design, **AREA = MONEY**. Therefore, wherever possible without impacting the functionality of the PLL, we will use the smallest devices to minimize area and cost.

---

## 1.C. Order of the Designs

The design process for this PLL was approached in the following order:

1. **Voltage Controlled Oscillator (VCO)**  
   The range of frequency of its output corresponds to the output of a PLL. At first, I had no clue if I could make 2.4GHz producing VCO with Skywater130 PDK. So clearly, the top priority for me was to check if my choice of VCO topology could respond to such frequency.  
   Additionally, the VCO gain (Kvco) needed to be established early on, as it plays a crucial role in determining the PLL’s transfer function.

2. **Loop Filter**  
   With Kvco determined from the previous step, I could proceed on analyzing the PLL’s transfer function and design of the loop filter. Although there are multiple methods for implementing a loop filter, I chose the simplest design, as this is my initial project.

3. **Phase Frequency Detector (PFD)**  
   I had a particular PFD design in mind that only requires 13 logic gates. I expected this part to be straightforward and less time-consuming, so this design came third in line.

4. **Charge Pump (CP)**  
   The charge pump was predicted to present several challenges due to transistor size considerations and its nature of discrete timing from the PFD outputs. To cope with this, I’ve tried as many designs as possible to try out which fits best for my intends. To cope with this, I experimented with various topologies to find one that best suited my objectives.

5. **Frequency Divider**  
   Initially, I considered the frequency divider to be the hardest part, as I’ve that heard implementing a frequency divider that allows flexible ranges of frequency synthesis would be complicated, requiring more in-depth knowledge. I delayed working on this until the end, in case I had to create a PLL without a divider stage. Fortunately, after days of trials and error, I managed to implement a basic frequency divider that fit my purposes.

---

*Stay tuned for updates on each section as I delve deeper into the design process and share insights on each component’s design and simulation.*
