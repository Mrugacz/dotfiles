#!/bin/bash

gpu-screen-recorder -w screen -f 60 -a "$(pactl get-default-sink).monitor|$(pactl get-default-source)" -o ~/Videos -c mp4 -r 30
