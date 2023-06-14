#!/bin/bash
# Requirements:
# - swaylock-effects
#
swaylock \
    --screenshots --clock --indicator-idle-visible \
	--indicator-radius 100 \
	--indicator-thickness 10 \
	--ring-color 1a1b26 \
	--key-hl-color c0caf6 \
    --bs-hl-color 283457 \
    --caps-lock-bs-hl-color c0caf5 \
    --caps-lock-key-hl-color e0af68 \
	--text-color c0caf5 \
	--line-color 00000000 \
	--inside-color 00000088 \
	--ring-wrong-color f7768e \
	--text-wrong-color c0caf5 \
	--line-wrong-color 00000000 \
	--inside-wrong-color 00000088 \
	--ring-ver-color 7aa2f7 \
	--text-ver-color c0caf5 \
	--line-ver-color 00000000 \
	--inside-ver-color 00000088 \
	--ring-clear-color e0af68 \
	--text-clear-color c0caf5 \
	--line-clear-color 00000000 \
	--inside-clear-color 00000088 \
	--ring-caps-lock-color e0af68 \
	--text-caps-lock-color c0caf5 \
	--line-caps-lock-color 00000000 \
	--inside-caps-lock-color 00000088 \
	--separator-color 00000000 \
	--fade-in 0.25 \
    --effect-scale 0.5 --effect-blur 7x3 --effect-scale 2 \
	--effect-vignette 0.75:0.75
