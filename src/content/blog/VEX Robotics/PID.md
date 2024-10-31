---
title: 'VEX Robotics Programming - PID'
description: 'PID is one of the most fundamental feedback control systems used in robotics. This guide will teach you what it is, how it works, and how to implement it in your VEX Robotics Competition robot.'
pubDate: 'July 18, 2024'
heroImage: '/thumbs/vex-robotics-prog-intro.webp'
tags: ['vex-robotics']
---
-# This post assumes you have working odometry on your robot.

PID is the most fundamental and versitile algorithm you can learn for Robotics. If you're building your autonomous routine and want to tell the robot 'move 3 feet forward', how would you approach that? The naive approach would be to set the motors to full power and wait a few seconds or wait until the odometry data tells you the robot has moved 3 feet. But this approach is often inconsistent —  if your drivetrain isnt *perfectly* even, the robot will drift to the side, or the robot will overshoot your target. This is where PID comes in.

PID is a *control algorithm*, a mathmatical way to control the output of a system given a criteria. PID consists of three distinct parts that work together. The P stands for Proportional, I stands for Integral, and D stands for Derivative. If you haven't taken a calculus course yet, those words may sound scary, but don't worry, I'll explain everything.

And to make this more visual, I've created a mini PID visualization that you can play around with:
[VISAID here]

### To get started, lets define two variables:
- $\text{Setpoint}$ - the target position of the system (the robot)
- $\text{Error}$ - how far away the system is from the setpoint

# **P**ID - Proportional
Recall that proportional in math means corresponding in size, or having a constant ratio. Let's look at the graph of $y = \frac12 x$,
<center>
<iframe src="https://www.desmos.com/calculator/pp4vl35pwf?embed" width="500" height="300" style="border: 1px solid #ccc; margin-bottom: 1rem" frameborder=0></iframe>
</center>

As $x$ increases here, you see that $y$ increases at a constant rate of $\frac{1}{2}$. We call that $k$ or the constant of proportionality. In a PID system, since there's multiple constants (that will be introduced in later sections), we call it $kP$ to denote that it's for the P part of the algorithm.

In PID, the $x$ is the $\text{Error}$, and the $y$ is the system output (aka the power to give the motors). So the further you are, the more power, and as you approach the setpoint, the error decreases resulting in the robot slowing down.

[VISAID here
    kP = 1
    kI = 0
    kD = 0
]

Now, let's implement this:

```cpp
int PID:update(float error) {
    // y = kx, where k is the constant, x is the error:
    float p = this->kP * error;
    // our PID currently has no other parts, so just return this:
    return p;
}
```

# P**I**D - Integral
Integrals in calculus mean the *area under a curve*.

<center>
<iframe src="https://www.desmos.com/calculator/nbzqmb313x?embed" width="500" height="300" style="border: 1px solid #ccc; margin-bottom: 1rem;" frameborder=0></iframe>
</center>

In the above graph, the function is graphed in red. The area under that curve is marked with blue. If you wanted to find the area under this curve, you would have to do some funky integrals, but none of that is required for PID. Instead, we can approximate the area by using small rectangles, called a riemmens sum.

# Summary
- P = Proportional, and acts proportionally to the error governed by the $kP$ constant.
- I = Integral, and acts with the buildup of error over time, governed by the $kI$ constant. Limited by the $I_max$ constant.
- D = Derivative, and acts with the change of error over a short interval, governed by the $kD$ constant.
