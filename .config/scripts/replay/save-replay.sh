#!/bin/bash

source "$HOME/.config/scripts/replay/.env"

killall -SIGUSR1 gpu-screen-recorder
notify-send 'Instant replay' "Saving last $RECORD_TIME seconds."
