### ~/.bashrc
# If not running interactively, don't do anything
[[ $- != *i* ]] && return

### ENV
# set qt theme to kvantum
QT_QPA_PLATFORMTHEME=kvantum
# SSH Agent 
export SSH_AUTH_SOCK="$XDG_RUNTIME_DIR/keyring/ssh"

### ALIASES
# hosts
alias hosts='sudo nvim /etc/hosts'
# python
alias py='python'
# git
# git add
alias ga='git add'
# git add all
alias gaa='git add -A'

alias y='yay -Syu --devel'
yy ()
{
    yay -Syyu --devel --noconfirm
    hyprctl dispatch hyprload update
}
# commit & push
gp () 
{
	git commit -m "$1"
	git push
}

### SETTINGS
# prompt
PS1='┌─\[\033[1;36m\]\u\[\033[0;37m\]@\[\033[1;36m\]\h\[\033[0;37m\]:$PWD\n└\[\033[37m\]\$ '
# autocd
shopt -s autocd

# downloads
if [[ ! -e /tmp/downloads ]]; then mkdir /tmp/downloads; fi

source ~/.ssh/aliases.sh

export PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/lib/jvm/default/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl:/home/kuba/.local/bin
alias config='/usr/bin/git --git-dir=/home/kuba/git/dots/.cfg/ --work-tree=/home/kuba'
