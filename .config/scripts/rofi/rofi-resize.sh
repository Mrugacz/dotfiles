#!/bin/bash

SELECTION=$(echo -e "Balance\nYT (cinema mode)\nYT (default)\n16:9\n4:3\n1:1\n2:1\n1:2" | rofi -dmenu -i)

getratio () {
	if [[ `echo $1 | grep -P '^\\d+:\\d+$'` ]]; then
		echo "Setting aspect ratio to: $1"
		bspr $1
	else
		echo "Incorrect aspect ratio."
	fi
}

case $SELECTION in
	'Balance') bspc node @focused:/ -B;;
	'YT (cinema mode)') bspr 1922:1366;;
	'YT (default)') bspr 999:1366;;
	'16:9') bspr 16:9;;
	'4:3') bspr 4:3;;
	'1:1') bspr 1:1;;
	'2:1') bspr 2:1;;
	'1:2') bspr 1:2;;
	*) getratio $SELECTION;;
esac
