#!/bin/bash

notify-send --icon='video-display' 'Instant replay' 'Stopping replay service.'
killall gpu-screen-recorder
