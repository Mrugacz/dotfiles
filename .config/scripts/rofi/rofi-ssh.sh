#!/bin/bash
# should work with dmenu
# fix gnome keyring
export SSH_AUTH_SOCK="$XDG_RUNTIME_DIR/gcr/ssh"
SERVER=$(echo -e "mrugacz.xyz\nc1872.lh.pl\nvoron.mrugacz.xyz\nvps.mrugacz.xyz" | rofi -dmenu)

TERMCMD='kitty -e ssh'

case $SERVER in 
	mrugacz.xyz) $TERMCMD mrugacz.xyz ;;
	c1872.lh.pl) $TERMCMD c1872.lh.pl ;;
	voron.mrugacz.xyz) $TERMCMD voron.mrugacz.xyz ;;
	vps.mrugacz.xyz) $TERMCMD vps.mrugacz.xyz
esac
