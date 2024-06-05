#!/bin/bash
# requirements: 
# - iio-sensor-proxy # accelerometer
# - detect-tablet-mode-git # detecting if device is in tablet mode

rotate-display () {
    hyprctl keyword monitor eDP-1,preferred,auto,1,transform,$1 
    hyprctl keyword input:tablet:transform $1
    hyprctl keyword input:touchdevice:transform $1
}
