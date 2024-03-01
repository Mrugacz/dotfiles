#!/bin/bash
SELECTION=$(echo -e "Log out\nPower off\nReboot\nUEFI" | rofi -dmenu -i)

case $SELECTION in
	'Log out') hyprctl dispatch exit;;
	'Power off') poweroff;;
	Reboot) reboot;;
    UEFI) systemctl reboot --firmware-setup;;
	*) echo 'no option was selected';;
esac
