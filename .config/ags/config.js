import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { exec, execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import { notificationPopup } from './notificationPopups.js';

const dispatch = ws => Hyprland.sendMessage(`dispatch workspace ${ws}`);

const Workspaces = (monitor) => Widget.Box({
    class_name: 'workspaces',
    children: Hyprland.bind('workspaces').transform(allWorkspaces => {
        // Sort workspaces based on some criteria, e.g., workspace name
        const sortedWorkspaces = allWorkspaces.sort((a, b) => a.name.localeCompare(b.name));

        return sortedWorkspaces.map(workspace => {
            // Check if the workspace belongs to monitor
            const isOnMonitor = Hyprland.getWorkspace(workspace.id).monitorID === monitor;

            let workspaceName = workspace.name;

            while (workspaceName > 5) {
                workspaceName -= 5;
            }


            // If it belongs to monitor, create a button
            if (isOnMonitor) {
                return Widget.Button({
                    label: `${workspaceName}`,
                    on_clicked: () => dispatch(workspace.id),
                    class_name: Hyprland.active.workspace.bind('id')
                        .transform(activeWorkspaceId => (activeWorkspaceId === workspace.id) ? 'focused' : ''),
                });
            }

            return null;
        }).filter(button => button !== null); // Filter out null entries
    }),
});

const ClientTitle = () => Widget.Label({
    class_name: 'client-title',
    label: Hyprland.active.client.bind('title'),
});

const Clock = () => Widget.Label({
    class_name: 'clock',
    setup: self => self
        // this is what you should do
        .poll(1000, self => execAsync(['date', '+%H:%M - %e %B %Y'])
            .then(date => self.label = date)),
});

// we don't need dunst or any other notification daemon
// because the Notifications module is a notification daemon itself
const Notification = () => Widget.Box({
    class_name: 'notification',
    visible: Notifications.bind('popups').transform(p => p.length > 0),
    children: [
        Widget.Icon({
            icon: 'preferences-system-notifications-symbolic',
        }),
        Widget.Label({
            label: Notifications.bind('popups').transform(p => p[0]?.summary || ''),
        }),
    ],
});

const Media = () => Widget.Button({
    class_name: 'media',
    on_primary_click: () => Mpris.getPlayer('')?.playPause(),
    on_scroll_up: () => Mpris.getPlayer('')?.next(),
    on_scroll_down: () => Mpris.getPlayer('')?.previous(),
    child: Widget.Label('-').hook(Mpris, self => {
        if (Mpris.players[0]) {
            const { track_artists, track_title } = Mpris.players[0];
            self.label = `${track_artists.join(', ')} - ${track_title}`;
        } else {
            self.label = 'Nothing is playing';
        }
    }, 'player-changed'),
});

const Volume = () => Widget.Box({
    class_name: 'volume',
    css: 'min-width: 180px',
    children: [
        Widget.Icon().hook(Audio, self => {
            if (!Audio.speaker)
                return;

            const category = {
                101: 'overamplified',
                67: 'high',
                34: 'medium',
                1: 'low',
                0: 'muted',
            };

            const icon = Audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
                threshold => threshold <= Audio.speaker.volume * 100);

            self.icon = `audio-volume-${category[icon]}-symbolic`;
        }, 'speaker-changed'),
        Widget.Slider({
            hexpand: true,
            draw_value: false,
            on_change: ({ value }) => Audio.speaker.volume = value,
            setup: self => self.hook(Audio, () => {
                self.value = Audio.speaker?.volume || 0;
            }, 'speaker-changed'),
        }),
    ],
});

const BatteryLabel = () => Widget.Box({
    class_name: 'battery',
    visible: Battery.bind('available'),
    children: [
        Widget.Icon({
            icon: Battery.bind('percent').transform(p => {
                return `battery-level-${Math.floor(p / 10) * 10}-symbolic`;
            }),
        }),
        Widget.Label({
            class_name: 'battery',
            label: Battery.bind('percent').transform(p => {
                return ` ${p}%`;
            }),
        }),
    ],
});

const SysTray = () => Widget.Box({
    children: SystemTray.bind('items').transform(items => {
        return items.map(item => Widget.Button({
            child: Widget.Icon({ binds: [['icon', item, 'icon']] }),
            on_primary_click: (_, event) => item.activate(event),
            on_secondary_click: (_, event) => item.openMenu(event),
            binds: [['tooltip-markup', item, 'tooltip-markup']],
        }));
    }),
});

// layout of the bar
const Left = (monitor) => Widget.Box({
    spacing: 8,
    children: [
        Workspaces(monitor),
        ClientTitle(),
    ],
});

const Center = () => Widget.Box({
    spacing: 8,
    children: [
        Clock(),
        // Notification(),
    ],
});

const Right = () => Widget.Box({
    hpack: 'end',
    spacing: 8,
    children: [
        Media(),
        Volume(),
        BatteryLabel(),
        SysTray(),
    ],
});

const Bar = (monitor) => Widget.Window({
    name: `bar-${monitor}`, // name has to be unique
    class_name: 'bar',
    monitor,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        start_widget: Left(monitor),
        center_widget: Center(),
        end_widget: Right(),
    }),
});

import { monitorFile } from 'resource:///com/github/Aylur/ags/utils.js';

monitorFile(
    `${App.configDir}/style.css`,
    function() {
        App.resetCss();
        App.applyCss(`${App.configDir}/style.css`);
    },
);

// Get the number of monitors
const nMonitors = imports.gi.Gdk.Screen.get_default().get_n_monitors();

// Create an array to store window configurations
const windows = [];

// Populate the array using a for loop
for (let i = 0; i < nMonitors; i++) {
    windows.push(Bar(i));
}

windows.push(notificationPopup);

// Export the config
export default {
    style: App.configDir + '/style.css',
    windows: windows,
};
