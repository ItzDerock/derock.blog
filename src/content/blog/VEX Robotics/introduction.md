---
title: 'VEX Robotics Programming - Introduction'
description: 'Part one to a multipart series where I will be documenting my experience with VEX Robotics programming for VRC.'
pubDate: 'Mar 6, 2024'
heroImage: '/thumbs/replit-desktop-arch-linux.webp'
tags: ['vex-robotics']
---

Hello! This guide is designed to help VEX Robotics Competition (VRC) teams effectively program their robots and will introduce you to many new concepts related to motion tracking and embedded programming. While VEX offers a block-based programming language for beginners and also a python alternative, this series will focus on the text-based programming in **C++** to unlock the full potential of your robot's capabilities.

# Introduction

If you don't care who I am, [you can skip straight to the table of contents](#tableofcontents) to get started.

👋 My name is Derock from 95993A. If you are outside of Kentucky, you probably have never heard of my team, but throughout my carrer, I have won numerous VEX Think Awards (given to the best programmer) from both a regional and state level. If you are in Kentucky, you may recogonize me as the one with the movie playing robot screen: 

<video src="/videos/cars_movie_vex.mp4" controls></video>

This just one of the many things I have done with VEX, and shows you the power of programming. I hope to share my knowledge with you, and help you become a better programmer.

# Table of Contents

This guide will be broken down into multiple parts. If you already know a topic, feel free to skip it. If there is no link to a part, that means it has not been written or released yet.

1. Environment Setup: Set up your editor with a blank PROSv4 project.
2. Introduction to PROS: Learn the basics of PROS.
3. Deep dive into PROS: Learn about tasks how to write safe concurrent code.
4. Odometry: Learn how to set up a basic odometry tracking system to track robot position.
5. PID: Learn how to use PID to control your robot's movement.
6. Boomerang: Things will get a whole lot more curvey here.
7. LVGL: Learn how to draw on the screen of the V5 brain to create user interfaces.
