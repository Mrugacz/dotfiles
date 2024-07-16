#!/bin/bash

source "$HOME/.config/scripts/replay/.env"

if [[ $(ps aufx | grep gpu-screen-recorder | grep -vc grep) -eq 0 ]]; then
	notify-send --icon='record-desktop' 'Instant replay' "Replay service is not running."
else
	killall -SIGUSR1 gpu-screen-recorder
	#  notify-send --icon='green-recorder' 'Instant replay' "Saving last $RECORD_TIME seconds."
fi
