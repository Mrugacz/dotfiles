#!/bin/bash
connected=$(xrandr | grep ' connected' | awk '{print $1}' | sort | xargs)

smname=$(xrandr | grep ' connected' | grep -v eDP1 | awk '{print $1}' | head -1)
smwidth=$(xrandr | grep $smname -A1 | tail -1 | awk '{print $1}' | awk -Fx '{print $1}') 
smheight=$(xrandr | grep $smname -A1 | tail -1 | awk '{print $1}' | awk -Fx '{print $2}') 

if [[ $connected == 'DisplayPort-0 DisplayPort-1 DisplayPort-2' ]]; then 
	# this exact config is most likely my desktop pc
	xrandr --output DisplayPort-1 --primary --mode 3440x1440 --pos 1080x0 --rotate normal \
		--output DisplayPort-0 --mode 1920x1080 --pos 4520x180 --rotate normal \
		--output HDMI-A-0 --off \
		--output DisplayPort-2 --mode 1920x1080 --pos 0x0 --rotate left
elif [[ $connected == 'eDP1' ]]; then
	xrandr --output eDP1 --primary --mode 1920x1080 --rotate normal \
		--output DP1 --off \
		--output DP2 --off \
		--output HDMI1 --off \
		--output HDMI2 --off \
		--output VIRTUAL1 --off
elif [[ $smwidth -eq 1920 ]]; then
	xrandr --output eDP1 --mode 1920x1080 --pos 0x"$smheight" --rotate normal \
		--output $smname --primary --mode "$smwidth"x"$smheight" --pos 0x0 --rotate normal
elif [[ $smwidth -gt 1920 ]]; then
	posx=$(( ($smwidth - 1920)/2 ))
	xrandr --output eDP1 --mode 1920x1080 --pos "$posx"x"$smheight" --rotate normal \
		--output $smname --primary --mode "$smwidth"x"$smheight" --pos 0x0 --rotate normal
elif [[ $smwidth -lt 1920 ]]; then
	posx=$(( (1920 - $smwidth)/2 ))
	xrandr --output eDP1 --mode 1920x1080 --pos 0x"$smheight" --rotate normal \
		--output $smname --primary --mode "$smwidth"x"$smheight" --pos "$posx"x0 --rotate normal
else
	~/.screenlayout/startup.sh
fi
