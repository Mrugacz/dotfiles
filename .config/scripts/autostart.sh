#!/bin/bash
# configure xrandr
~/.config/scripts/xrandr.sh &
# configure monitors for bspwm
~/.config/scripts/init-monitors.sh &

# start compositor
picom -b --experimental-backend

# restore wallpaper
nitrogen --restore

# start keyring for ssh-agent
gnome-keyring-daemon > /dev/null & disown

# start polkit agent
/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 > /dev/null & disown

# TODO: rtfm and set it up properly
#redshift -t 5700:3600 > /dev/null
# use correct cursor
xsetroot -cursor_name left_ptr
nm-applet
