---
layout: post
title: "PLL - Design Parameters Part 2: Loop Filter"
date: 2024-11-10
categories: [Analog Design, PLL, Loop Filter]
toc: true
math: true
---

From the previous post “Voltage Controlled Oscillator Design,” we obtained the **Kvco** as **362 MHz/V**.  

Back in the post “Design Parameters Part 1,” we left off **C₁**, **R₁**, and **Kvco** undecided.  
Now, with Kvco being set, we move on to the derivation of **C₁** and **R₁**.

---

## Loop Filter Derivation

From that post, we specifically decided to start from a 2nd order PLL for the loop filter parameter configuration.

<br>
  <div style="text-align: center; font-size: 18px;">
      $$ {\scriptstyle H(s)_{\text{closed loop}}} = \frac{\frac{I_p}{2\pi} \cdot \left( R_1 + \frac{1}{C_1 s} \right) \cdot \frac{K_{\text{VCO}}}{s}}{1 + \frac{I_p}{2\pi} \cdot \left( R_1 + \frac{1}{C_1 s} \right) \cdot \frac{K_{\text{VCO}}}{s} \cdot \frac{1}{M}} $$
    <p><strong><span style="font-size: 16px;">Equation 1: 2nd order Closed Loop Transfer Function</span></strong></p>
  </div>
<br>

This allows us to use control theory to analyze the 2nd-order closed-loop PLL system.  

### Key Equations

<br>
  <div style="text-align: center; font-size: 18px;">
      $$ \zeta = \frac{R_1}{2} \sqrt{\frac{I_p K_{\text{VCO}} C_1}{2\pi M}} $$
    <p><strong><span style="font-size: 16px;">Equation 2: Damping Factor</span></strong></p>
  </div>
<br>
  <div style="text-align: center; font-size: 18px;">
      $$ \omega_n = \sqrt{\frac{I_p K_{\text{VCO}}}{2\pi M C_1}} $$
    <p><strong><span style="font-size: 16px;">Equation 3: Natural Frequency</span></strong></p>
  </div>
<br>

As **Eq.3** has just one unknown variable (**C₁**), we will start deriving from the natural frequency.  

---

## Discrete-Time Nature of PLL

First, we need to realize that our PLL carries a **Discrete-Time (DT)** nature. This is because the VCO is driven by the output of the PFD/CP/Loop Filter cascade, which is a ramp response.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/pll_pfd_cp_loop_filter_cascade.png" alt="PLL and Loop Filter Cascade" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 1: PLL and the Highlighted PFD/CP/Loop Filter Cascade</span></strong></p>
</div>

<br><br>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/ramp_response_signal.png" alt="Ramp Response Signal" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 2: Ramp Response Signal of the PFD/CP/Loop Filter Cascade</span></strong></p>
</div>

<br>

This discrete nature interferes with our attempt to view the PLL as a continuous system. However, as shown in **Figure 2(b)**, if we were to state the changes **slowly**, we can approximate back the system to be a continuous system. By then, the analysis through transfer function gains some reliability.

A rule of thumb to ensure this slow change in the loop is to select the loop bandwidth approximately equal to **1/10** of the input frequency.  
We know our input frequency (**f_REF**) as **20 MHz**, thus the loop bandwidth **has to be 2 MHz**.

---

## Open Loop Bandwidth Selection

But which bandwidth? **ω_-3dB** (3dB cutoff bandwidth of the Closed Loop System) or **ω_u** (unity-gain bandwidth of the Open Loop System)?

<br>
  <div style="text-align: center; font-size: 18px;">
      $$ H(s)_{\text{Open Loop, Fig.1}} = \frac{I_p}{2\pi} \cdot \left( R_1 + \frac{1}{C_1 s} \right) \cdot \frac{K_{\text{VCO}}}{s} $$
    <p><strong><span style="font-size: 16px;">Equation 4: Open Loop Transfer Function</span></strong></p>
  </div>
<br>

If this still raises concerns, we can take further validations.

