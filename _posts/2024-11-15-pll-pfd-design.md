---
layout: post
title: "PLL - Phase Frequency Detector Design"
date: 2024-11-20
categories: [Analog Design, PFD]
toc: true
---

### Overview
Moving on to the PFD. This may be the shortest part yet.

We intend to make a Phase Frequency Detector (PFD) by capturing the edge of the signals, **positive edge** to be specific.

This is an important takeaway because, by adopting a positive edge-detecting PFD, the feedback signal coming back from the frequency divider does not have to be a 50% duty cycled signal.  

It becomes possible to implement power-efficient divider designs without placing stress on achieving a 50% duty cycle.

---

### Design Topology

The topology for our PFD looks like this:

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_topology.png" alt="PFD Topology" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 1</strong></p>
</div>

To evaluate this topology, we observe its time response operation step by step.

---

### Step-by-Step Signal Analysis

First, we apply the two input signals as shown in **Figure 2**. The signal on the left is the reference 20 MHz pulse, and the signal on the right is the feedback 20 MHz pulse lagging by 1 ns, coming back from the VCO-Freqency_Divider cascasde.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_input_signals.png" alt="PFD Input Signals" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 2</strong></p>
</div>

<br>

Its representation is shown in **Figure 3**.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_signal_representation.png" alt="Signal Representation" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 3</strong></p>
</div>

<br>

**Figure 4** shows the close-up behavior of the two signals.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_signal_closeup.png" alt="Signal Close-Up" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 4</strong></p>
</div>

---

### Transient Response of NOR Blocks

**Figure 5 ~ 13** shows the transient response of their two input signals and one output signal from the NOR blocks in **Figure 1**.
  
X1~X4 are the NOR blocks from the F_REF detecting side, and X5~X8 are for F_VCO, respectively. All signals are color-coded simultaneously among graphs on the left side (X1~X4) as well as the right side.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_transient_response_2_0120.png" alt="NOR Transient Response" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 5</strong></p>
</div>

---

### Time-Resolved Analysis

At 2.0124 µs: F_REF rises enough to trigger DOWN the X1 NOR output, which is the node **QA_b**.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_transient_response_2_0124.png" alt="Time Analysis 1" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 6</strong></p>
</div>

<br>

At 2.0126 µs: **QA_b** is entirely DOWN, and this triggers **QA** to go UP in the X2 NOR output.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_transient_response_2_0126.png" alt="Time Analysis 2" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 7</strong></p>
</div>

<br>

At 2.0128 µs: **QA** is entirely UP.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_transient_response_2_0128.png" alt="Time Analysis 3" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 8</strong></p>
</div>

<br>

At 2.0130 µs: F_VCO starts to rise.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_transient_response_2_0130.png" alt="Time Analysis 3" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 9</strong></p>
</div>

<br>

At 2.0134 µs: F_VCO rises enough to trigger DOWN the X5 NOR output, which is the node **QB_b**.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_transient_response_2_0134.png" alt="Time Analysis 3" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 10</strong></p>
</div>

<br>

At 2.0136us: **QB_b** is entirely DOWN, and this triggers **QB** to go UP in X6 NOR output.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_transient_response_2_0136.png" alt="Time Analysis 3" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 11</strong></p>
</div>

<br>

At 2.0138us: Now **QB** is entirely UP, this means that the second signal has detected, and the interval between QA and QB is the time difference between F_REF and F_VCO. Therefore, that amount of information will be passed down to the CP.
Moving on, the X9 AND block now has its two inputs UP, which leads to its output (RESET) also being UP.


<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_transient_response_2_0138.png" alt="Time Analysis 3" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 12</strong></p>
</div>

<br>

At 2.0140us: The UP RESET signal reaches the input of X4 and X8 NOR block, which simultaneously triggers the X2 and X6 NOR blocks and finally driving it to go DOWN.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_transient_response_2_0140.png" alt="Time Analysis 3" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 13</strong></p>
</div>

<br>

---

### Final Outputs

The whole process was to create a pulse signal for the CP input, as shown below.  

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_final_output.png" alt="PFD Final Output" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 14</strong></p>
</div>

<br>

There is one more thing to discuss: applying additive inverters to the output to ensure delays for small phase frequency differences. This is done to avoid dead zone issues in PFD and CP.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_with_inverter_delays.png" alt="PFD with Inverters" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 15</strong></p>
</div>

After such an approach, for sequences where the two input signals are in coordination, we still get to see some signals in the output, which will ensure that our PFD-CP design would not fall into a dead zone.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_pfd_design/pfd_with_inverter_delays_output.png" alt="PFD Dead Zone Proof" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 16</strong></p>
</div>

---

### Conclusion

This completes the design and analysis of the phase frequency detector. Stay tuned for the next post on charge pumps and further integration!
