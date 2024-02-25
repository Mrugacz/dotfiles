#!/bin/bash
# requirements: 
# - iio-sensor-proxy # accelerometer
# - detect-tablet-mode-git # detecting if device is in tablet mode

rotate-display () {
    hyprctl keyword monitor eDP-1,preferred,auto,1,transform,$1 
    hyprctl keyword device:wacom-hid-527a-pen:transform $1
    hyprctl keyword device:wacom-hid-527a-finger:transform $1
}