Say we set the 2nd order system to have a damping factor (**ζ**) of **1**, it shows as the figure below.  
In such (**ζ = 1**) configuration, it shows the relationships of the bandwidths as **ω_-3dB ≈ 2.5ωₙ**, and **ω_u ≈ 2.1ωₙ**.  
By this, the two bandwidths are close in values, which means that even if we choose **ω_-3dB** over **ω_u**, we can still expect the similar results.
 

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/pll_various_response.png" alt="Various PLL Response" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 3: Various PLL Response</strong></p>
</div>

<br>
  <div style="text-align: center; font-size: 18px;">
      $$ \frac{\omega_{REF}}{10} = \omega_u = 2.1 \omega_n $$
    <p><strong><span style="font-size: 16px;">Equation 5: Relationship of Reference, Unity-Gain, Natural Frequency</span></strong></p>
  </div>
<br>

---

## Deriving C₁ and R₁

### Calculating C₁:

<br>
  <div style="text-align: center; font-size: 18px;">
      $$ \frac{2\pi \times (20 \, \text{MHz})}{10} = \omega_n = 2.1 \sqrt{\frac{I_p K_{\text{VCO}}}{2\pi M C_1}} $$
      $$ \frac{2\pi \times (20 \times 10^6)}{10} = 2.1 \sqrt{\frac{(100 \times 10^{-6}) \times (2\pi \times 362 \times 10^6)}{2\pi \times 120 \times C_1}} $$
      $$ C_1 = (2.1)^2 \times \frac{(100 \times 10^{-6}) \times (2\pi \times 362 \times 10^6)}{2\pi \times 120 \times \left( \frac{2\pi \times (20 \times 10^6)}{10} \right)^2} $$
      $$ C_1 \approx 8.42pF $$
    <p><strong><span style="font-size: 16px;">Equation 6: C1 Derivation</span></strong></p>
  </div>
<br>

Therefore the value of C₁ = 8.24pF, and the value of C₂ taken as 1/5, which will be roughly C₂ = 1.68pF.

Configuring C₁, we can move on to the configuration of the R₁ value. As we set the damping factor (ζ) as 1, the calculation starts from Eq.2 as below.

### Calculating R₁:

<br>
  <div style="text-align: center; font-size: 18px;">
      $$ \omega_n = \sqrt{\frac{I_p K_{\text{VCO}}}{2\pi M C_1}} $$
      $$ 1 = \frac{R_1}{2} \sqrt{\frac{(100 \times 10^{-6} \, \text{A}) \times (2\pi \times 309 \times 10^6) \times (7.19 \times 10^{-12})}{2\pi \times 120}} $$
    <p><strong><span style="font-size: 16px;">Equation 7: R1 Derivation</span></strong></p>
  </div>
<br>

In conclusion, we have R₁ = 42.9kΩ.

---

## Simulation in MATLAB

We validate these values using MATLAB Simulink and the Control System Designer.  
Below are the Design Parameters and the Simulink diagram:

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/design_parameters.png" alt="Design Parameters" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 4: Design Parameters for PLL</strong></p>
</div>

<br>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/simulink_diagram.png" alt="Simulink Diagram" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 5: Simulink Diagram for PLL</strong></p>
</div>

<br>

This represents our target topology that we mentioned in "PLL Design Parameters: Part 1"

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/pll_circuit_representation.png" alt="PLL Circuit Representation" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 6: PLL Circuit Representation</strong></p>
</div>

<br>

Evaluating the results through "Control System Designer App" in simulink will look like this.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/step_response_bode_diagram.png" alt="Step Response, Bode Plot" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 7: Step Response, Bode Plot</strong></p>
</div>

---

## Xschem Implementation

Finally, in Xschem, the schematic looks like this:

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/xschem_implementation.png" alt="Xschem Implementation" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 8: Xschem Implementation</strong></p>
</div>

---

With the loop filter parameters derived and simulated, we finished the design parameter configuration. 
We can now move on to Phase Freqeuncy Detector (PFD) design in the next post.