#!/bin/bash
# kill all polybar instances
killall polybar

# get primary display
primary=$(xrandr | grep ' connected primary ' | awk '{print $1}')

# get rest of connected displays
additional=$(xrandr | grep ' connected ' | grep -v primary | awk '{print $1}')

# launch polybar on all primary display
MONITOR=$primary polybar --reload bottom &
MONITOR=$primary polybar --reload top-main &

# launch polybar on remaining displays
for monitor in ${additional[@]}; do
	echo $monitor
	MONITOR=$monitor polybar --reload bottom &
	MONITOR=$monitor polybar --reload top &
done
