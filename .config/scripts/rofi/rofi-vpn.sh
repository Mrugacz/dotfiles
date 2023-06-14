#!/bin/bash
WIDTH=$(($(nmcli con | grep vpn | awk '{if ($4 !="--") print $1" (active)"; else print $1}' | sort | head -1 | wc -c) + 8))
LINES=$(nmcli con | grep vpn | awk '{if ($4 !="--") print $1" (active)"; else print $1}' | wc -l)
SELECTION=$(nmcli con | grep vpn | awk '{if ($4 !="--") print $1" (active)"; else print $1}' | rofi -dmenu -i -theme-str "window {width: "$WIDTH"ch;} listview {lines: "$LINES";}")

if [[ -z "$SELECTION" ]]; then
	echo "no option was selected"
elif [[ ! $(echo $SELECTION | grep ' (active)') ]]; then
	nmcli con up id $SELECTION
else
	nmcli con down id $(echo $SELECTION | sed 's/ (active)//g')
fi
