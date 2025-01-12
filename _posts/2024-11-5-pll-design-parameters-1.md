---
title: PLL - Design Parameters Part 1 - Initial Configuration
date: 2024-11-5 12:00:00 +0000
categories: [AnalogDesign, PLL]
tags: [PLL, loop filter, control theory]
description: "A detailed walkthrough of designing a 3rd order PLL with a 2nd order loop filter, including design parameter considerations and initial setup."
---

## Target Architecture

Our target architecture will look like this. One thing to point out is that it is a 3rd order PLL with a 2nd order loop filter.

<img src="{{site.url}}/images/third_order_pll.png" style="display: block; margin: auto;" alt="Diagram of a third order PLL" />

---

## Configuring Design Parameters

However, when we are determining the design parameters, we define a 2nd order PLL with a 1st order loop filter.

<img src="{{site.url}}/images/second_order_pll.png" style="display: block; margin: auto;" alt="Diagram of a second-order PLL" />

---

This is because, if the PLL is set as 2nd order, we can use **control theory** to analyze the 2nd transfer function. This enables the analysis of natural frequency and damping factor, while a 3rd order transfer function can’t be easily analyzed through such simple methods.

### Consideration for C2 in the Loop Filter
After analysis, we place \(C2\) into the loop filter, **surmising it will have a small effect on the system**.  
As a rule of thumb, \(C2\) is normally set to 0.1~0.2 of the value of \(C1\).

---

## Transfer Function
We start with this equation, which is the transfer function of the PLL, assuming \(K_vco\) is linear for now:

<img src="{{site.url}}/images/pll_transfer_function.png" style="display: block; margin: auto;" alt="Equation showing the PLL transfer function" />

Simplified:

<img src="{{site.url}}/images/simplified_pll_transfer_function.png" style="display: block; margin: auto;" alt="Simplified PLL transfer function equation" />


### Design Parameters
The design parameters are as follows:

- \(I_p\): Charge pump reference current [A]
- \(K_vco\): Voltage-to-frequency gain of the oscillator [Hz/V]
- \(C1\): 1st order loop filter capacitor [F]
- \(R1\): 1st order loop filter resistor [Ω]
- \(M\): Divider ratio (dimensionless)

---

## Trade-Offs in Analog Circuit Design

In analog circuits, everything comes with a trade-off. Enhancing **Feature A** might degrade **Feature B**, and decisions should be made based on design priorities. After deriving \(K_vco\) and loop filter values, we’ll explore how changing these values affects the system.

---

## Initial Design Procedure

1. **F_VCO :** The VCO output frequency is 2.4 GHz.
2. **F_REF :** For phase detection, \(F_REF\) was set to 20 MHz.  
   - This results in \(M = 120\), which can be factored as \(2 X 2 X 2 X 3 X 5\).
   - This allows for experimentation with divide-by-2, divide-by-3, and divide-by-5 blocks.

3. **I_p :** Arbitrarily set to 100 µA as a starting point.  

---

## Why use arbitrary values for I_p?

The value of the charge pump does not effect the its topology.  
  
Rather, the actual **CONVICT** is the operation of charge pumps. In particular, its **switching** stages are what matters in the topology decision, which we will  discuss later in the charge pump design section.

---

## C1, R1, and K_vco?

These three cannot be decided unless we get our hands on the Kvco values.  
Kvco is “the ratio of output frequency with respect to input voltage” of a **given topology**.  
  
  
Meaning we need to find out the frequency of the VCO output signal at a given voltage, and this needs to be measured after the schematic simulation of VCOs, it’s not something we can guess right off the bat

---
---

To conclude, this post covers the initial considerations for our PLL design. In the next post, we’ll dive into the **VCO implementation**.
