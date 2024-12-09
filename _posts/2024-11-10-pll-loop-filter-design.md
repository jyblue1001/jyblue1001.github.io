---
layout: post
title: "PLL - Design Parameters Part 2: Loop Filter"
date: 2024-11-15
categories: [Analog Design, PLL, Loop Filter]
toc: true
---

From the previous post “Voltage Controlled Oscillator Design,” we obtained the **Kvco** as **309 MHz/V**.  

Back in the post “Design Parameters Part 1,” we left off **C₁**, **R₁**, and **Kvco** undecided.  
Now, with Kvco being set, we move on to the derivation of **C₁** and **R₁**.

---

## Loop Filter Derivation

From that post, we specifically decided to start from a 2nd order PLL for the loop filter parameter configuration.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/pll_closed_loop_transfer_function.png" alt="H(s) Closed Loop Equation" style="width:100%; display: block; margin: auto;" />
  <p><strong>Equation 1: Closed Loop Transfer Function</strong></p>
</div>

This allows us to use control theory to analyze the 2nd-order closed-loop PLL system.  

### Key Equations
<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/damping_factor_eq.png" alt="Damping Factor Equation" style="width:100%; display: block; margin: auto;" />
  <p><strong>Equation 2: Damping Factor</strong></p>
</div>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/natural_frequency_eq.png" alt="Natural Frequency Equation" style="width:100%; display: block; margin: auto;" />
  <p><strong>Equation 3: Natural Frequency</strong></p>
</div>

As **Eq.3** has just one unknown variable (**C₁**), we will start deriving from the natural frequency.  

---

## Discrete-Time Nature of PLL

First, we need to realize that our PLL carries a **Discrete-Time (DT)** nature. This is because the VCO is driven by the output of the PFD/CP/Loop Filter cascade, which is a ramp response.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/pll_pfd_cp_loop_filter_cascade.png" alt="PLL and Loop Filter Cascade" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 1: PLL and the Highlighted PFD/CP/Loop Filter Cascade</strong></p>
</div>

<br><br>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/ramp_response_signal.png" alt="Ramp Response Signal" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 2: Ramp Response Signal of the PFD/CP/Loop Filter Cascade</strong></p>
</div>

This discrete nature interferes with our attempt to view the PLL as a continuous system. However, as shown in **Figure 2(b)**, if we were to state the changes **slowly**, we can approximate back the system to be a continuous system. By then, the analysis through transfer function gains some reliability.

A rule of thumb to ensure this slow change in the loop is to select the loop bandwidth approximately equal to **1/10** of the input frequency.  
We know our input frequency (**f_REF**) as **20 MHz**, thus the loop bandwidth **has to be 2 MHz**.

---

## Open Loop Bandwidth Selection

But which bandwidth? **ω_-3dB** (3dB cutoff bandwidth of the Closed Loop System) or **ω_u** (unity-gain bandwidth of the Open Loop System)?

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/pll_open_loop_transfer_function.png" alt="Open Loop Transfer Function" style="width:100%; display: block; margin: auto;" />
  <p><strong>Equation 4: Open Loop Transfer Function</strong></p>
</div>

If this still raises concerns, we can take further validations.

Say we set the 2nd order system to have a damping factor (**ζ**) of **1**, it shows as the figure below.  
In such (**ζ = 1**) configuration, it shows the relationships of the bandwidths as **ω_-3dB ≈ 2.5ωₙ**, and **ω_u ≈ 2.1ωₙ**.  
By this, the two bandwidths are close in values, which means that even if we choose **ω_-3dB** over **ω_u**, we can still expect the similar results.
 

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/pll_various_response.png" alt="Various PLL Response" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 3: Various PLL Response</strong></p>
</div>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/f_ref_unity_nat_relationship.png" alt="Relationship of Reference, Unity-Gain, Natural Frequency" style="width:50%; display: block; margin: auto;" />
  <p><strong>Equation 5: Relationship of Reference, Unity-Gain, Natural Frequency</strong></p>
</div>
---

## Deriving C₁ and R₁

### Calculating C₁:

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/C1_calculation.png" alt="C1 Calculation" style="width:100%; display: block; margin: auto;" />
</div>

Therefore the value of C₁ = 7.19pF, and the value of C₂ taken as 1/5, which will be roughly C₂ = 1.43pF.

Configuring C₁, we can move on to the configuration of the R₁ value. As we set the damping factor (ζ) as 1, the calculation starts from Eq.2 as below.

### Calculating R₁:

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_loop_filter_design/R1_calculation.png" alt="R1 Calculation" style="width:80%; display: block; margin: auto;" />
</div>

In conclusion, we have R₁ = 46.5kΩ.


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
  <img src="{{site.url}}/images/pll_loop_filter_design/xschem_schematic.png" alt="Xschem Schematic" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 8: Xschem Implementation</strong></p>
</div>

---

With the loop filter parameters derived and simulated, we finished the design parameter configuration. 
We can now move on to Phase Freqeuncy Detector (PFD) design in the next post.