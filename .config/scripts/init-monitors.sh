#!/bin/bash
# wait for monitors to get detected
sleep 0.5
# get all connected monitors
monitors=(`xrandr -q | awk '/ connected/ {print $1}'`)

# kill existing sxhkd session
killall sxhkd
# start sxhkd again
pgrep -x sxhkd > /dev/null & disown || sxhkd &
# initialize monitors
if [[ ${#monitors[@]} -eq 1 ]]; then
	sxhkd -c ~/.config/sxhkd/single-monitor.conf &
else
	sxhkd -c ~/.config/sxhkd/multi-monitor.conf &
fi

# remove disconnected monitors
for i in `bspc query -M --names`; do 
	if [[ ! `xrandr | grep "^$i connected"` ]]; then 
		bspc query -N -m $i | xargs -i bspc node {} -d "eDP1:^1"
		bspc monitor $i --remove
	fi 
done

# add desktops 1-5 to all connected monitors
for monitor in ${monitors[@]}; do 
	bspc monitor $monitor -d 1 2 3 4 5
done

# launch polybar
~/.config/scripts/polybar/init.sh &
