---
title: PLL - Charge Pump Design Part 2
date: 2024-11-23
categories: [Analog Design, PLL, CP]
toc: true
---

# Table of Content
1. [Concept of the proposed topology](#1-concept-of-the-proposed-topology)
2. [DC Analysis](#2-dc-analysis)
3. [Transient Analysis](#3-transient-analysis)
   - [Testbench Considerations](#31-testbench-considerations)
   - [Simulation Results](#32-simulation-results)
4. [Design Issues](#4-design-issues) 
   - [Large Transistors](#41-large-transistors)
   - [Non-Linear Charge Pump](#42-non-linear-charge-pump)
   
## **1. Concept of the Proposed Topology**

The implementation and the simulation configurations follow as shown below.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part1/topology1.png" alt="topology1" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 1</strong></p>
</div>

<br>

In fig.1, M1~M6 are the pulse inverting stages for charge pump (CP) PMOS input, and M7~M12 are the pulse non-inverting stages for CP NMOS input. Some might think this could be done by adding a single inverter on the PMOS input, but such configuration can bring timing mismatches for the PMOS and NMOS input.

To mitigate that effect, M9, M10 are added as pass-gates for the non-inverting stage. Compared to the inverters, however, this pass-gate is comprised of mismatch due to large parasitic capacitance. This could be resolved to some extent by placing it in the middle of two inverters as fig.1.

For size considerations, the pulse inverting and non-inverting stages (M1~M12) are implemented in the smallest dimensions possible, so they do not suffer from excessive parasitic capacitance from the device. This concept is also applied to the CP input PMOS and NMOS (M13~M14) so their impedance does not hinder the loop filter components. However, these two transistors were not pushed to their minimum size limit (PMOS [W:0.86um, W:0.15um], NMOS [W:0.43um, W:0.15um]), because such configuration could bring current mismatch.

M15~M17 are the PMOS current mirror stages and M18~M21 are the NMOS current mirror stages. For size considerations, they are implemented in big dimensions so that the role of current mirroring is not degraded due to channel length modulation.

---

## **2. DC Analysis**

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part1/dc_sweep_spice_code.png" alt="dc_sweep_spice_code" style="width:150%; display: block; margin: auto;" />
  <p><strong>Figure 2</strong></p>
</div>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part1/dc_response.png" alt="dc_response" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 3</strong></p>
</div>

<br>

Fig.2 is the spice code for the DC sweep simulation, and the plots in fig.3 are the results. We find out that the proposed CP provides 100uA in the operating V_CONT ranges.

---

## **3. Transient Analysis**

#### **3.1. Testbench Considerations**

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part1/transient_topology.png" alt="transient_topology" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 4</strong></p>
</div>

<br>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part1/input_pulses.png" alt="input_pulses" style="width:80%; display: block; margin: auto;" />
  <p><strong>Figure 5</strong></p>
</div>

<br>

Apart from fig.1, CP is now connected with the PFD and the loop filter components.
The input F_REF and F_VCO pulses are shown in fig.5, along with the PFD that we created from the previous post. The delays of pulse signals in F_REF and F_VCO are both set as 12ns. By altering the delay value of **F_VCO**, we can test conditions where F_VCO is **"slower"**, **"faster"** and **"same speed"** to F_REF.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part1/transient_spice_code.png" alt="transient_spice_code" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 6</strong></p>
</div>

<br>

Fig.6 is the SPICE code for the transient response simulations with some comments explaining some of the code lines. The reason for choosing timesteps 50ps and 5ps is related to the validation of unwanted oscillations. In simulations, the rule of thumb for selecting the appropriate timesteps is to choose a <sup>1</sup>/<sub>10</sub> value, and our frequency of interest is the reference frequency, which is 20MHz, 5×10<sup>-8</sup> s (50ns). Thus, we could choose a timestep of 5ns. However, to further validate for possible oscillations that could arise from amplifications in parasitic capacitances, smaller timesteps 50ps and 5ps were chosen.

<br>

<div style="text-align: center;">
  <!-- First Image -->
  <img src="{{site.url}}/images/pll_cp_design/part1/freq_vs_vcont.png" 
       alt="freq_vs_vcont" 
       style="width: 80%; display: block; margin: auto;" />

  <!-- Second Image -->
  <img src="{{site.url}}/images/pll_cp_design/part1/lock_state_vcont.png"  
       alt="lock_state_vcont" 
       style="width: 80%; display: block; margin: auto; margin-top: 0px;" />

  <!-- Caption -->
  <p><strong>Figure 7</strong></p>
</div>

<br>
The V_CONT value for when the F_REF and F_VCO have the same speed are derived as fig.7. Where 0.8V exerts 2.37GHz and 0.9V produces 2.46GHz, we assume Kvco is linear between these two points and derive the V_CONT value where the VCO can produce 2.40GHz output signal.
After the derivation, we configure the initial V_out voltage to 0.83V.

---

#### **3.2. Simulation Results**

<span style="color: blue;">1st condition (F_REF slower than F_VCO)</span>

Fig.8 is the pulse response of this transient response. The plots on the left show the full picture, and the plots on the right show the close-up pulses. The notation on the top margin of each plot depicts which node signal they are showing. The plots are orderly put from the PFD output to the CP branch input.

<div style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part1/first_condition_pulse.png" 
         alt="first_condition_pulse" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part1/first_condition_pulse_closeup.png" 
         alt="first_condition_pulse_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 8. Input Pulse signals of the First Condition</strong></p>
</div>

<br>

Starting from the top, fig.9 shows the plot of PMOS and NMOS current of the CP **/** M13 & M14 **/** M17 & M21 **/** the (PMOS current – NMOS current) which is the current provided to the loop filter **/** and finally the V_out, respectively.

The 4th row from fig.9 shows that the CP is providing a little more than 100uA, this due to the charge injection from the parasitic capacitance from the big MOSFETs.

<div style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part1/first_condition_current_response.png" 
         alt="first_condition_current_response" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part1/first_condition_current_response_closeup.png" 
         alt="first_condition_current_response_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 9. Current Flow in the First Condition</strong></p>
</div>

<br>

<span style="color: blue;">2nd condition (F_REF faster than F_VCO)</span>

The layout of the plots are identical to the 1st condition, fig.10 is the pulse response of this transient response. The plots on the left show the full picture, and the plots on the right show the close-up pulses.

<div style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part1/second_condition_pulse.png" 
         alt="second_condition" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part1/second_condition_pulse_closeup.png" 
         alt="second_condition_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 10. Input Pulse signals of the Second Condition</strong></p>
</div>

<br>

Fig.11 is similar to the aspects of fig.9.

<div style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part1/second_condition_current_response.png" 
         alt="second_condition_current_response" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part1/second_condition_current_response_closeup.png" 
         alt="second_condition_current_response_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 11. Current Flow in the Second Condition</strong></p>
</div>

<br>

<span style="color: blue;">3rd condition (F_REF same as F_VCO)</span>

Similar to the 1st and 2nd condition, fig.12 is the pulse response of this transient response. The plots on the left show the full picture, and the plots on the right show the close-up pulses.

<div style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part1/third_condition_pulse_closeup.png" 
         alt="third_condition_current_response" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part1/third_condition_pulse.png" 
         alt="third_condition_current_response_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 12. Input Pulse signals of the Third Condition</strong></p>
</div>

<br>

The 5th row of fig.13 shows the V_out result when the PLL is assumed to be in the lock state. To resolve its decreasing behavior, we can increase the length of M13 from 2um to 2.4um. The results are shown in fig.14

<div style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part1/third_condition_current_response.png" 
         alt="third_condition_current_response" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part1/third_condition_current_response_closeup.png" 
         alt="third_condition_current_response_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 13. Current Flow in the Third Condition</strong></p>
</div>

<br>

<div style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part1/revised_third_condition_current_response.png" 
         alt="third_condition_current_response" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part1/revised_third_condition_current_response_closeup.png" 
         alt="third_condition_current_response_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 14. Current Flow in the Third Condition with Revised Transistor Sizes</strong></p>
</div>

<br>

---

## **4. Design Issues**

This CP designs however, consists of the following issues. 

#### **4.1. Large Transistors**

One of the problems in this design is that it requires large transistors for the reference current branches to mitigate channel length modulation. It reaches up to 200um X 1.5um in the largest transistors, which may take up lots of area in the chip die. Additionally, these large sizes naturally entail large parasitic capacitances leading to more problems when interacting with other PLL components with small capacitances. For example, when this CP is connected to the PFD from our previous design, the large capacitance introduces poor slew rates in the pulse interpretation. This property is the root problem that leads to the second issue.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part1/big_transistors.png" alt="big_transistors" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 15. Big Transistors</strong></p>
</div>

<br>

#### **4.2. Non-Linear Charge Pump**

Fig.16 is a close-up picture of fig.13, it shows when the CP is locked in the lock state.
It fails to provide 100uA from both PMOS and NMOS in the CP branch. This may not seem like an issue at the first glance because these two factors cancel each other out, thus not presenting any serious problems.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part1/mismatches_dc.png" alt="mismatches_dc" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 16. Excessive Current</strong></p>
</div>

<br>

However, this problem becomes clear when the F_REF and F_VCO delay offset is non-zero (e.g. ±1ns, i.e. F_VCO delay =13ns).

<div style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part1/F_VCO_delay_13ns.png" 
         alt="F_VCO_delay_13ns" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part1/F_VCO_delay_13ns_closeup.png" 
         alt="F_VCO_delay_13ns_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure 17. Excessive Current in Non-Zero Delay Offset Situations</strong></p>
</div>

<br>

As depicted in the 4th row of fig.17, it is difficult to say if the charge pump sources 100uA. Thus, we cannot dismiss the feasibility that this CP will have a non-linear functionality.

<br>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part1/dead_zone_spice.png" alt="dead_zone_spice" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 18. Delay Parameter Sweep SPICE code for CP Dead-Zone Validation</strong></p>
</div>

<br>

To check this CP function linearity, we write a new testbench for checking the CP dead zone.
With this simulation, we can utilize its output “.txt” files to create a “average charge pump current” VS “Delay Time” plot in Python. Not only does this check whether the design carries a CP dead zone but also confirms the linearity of the CP.
SPICE code is given as fig.18, which will execute a parameter sweep of F_VCO delay time from 0ns ~ 24ns with 1ns timestep. The initial “vout” node voltage is set to 0.9V accordingly to respond to both F_VCO operations in leading and lagging situations. 

<br>

<div style="text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <img src="{{site.url}}/images/pll_cp_design/part1/F_VCO_lag_10ns_1us.png" 
         alt="F_VCO_lag_10ns_1us" 
         style="width: 100%; display: block; margin: auto;" />
    <img src="{{site.url}}/images/pll_cp_design/part1/F_VCO_lag_10ns_1us_closeup.png" 
         alt="F_VCO_lag_10ns_1us_closeup" 
         style="width: 100%; display: block; margin: auto;" />
  </div>
  <p><strong>Figure.19 (Left: F_VCO is lagging by 10ns, 1us sim; Right: F_VCO is lagging by 10ns, 60ns sim)</strong></p>
</div>

<br>

One thing to note is that the transient signal runs for only 60ns, which feels too short for simulations. As the plot on the right in fig.19, when the simulation hits the first charge pump clock (approx. 0ns ~ 62.7ns), the v_out voltage already surges near the VDD. This leaves no margin for voltages in the succeeding clocks, so the following operations cannot exert the same voltage increase as they did in the first clock. Thus, they are forced to supply less than 100uA. So we capture only the action of the first clock to visualize the charge pump dead-zone behavior.
<br>
This is a matter in the voltage increment behavior of the loop filters. If we want to change this, we need to choose different loop filter parameters, as those are what create these actions. However, altering the loop filter parameter would mean that we also need alternative VCO configurations. Such measure is unnecessary because we have already configured our VCO through rigorous attempts.

<br>
After the simulation completes, we run “convert_txt_csv.py” which was introduced in the VCO design post, then we can check the CP dead zone by running a new code “current_per_delay_time.py”.  

The code for "current_per_delay_time.py" is shown below, and fig.20 is the result.

<div style="text-align: left;">
  <pre style="background: #f6f8fa; padding: 12px; border-radius: 6px; overflow-x: auto; border: 1px solid #e1e4e8; font-size: 12px; line-height: 1.5; font-family: 'Courier New', Courier, monospace;">
  <code>
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os
import matplotlib.ticker as ticker

# File paths
intervals = np.arange(-12, 13, 1)  # Delay time intervals
file_paths = [f'pfd_charge_pump_dead_zone_check_2_{i}.csv' for i in intervals]

# Extract delay times from file names
delay_times = [float(os.path.basename(path).split('_')[-1].split('.')[0]) for path in file_paths]

# Function to integrate current over time up to 50ns
def integrate_current_upto_50ns(file_path):
    data = pd.read_csv(file_path, header=None)  # Load the CSV file
    time = data[0]  # Time is in the first column
    current = data[1]  # Current is in the second column
    
    # Filter data to include only time values <= 50 ns (50e-9 seconds)
    filtered_data = data[time <= 50e-9]
    time_filtered = filtered_data[0]
    current_filtered = filtered_data[1]
    
    # Integrate current over time to get charge
    charge = np.trapz(current_filtered, x=time_filtered)  # Use time as x-axis for integration
    avg_current = charge / (time_filtered.iloc[-1] - time_filtered.iloc[0])  # Average current over time
    return avg_current

# Calculate average currents for all files
average_currents = [integrate_current_upto_50ns(file_path) for file_path in file_paths]

# Plotting "Charge Pump Current vs Delay Time" for data up to 50ns
plt.figure(figsize=(10, 6))
plt.plot(delay_times, average_currents, marker='o', linestyle='-', color='b')

# Add annotations for average current values
for x, y in zip(delay_times, average_currents):
    plt.text(x, y, f'{y:.2e}', fontsize=9, ha='right', va='bottom')

plt.xlabel("Delay Time (ns)")
plt.ylabel("Average Charge Pump Current (A) (up to 50 ns)")
plt.title("Charge Pump Current vs Delay Time (Up to 50 ns)")

# Set grid and ticks to show 1 ns intervals
plt.grid(True, which='both', linestyle='--', linewidth=0.5)
plt.xticks(np.arange(-12, 13, 1))  # Setting x-axis ticks at every 1 ns interval
plt.gca().xaxis.set_major_locator(ticker.MultipleLocator(1))
plt.gca().yaxis.set_major_locator(ticker.MaxNLocator(integer=True))

# Save the plot before showing it
plt.savefig('charge_pump_current_vs_delay_time_upto_50ns.png')

# Now show the plot
plt.show()
  </code>
  </pre>
</div>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part1/dead_zone.png" alt="dead_zone" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 20. Current VS. Delay Plot</strong></p>
</div>

<br>

This issue arises from the PMOS and NMOS current sourcing branches not sourcing the proper 100uA. 

One might think of a solution by changing the length of M13 (0.15um → 0.4um) and M14 (0.15um → 0.9um), to match the 100uA output, which is shown in fig.21.

<br>

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part1/CP_branch_resize.png" alt="CP_branch_resize" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 21. Revised Charge Pump Transistor Sizes</strong></p>
</div>

<br>

However, this contradicts DC analysis as shown in fig.22. It shows severe current mismatches between the PMOS and NMOS current branch in the operating voltage range.

<div style="text-align: center;">
  <img src="{{site.url}}/images/pll_cp_design/part1/DC_analysis_contradiction.png" alt="DC_analysis_contradiction" style="width:100%; display: block; margin: auto;" />
  <p><strong>Figure 22 DC Mismatch</strong></p>
</div>

<br>

The result proves that this CP design carries two major issues.  
First, this CP topology has immensely large transistors, especially for the current mirroring branches. Second, the CP operation is significantly non-linear. While there could be possible solutions, the natural trait of the big transistors being plagued with big parasitic capacitances limits the number of options.

<br>

*In the next post, a new topology will be suggested in nanoscale design to resolve the above two issues.*
