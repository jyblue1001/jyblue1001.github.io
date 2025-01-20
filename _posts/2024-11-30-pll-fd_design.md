---
title: PLL - Frequency Divider Design
date: 2024-11-30
categories: [Analog Design, PLL, FD]
toc: true
math: true
---

# Table of Contents
[Introduction](#introduction)
1. [Latch Styles](#1-latch-styles)
   - [Static and Dynamic Latches](#11-static-and-dynamic-latches)

2. [Dynamic Latch](#2-dynamic-latch)
   - [Proposed Latch](#21-proposed-latch)
   - [Design Simulation](#22-design-simulation)

3. [Proposed Dividers and Design Consideration](#3-proposed-dividers-and-design-consideration)
   - [Divide-by-2 Design](#31-divide-by-2-design)
     - [Design Simulation](#311-design-simulation)
   - [Divide-by-3 Design](#32-divide-by-3-design)
     - [Concept Development](#321-concept-development)
     - [Design Simulation](#322-design-simulation)
   - [Divide-by-5 Design](#33-divide-by-5-design)
     - [Concept Development](#331-concept-development)
     - [Design Simulation](#332-design-simulation)

4. [Divide-by-120 Design](#4-divide-by-120-design)
   - [Design Simulation](#41-design-simulation)
   - [Impact of the Divider](#42-impact-of-the-divider)
   - [Revised FF](#43-revised-ff)
   - [Final Evaluation](#44-final-evaluation)

<br>

## **Introduction**

Now we begin the frequency divider (FD) design. We first examine the types of latches, which can be broadly classified into two categories: static and dynamic. After discussing the traits of these two latches, we then explain why dynamic latches are chosen over static latches. In the third section, we proceed with the actual design of our divide-by-120 FD in two different dynamic FFs. The design process will provide useful tips and highlight key design considerations throughout. Finally, we simulate the divide-by-120 FD in two FFs and cover its limitations. Then derive a new FF that consists of the advantage of prior FFs and conclude with the final divide-by-120 FD.

> To keep things concise, we note “divide-by-N FD” as “DivN”, further on.
{: .prompt-info }

## **1.	Latch Styles**
### **1.1.	Static and Dynamic Latches**

##### How to divide a signal

Now we begin the frequency divider design. How do we divide frequencies? For a given frequency, if we were to “hold” the signal and release it at the harmonic period of that frequency, we can divide the frequency. To do that, we need to make a circuit which operation runs on the input signal’s frequency. This behavior could be implemented by using latches, which could “hold” signals. Then, the concept could be advanced to Flip-Flops (FF), which are series of latches that could be operated by an “enable signal”. By setting the enable signal to the input frequency of interest, we can derive a frequency divider.

<br>

##### Latch functionality 

First, the static latches utilize back-to-back amplifying stages to store states. These circuits store the value by locking them in operating points, which inevitably demands the circuits to be powered on, frequently consuming power. Moreover, their topology naturally requires more transistors for its operation.  

<div id="fig1" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/static_latch.png" alt="static_latch" style="width:50%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 1. Static Latch with back-to-back Inverting Stages</span></strong></p>
</div>

<br>

Second, there are dynamic latches. These latches use their device capacitances to store value. They can be implemented with fewer transistors than static latches but may lose their states if the clock frequency is not sufficiently high.  

<div id="fig2" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/dynamic_latch.png" alt="dynamic_latch" style="width:40%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 2. Dynamic Latch, "Clocked CMOS" ($ \small {\mathbf C^2 \mathbf {MOS}} $)  Latch</span></strong></p>
</div>

<br><br>

##### Purpose of the Design

In this design, we target dynamic latches due to their advantages in low power consumption and to test how these dynamic latches behave in GHz topology.

<br>

---
## **2. Dynamic Latch**

### **2.1.	Proposed Latch**

Among various types of dynamic latches noted in [2], fig.3 and fig.5 are the proposed topologies. For convenience, we will note them as “Comp SW FF” and “Ratioed TSPC FF”, in short, respectively.

> TIP: TSPC → True Single Phased Clock .
{: .prompt-tip }

##### **Comp SW FF**

<div id="fig3" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff.png" 
       alt="comp_sw_ff" 
       style="width: 80%; display: block; margin: auto;" />
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_description.png"  
       alt="comp_sw_ff_description" 
       style="width: 80%; display: block; margin: auto; margin-top: 0px;" />
  <p><strong>Figure 3. <a href="#reference-2" title="Go to Reference 2"> Complementary Switched Flip-Flop from [2]</a></strong></p>
</div>

<div id="fig4" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/split_path_ff.png" 
       alt="split_path_ff" 
       style="width: 60%; display: block; margin: auto;" />
  <img src="{{site.url}}/images/pll_fd_design/split_path_ff_description.png"  
       alt="split_path_ff_description" 
       style="width: 50%; display: block; margin: auto; margin-top: 0px;" />
  <p><strong>Figure 4. <a href="#reference-2" title="Go to Reference 2"> Split Signal Path TSPC Flip-Flop from [2]</a></strong></p>
</div>


<br>

Comp SW FF can be implemented “unratioed”, meaning there is no need for size considerations, and we could dive into the smallest dimensions, which is [W: 0.43um, L: 0.15um]. This design was originally a TSPC FF seen in fig.4, then later improved as fig.3 with complementary clocks to ensure faster operations in higher frequencies.

<br>

##### **Ratioed TSPC FF**

<div id="fig5" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff.png" 
       alt="ratioed_tspc_ff" 
       style="width: 60%; display: block; margin: auto;" />
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_description.png"  
       alt="ratioed_tspc_ff_description" 
       style="width: 40%; display: block; margin: auto; margin-top: 0px;" />
  <p><strong>Figure 5. <a href="#reference-2" title="Go to Reference 2"> Ratioed TSPC Flip-Flop from [2]</a></strong></p>
</div>

<br>

Ratioed TSPC FF could also be implemented “unratioed” and could be designed in the smallest sizes. Except for M_9, which should be two to three times wider for optimum speed.

<br>

While Ratioed TSPC FF seems like an intriguing option due to its fewer number of transistors. These Dividers have additional characteristics to highlight that cannot be spotted in textbook configurations. For further inspection, we move on to the actual designs to analyze its waveforms.

<br>

### **2.2.	Design Simulation**

##### **Comp SW FF**

Fig.6 is the actual implementation of Comp SW FF, fig.12 is the SPICE, and fig.13 shows the waveforms.

<div id="fig6" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_schematic.png" alt="comp_sw_ff_schematic" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 6. Schematic Representation of Comp SW FF</span></strong></p>
</div>

<br>

One thing to note is the complementary CLK generating circuit in fig.6. The development of such design develops from the concept in fig.7.

<div id="fig7" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_clk_generating_circuit_1.png" alt="comp_clk_generating_circuit_1" style="width:60%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 7. Complementary Clock Generating Circuit 1</span></strong></p>
</div>

<br>

The SPICE code for DC analysis is shown as [fig.4](#fig4), and its result is [fig.5](#fig5).  

<div id="fig8" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_clk_gen_circ_period_mistmatch1.png" 
       alt="comp_clk_gen_circ_period_mistmatch1" 
       style="width: 90%; display: block; margin: auto;" />
  <img src="{{site.url}}/images/pll_fd_design/comp_clk_gen_circ_period_mistmatch2.png"  
       alt="comp_sw_ff_vco_output2" 
       style="width: 90%; display: block; margin: auto; margin-top: 0px;" />
  <p><strong><span style="font-size: 16px;">Figure 8. Complementary Clock Generating Circuit 2</span></strong></p>
</div>

<br>

Fig,8 shows the outcome where the PLL is built with Comp_sw_FF FD with fig.7 configurated complementary clock circuits. We can see the rising waveform is different between the periods of the signals. Therefore, fails in matching a 2.4GHz.

<div id="fig9" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_clk_generating_circuit_2.png" alt="comp_clk_generating_circuit_2" style="width:65%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 9. Complementary Clock Generating Circuit 2</span></strong></p>
</div>

<br>

We try to mitigate such traits with the addition of inverters to guard the VCO from the pass-gate. However, this design also provides subtle waveform mismatches in CK1_b and CK1 as shown in fig.9. This is also due to the pass-gate device.

<div id="fig10" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/waveform_mismatch.png" alt="waveform_mismatch" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 10. Waveform Mismatch</span></strong></p>
</div>

<br>

<div id="fig11" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_clk_generating_circuit_3.png" alt="comp_clk_generating_circuit_3" style="width:80%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 11. Complementary Clock Generating Circuit 3</span></strong></p>
</div>

<br>

In fig.11, we now guard both nodes of the pass-gate to suppress the parasitic capacitances. While this has disadvantages in delays, it has the best result in the simulation as in fig.13.

<div id="fig12" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_spice.png" alt="comp_sw_ff_spice" style="width:45%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 12. Comp SW FF SPICE</span></strong></p>
</div>

<br>

<div id="fig13" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_waveform.png" alt="comp_sw_ff_waveform" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 13. Comp SW FF Waveform</span></strong></p>
</div>

<br>

 We can see that Comp SW FF is actually a **Positive edge-triggered Flip-Flop with a single inverted output**.

##### **Ratioed TSPC FF**

<div id="fig6" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_schematic.png" alt="ratioed_tspc_ff_schematic" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 14. Schematic Representation of Ratioed TSPC FF</span></strong></p>
</div>

<br>

<div id="fig15" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_spice.png" alt="ratioed_tspc_ff_spice" style="width:50%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 15. Ratioed TSPC FF SPICE</span></strong></p>
</div>

<br>

<div id="fig13" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_waveform.png" alt="ratioed_tspc_ff_waveform" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 16. Ratioed TSPC FF Waveform</span></strong></p>
</div>

<br>

For the case of Ratioed TSPC FF, Fig.14 is the actual implementation, fig.15 is the SPICE, and fig.16 shows the waveforms. By analyzing fig.16, we can understand for the case of Ratioed TSPC FF, it is a **Negative edge-triggered Flip-Flop with a single inverted output**. 

One thing to note is that both TSPC FFs have inverting outputs, the reason for this could be that they all have three inverter stages. As for the Comp SW FF, [M1, M2, M2_c, M3], [M4, M5, M5_c, M6], [M7, M8] represent the three inverter stages, as shown in fig. 6. Regarding the Ratioed TSPC FF, [M1, M2, M3], [M4, M5], [M6, M7] correspond to the three inverter stages, as shown in fig. 14. This insight of treating FFs as a series of inverters is particularly beneficial when designing Div3 and Div5 components later in the post. We use a symbol such as fig.17, representing an FF with an inverting output.

<div id="fig17" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/inverting_output_ff_symbol.png" alt="inverting_output_ff_symbol" style="width:20%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 17. Symbol of Inverting output FF</span></strong></p>
</div>

<br>


---

## **3.	Proposed Dividers and Design Consideration**

### **3.1. Divide-by-2 Design**

#### **3.1.1. Design Simulation**

<br>

##### **Comp SW FF**

<br>

To make a Div2, we readily connect the “inverting” output to the input as fig.18 and fig.21. With the results illustrated in fig.20 and fig.23, the output is a signal with a period of 833ps, which is approximately $ \frac{1}{2} $ of 2.4GHz.

<br>

<div id="fig18" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_div2_schematic.png" alt="comp_sw_ff_div2_schematic" style="width:90%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 18. Schematic Representation of Comp SW FF Div2</span></strong></p>
</div>

<br>

<div id="fig19" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_div2_spice.png" alt="comp_sw_ff_div2_spice" style="width:60%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 19. Comp SW FF Div2 SPICE</span></strong></p>
</div>

<br>

<div id="fig20" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_div2_waveform.png" alt="comp_sw_ff_div2_waveform" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 20. Comp SW FF Waveform</span></strong></p>
</div>

<br>

##### **Ratioed TSPC FF**

<div id="fig21" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_div2_schematic.png" alt="ratioed_tspc_ff_div2_schematic" style="width:90%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 21. Schematic Representation of Ratioed TSPC FF Div2</span></strong></p>
</div>

<br>

<div id="fig22" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_div2_spice.png" alt="ratioed_tspc_ff_div2_spice" style="width:50%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 22. Ratioed TSPC FF Div2 SPICE</span></strong></p>
</div>

<br>

<div id="fig23" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_div2_waveform.png" alt="ratioed_tspc_ff_div2_waveform" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 23. Ratioed TSPC FF Div2 Waveform</span></strong></p>
</div>

<br>

---

### **3.2. Divide-by-3 Design**

#### **3.2.1. Concept Development**

Fig.24 is the proposed Div3 design from [2]. Unlike Fig. 17, this design features a non-inverting output. 

<div id="fig24" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/div3_concept.png" alt="div3_concept" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 24. Div3 Concept</span></strong></p>
</div>

<br>

We change the FF to our configuration in then inspect how we can apply such an operation to our case. Also, note what we can do further to reduce the number of transistors.

<div id="fig25" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/div3_dev_process.png" alt="div3_dev_process" style="width:90%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;"> Figure 25. Process of applying the logic of fig.24 with fig.17, with improvements</span></strong></p>
</div>

<br>

Fig.25 shows the process of developing our own Div3


<div id="fig26" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/div3_hand_eval.png" alt="div3_hand_eval" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;"> Figure 26. Hand-evaluation of the final Div3 circuit</span></strong></p>
</div>

<br>

##### **Hand-Evaluation of Div3**  

Before the actual simulation of the FD, it is highly advised that the design be evaluated by hand. This is the best way for the designer to understand how logic works and if it matches our goal. Fig.26 presents an evaluation of the final Div3. However, it is recommended that each process step be manually evaluated individually, which I will leave as an exercise for the readers. A key starting point for those interested in attempting this would be setting the initial conditions for each node. To do this, select one node of interest and assign it an arbitrary value. This will allow the remaining node values to adjust according to the design’s logic configuration. If the design is correct, the circuit will produce a proper Div3 signal. Otherwise, it will converge to either a HIGH or LOW state.  
<br>

##### **Incorporation of a NAND Gate in the Flip-Flop (FF)**  

One thing to note in fig.25 is that we embedded a NAND into the FF. This is a legitimate approach because we agreed to develop the intuition that our TSPC FF is a series of three inverters. The key is to have three succeeding inverting stages grouped in the same clock. Even though we have a NAND instead of a NOT in fig.25, it still holds the purpose of carrying a state within its device capacitance.  
<br>

##### **Duty Cycle Considerations**  

Another thing to note is the duty cycle of this Div3 FD, which is shown in the waveforms in fig. 24 and 26 as 66.6%. To prove that the phase and frequency distinguishing functionality is irrelevant to the duty cycle, we recall back the PFD design post. In that post, we explained that our PFD operates as a positive edge-detecting component. This means the window of interest spans from one rising edge of the signal to the next. Consequently, the duty cycle does not impact the functionality of this PLL’s topology, provided that the divided frequency adheres to the expected period.  
<br>

---

#### **3.2.2. Actual Development**

##### **Comp SW FF**

<div id="fig27" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_div3_schematic.png" alt="comp_sw_ff_div3_schematic" style="width:90%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 27. Schematic Representation of Comp SW FF Div3</span></strong></p>
</div>

<br>

Fig.27 is the transistor level Comp_sw_FF. Every NMOS and PMOS is sized [W: 0.43um, L: 0.15um] except for inverters and the pass-gates, which have PMOS as [W: 0.86um, L: 0.15um]. 

<div id="fig28" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_div3_spice.png" alt="comp_sw_ff_div3_spice" style="width:50%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 28. Comp SW FF Div3 SPICE</span></strong></p>
</div>

<br>

<div id="fig29" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_div3_waveform.png" alt="comp_sw_ff_div3_waveform" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 29. Comp SW FF Div3 Waveform</span></strong></p>
</div>

<br><br>

##### **Ratioed TSPC FF**

<div id="fig30" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_div3_schematic.png" alt="ratioed_tspc_ff_div3_schematic" style="width:90%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 30. Schematic Representation of Ratioed TSPC FF Div3</span></strong></p>
</div>

<br>

Like the prior, fig.30 is the transistor level Ratioed TSPC FF. Every NMOS and PMOS is sized [W: 0.43um, L: 0.15um] except for inverters and the pass-gates, which have PMOS as [W: 0.86um, L: 0.15um].  

<div id="fig31" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_div3_spice.png" alt="ratioed_tspc_ff_div3_spice" style="width:50%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 31. Ratioed TSPC FF Div3 SPICE</span></strong></p>
</div>

<br>

<div id="fig32" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_div3_waveform.png" alt="ratioed_tspc_ff_div3_waveform" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 32. Ratioed TSPC FF Div3 Waveform</span></strong></p>
</div>

<br>

Same as before, figure 32 shows the waveforms of fig.30, which outputs a 1.2511ns signal, that is, $ \frac{1}{3} $ of 2.4GHz.

---

### **3.3. Divide-by-5 Design**

#### **3.3.1. Concept Development**
<br>

To make a Div5, we introduce the concept of a Dual Modulus Prescaler.
<br>

<div id="fig33" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/dual_modulus_prescaler.png" 
       alt="dual_modulus_prescaler" 
       style="width: 80%; display: block; margin: auto;" />
  <img src="{{site.url}}/images/pll_fd_design/dual_modulus_prescaler_description.png"  
       alt="dual_modulus_prescaler_description" 
       style="width: 50%; display: block; margin: auto; margin-top: 0px;" />
  <p><strong>Figure 33. <a href="#reference-2" title="Go to Reference 2"> Dual Modulus Prescaler from [2]</a></strong></p>
</div>

<br>

A <span style="color:lightblue;">dual modulus</span> <span style="color:red;">prescaler</span> is a <span style="color:red;">frequency divider</span> that can <span style="color:lightblue;">switch between two division factors</span>, likely N and N+1. By leveraging this characteristic, if N is 2, the prescaler can operate as a Div2 followed by a Div3. The summation of the doubled and tripled periods can be used to create a 1/5 frequency signal, which will have a duty cycle of 40%, as the doubled period accounts for that 40%.

<br>

<div id="fig34" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/div5.png" 
       alt="div5" 
       style="width: 80%; display: block; margin: auto;" />
  <img src="{{site.url}}/images/pll_fd_design/div5_description.png"  
       alt="div5_description" 
       style="width: 50%; display: block; margin: auto; margin-top: 0px;" />
  <p><strong>Figure 34. <a href="#reference-2" title="Go to Reference 2"> Div5 from [2]</a></strong></p>
</div>

<br>

The dual modulus scaler, or the $\div$ 2/3 (Div2,3) circuit, can be designed as fig.33. In <a href="#reference-2" title="Go to Reference 2"> [2]</a>, it adopts an OR gate to implement the “switch between two division factors” function. Then, it could be advanced into a Div5 as shown in fig.34. 

<div id="fig35" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/and_with_or_input.png" alt="and_with_or_input" style="width:90%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 35. AND gate with OR input</span></strong></p>
</div>

<br>

Fig.35 shows how the AND & OR gates from fig.34 could be combined. If we manage to place the NOR component devices [M5, M2, M6, M4] near the rails, and NAND components [M1, M2, M3, M4] centered in the output node, it works as a “AND gate with OR input”.  
<br>
One interesting observation is that the AND with an OR input can be made with NAND with a NOR input. Combining two inverting-stage logic gates appears to nullify their respective NOT operations.

---

#### **3.3.2. Acutal Design**
<br>

##### **Comp SW FF**

<div id="fig36" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_div5_schematic.png" alt="comp_sw_ff_div5_schematic" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 36. Schematic Representation of Comp SW FF Div5</span></strong></p>
</div>

<br>

<div id="fig37" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_div5_spice.png" alt="comp_sw_ff_div5_spice" style="width:50%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 37. Comp SW FF Div5 SPICE</span></strong></p>
</div>

<br>

<div id="fig38" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_div5_waveform.png" alt="comp_sw_ff_div5_waveform" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 38. Comp SW FF Div5 Waveform</span></strong></p>
</div>

<br>

The vout signal in fig.38 shows a period of 2.0643ns, which is five times the period of a 2.4GHz signal.

<br>

##### **Ratioed TSPC FF**

<div id="fig39" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_div5_schematic.png" alt="ratioed_tspc_ff_div5_schematic" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 39. Schematic Representation of Ratioed TSPC FF Div5</span></strong></p>
</div>

<br>

<div id="fig40" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_div5_spice.png" alt="ratioed_tspc_ff_div5_spice" style="width:50%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 40. Ratioed TSPC FF Div5 SPICE</span></strong></p>
</div>

<br>

<div id="fig41" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_div5_waveform.png" alt="ratioed_tspc_ff_div5_waveform" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 41. Ratioed TSPC FF Div5 Waveform</span></strong></p>
</div>

The vout signal in fig.22 shows a period of 2.0861ns, which is also five times the period of a 2.4GHz signal.

Now, with all three components that compose the Div120. We move on to its design implementation.

---

## **4. Divide-by-120 Design**

### **4.1. Design Simulation**

As we covered in the “PLL – Design parameters” post, 120 can be broken into $ 2^{3} \times 3 \times 5 $. Meaning, Div120 can be built by connecting three Div2s, one Div3, and one Div5.

<br>

##### **Comp SW FF**

<div id="fig42" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_div120_symbol.png" alt="comp_sw_ff_div120_symbol" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 42. Comp SW FF Div120 Symbol Representation</span></strong></p>
</div>

<br>

For the Comp_sw_FF, the FD is implemented as fig.42, with the simulation setup like fig.44.

<div id="fig43" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_div120_spice.png" alt="comp_sw_ff_div120_spice" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 43. Comp SW FF Div120 SPICE</span></strong></p>
</div>

<br>

<div id="fig44" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_div120_setup.png" alt="comp_sw_ff_div120_setup" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 44. Comp SW FF Div120 Setup and Waveform</span></strong></p>
</div>

<br>

The SPICE is written as fig.43, where the code is written similarly to SPICE for evaluating the Kvco in the VCO post. The code measures up to 120ns which covers at least one period of the divide-by-120 (20MHz = 50ns). 
We write the code as such because, as we briefly mentioned in the last part of the VCO post, the capacitance from the FD influences the VCO, degrading its operation speed. So, we need to change the aspect ratio of the MOSFETs in the ringed oscillator so that it meets our frequency of interest, 2.4GHz.

<div id="fig45" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_revised_vco_schematic.png" alt="comp_sw_ff_revised_vco_schematic" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 45. Revised VCO Schematic of Comp SW FF Div120</span></strong></p>
</div>

<br>

After changing the size from [W_p: 0.86um, L_p: 0.27um, W_n: 0.43um, L_n: 0.27um] to [W_p: 1.0um, L_p: 0.19um, W_n: 0.50um, L_n: 0.19um] as shown in fig.45. It creates a Kvco plot as fig.46. 

<div id="fig46" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_ff_revised_vco_kvco.png" alt="comp_sw_ff_revised_vco_kvco" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 46. Kvco plot of the Revised VCO</span></strong></p>
</div>

<br>

With this revised VCO, the output frequency is $\frac{1}{400.71\times{10}^{-12}s} \approx \small{2.496} \scriptsize{GHz} $ for V_cont of 0.9V. When this goes through the FD, the period of the final signal is 48.177ns, as shown in fig.47. 

<div id="fig47" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_revised_vco_output.png" 
       alt="comp_sw_revised_vco_output" 
       style="width: 80%; display: block; margin: auto;" />
  <img src="{{site.url}}/images/pll_fd_design/comp_sw_revised_vco_div120_output.png"  
       alt="comp_sw_revised_vco_div120_output" 
       style="width: 50%; display: block; margin: auto; margin-top: 0px;" />
  <p><strong><span style="font-size: 16px;">Figure 47. VCO output (Top), Div120 output (Bottom)</span></strong></p>
</div>
<br>

We can conclude that the FD successfully delivers divide-by-120 through the following calculation. 

$$ \frac{48.189\times{10}^{-9}}{400.71\times{10}^{-12}} = 120.26\ \ \approx 120 $$

<br><br>

##### **Ratioed TSPC FF**

<br>

<div id="fig48" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_div120_symbol.png" alt="ratioed_tspc_div120_symbol" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 48. Ratioed FF Div120 Symbol Representation</span></strong></p>
</div>

<br>

For the Ratioed_FF, the FD is implemented as fig.48, and the simulation setup as fig.49. As explained above, the SPICE simulation is written similarly to serve the same purpose.


<div id="fig49" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_div120_setup.png" alt="ratioed_tspc_ff_div120_setup" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 49. Ratioed TSPC FF Div120 Setup and Waveform</span></strong></p>
</div>

<br>

<div id="fig50" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_revised_vco_schematic.png" alt="ratioed_tspc_ff_revised_vco_schematic" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 50. Revised VCO Schematic of Ratioed TSPC FF Div120</span></strong></p>
</div>

<br>

[W_p: 0.86um, L_p: 0.27um, W_n: 0.43um, L_n: 0.27um] to [W_p: 0.86um, L_p: 0.20um, W_n: 0.43um, L_n: 0.20um] as shown in fig.50. It creates a Kvco plot as fig.51. 

<div id="fig51" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_ff_revised_vco_kvco.png" alt="ratioed_tspc_ff_revised_vco_kvco" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 51. Kvco plot of the Revised VCO</span></strong></p>
</div>

<br>

With this revised VCO, the output frequency is $\frac{1}{409.76\times{10}^{-12}s}\ \approx \small{2.44} \scriptsize{GHz} $ for V_cont of 0.9V. When this goes through the FD, the period of the final signal is 49.755ns, as shown in fig.52. 

<div id="fig52" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_revised_vco_output.png" 
       alt="ratioed_tspc_revised_vco_output" 
       style="width: 100%; display: block; margin: auto;" />
  <img src="{{site.url}}/images/pll_fd_design/ratioed_tspc_revised_vco_div120_output.png"  
       alt="ratioed_tspc_revised_vco_div120_output" 
       style="width: 100%; display: block; margin: auto; margin-top: 0px;" />
  <p><strong><span style="font-size: 16px;">Figure 52. VCO output (Top), Div120 output (Bottom)</span></strong></p>
</div>
<br>

We can see that for the case of the Ratioed FF, the division ratio is $\frac{49.775\times{10}^{-9}}{409.76\times{10}^{-12}} =\ \small{121.42} $, which is near 120. However, for those with a sharp eye, you can see that the VCO output signal in fig.52 is slightly distorted, as we first observed in fig.8.

---

### **4.2. Impact of the Divider**
<br>

From fig. 7, 8, 9, 10, and 52, it was observed that parasitic capacitance poses a significant issue, as it distorts the VCO output signal when the divider is connected. This issue may be suppressed if the dimensions of the MOSFETs get smaller, but [W_n: 0.43um, L: 0.15um] is the lowest limit. Thus, we cannot derive a solution in this direction.  
<br>

While the FD of Comp_sw_FF derives a solution from using inverters, it uses too many MOSFETs, even overwhelming the numbers used for FD design in divide-by-2. This leads to longer simulations because they vary proportionally to the number of devices, which is another inconvenience. Plus, the Comp_sw_FF topology introduces an additional disadvantage of delays from its complementary clock-generating stages.
<br>

---

### **4.3. Revised FF**
<br>

Instead, an alternative can be drawn from the strengths of both approaches. We could choose the Ratioed FF for its merit in fewer devices while shielding the VCO & FD connection as much as possible using inverters as in comp_sw_FF.  
<br>

The FDs directly connected to the VCO output node are the divide-by-2 and the divide-by-3. This is intuitively seen because the divide-by-2 is made by connecting the input and output of the FF. The divide-by-3 is related by having its input connected to that node.

<div id="fig53" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/final_div2.png" alt="final_div2" style="width:80%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 53. Ratioed TSPC Div2 with Inverter Shielding</span></strong></p>
</div>

<br>

<div id="fig54" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/final_div3.png" alt="final_div3" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 54. Ratioed TSPC Div3 with Inverter Shielding</span></strong></p>
</div>

<br>

Replacing the original divide-by-2 and divide-by-3 with the proposed FD design in Fig.53 and 54. We then examine how the actual operation under this solution behaves.

<br>

---

### **4.4.	Final Evaluation**
<br>

The simulation conditions are identical to the ones introduced in “4.1. Design Simulation”. Hence, we focus on the main points.

<div id="fig55" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/final_ff_div120_setup.png" alt="final_ff_div120_setup" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 55. Final FF Div120 Setup and Waveform</span></strong></p>
</div>

<br>

<div id="fig56" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/final_ff_revised_vco_schematic.png" alt="final_ff_revised_vco_schematic" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 56. Revised VCO Schematic of the Final FF Div120</span></strong></p>
</div>

<br>

<div id="fig57" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/final_ff_revised_vco_kvco.png" alt="final_ff_revised_vco_kvco" style="width:100%; display: block; margin: auto;" />
  <p><strong><span style="font-size: 16px;">Figure 57. Kvco plot of the Revised VCO</span></strong></p>
</div>

<br>

<div id="fig58" style="text-align: center;">
  <img src="{{site.url}}/images/pll_fd_design/final_revised_vco_output.png" 
       alt="final_revised_vco_output" 
       style="width: 100%; display: block; margin: auto;" />
  <img src="{{site.url}}/images/pll_fd_design/final_revised_vco_div120_output.png"  
       alt="final_revised_vco_div120_output" 
       style="width: 100%; display: block; margin: auto; margin-top: 0px;" />
  <p><strong><span style="font-size: 16px;">Figure 58. VCO output (Top), Div120 output (Bottom)</span></strong></p>
</div>
<br>

We see that with this VCO and FD, the VCO outputs $ \frac{1}{415.38\times{10}^{-12}} = \small{2.407} \scriptsize{GHz} $ for V_cont of 0.9V. Then to a divide-by-120 signal of 49.835ns, which leads to the divider factor of $ \frac{49.835\times{10}^{-9}}{415.38\times{10}^{-12}} = \small{119.97}\ \ \approx \small{120} $, promisingly matching up with our original concept.

Additionally, we can confirm that the VCO output signal (top image of fig.58) does not seem to be corrupted by the capacitances from the succeeding stages, resolving the issue from fig.54.

<br>

---

*Next post, the full topology of the PLL will be put under analysis.*

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
