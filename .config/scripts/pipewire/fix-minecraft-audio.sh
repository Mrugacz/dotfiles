#!/bin/bash
# for some unknown reason MC detects a random, disabled audio device as "system default"
# this fixes it

while true; do
    if pw-link -o | grep alsoft > /dev/null; then 
        echo found
        # left channel
        pw-link alsoft:channel_1 bluez_output.90_7A_58_D5_E2_7B.1:playback_FL
        # right channel
        pw-link alsoft:channel_2 bluez_output.90_7A_58_D5_E2_7B.1:playback_FR
        sleep 60
    else
        echo waiting
        sleep 5
    fi
done

