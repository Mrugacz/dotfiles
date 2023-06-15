#!/bin/bash
# requirements: 
# - iio-sensor-proxy # accelerometer
# - detect-tablet-mode-git # detecting if device is in tablet mode

source $HOME/.config/scripts/hypr/common.sh

if [ $# -lt 1 ]; then
    echo "Usage: $0 <command>"
    exit 1
fi

MODE=$1

case $MODE in
    tablet)
        echo tablet > /tmp/.lid-state # unlock rotation

        #  TODO: change bar
        ;;
    laptop)
        echo laptop > /tmp/.lid-state # lock rotation
        
        rotate-display 0 

        #  TODO: change bar
        ;;
    *)
        echo -e "Unknown mode."
        ;;
esac
