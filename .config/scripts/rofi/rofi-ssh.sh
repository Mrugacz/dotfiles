#!/bin/bash
# should work with dmenu
# fix gnome keyring
export SSH_AUTH_SOCK="$XDG_RUNTIME_DIR/gcr/ssh"
SERVER=$(echo -e "mrugacz.xyz\nc1872.lh.pl\nvoron.mrugacz.xyz\nvps.mrugacz.xyz\nhetzner-backup" | rofi -dmenu)

case $SERVER in
mrugacz.xyz) kitty -e ssh mrugacz.xyz ;;
c1872.lh.pl) kitty -e ssh c1872.lh.pl ;;
voron.mrugacz.xyz) kitty -e ssh voron.mrugacz.xyz ;;
vps.mrugacz.xyz) kitty -e ssh vps.mrugacz.xyz ;;
hetzner-backup) kitty -e ssh hetzner-backup ;;
esac
