#!/bin/bash

source "$HOME/.config/scripts/replay/.env"

notify-send --icon='video-display' 'Instant replay' 'Replay service started.'

# gpu-screen-recorder -k h264 -w screen -f $FRAMERATE -a "$(pactl get-default-sink).monitor|$(pactl get-default-source)" -o $FILE_PATH -c mp4 -r $RECORD_TIME
gpu-screen-recorder -k h264 -w screen -f $FRAMERATE -a "$(pactl get-default-sink).monitor|$(pactl get-default-source)" -sc "$HOME/.config/scripts/replay/rename.sh" -o $FILE_PATH -c mp4 -r $RECORD_TIME
