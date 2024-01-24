#!/bin/bash

notify-send 'Instant replay' 'Stopping replay service.'
kill $(ps aufx | grep .config/scripts/replay.sh  | head -1 | awk '{print $2}')
