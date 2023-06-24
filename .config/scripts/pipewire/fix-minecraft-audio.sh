#!/bin/bash
# for some unknown reason MC detects a random, disabled audio device as "system default"
# this fixes it

# just add it as a wrapper command or sth in the launcher

# left channel
pw-link alsoft:channel_1 bluez_output.90_7A_58_D5_E2_7B.1:playback_FL
# right channel
pw-link alsoft:channel_2 bluez_output.90_7A_58_D5_E2_7B.1:playback_FR
