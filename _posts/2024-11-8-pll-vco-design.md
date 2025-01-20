---
layout: post
title: "PLL - Voltage Controlled Oscillator Design"
date: 2024-11-8
categories: [Analog Design, PLL, VCO]
toc: true
math: true
---

## Voltage Controlled Oscillator (VCO) Design Part 1

As its name implies, a voltage-controlled oscillator is an oscillator that can be controlled by some control voltage.  
Starting off, we should begin by making the simplest current-starved oscillator.  

Additionally, we will implement the smallest length and width in every transistor to check the maximum frequency of the VCO in the Skywater130-PDK environment. The NMOS and PMOS used in this design are “NMOS name” and “PMOS name.” By accessing its SPICE file, we can find out the minimum width is 430nm, and the length is 120nm.  


### Key Design Philosophy

Before starting off, one key point when creating designs is this excellent quote from Prof. Hajimiri from Caltech:
1. **Know your topologies.**  
2. **Then consider the aspect ratios (Width & Length).**

It is okay to perform **some aspect ratio checks** while validating step 1. However, if you ignore this process and jump into design without fully understanding the knobs you are controlling, you will most likely end up in an endless maze, wasting precious time.

---

## Initial VCO Design

We begin with the simplest design, shown in **Figure 1**, and **Figure 2** explicitly demonstrates the functionality of the transistors.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/figure1_simplest_vco.png" alt="Simplest VCO" style="width:50%; display: block; margin: auto;" />
  <p><strong>Figure 1 - Simplest VCO Topology</strong></p>
</div>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/figure2_vco_functionality.png" alt="VCO Functionality" style="width:50%; display: block; margin: auto;" />
  <p><strong>Figure 2 - VCO Functionality</strong></p>
</div>


The SPICE code for this design is as follows:  
<img src="{{site.url}}/images/pll_vco_design/spice_code.png" alt="Simplest VCO Functionality" style="width:70%; display: block; margin: auto;" />

Our control voltage (V_CONT) is ambiguously set to **0.9V**. This configuration saves the value of `v(osc)` in a `.raw` file. Viewing the waveform, it looks like this:

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/figure3_vco_output_signal.png" alt="Output Signal" style="width:70%; display: block; margin: auto;" />
  <p><strong>Figure 3 - Output Signal</strong></p>
</div>

From the transient response, we can directly measure the period. At our first attempt, the frequency is measured as **1.02 GHz**. This is a promising result because now we may now be able to configure it to our target frequency of **2.4GHz**.

---

## Measuring Kvco

### Why Measure Kvco?
To better understand the behavior of this VCO, we first measure the **Kvco**, as it provides essential insights before diving deeper into the design.

To measure Kvco:
1. **Sweep V_CONT**: From **0V to 1.8V** in 0.1V steps.
2. **SPICE Code**: The SPICE code for this sweep is as follows:  

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/spice_code2.png" alt="Spice code2" style="width:90%; display: block; margin: auto;" />
</div>


> **Note**: After simulation, `.txt` files will be generated. Convert these files to `.csv` for easier examination using Python.

### Automating Kvco Calculation
Manually measuring frequency from 19 raw files is tedious. To streamline this, I developed two Python scripts:
1. **convert_txt_csv.py**: Converts `.txt` files to `.csv`.
2. **find_frequency.py**: Finds frequency using the `find_peaks` library in SciPy.  

#### Python Code Details
- **find_frequency.py**: This script uses `find_peaks` for peak detection. Alternative methods, such as threshold crossing and FFT, were tested, but `find_peaks` provided the best results.  
- **Offset Error**: Note that the code introduces a **1–2% offset error** compared to hand-measured frequencies. For quick Kvco measurements, this is acceptable, but final measurements should be done manually.

---

## Kvco Results and Observations

The Kvco derivation process is as follows:
1. **Run SPICE Simulation**.
2. **Run convert_txt_csv.py**.
3. **Run find_frequency.py**.

The output result is shown below:  

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/simplest_vco_kvco.png" alt="Simplest VCO Kvco" style="width:90%; display: block; margin: auto;" />
  <p><strong>Figure 4 - Simplest VCO Kvco</strong></p>
</div>

### Key Observations
1. The Kvco is **non-linear**, which is undesirable.  
2. The VCO is **inactive** below certain voltage.  

This is due to the current mirroring approach in this topology. When the PMOS and NMOS transistors in the first branch are in cutoff, no current is available to mirror.  
**Figure 5** demonstrates this behavior:

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/first_branches.png" alt="First Branches" style="width:80%; display: block; margin: auto;" />
  <p><strong>Figure 5 - Subthreshold region in 1st Branches </strong></p>
