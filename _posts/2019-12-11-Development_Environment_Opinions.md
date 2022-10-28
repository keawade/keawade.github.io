---
title: "Development Environment Opinions"
date: "2019-12-11"
slug: "2019-12-11-Development_Environment_Opinions"
excerpt: "An opinionated list of software I like enough to recommend."
ogImage:
  url: ""
---

This is a collection of software I've used that I have found useful or neat. I've included install instructions for macOS but if you're on linux, finding other ways to install this software shouldn't be difficult.

## Homebrew

[https://brew.sh/](https://brew.sh/)

Homebrew is a package manager for macOS. It has some annoyances but has the largest package base and community around it.

```shell
# Install brew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

## fish

[https://fishshell.com/](https://fishshell.com/)

The `fish` shell provides a modern take on the shell and has some great documentation.

```shell
# Install fish
brew install fish
# Add fish to the list of available shells
echo /usr/local/bin/fish | sudo tee -a /etc/shells
# Set your shell to fish
chsh -s /usr/local/bin/fish
```

## Node Version Manager

[https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm#node-version-manager---)

POSIX-compliant bash script to manage multiple active node.js versions.

```shell
# Install nvm
# Note: Don't install this via brew as it doesn't work as of the time of writing.
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

# Install fast-nvm-fish
# Only needed for fish
curl -sSL https://raw.githubusercontent.com/brigand/fast-nvm-fish/master/nvm.fish > ~/.config/fish/functions/nvm.fish

# Install node and npm via nvm
nvm install 10
nvm use 10
```

You may also need to add a line to your configs:

```shell
# ~/.config/fish/config.fish or ~/.zshrc or ~/.bashrc
nvm use 10
```

## coreutils

[https://www.gnu.org/software/coreutils/coreutils.html](https://www.gnu.org/software/coreutils/coreutils.html)

The `coreutils` brew formulae contains GNU file, shell, and text utilities. The default utils provided by macOS have some shortcomings and idiosyncrasies that don't exist in the canonical GNU utilities.

```shell
# Install coreutils
brew install coreutils
```

You will need to update your `PATH` and `MANPATH` variables to tell macOS to use the new utils over the macOS utils:

```shell
# ~/.config/fish/config.fish
set PATH /usr/local/opt/coreutils/libexec/gnubin $PATH
set MANPATH /usr/local/opt/coreutils/libexec/gnuman $MANPATH

# ~/.zshrc or  ~/.bashrc
export PATH="$(brew --prefix coreutils)/libexec/gnubin:/usr/local/bin:$PATH"
```

## thefuck

[https://github.com/nvbn/thefuck](https://github.com/nvbn/thefuck#the-fuck-----)

`thefuck` is one of the most useful command line utilities I have found.

```shell
# Install thefuck
brew install thefuck
```

You will need to configure it before use as well:

```shell
# ~/.config/fish/config.fish
thefuck --alias | source
# ~/.zshrc or  ~/.bashrc
eval "$(thefuck --alias)"
```

I would also recommend adding an alias ;)

```shell
# Be more polite
alias f='fuck'
```

## starship

[https://github.com/starship/starship](https://github.com/starship/starship)

Starship is a minimal, fast, and extremely customizable prompt for any shell.

```shell
brew install starship
```

You will need to configure your shell to use starship:

```shell
# ~/.config/fish/config.fish
starship init fish | source
# ~/.zshrc
eval "$(starship init zsh)"
# ~/.bashrc
eval "$(starship init bash)"
```

## VSCodium

[https://github.com/VSCodium/vscodium](https://github.com/VSCodium/vscodium#vscodium)

VSCodium is a build of VSCode that strips out all of Microsoft's telemetry.

```shell
# Install vscodium
brew cask install vscodium

# Can still be launched from cli like this:
code ~/foo.txt
```

## FiraCode

[https://github.com/tonsky/FiraCode](https://github.com/tonsky/FiraCode#fira-code-monospaced-font-with-programming-ligatures)

FiraCode is a nice monospace font with ligatures.

```shell
# Install FiraCode
brew tap homebrew/cask-fonts
brew cask install font-fira-code
```

You will also need to configure Visual Studio Code:

```json
// settings.json
{
    // Use the font
    "editor.fontFamily": "Fira Code",
    // Use the font ligatures
    "editor.fontLigatures": true,
}
```

## exa

[https://github.com/ogham/exa](https://github.com/ogham/exa#exa-)

`exa` attempts to be a more featureful, more user-friendly version of `ls`.

```shell
brew install exa
```

You can replace `ls` with `exa` with an alias in your config file:

```shell
# ~/.config/fish/config.fish or ~/.zshrc or ~/.bashrc
alias ls='exa'
```

## bat

[https://github.com/sharkdp/bat](https://github.com/sharkdp/bat)

A `cat` clone with syntax highlighting and Git integration.

```shell
# Install bat
brew install bat
```

Again, we can replace `cat` with `bat` with an alias:

```shell
# ~/.config/fish/config.fish or ~/.zshrc or ~/.bashrc
alias cat='bat'
```

## fd

[https://github.com/sharkdp/fd](https://github.com/sharkdp/fd#fd)

`fd` is a simple, fast and user-friendly alternative to [`find`](https://www.gnu.org/software/findutils/).

```shell
# Install fd
brew install fd
```

```shell
# ~/.config/fish/config.fish or ~/.zshrc or ~/.bashrc
alias find='fd'
```

## tldr

[https://github.com/dbrgn/tealdeer](https://github.com/dbrgn/tealdeer#tealdeer)

A collection of simplified and community-driven man pages.

```shell
# Install tldr
brew install tealdeer

# Use like man
tldr node
```

## htop

[https://hisham.hm/htop/](https://hisham.hm/htop/)

A terminal based process/task manager for unix systems.

```shell
# Install htop
brew install htop
```

## git

Git comes on macOS by default but it isn't updated very frequently. You can install the latest git with brew:

```shell
# Install git
brew install git
```

## Mark Text

Mark Text is a markdown based notes application. I like having my markdown notes separate from my VSCode instances.

I used Mark Text to write this article. :D

```shell
# Install Mark Text
brew cask install mark-text
```
