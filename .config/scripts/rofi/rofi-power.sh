#!/bin/bash
SELECTION=$(echo -e "Log out\nPower off\nReboot" | rofi -dmenu -i)

case $SELECTION in
	'Log out') hyprctl dispatch exit;;
	'Power off') poweroff;;
	Reboot) reboot;;
	*) echo 'no option was selected';;
esac