</div>

---

## Addressing the Issues

### Activating the VCO Across All V_CONT
To make the VCO active for all V_CONT values, we provide pathways for current by adding on-resistors to the 2nd–4th branches.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/vco_with_on_resistors.png" alt="First Branches" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 6 - VCO with on-resistors</strong></p>
</div>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/vco_functionality.png" alt="VCO Functionality" style="width:70%; display: block; margin: auto;" />
  <p><strong>Figure 7 - VCO Functionality</strong></p>
</div>
---

### Improving Kvco Linearity

#### Observation
A linear Kvco is required within the operating control voltage range (**0V to 1.8V**). Currently, the Kvco slope increases rapidly as V_CONT rises, due to the PMOS growing stronger.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/VCO2_V2.png" alt="VCO2_V2" style="width:70%; display: block; margin: auto;" />
  <p><strong>Figure 8 (Click the photo to see the V2 node voltage)</strong></p>
</div>

#### Solution
To moderate the Kvco slope:  
&nbsp;&nbsp;&nbsp;&nbsp;Increase the **length** of the PMOS variable resistance.


But before we do that, we first raise the aspect ratio for both the NMOS and PMOS variable resistance simultaneously for a more dramatic effect.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/VCO3_topology.png" alt="VCO3_topology" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 9 - VCO with increased aspect ratio</strong></p>
</div>

We then increase the length of the NMOS variable resistance from 0.15um to 1.5um. The value is set until we find a Kvco plot as figure 10.b. This is a time consuming process to find the appropriate length. 

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/VCO4_topology.png" alt="VCO4_topology" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 10.a - VCO with increased PMOS length</strong></p>
</div>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/VCO4_kvco.png" alt="VCO4_kvco" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 10.b - Kvco</strong></p>
</div>

---

## VCO Configuration

To configure the VCO for the target frequency:
1. Increase the **length** of the ring oscillator transistors from **0.15µm to 0.27µm**.
2. Tune the **width**, if necessary.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/VCO5_topology.png" alt="VCO5_topology" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 11.a - VCO</strong></p>
</div>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/VCO5_kvco.png" alt="VCO5_kvco" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 11.b - Kvco</strong></p>
</div>

The process is time-consuming but results in the desired frequency response:  
- **Kvco Value**: 281 MHz/V  
<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/kvco_value.png" alt="kvco_value" style="width:100%; display: block; margin: auto;" />
</div>

<br>

- **Kvco Max Value**: 763 MHz/V  
<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/kvco_value_max.png" alt="kvco_value_max" style="width:100%; display: block; margin: auto;" />
</div>

<br>

## Acutal Design Considerations

However, there are actual design considerations that need to be taken into account.  
Looking at **Figure 11.a**, our VCO’s oscillation relies on the parasitic capacitances in each inverter stage. Also, the VCO only has the minimum three inverter stages, which makes it susceptible to additional parasitic capacitances.

The actual problem arises when the frequency divider is connected to the VCO. In **Figure 12**, we connected our VCO with the “divide-by-120” frequency divider (FD). The actual FD design will be covered later on.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/vco_frequency_divider.png" alt="Frequency Divider Connected to VCO" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 12</strong></p>
</div>

---

## Kvco Measurement with Frequency Divider

Then, if we measure the Kvco of this topology, it appears as **Figure 13**.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/vco_fd_kvco.png" alt="Kvco Measurement" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 13</strong></p>
</div>

We now see that our VCO output frequency range is entirely out of the target frequency, **2.4GHz**.  
As a solution, we make the transistor length in the ringed-oscillator shorter, **0.27µm → 0.22µm**.

<br>

After that, our new Kvco plot will look like **Figure 14**.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_vco_design/vco_fd_adjusted_kvco.png" alt="Adjusted Kvco Plot" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 14</strong></p>
</div>

---

## Final Kvco Calculation

Calculating the exact frequency from the raw files, the Kvco value is **362 MHz/V**, and this will be our final Kvco value.

<br>

<div style="text-align: center; font-size: 30px;">
  $ \frac{\frac{1}{377.59\times{10^{-6}}}-\frac{1}{500.73\times{10^{-6}}}}{\scriptscriptstyle 1.8-0.0} = {\scriptstyle 362 \, \mathrm{MHz/V}} $
</div>

<br>


---

## Summary and Next Steps

With the Kvco recalculated and adjusted to the desired range, we can now proceed to design the next stages of the PLL, ensuring all design parameters align with the target specifications.