#!/bin/bash

is_fullscreen=$(hyprctl activewindow -j | jq -r '.fullscreen')
if [ "$is_fullscreen" -eq 0 ]; then
    window_name="Desktop"
else
    #window_name=$(hyprctl activewindow -j | jq -r '.initialTitle' | tr -cd '[:alnum:]_. -')
    window_name=$(hyprctl activewindow -j | jq -r '.title' | tr -cd '[:alnum:]_. -')
fi

video_directory="/home/$(whoami)/Videos/Captures/$window_name"
mkdir -p "$video_directory"

filename="$(date +%Y-%m-%d_%H-%M-%S).mp4"
video_file="$video_directory/$filename"
echo "Saving replay from $window_name to $video_file"
mv "$1" "$video_file" && notify-send --icon='green-recorder' 'Instant replay' "Saving replay from $window_name as:\n $window_name/$filename"
