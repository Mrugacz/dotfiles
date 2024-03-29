const hyprland = await Service.import("hyprland");
const mpris = await Service.import("mpris");
const audio = await Service.import("audio");
const battery = await Service.import("battery");
const systemtray = await Service.import("systemtray");
import { NotificationPopups } from "./notificationPopups.js";

//          ╭─────────────────────────────────────────────────────────╮
//          │                        Hyprland                         │
//          ╰─────────────────────────────────────────────────────────╯

function Workspaces(monitor) {
    const activeId = hyprland.active.workspace.bind("id");
    const workspaces = hyprland.bind("workspaces").transform((allWorkspaces) => {
        return allWorkspaces.map((workspace) => {
            const isOnMonitor =
                hyprland.getWorkspace(workspace.id).monitorID === monitor;

            if (isOnMonitor) {
                const workspaceName = workspace.name % 5;
                return Widget.Button({
                    label: `${workspaceName}`,
                    on_clicked: () =>
                        hyprland.messageAsync(`dispatch workspace ${workspace.id}`),
                    class_name: activeId.as(
                        (i) => `${i === workspace.id ? "focused" : ""}`,
                    ),
                });
            }
        });
    });

    return Widget.Box({
        class_name: "workspaces",
        children: workspaces,
    });
}

function ClientTitle() {
    return Widget.Label({
        class_name: "client-title",
        label: hyprland.active.client.bind("title"),
        truncate: "end",
    });
}

//          ╭─────────────────────────────────────────────────────────╮
//          │                          Clock                          │
//          ╰─────────────────────────────────────────────────────────╯

const date = Variable("", {
    poll: [1000, 'date "+%H:%M - %e %B %Y"'],
});

function Clock() {
    return Widget.Label({
        class_name: "clock",
        label: date.bind(),
    });
}

//          ╭─────────────────────────────────────────────────────────╮
//          │                          Audio                          │
//          ╰─────────────────────────────────────────────────────────╯

function Media() {
    const label = Utils.watch("", mpris, "player-changed", () => {
        if (mpris.players[0]) {
            const { track_artists, track_title } = mpris.players[0];
            return `${track_artists.join(", ")} - ${track_title}`;
        } else {
            return "Nothing is playing";
        }
    });

    return Widget.Button({
        class_name: "media",
        on_primary_click: () => mpris.getPlayer("")?.playPause(),
        on_scroll_up: () => mpris.getPlayer("")?.next(),
        on_scroll_down: () => mpris.getPlayer("")?.previous(),
        child: Widget.Label({ label: label, truncate: "end" }),
    });
}

function Volume() {
    const icons = {
        101: "overamplified",
        67: "high",
        34: "medium",
        1: "low",
        0: "muted",
    };

    function getIcon() {
        const icon = audio.speaker.is_muted
            ? 0
            : [101, 67, 34, 1, 0].find(
                (threshold) => threshold <= audio.speaker.volume * 100,
            );

        return `audio-volume-${icons[icon]}-symbolic`;
    }

    const icon = Widget.Icon({
        icon: Utils.watch(getIcon(), audio.speaker, getIcon),
    });

    const slider = Widget.Slider({
        hexpand: true,
        draw_value: false,
        on_change: ({ value }) => (audio.speaker.volume = value),
        setup: (self) =>
            self.hook(audio.speaker, () => {
                self.value = audio.speaker.volume || 0;
            }),
    });

    return Widget.Box({
        class_name: "volume",
        css: "min-width: 180px",
        children: [icon, slider],
    });
}

const Microphone = () =>
    Widget.Button({
        class_name: "microphone",
        on_primary_click: () =>
            Utils.exec(
                'bash -c "pactl set-source-mute `pactl get-default-source` toggle"',
            ),
        child: Widget.Icon().hook(audio, (self) => {
            if (!audio.microphone || !audio.microphone.stream) return;

            const icon = audio.microphone.stream.is_muted
                ? "microphone-sensitivity-muted-symbolic"
                : "microphone-sensitivity-high-symbolic";
            self.icon = icon;
        }),
    });

function BatteryLabel() {
    if (battery.available === false) return; // ignore if no battery is present
    const value = battery.bind("percent").as((p) => (p > 0 ? p / 100 : 0));
    const icon = battery
        .bind("percent")
        .as((p) => `battery-level-${Math.floor(p / 10) * 10}-symbolic`);

    return Widget.Box({
        class_name: "battery",
        visible: battery.bind("available"),
        children: [
            Widget.Icon({ icon }),
            Widget.LevelBar({
                widthRequest: 140,
                vpack: "center",
                value,
            }),
        ],
    });
}

//          ╭─────────────────────────────────────────────────────────╮
//          │                       System Tray                       │
//          ╰─────────────────────────────────────────────────────────╯

function SysTray() {
    const items = systemtray.bind("items").as((items) =>
        items.map((item) =>
            Widget.Button({
                child: Widget.Icon({ icon: item.bind("icon") }),
                on_primary_click: (_, event) => item.activate(event),
                on_secondary_click: (_, event) => item.openMenu(event),
                tooltip_markup: item.bind("tooltip_markup"),
            }),
        ),
    );

    return Widget.Box({
        children: items,
    });
}

//          ╭─────────────────────────────────────────────────────────╮
//          │                        Positions                        │
//          ╰─────────────────────────────────────────────────────────╯

function Left(monitor) {
    return Widget.Box({
        spacing: 8,
        children: [Workspaces(monitor), ClientTitle()],
    });
}

function Center() {
    return Widget.Box({
        spacing: 8,
        children: [Clock()],
    });
}

function Right() {
    return Widget.Box({
        hpack: "end",
        spacing: 8,
        children: [Media(), Microphone(), Volume(), BatteryLabel(), SysTray()],
    });
}

//          ╭─────────────────────────────────────────────────────────╮
//          │                      Window Logic                       │
//          ╰─────────────────────────────────────────────────────────╯

//  TODO: move bars to separate file, only load them here

function Bar(monitor) {
    return Widget.Window({
        name: `bar-${monitor}`, // name has to be unique
        class_name: "bar",
        monitor,
        anchor: ["top", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            start_widget: Left(monitor),
            center_widget: Center(),
            end_widget: Right(),
        }),
    });
}

const nMonitors = imports.gi.Gdk.Screen.get_default().get_n_monitors();
const windows = [];

for (let i = 0; i < nMonitors; i++) {
    windows.push(Bar(i));
}

windows.push(NotificationPopups());

App.config({ style: "./style.css", windows: windows });

export { };
