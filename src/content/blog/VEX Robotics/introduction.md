---
title: 'VEX Robotics Programming - Introduction'
description: 'Part one to a multipart series where I will be documenting my experience with VEX Robotics programming for VRC.'
pubDate: 'Mar 6, 2024'
heroImage: '/thumbs/replit-desktop-arch-linux.webp'
tags: ['vex-robotics']
---

One of the most integral part of a VEX Robotics Competition (VRC) team is the programming. A robot without code will not function, and while the barrier for entry has lowered now that VEX offers a block-based programming language, if you want to build something powerful, you will need to learn how to code in a text-based language.

This guide is the first part of a multipart series where I will guide you through the concepts you will need to know to program a successful VRC robot. This guide will cover topics such as Odometry, PID, Boomerang, and more. Prior knowledge to `C++` is recommended, as I will not be explaining the basics of the language.

# Introduction

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