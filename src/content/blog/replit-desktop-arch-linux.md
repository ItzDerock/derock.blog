---
title: 'Replit Desktop App'
description: 'How to install the Replit Desktop App on Arch Linux using debtap'
pubDate: 'Jul 18, 2023'
heroImage: '/thumbs/replit-desktop-arch-linux.webp'
tags: ['replit', 'arch-linux']
---

Replit provides online IDEs and environments to develop and deploy your applications. Initially, they only offered a web-based IDE, but now they’ve released a [desktop app](https://blog.replit.com/desktop-app)! Unfortunately, this app is only available for Windows, MacOS, and Debian-based Linux distros, so users using other distributions are out of luck. Fortunately, with the power of debtap, it’s possible to repackage the Debian tarball into a pacman package for Arch Linux.

In this guide, I’ll walk you through how to install the Replit desktop app on Arch Linux. 

# Setup

To start, download the latest `.deb` from the website:

```bash
$ curl -o replit-desktop.deb https://desktop.replit.com/download/deb
```

Then install `debtap` — an application that takes apart Debian packages and repackages it for Arch Linux. debtap is available on the AUR. This guide assumes that you already have `yay` configured. 

```bash
$ yay -S debtap # Use any AUR helper.
$ sudo debtap -u # Sets up debtap (one-time)
```

# Installation

Now we can use the debtap CLI to repackage the debian package. Run debtap and let it know where the replit desktop deb file is.

```bash
$ debtap ./replit-desktop.deb
```

When it asks for the `Packager name`, just type anything. I used `Replit`. When it asks for the package license, just leave it blank and hit enter. Then just sit back and let debtap do its work. You can ignore any grep warnings. Eventually, you will see: 

```bash
:: If you want to edit .PKGINFO and .INSTALL files (in this order), press 
	(1) For vi 
	(2) For nano 
	(3) For default editor 
	(4) For a custom editor or any other key to continue:
```

debtap isn’t perfect and includes extra dependencies that add over 18GB to the installation! We can change this by editing the `.PKGINFO` file. Use any editor here, for simplicity, I suggest using nano.

When your editor opens, delete the following lines: (if some do not appear in your file, ignore it and continue to the next line)

```bash
depend = discord
depend = kde-runtime
depend = kde-cli-tools
depend = intel-oneapi-basekit
```

After making these edits, save and quit from your editor. (`CTRL` + `X`, `Y`, `↵ ENTER` for nano, `:wq` for vi/vim). If another file pops up, close it without making any edits. 

Now just let debtap finish up. Once it is done, run:

```bash
$ sudo pacman -U ./replit-0.1.4-1-x86_64.pkg.tar.zst
```

Note that your version number may be different (`0.1.4-1`). 

Press `y` when prompted and replit should be installed!

# Finishing Thoughts

Hopefully this article was helpful and you can now enjoy the Replit Cloud IDE on your personal computer. Replit has confirmed that they will only be officially supporting Debian distros for now, so please keep issues that are Arch-related out of their forums.  

If you run into any issues, feel free to join my [community](https://discord.gg/MZQN8QMJg8) discord server!
