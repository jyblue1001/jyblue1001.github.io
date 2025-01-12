---
title: "Designing a 2.4GHz Phased Locked Loop with Open-Source EDA tools"
date: 2024-11-01 10:00:00 +0000
categories: [Analog Design, PLL]
tags: [PLL, skywater130, OSIC, analog-design]
description: "Detailed log of designing a 2.4 GHz Phased Locked Loop using Skywater130 PDK with open-source tools, covering every step, mistake, and learning."
pin: true
comments: true
---

## Before Starting…
The objective of this project was an attempt for me to solely adventure the analog chip design process of a PLL without any help from professors or other senior colleagues. The project was executed in open source to show that anyone could do analog designs with the help of free tools that can be run on their very own personal PC.  
  
In this blog, I will try to describe the entire design process as truly as possible. Listing all the rigorous mistakes and speculations I’ve made through the process, followed with reasons for attempting such actions. Note that all the final decisions were made solely by myself after many hours of speculation. So, it hasn’t been approved by anyone else to guarantee the clarity of these attempts, but as of that, I will try to persuade why I choose these decisions to the fullest.  
  
I believe posting these mistakes will help future viewers who visit this blog by providing realistic advices that can be only realized when tackling actual design considerations.  

---

## What This Blog Covers
**Design Flow**: A thorough breakdown of the entire process, including all mistakes and design considerations in makeing a 2.4 GHz PLL  
   
 **Part 1**: Determining the PLL specs and simulation of its schematicss (Complete)  
 **Part 2**: Layout, DRC, extraction, LVS, and Post-layout simulations (In Progess...)  

<img src="{{site.url}}/images/analog_circuit_design_flow.png" alt="Analog Circuit Design Flow" style="display: block; margin: auto;" />


---


## Table of Contents

1. Introduction  
   a. [Objective]({{ site.url }}{{ site.baseurl }}/posts/pll-introductions/#1a-objective-designing-a-24ghz-phased-locked-loop-with-open-source-materials-using-the-skywater130-pdk)  
   b. [Design Considerations]({{ site.url }}{{ site.baseurl }}/posts/pll-introductions/#1b-design-considerations)  
   c. [Order of the Designs]({{ site.url }}{{ site.baseurl }}/posts/pll-introductions/#1c-order-of-the-designs)  

2. Part 1 (Completed)  
   a. [PLL Design Parameters]  
   b. [VCO]  
   c. [Loop Filter]  
   d. [Frequency Phase Detector]  
   e. [Charge Pump]  
   f. [Frequency Divider]  
   g. [Full PLL]  

3. Part 2 (In Progress)


---


## Things You Need to Know
This project relies on key concepts from:
- **Design of Analog CMOS Integrated Circuits, 2nd Edition – Razavi [1]**
  - Mandatory Chapters: CH15, 16
  - Recommended: CH5, 7, 13
- **Design of CMOS Phase-Locked Loops: From Circuit Level to Architecture Level, 1st Edition – Razavi [2]**
  - Mandatory Chapters: CH3, 7, 8, 9, 15

I’ve pointed out the chapters that are mandatory to comprehend the best of these posts. If time allows you so, other chapters in [1] such as CH5, 7, 13 are recommend as well.
  
Without honing the concepts covered in those chapters, you will struggle to understand many of the core concepts such as **loop filters considerations**, and **Kvco** in VCOs.
I will mention additional materials in the post if any other concepts need to be introduced throughout the design.


---
## Which open-source material?
Here are the main open-source tools and resources I used for this project:

  [Xschem (schematics)](https://xschem.sourceforge.io/stefan/index.html)  
  [Ngspice (simulations)](https://ngspice.sourceforge.io/)  
  [Magic VLSI (layout)](https://opencircuitdesign.com/magic/)
  [Netgen (netlist comparison, LVS)](https://opencircuitdesign.com/netgen/)
  [Skywater130 PDK (Process Design Kit)](https://skywater-pdk.readthedocs.io/en/main/)


> **IMPORTANT**  
>
> - **NOTE 1**: This post is a DESIGN LOG and does not cover instructions on how to use these tools. Instead, below are some great YouTube playlist and video that helped me greatly in self-teaching these tools  
>   [Xschem, Ngspice, Magic tutorial](https://www.youtube.com/playlist?list=PLgsDG5BJZpBTEUaxjfvYUiMPpUPU_vQpr) and [Xschem tutorial](https://www.youtube.com/watch?v=bYbkz8FXnsQ).
> - **NOTE 2**: Going through the actual configuration process for these EDA tool environments is already an obstacle itself. As a solution, check out this blog, which breaks down the steps to make it super easy to deal with.  
>   [Setting Up Open Source Tools with Docker](https://kwantaekim.github.io/2024/05/25/OSE-Docker/)  

*Follow along as I tackle the complexities of analog design with an open mind and hands-on approach!*