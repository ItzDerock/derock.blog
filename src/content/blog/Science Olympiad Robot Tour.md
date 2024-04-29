---
title: 'Science Olympiad - Robot Tour'
description: 'Brief overview over how I created and programmed a robot for the 2024 Science Olympiad Robot Tour competition.'
pubDate: 'April 29, 2024'
heroImage: '/thumbs/scioly-robot-tour-2024.webp'
tags: ['robotics']
---

Science Olympiad's Robot Tour throws down a gauntlet: navigate a maze-like track, unseen until competition day, while trying to
get a time as close as possible to what the judges request. Sounds simple... right? Well, turns out there's a lot that goes into
this problem. In this post, I'll detail my approach to this competition.

# 1. Tracking the robot

First, the robot needs to know where it is in the field so it can navigate around. This calls for a concept known as Odometry.
I'm not going to go into a ton of detail in this post about how odometry works and the math behind it all (it's very cool!). If
you're interested, I'd highly recommend checking out [this
article](https://medium.com/@nahmed3536/wheel-odometry-model-for-differential-drive-robotics-91b85a012299) by Ahmed.

For wheel odometry to work, we need two tracking wheels and a way to know the heading of the robot. A tracking wheel is
basically a wheel that knows how much it has turned, we can use an encoder for that job. A quick google search for a motor with
an encoder yielded me the following: Adafruit's [Geared DC Motor with Magnetic Encoder Outputs](https://www.adafruit.com/product/4416).

Next, we need a way for the robot to know which way it is facing. Another google search later, and I found the [MPU9250](https://www.amazon.com/HiLetgo-Gyroscope-Acceleration-Accelerator-Magnetometer/dp/B01I1J0Z7Y).
