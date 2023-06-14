#!/bin/bash
#  TODO: clean up this spaghetti 

### ~/.bashrc
# If not running interactively, don't do anything
[[ $- != *i* ]] && return

### ENV
# SSH Agent 
export SSH_AUTH_SOCK="$XDG_RUNTIME_DIR/keyring/ssh"
# EDITOR
export EDITOR=nvim

### ALIASES
# hosts
alias hosts='sudo nvim /etc/hosts'
# python
alias py='python'

# GIT
# git add
alias ga='git add'
# git add all
alias gaa='git add -A'
# commit & push
gp () 
{
	git commit -m "$1"
	git push
}

# basic shell
alias ls='exa'
alias ll='exa -lah'
alias cat='bat -pP'
alias vim='nvim'

# host
alias a='host -ta'
alias mx='host -tmx'
alias ns='host -tns'
dhost ()
{
    host $(host -t a $1 | awk '{print $NF}' )
}

# YAY
alias y='yay -Syu --devel'
yy ()
{
    yay -Syyu --devel --noconfirm
    hyprctl dispatch hyprload update
}

### SETTINGS
# prompt
PS1='┌─\[\033[1;36m\]\u\[\033[0;37m\]@\[\033[1;36m\]\h\[\033[0;37m\]:$PWD\n└\[\033[37m\]\$ '

# autocd
shopt -s autocd

# downloads
if [[ ! -e /tmp/downloads ]]; then 
    mkdir /tmp/downloads
fi

source ~/.ssh/aliases.sh

alias config='/usr/bin/git --git-dir=/home/kuba/git/dotfiles --work-tree=/home/kuba'
