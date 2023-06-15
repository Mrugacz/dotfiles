#!/bin/bash
# requirements: 
# - iio-sensor-proxy # accelerometer
# - detect-tablet-mode-git # detecting if device is in tablet mode

source $HOME/.config/scripts/hypr/common.sh

monitor-sensor --accel | while read -r line; do
    if [[ `cat /tmp/.lid-state` == 'tablet' ]]; then
        if echo "$line" | grep -q "Accelerometer orientation changed"; then
            ORIENTATION=$(echo "$line" | awk '{print $NF}')
            case "$ORIENTATION" in 
                normal) 
                    rotate-display 0
                ;;
                left-up) 
                    rotate-display 1
                ;;
                bottom-up) 
                    rotate-display 2
                ;;
                right-up) 
                    rotate-display 3
                ;;
            esac
        fi
    fi
done
