#!/bin/bash
LINK=$(echo "$USER@$HOSTNAME - $(date -u +%Y-%m-%dT%H:%M:%S)" | sha256sum | awk '{print "https://meet.jit.si/meeting-"$1}')
wl-copy "$LINK"
firefox --new-window $LINK
