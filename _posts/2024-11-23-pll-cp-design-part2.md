---
title: PLL - Charge Pump Design Part 2
date: 2024-11-23
categories: [Analog Design, PLL, CP]
toc: true
math: true
---

# Table of Contents
1. [Concept of the proposed topology](#1-concept-of-the-proposed-topology)
2. [DC Analysis](#2-dc-analysis)
   - [Topology and Operation Details Regarding DC analysis](#21-topology-and-operation-details-regarding-dc-analysis)
   - [Transistor Size Reasoning](#22-transistor-size-reasoning)
3. [Transient Analysis](#3-transient-analysis)
   - [OPAMP Analysis](#31-opamp-analysis)
   - [Testbench Considerations](#32-testbench-considerations)
   - [Simulation Results](#33-simulation-results)
4. [Design Analysis](#4-design-analysis)
   - [Evaluation of Conditions](#41-evaluation-of-conditions)
   - [Charge Pump Dead Zone](#42-charge-pump-dead-zone)

As mentioned at the beginning of the previous post, this post presents a design with solutions to the problems in the first topology. The two problems were large transistors and non-linear CP operation.  
Large transistors were needed because large parameters are less affected by channel length modulation, which is an issue in nanometer transistors. This was critical in the “mirroring action” of charge pump branches, where the goal is to mirror the same amount of current from the ideal current source branch.  
However, this effect of channel length modulation could be mitigated by using operational amplifiers. If the OPAMP has a high gain, it leads to strong feedback in the transistors. In this condition, their operating points could be matched precisely so that they are somewhat relieved from channel length modulation.  

## **1. Concept of the Proposed Topology**

The implementation and the simulation configurations follow as shown below.

<div id="fig1" style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part2/topology_with_loop_notation.png" 
       alt="topology_with_loop_notation" 
       style="width:100%; display: block; margin: auto;" />
  <p>
    <strong>Figure 1. <a href="#reference-2" title="Go to Reference 2">Figure 8.17 from [2]</a></strong>
  </p>
</div>

<br>

As we know, if an OPAMP has a high gain, it has the ability to equalize its two differential inputs with strong negative feedback.

---

<div id="fig2" style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part2/topology_with_FB_notation.png" alt="topology_with_FB_notation" style="width:150%; display: block; margin: auto;" />
  <p><strong>Figure 2</strong></p>
</div>

<br>

In [fig.2](#fig2), shows the theoretical CP Loop 1, and Loop 2 behavior of negative feedback, and positive feedback, respectively. The circuit also has positive feedback which may not be pleasing for it to work as a bias equalizing branch. However, notice that Loop 2 also consists of switches that depend on PFD output, thus leading to discrete-time behavior, unlike its continuous-time counterpart on Loop 1. While loop 2 is off, it naturally discharges from the succeeding loop filter nodes, and such discharging behavior will also be tracked through the OPAMP since Loop 1 is still engaging in negative feedback. Why is this important? This system allows both M3, M4 branch and M1, M2 branch to hold the same operating point even in nanoscale transistors due to traits of high-gain OPAMP, while M3, M4 is successfully mirroring current from its ideal source, I_REF.

## **2. DC Analysis**

#### **2.1. Topology and Operation Details Regarding DC analysis**

The proposed topology is shown in [fig.3](#fig3). The design of the OPAMP will be elaborated in step.2 because its spec requires insights in transient operations. Until then, we assume that the OPAMP has high-gain and therefore the negative-feedback loop keeps its two input the same.

<div id="fig3" style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part2/dc_sweep_simulation_schematic.png" alt="dc_sweep_simulation_schematic" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 3</strong></p>
</div>

<br>

<div id="fig4" style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part2/dc_sweep_simulation_spice.png" alt="dc_sweep_simulation_spice" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 4</strong></p>
</div>

The SPICE code for DC analysis is shown as [fig.4](#fig4), and its result is [fig.5](#fig5).  

<div id="fig5" style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part2/current_mistmatches.png" alt="current_mistmatches" style="width:80%; display: block; margin: auto;" />
  <p><strong>Figure 5</strong></p>
</div>

<br>

The difference in [fig.5](#fig5). compared to [fig.3](#fig3) from the previous post (for the sake of convenience, it will henceforth be referred to as topology 1) is that the current from UP CP branch steeply decreases as the voltage of node V_CP goes near GND (around 0.25V).  
This is because this current mirroring operation works differently from the topology 1. In topology 1, the current is mirrored by connecting the transistor gate of the charge pump branch to the gate of the reference current branches, which has fixed voltages in gate and drain. In topology 2, the reference current has a varying voltage in the gate and drain voltages (both gate and drain for M2, only drain for M3).  
For M3, it has fixed gate voltage from the ideal current source with its gate directly connected to the ideal current sourcing NMOS. For its drain voltage, as V_CP voltage changes, node voltage for node X also changes due to OPAMP.  
To further examine the voltage-varying operation in node X, we need to discuss M2. As V_CP voltage changes, so does the voltage for node X. To hold this behavior the high gain OPAMP balances the gate of M2 so that node X which is the drain node for “both” M2 and M3 operates and sustains an appropriate drain voltage to mirror 100uA from the ideal current source. This indicates that the common node X of NMOS and PMOS makes them interdependent.  
Moving on, as node voltage X falls near GND, it pushes M3 to deep triode region, making it a mere On-resistor. The following situation could be explained through an example as [fig.6](#fig6). When this happens, as node X goes towards GND, and M3 holds resistance such as 5000 ohms. It could only flow 20uA amount of current through the branch, which is far less than 100uA. Thus, to match this decreasing current behavior, the OPAMP increases its output voltage near the threshold voltage.  

<div id="fig6" style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part2/m3_example.png" alt="m3_example" style="width:70%; display: block; margin: auto;" />
  <p><strong>Figure 6</strong></p>
</div>

<br>

This is also the reason why in essence the node voltage X could not exactly reach GND (0V), which is an interesting property that will also be discussed in step 2. For the sake of convenience in further analyses, I quote this as “non-convergence to GND”


---

#### **2.2. Transistor Size Reasoning**  

<br>

<table id="table1" style="border-collapse: collapse; width: 100%; text-align: center;">
  <thead>
    <tr style="border-top: 3px solid black; border-bottom: 3px solid black;">
      <th style="border: 1px solid black; padding: 8px; border-left: 3px solid black; border-right: 3px solid black">Transistor<br>(Superset)</th>
      <th style="border: 1px solid black; padding: 8px; border-right: 3px solid black">Role</th>
      <th style="border: 1px solid black; padding: 8px; border-right: 3px solid black">Transistor<br>(Subset)</th>
      <th style="border: 1px solid black; padding: 8px; border-right: 3px solid black">Role</th>
      <th style="border: 1px solid black; padding: 8px;">Sizes (respectively)</th>
      <th style="border: 1px solid black; padding: 8px; border-left: 3px solid black; border-right: 3px solid black;">Size Reasoning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid black; padding: 8px; border-left: 3px solid black;">M1</td>
      <td style="border: 1px solid black; padding: 8px;">Ideal current source</td>
      <td style="border: 1px solid black; padding: 8px;"></td>
      <td style="border: 1px solid black; padding: 8px;"></td>
      <td style="border: 1px solid black; padding: 8px;">W = 4μm, L = 0.6μm</td>
      <td style="border: 1px solid black; padding: 8px; border-left: 3px solid black; border-right: 3px solid black;">Minimum length to avoid channel length<br>modulation with this OPAMP specs</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px; border-left: 3px solid black;" rowspan="2">M2, M3</td>
      <td style="border: 1px solid black; padding: 8px;" rowspan="2">Ideal current source mirroring branch</td>
      <td style="border: 1px solid black; padding: 8px;">M2</td>
      <td style="border: 1px solid black; padding: 8px;">Ideal current mirroring for UP operation</td>
      <td style="border: 1px solid black; padding: 8px;">W = 8μm, L = 0.6μm</td>
      <td style="border: 1px solid black; padding: 8px; border-left: 3px solid black; border-right: 3px solid black;" rowspan="4">Minimum length to avoid channel<br>length modulation with this OPAMP specs</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">M3</td>
      <td style="border: 1px solid black; padding: 8px;">Ideal current mirroring for DOWN operation</td>
      <td style="border: 1px solid black; padding: 8px;">W = 4μm, L = 0.6μm</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px; border-left: 3px solid black; border-left: 3px solid black;" rowspan="2">M4, M5</td>
      <td style="border: 1px solid black; padding: 8px;" rowspan="2">Charge pumping current branch</td>
      <td style="border: 1px solid black; padding: 8px;">M4</td>
      <td style="border: 1px solid black; padding: 8px;">UP charge pumping operation</td>
      <td style="border: 1px solid black; padding: 8px; ">W = 8μm, L = 0.6μm</td>
    </tr>
    <tr style="border-bottom: 3px solid black;">
      <td style="border: 1px solid black; padding: 8px;">M5</td>
      <td style="border: 1px solid black; padding: 8px;">DOWN charge pumping operation</td>
      <td style="border: 1px solid black; padding: 8px;">W = 4μm, L = 0.6μm</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px; border-left: 3px solid black; border-left: 3px solid black;" rowspan="2">M6, M8, M9</td>
      <td style="border: 1px solid black; padding: 8px;" rowspan="2">UP switch</td>
      <td style="border: 1px solid black; padding: 8px;">M6</td>
      <td style="border: 1px solid black; padding: 8px;">UP charge pump disabling switch</td>
      <td style="border: 1px solid black; padding: 8px;">W = 2μm, L = 0.15μm</td>
      <td style="border: 1px solid black; padding: 8px; border-left: 3px solid black; border-right: 3px solid black;" rowspan="9">Minimum size to ensure<br>minimum slew rate</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">M8, M9</td>
      <td style="border: 1px solid black; padding: 8px;">UP charge pump enabling<br>complementary switch</td>
      <td style="border: 1px solid black; padding: 8px;">W = 2μm, L = 0.15μm,<br>W = 1μm, L = 0.15μm</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px; border-left: 3px solid black;" rowspan="2">M7, M10, M11</td>
      <td style="border: 1px solid black; padding: 8px;" rowspan="2">DOWN switch</td>
      <td style="border: 1px solid black; padding: 8px;">M7</td>
      <td style="border: 1px solid black; padding: 8px;">DOWN charge pump disabling switch</td>
      <td style="border: 1px solid black; padding: 8px;">W = 1μm, L = 0.15μm</td>
    </tr>
    <tr style="border-bottom: 3px solid black;">
      <td style="border: 1px solid black; padding: 8px;">M10, M11</td>
      <td style="border: 1px solid black; padding: 8px;">DOWN charge pump enabling<br>complementary switch</td>
      <td style="border: 1px solid black; padding: 8px;">W = 2μm, L = 0.15μm,<br>W = 1μm, L = 0.15μm</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px; border-left: 3px solid black;" rowspan="2">M12, M13, M16,<br>M17, M20, M21</td>
      <td style="border: 1px solid black; padding: 8px;" rowspan="2">Inverting stage for PFD UP output</td>
      <td style="border: 1px solid black; padding: 8px;">M20, M21</td>
      <td style="border: 1px solid black; padding: 8px;">UP signal inverting section for switch actions</td>
      <td style="border: 1px solid black; padding: 8px;" rowspan="5">W = 2μm, L = 0.15μm,<br>W = 1μm, L = 0.15μm</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">M12, M13,<br>M16, M17</td>
      <td style="border: 1px solid black; padding: 8px;">Additive inverters to match<br>overall inverting action</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px; border-left: 3px solid black;" rowspan="3">M14, M15, M16,<br>M17, M22, M31</td>
      <td style="border: 1px solid black; padding: 8px;" rowspan="3">Non-Inverting stage for PFD DOWN output</td>
      <td style="border: 1px solid black; padding: 8px;">M20, M21</td>
      <td style="border: 1px solid black; padding: 8px;">DOWN signal inverting section for switch actions</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px;">M14, M15</td>
      <td style="border: 1px solid black; padding: 8px;">Additive inverter to match<br>overall non-inverting action</td>
    </tr>
    <tr style="border-bottom: 3px solid black;">
      <td style="border: 1px solid black; padding: 8px;">M18, M19</td>
      <td style="border: 1px solid black; padding: 8px;">Additive pass-gate to match<br>overall non-inverting action</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 8px; border-left: 3px solid black;" rowspan="2">C1, C2</td>
      <td style="border: 1px solid black; padding: 8px;" rowspan="2">Feed-forward capacitor</td>
      <td style="border: 1px solid black; padding: 8px;">C1</td>
      <td style="border: 1px solid black; padding: 8px;">M4 Feed-forward capacitor for better<br>pulse behavior (as a Rect signal)</td>
      <td style="border: 1px solid black; padding: 8px;">W = 6μm, L = 5.4μm</td>
      <td style="border: 1px solid black; padding: 8px; border-left: 3px solid black; border-right: 3px solid black;" rowspan="2">Appropriate capacitance sizing<br>ensuring 100uA supply</td>
    </tr>
    <tr style="border-bottom: 3px solid black;">
      <td style="border: 1px solid black; padding: 8px;">C2</td>
      <td style="border: 1px solid black; padding: 8px;">M5 Feed-forward capacitor for better<br>pulse behavior (as a Rect signal)</td>
      <td style="border: 1px solid black; padding: 8px;">W = 2.6μm, L = 2.6μm</td>
    </tr>
  </tbody>
</table>
<p style="text-align: center; font-weight: bold;">Table 1. CP Transistor Size Reasoning</p>

<br>

Before moving on to an in-depth explanation, [table 1](#table1) simplifies size reasoning making every other reasoning clear except M1, M2, M3, M4, and M5.

As we have discussed, the current sourcing operation is interdependent between its PMOS and NMOS (M2 & M3 for reference current branch and M4 & M5 for charge pumping branch). As the usual rule of thumb, we normally set the aspect ratio 2:1 for PMOS: NMOS to match the driving force of the transistors. While the length stays in nanoscale, the width is set through trials and errors to find the appropriate size.

<br>

To observe how the operation varies when sized differently, [table 2](#table2) shows the results.  

<table id="table2" style="border-collapse: collapse; width: 100%; text-align: center;">
black;">
  <tr>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/2_015_1_015.png" alt="Graph 1" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 2μm, L<sub>p</sub> = 0.15μm<br>W<sub>n</sub> = 1μm, L<sub>n</sub> = 0.15μm</span>
    </td>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/2_03_1_03.png" alt="Graph 2" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 2μm, L<sub>p</sub> = 0.3μm<br>W<sub>n</sub> = 1μm, L<sub>n</sub> = 0.3μm</span>
    </td>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/2_06_1_06.png" alt="Graph 3" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 2μm, L<sub>p</sub> = 0.6μm<br>W<sub>n</sub> = 1μm, L<sub>n</sub> = 0.6μm</span>
    </td>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/2_12_1_12.png" alt="Graph 4" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 2μm, L<sub>p</sub> = 1.2μm<br>W<sub>n</sub> = 1μm, L<sub>n</sub> = 1.2μm</span>
    </td>
  </tr>
  <tr>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/4_015_2_015.png" alt="Graph 5" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 4μm, L<sub>p</sub> = 0.15μm<br>W<sub>n</sub> = 2μm, L<sub>n</sub> = 0.15μm</span>
    </td>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/4_03_2_03.png" alt="Graph 6" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 4μm, L<sub>p</sub> = 0.3μm<br>W<sub>n</sub> = 2μm, L<sub>n</sub> = 0.3μm</span>
    </td>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/4_06_2_06.png" alt="Graph 7" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 4μm, L<sub>p</sub> = 0.6μm<br>W<sub>n</sub> = 2μm, L<sub>n</sub> = 0.6μm</span>
    </td>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/4_12_2_12.png" alt="Graph 8" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 4μm, L<sub>p</sub> = 1.2μm<br>W<sub>n</sub> = 2μm, L<sub>n</sub> = 1.2μm</span>
    </td>
  </tr>
  <tr>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/8_015_4_015.png" alt="Graph 9" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 8μm, L<sub>p</sub> = 0.15μm<br>W<sub>n</sub> = 4μm, L<sub>n</sub> = 0.15μm</span>
    </td>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/8_03_4_03.png" alt="Graph 10" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 8μm, L<sub>p</sub> = 0.3μm<br>W<sub>n</sub> = 4μm, L<sub>n</sub> = 0.3μm</span>
    </td>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/8_06_4_06.png" alt="Graph 11" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 8μm, L<sub>p</sub> = 0.6μm<br>W<sub>n</sub> = 4μm, L<sub>n</sub> = 0.6μm</span>
    </td>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/8_12_4_12.png" alt="Graph 12" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 8μm, L<sub>p</sub> = 1.2μm<br>W<sub>n</sub> = 4μm, L<sub>n</sub> = 1.2μm</span>
    </td>
  </tr>
  <tr>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/16_015_8_015.png" alt="Graph 13" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 16μm, L<sub>p</sub> = 0.15μm<br>W<sub>n</sub> = 8μm, L<sub>n</sub> = 0.15μm</span>
    </td>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/16_03_8_03.png" alt="Graph 14" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 16μm, L<sub>p</sub> = 0.3μm<br>W<sub>n</sub> = 8μm, L<sub>n</sub> = 0.3μm</span>
    </td>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/16_06_8_06.png" alt="Graph 15" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 16μm, L<sub>p</sub> = 0.6μm<br>W<sub>n</sub> = 8μm, L<sub>n</sub> = 0.6μm</span>
    </td>
    <td style="border: 2px solid black; padding: 3px;">
      <img src="{{site.url}}/images/pll_cp_design/part2/16_12_8_12.png" alt="Graph 16" style="width: 100%; max-width: 200px;">
      <br>
      <span>W<sub>p</sub> = 16μm, L<sub>p</sub> = 1.2μm<br>W<sub>n</sub> = 8μm, L<sub>n</sub> = 1.2μm</span>
    </td>
  </tr>
</table>
<p style="text-align: center; font-weight: bold;">Table 2 . Different Sized Current Mirroring Transistors</p>

While not suffering dramatic consequences from channel length modulation, W_p = 8um, L_p = 0.6um, W_n = 4um, L_n = 0.6um show tolerable outcomes in the smallest widths and lengths. Therefore, it is finally configured as our parameter as in [table 1](#table1).

---

## **3. Transient Analysis**

#### **3.1. OPAMP Analysis**

Before we begin Transient Simulation of the CP, we must develop our concept of our OPAMP. The priorities are the following.

1.	**Wide range of input common voltage**
2.	**High gain**
3.	**Unity Gain Bandwidth near 20MHz**
4.	**Output impedance**

<br>

The first factor arises from the concern of our varying V_CONTROL voltage for the VCO which is set as 0~1.8V. To cope with these low to high input common mode voltages, we can develop the concept of rail-to-rail amplifiers.  
<br>
The second factor is obvious because we need to utilize its feedback property in high-gain conditions. While the exact value is not precisely laid out, we arbitrarily choose the total gain over 50[V/V] as a starting point.  
<br>
This is because in actual simulations, the output signal of the CP will be shown as [fig.7](#fig7), which somewhat resembles a saw-tooth signal. This is due to the loop filters shown in [fig.8](#fig8), its study is dealt in CH7 in [2] for readers who may be concerned. As we have learned from signals and systems, the Fourier series of a sawtooth signal exhibits decreasing coefficients as the harmonic order increases, emphasizing the significance of the fundamental frequency (20 MHz) as the primary reference. We may consider including higher harmonics such as 40 MHz or more, to ensure a better solution.  
<br>
The fourth factor was an unexpected priority. The output impedance, or to be more accurate, the capacitance of the output node had to be brought into scope. This was because the output capacitance from the OPAMP 2nd stage and the capacitance of M2 & M4 exacerbated the operation of the CP. Those created unwanted ripples, especially in the first (Slower F_VCO) and third (F_VCO same speed) conditions.  
<br>

<div id="fig7" style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part2/topology2_condition1.png" alt="topology2_condition1" style="width:80%; display: block; margin: auto;" />
  <p><strong>Figure 7. Acutal Transient Response</strong></p>
</div>

<br>

<div id="fig8" style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part2/effect_of_c2.png" alt="effect_of_c2" style="width:80%; display: block; margin: auto;" />
  <p><strong>Figure 8. <a href="#reference-2">Figure 7.48 from [2]</a></strong></p>
</div>

<br>

Moving on to the actual design. We develop the simplest rail-to-rail amplifiers as a starting point.  

<div id="fig9" style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part2/opamp_basis_simulation_schematic.png" alt="opamp_basis_simulation_schematic" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 9. OPAMP Basis Simulation Schematic</strong></p>
</div>

<br>

[Fig.9](#fig9) is the proposed OPAMP in this CP. Its first stage consists of NMOS and PMOS differential amplifiers with active current mirror load, with current bias from the M13, M11, and R1 branch. The second stage has a PMOS output transistor succeeding the NMOS input stage, combined with its reciprocal pair into a single branch. Note that this is not the most trustworthy OPAMP but get the job done, and [table 3](#table3) shows the detailed size configurations.  

<br>

<table id="table3" style="border-collapse: collapse; width: 100%; text-align: center;">
  <thead>
    <tr style="border-top: 3px solid black; border-bottom: 3px solid black;">
      <th style="border: 1px solid black; padding: 5px; border-left: 3px solid black; border-right: 3px solid black">Transistor<br>(Superset)</th>
      <th style="border: 1px solid black; padding: 5px; border-right: 3px solid black">Role</th>
      <th style="border: 1px solid black; padding: 5px; border-right: 3px solid black">Transistor<br>(Subset)</th>
      <th style="border: 1px solid black; padding: 5px; border-right: 3px solid black">Role</th>
      <th style="border: 1px solid black; padding: 5px; border-right: 3px solid black">Sizes (respectively)</th>
      <th style="border: 1px solid black; padding: 5px; border-right: 3px solid black;">Size Reasoning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid black; padding: 5px; border-left: 3px solid black;" rowspan="2">M1, M2,<br>M7, M8</td>
      <td style="border: 1px solid black; padding: 5px;" rowspan="2">1st stage NMOS</td>
      <td style="border: 1px solid black; padding: 5px;">M1, M2</td>
      <td style="border: 1px solid black; padding: 5px;">Input NMOS</td>
      <td style="border: 1px solid black; padding: 5px;" rowspan="2">W = 1µm, L = 0.15µm</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black; border-left: 3px solid black; border-right: 3px solid black" rowspan="4">Minimum size in achieving large gain</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px;">M7, M8</td>
      <td style="border: 1px solid black; padding: 5px;">Active current mirroring NMOS</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px; border-left: 3px solid black;" rowspan="2">M5, M6,<br>M3, M4</td>
      <td style="border: 1px solid black; padding: 5px;" rowspan="2">1st stage PMOS</td>
      <td style="border: 1px solid black; padding: 5px;">M5, M6</td>
      <td style="border: 1px solid black; padding: 5px;">Input PMOS</td>
      <td style="border: 1px solid black; padding: 5px;" rowspan="2">W = 2µm, L = 0.15µm</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px;">M3, M4</td>
      <td style="border: 1px solid black; padding: 5px;">Active current mirroring PMOS</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px; border-left: 3px solid black;" rowspan="2">M9, M10</td>
      <td style="border: 1px solid black; padding: 5px;" rowspan="2">2nd stage</td>
      <td style="border: 1px solid black; padding: 5px;">M9</td>
      <td style="border: 1px solid black; padding: 5px;">PMOS CS output Stage</td>
      <td style="border: 1px solid black; padding: 5px;">W = 4µm, L = 0.15µm</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black; border-left: 3px solid black; border-right: 3px solid black;" rowspan="2">Appropriate size in balancing both large gain<br>and small capacitive output load</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px;">M10</td>
      <td style="border: 1px solid black; padding: 5px;">NMOS CS output Stage</td>
      <td style="border: 1px solid black; padding: 5px;">W = 2µm, L = 0.15µm</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black; border-left: 3px solid black;" rowspan="2">M11, M12,<br>M13, M14</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black;" rowspan="2">Current Mirroring Transistors</td>
      <td style="border: 1px solid black; padding: 5px;">M11, M12</td>
      <td style="border: 1px solid black; padding: 5px;">Current Mirroring NMOS</td>
      <td style="border: 1px solid black; padding: 5px;">W = 10µm, L = 0.5µm</td>
      <td style="border: 1px solid black; padding: 5px; border-left: 3px solid black; border-bottom: 3px solid black; border-right: 3px solid black;" rowspan="2">Minimum length to mitigate significant<br>channel length modulation in this configuration</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black;">M13, M14</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black;">Current Mirroring PMOS</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black;">W = 5µm, L = 0.5µm</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px; border-left: 3px solid black;">R3</td>
      <td style="border: 1px solid black; padding: 5px;">Current Biasing Resistor</td>
      <td style="border: 1px solid black; padding: 5px;"></td>
      <td style="border: 1px solid black; padding: 5px;"></td>
      <td style="border: 1px solid black; padding: 5px;">L = 1µm</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black; border-left: 3px solid black; border-right: 3px solid black;">An arbitrarily chosen value<br>considering layout convenience</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black; border-left: 3px solid black;" rowspan="2">R1, R2</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black;" rowspan="2">RHP Zero Cancelling Resistor</td>
      <td style="border: 1px solid black; padding: 5px;">R1</td>
      <td style="border: 1px solid black; padding: 5px;">RHP Zero Cancelling Resistor for M9</td>
      <td style="border: 1px solid black; padding: 5px;">L = 1.14µm</td>
      <td style="border: 1px solid black; padding: 5px; border-left: 3px solid black; border-right: 3px solid black;">$ \frac{1}{g_{m_{M9}}} $ value to cancel RHP zero of M9</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black;">R2</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black;">RHP Zero Cancelling Resistor for M10</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black;">L = 0.87µm</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black; border-left: 3px solid black; border-right: 3px solid black;">$ \frac{1}{g_{m_{M10}}} $ value to cancel RHP zero of M10</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px; border-left: 3px solid black; border-bottom: 3px solid black;" rowspan="2">CC_1, CC_2</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black;" rowspan="2">Miller Compensation Capacitor</td>
      <td style="border: 1px solid black; padding: 5px;">CC_1</td>
      <td style="border: 1px solid black; padding: 5px;">Miller Compensation Capacitor for M9</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black;" rowspan="2">1st: W = 8um, L = 8um<br>2nd: W = 10m, L = 10um<br>3rd: W = 15m, L = 15um</td>
      <td style="border: 1px solid black; padding: 5px; border-left: 3px solid black; border-bottom: 3px solid black; border-right: 3px solid black;" rowspan="2">Appropriate capacitance sizing regarding<br>the surrounding transistors’ sizes, especially M5</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black;">CC_2</td>
      <td style="border: 1px solid black; padding: 5px; border-bottom: 3px solid black;">Miller Compensation Capacitor for M10</td>
    </tr>
  </tbody>
</table>
<p style="text-align: center; font-weight: bold;">Table 3. OPAMP Transistor Size Reasoning</p>

<br>

<div id="fig10" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/opamp_basis_simulation_spice.png" 
         alt="opamp_basis_simulation_spice" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/bode_plot_no_comp.png" 
         alt="bode_plot_no_comp" 
         style="width: 80%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 10. Current Flow in the Third Condition with Revised Transistor Sizes</strong></p>
</div>

<br>

[Fig.10](#fig10) shows the SPICE code the Bode plot of the OPAMP. It shows that the DC gain is 71 [V/V] , with its unity gain BW as 5.8 GHz. While the OPAMP in this condition is in no good use, we can drive better configuration by applying Miller compensation. By this, the poles in the first and second stages will be split to better stability.

An excellent explanation of this concept is introduced in the youtube link below and it is advisable to watch it before designing this OPAMP.

{% include embed/youtube.html id='PT31xAEd_v4' %}

<br>

As the video explains, we can use a resistor to move the right half plane (RHP) zero to infinity, and a capacitor to conduct miller compensation.
As we follow, the value of the resistor at the “N_first_stage” node is chosen precisely as $ \frac{1}{g_{m_{M9}}} = \frac{1}{152.73\times{10^{-6}}} = 6536 \Omega $. The value of $ {g_{m_{M9}}} $ can be found from [fig.9](#fig9), then the resistor is implemented in the final value of 6514 ohms with a length of 1.14um. The same procedure is conducted for the resistor of the “P_first_stage”.  
The capacitance for the miller compensation could be derived through direct analysis, but such calculation is not recommended due to the difficulty of evaluating every parasitic capacitance in a given topology. In our case, we use equal values for the miller compensation capacitor in both M9 and M10. Then, we alter those values to examine how different capacitance values affect the unity gain BW and transient simulation results.  

[Fig.11](#fig11), [12](#fig12) and [table 4](#table4) illustrates the traits of the OPAMPs with capacitance variations.

<br>

<div id="fig11" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/opamp1_topology.png" 
         alt="opamp1_topology" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/opamp1_bode_plot.png" 
         alt="opamp1_bode_plot" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 11. OPAMP Final topology (Left), OPAMP1 Bode Plot (Right)</strong></p>
</div>

<br>

<div id="fig12" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/opamp2_bode_plot.png" 
         alt="opamp2_bode_plot" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/opamp3_bode_plot.png" 
         alt="opamp3_bode_plot" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 12. OPAMP2 Bode Plot (Left), OPAMP3 Bode Plot (Right) </strong></p>
</div>

<br>

<table id="table4" style="border-collapse: collapse; width: 100%; text-align: center;">
  <thead>
    <tr style="border-top: 3px solid black; border-bottom: 3px solid black;">
      <th style="border: 1px solid black; padding: 3px; border-right: 3px solid black; border-left: 3px solid black;">SPECS \ CASES</th>
      <th style="border: 1px solid black; padding: 3px; border-right: 3px solid black;">OPAMP 1</th>
      <th style="border: 1px solid black; padding: 3px; border-right: 3px solid black;">OPAMP 2</th>
      <th style="border: 1px solid black; padding: 3px; border-right: 3px solid black;">OPAMP 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid black; padding: 3px; border-bottom: 3px solid black; border-right: 3px solid black; border-left: 3px solid black;">Size</td>
      <td style="border: 1px solid black; padding: 3px;">8µm X 8µm</td>
      <td style="border: 1px solid black; padding: 3px;">10µm X 10µm</td>
      <td style="border: 1px solid black; padding: 3px; border-right: 3px solid black;">15µm X  15µm</td>
    </tr>
        <tr>
      <td style="border: 1px solid black; padding: 3px; border-bottom: 3px solid black; border-right: 3px solid black; border-left: 3px solid black;">Capacitance</td>
      <td style="border: 1px solid black; padding: 3px;">0.134pF</td>
      <td style="border: 1px solid black; padding: 3px;">0.208pF</td>
      <td style="border: 1px solid black; padding: 3px; border-right: 3px solid black;">0.461pF</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 3px; border-right: 3px solid black; border-left: 3px solid black; border-bottom: 3px solid black;">Unity gain BW</td>
      <td style="border: 1px solid black; padding: 3px; border-bottom: 3px solid black;">70MHz</td>
      <td style="border: 1px solid black; padding: 3px; border-bottom: 3px solid black;">44MHz</td>
      <td style="border: 1px solid black; padding: 3px; border-right: 3px solid black; border-bottom: 3px solid black;">20MHz</td>
    </tr>
  </tbody>
</table>
<p style="text-align: center; font-weight: bold;">Table 4. OPAMPs with different size Miller Cap.</p>

<br>

---

#### **3.2. Testbench Considerations**

<br>

<div id="fig13" style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part2/transient_simulation_schematic.png" alt="transient_simulation_schematic" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 13. Transient Simulation Schematic</strong></p>
</div>

<br>

<div id="fig14" style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part2/transient_simulation_spice.png" alt="transient_simulation_spice" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 14. Transient Simulation SPICE</strong></p>
</div>

<br>

The testbench is similar to the previous post.

---

#### **3.3. Simulation Results**

We test the transient simulation by sorting three cases “Case 1”, “Case 2”, and “Case 3”. The only different component in those cases is the OPAMP, which is denoted in [table 4](#table4). Then, like the previous post, we examine all three conditions for each case. The 1st condition (F_REF slower than F_VCO), 2nd condition (F_REF faster than F_VCO), and 3rd condition.  

<br>

<div style="text-align: left; font-size: 20px;">
  Case 1: OPAMP 1
</div>

<span style="color: blue;">1st condition (F_REF slower than F_VCO)</span>  

<div id="fig15" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/case1_condition1.png" 
         alt="case1_condition1" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/case1_condition1_closeup.png" 
         alt="case1_condition1_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 15. Case 1, Condition 1 </strong></p>
</div>

<br>

<span style="color: blue;">2nd condition (F_REF faster than F_VCO)</span>  

<div id="fig16" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/case1_condition2.png" 
         alt="case1_condition2" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/case1_condition2_closeup.png" 
         alt="case1_condition2_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 16. Case 1, Condition 2 </strong></p>
</div>

<br>

<span style="color: blue;">3rd condition (F_REF same as F_VCO)</span>  

<div id="fig17" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/case1_condition3.png" 
         alt="case1_condition3" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/case1_condition3_closeup.png" 
         alt="case1_condition3_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 17. Case 1, Condition 3 </strong></p>
</div>

<br>

<div style="text-align: left; font-size: 20px;">
  Case 2: OPAMP 2
</div>

<span style="color: blue;">1st condition (F_REF slower than F_VCO)</span>  

<div id="fig18" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/case2_condition1.png" 
         alt="case2_condition1" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/case2_condition1_closeup.png" 
         alt="case2_condition1_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 18. Case 2, Condition 1 </strong></p>
</div>

<br>

<span style="color: blue;">2nd condition (F_REF faster than F_VCO)</span>  

<div id="fig19" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/case2_condition2.png" 
         alt="case2_condition2" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/case2_condition2_closeup.png" 
         alt="case2_condition2_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 19. Case 2, Condition 2 </strong></p>
</div>

<br>

<span style="color: blue;">3rd condition (F_REF same as F_VCO)</span>  

<div id="fig20" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/case2_condition3.png" 
         alt="case2_condition3" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/case2_condition3_closeup.png" 
         alt="case2_condition3_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 20. Case 2, Condition 3 </strong></p>
</div>

<br>

<div style="text-align: left; font-size: 20px;">
  Case 3: OPAMP 1
</div>

<span style="color: blue;">1st condition (F_REF slower than F_VCO)</span>  

<div id="fig21" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/case3_condition1.png" 
         alt="case3_condition1" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/case3_condition1_closeup.png" 
         alt="case3_condition1_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 21. Case 3, Condition 1 </strong></p>
</div>

<br>

<span style="color: blue;">2nd condition (F_REF faster than F_VCO)</span>  

<div id="fig22" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/case3_condition2.png" 
         alt="case3_condition2" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/case3_condition2_closeup.png" 
         alt="case3_condition2_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 22. Case 3, Condition 2 </strong></p>
</div>

<br>

<span style="color: blue;">3rd condition (F_REF same as F_VCO)</span>  

<div id="fig23" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/case3_condition3.png" 
         alt="case3_condition3" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/case3_condition3_closeup.png" 
         alt="case3_condition3_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 23. Case 3, Condition 3 </strong></p>
</div>

<br>

The second condition in all three cases shows no issue providing 100uA current. For the third condition, as the capacitance gets bigger, it lowers the unity gain BW and the steady-state responses grow more stable. However, it is the opposite for the first condition. As the unity gain BW gets smaller, the CP suffers from slow coherence between the differential input nodes of the OPAMP, as shown in [fig.21](#fig21).  
<br>
This shows that if the capacitance of the OPAMP output node is too small, the PLL will suffer from ripples in the lock state. If it is too big, the PLL will suffer from inappropriate charge-pumping actions in the first conditions. Therefore, choosing a moderate-size capacitor such as OPAMP 2 is advisable, which has a unity gain BW of approx. 44MHz.  
<br>

---

## **4. Design Analysis**

#### **4.1. Evaluation of Conditions**

For better comprehension, there are few notes to discuss, especially the first and the third.
<br>
The first conditions require further explanation for comprehension. As shown in [fig.5](#fig5), the reference current branch could only provide 40uA in initial conditions. That is why the CP experiences an insufficient pulse magnitude at the first clock.  
<br>
Also, all cases show that the CP experiences a sudden surge in node “X” after the first clock. Such behavior occurs from node “X” being non-zero due to “no-convergence to zero”. During the first clock, the negative and positive feedback operate to match the two differential inputs. However, the first clock abruptly ends after 24ns, and the OPAMP is only left with negative feedback with the two differential input node voltages even far apart from the initial status. Thus, the negative feedback loop of the OPAMP lowers its output voltage, which raises the node voltage of X due to the M2 CS stage. Therefore, the CP experiences a sudden surge in the X node.
<br><br>

Second, the third conditions answer the C1, C2 size reasoning back from table.1. It would look like [fig.24](#fig24) in the third condition without the capacitors. 

<div id="fig24" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/current_before_ff_cap_closeup.png" 
         alt="current_before_ff_cap_closeup" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/vout_before_ff_cap.png" 
         alt="vout_before_ff_cap" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 24. Current (Left), Vout (Right) Aspect before Feedforward Capacitor </strong></p>
</div>

<br>

The values of C1 and C2 are decided so that both UP and DOWN pulses become rectangular signals of the same 100uA magnitude while outputting a constant output.

<div id="fig25" style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part2/current_after_ff_cap_closeup.png" 
         alt="current_after_ff_cap_closeup" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part2/vout_after_ff_cap.png" 
         alt="vout_after_ff_cap" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 25. Current (Left), Vout (Right) Aspect after Feedforward Capacitor </strong></p>
</div>

<br>

#### **4.2. Charge Pump Dead Zone**

The dead-zone configuration for this CP is the same as the previous post, and the results are shown in [fig.26](#fig26)  

> [Dead-Zone Configuration]({{site.url}}/images/pll_cp_design/part1/dead_zone_spice.png)
{: .prompt-info }

<br>

<div id="fig26" style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part2/dead_zone.png" alt="dead_zone" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 26. Current VS. Delay Plot</strong></p>
</div>

<br>

This proves that this CP has linear functionality within nanoscale design. It was possible due to using an OPAMP suppress channel length modulation. 
<br>

*In the next post, a new topology will be suggested in nanoscale design to resolve the above two issues.*

---

<div>
  <h3>References</h3>
  <ul style="list-style-type: none; padding: 0; margin: 0;">
    <li id="reference-1">
      [1] Design of Analog CMOS Integrated Circuits, 2nd Edition – Razavi
    </li>
    <li id="reference-2">
      [2] Design of CMOS Phase-Locked Loops: From Circuit Level to Architecture Level, 1st Edition – Razavi
    </li>
  </ul>
</div>
