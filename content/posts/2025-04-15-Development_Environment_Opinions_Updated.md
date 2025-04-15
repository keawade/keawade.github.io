---
title: New and Improved Development Environment Opinions ✨
date: 2025-04-15
slug: 2025-04-15-Development_Environment_Opinions
summary: An opinionated list of software I like enough to recommend.
draft: true
---

It's been a few years since I wrote my previous post, [Development Environment
Opinions][previous-post], and I've found new things, refined my tastes, etc. So
here are my _new and improved_ development environment opinions!

<!-- more -->

## Operating system

I love Linux. If I could wave a magic wand and update corporate IT policies I
would use [Fedora Silverblue][fedora-silverblue] for my professional work. It's
stable, performant, and atomic.

In the meantime macOS has been good enough for development. It's generally
stable and performant but they've been taking notes from [Microsoft's theory of
consent][ms-consent] over the years which is really annoying.

Windows [is right out][monty-python-right-out].

## Ghostty

<https://ghostty.org/>

Terminal emulators just keep getting better and better. Ghostty is the latest
and greatest currently. Also love that it's available cross platforms so I don't
have to maintain as much macOS vs Linux stuff in my dotfiles.

## Homebrew

<https://brew.sh/>

Homebrew is a package manager for macOS. I have some quibbles with it and there
are more modern ones around nowadays but it works, has all the things I need,
and I don't have to think about it now.

## fish

<https://fishshell.com/>

Fish does most of the basic things I have come to expect from a terminal right
out of the box.

I used `bash` and then `zsh` for years while accruing an ever growing list of
plugins for basic functionality that ended up slowing the start time. When I
looked into improving my setup's performance I noticed several of my primary
plugins were reimplementing functionality from `fish`. I tried `fish` and pretty
much never looked back.

I use the [`fisher` plugin manager from Jorge Bucaran][fish-fisher]. Check out
[my dotfiles for a list of plugins I use][dotfiles-fish-plugins].

## Neovim

<https://neovim.io/>

Performant, customizable, open source.

[previous-post]: /posts/2019-12-11-development-environment-opinions
[fedora-silverblue]: https://fedoraproject.org/atomic-desktops/silverblue/
[ms-consent]:
  https://hachyderm.io/@AnarchoCatgirlism@kitsunes.gay/114260042656271952
[monty-python-right-out]: https://youtu.be/xOrgLj9lOwk?si=f1v9Mf0xsICMsGRR&t=82
[fish-fisher]: https://github.com/jorgebucaran/fisher
[dotfiles-fish-plugins]:
  https://github.com/keawade/dotfiles/blob/main/.config/fish/fish_plugins
