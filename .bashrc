#!/bin/bash
# If not running interactively, don't do anything
[[ $- != *i* ]] && return

### ENV
# SSH Agent
export SSH_AUTH_SOCK="$XDG_RUNTIME_DIR/gcr/ssh"
# EDITOR
export EDITOR=nvim
export VISUAL=nvim
export PATH="/usr/lib/ccache/bin/:$PATH"

### ALIASES
# hosts
alias hosts='sudo nvim /etc/hosts'
# python
alias py='python'

# basic shell
alias ls='exa'
alias ll='exa -lah'
alias cat='bat -pP'
alias vim='nvim'

# host
alias a='host -ta'
alias mx='host -tmx'
alias ns='host -tns'
alias txt='host -ttxt'

alias vw='vim ~/git/website/content/'

dhost() {
	host "$(host -t a "$1" | awk '{print $NF}')"
}

### SETTINGS
# prompt
PS1='\[\e[1m\][\[\e[0;92m\]\H\[\e[0;1m\]]\[\e[0m\]:$PWD \[\e[90;2m\]$(git branch 2>/dev/null | grep '"'"'*'"'"' | colrm 1 2)\n\[\e[0m\]\$ '

# autocd
shopt -s autocd

# history

HISTTIMEFORMAT="%d/%m/%Y %H:%M - "
HISTSIZE=10000
HISTFILESIZE=10000
HISTCONTROL=ignoredups

shopt -s histappend
shopt -s cmdhist

source ~/.ssh/aliases.sh

alias config='/usr/bin/git --git-dir=/home/kuba/git/dotfiles --work-tree=/home/kuba'
alias cs='config status'
alias ca='config add'
alias cm='config commit -m'

#  bind -x '"\C-r": eval "$(grep -v "^#" ~/.bash_history* | grep -v "^#"| fzf --tac | cut -d ":" -f2-)"'
