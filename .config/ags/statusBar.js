const hyprland = await Service.import("hyprland");
const mpris = await Service.import("mpris");
const audio = await Service.import("audio");
const battery = await Service.import("battery");
const systemtray = await Service.import("systemtray");

//          ╭─────────────────────────────────────────────────────────╮
//          │                        Hyprland                         │
//          ╰─────────────────────────────────────────────────────────╯

function Workspaces(monitor) {
  const activeId = hyprland.active.workspace.bind("id");
  const workspaces = hyprland.bind("workspaces").transform((allWorkspaces) => {
    return allWorkspaces
      .filter(
        (workspace) =>
          hyprland.getWorkspace(workspace.id).monitorID === monitor,
      ) // Filter workspaces based on monitor
      .sort((a, b) => {
        // Sort workspaces by their names
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      })
      .map((workspace) => {
        let workspaceName = workspace.name % 5;
        if (workspaceName === 0) {
          workspaceName = 5;
        }
        return Widget.Button({
          label: `${workspaceName}`,
          on_clicked: () =>
            hyprland.messageAsync(`dispatch workspace ${workspace.id}`),
          class_name: activeId.as(
            (i) => `${i === workspace.id ? "focused" : ""}`,
          ),
        });
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
    tooltip_text: "Toggle microphone",
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

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid time";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const hoursDisplay = hours > 0 ? hours + "h " : "";
  const minutesDisplay = minutes > 0 ? minutes + "m " : "";
  const secondsDisplay = remainingSeconds > 0 ? remainingSeconds + "s" : "";

  return hoursDisplay + minutesDisplay + secondsDisplay;
}

function BatteryLabel() {
  if (!battery.available) return; // Ignore if no battery is present
  const percent = Math.max(0, battery.percent / 100);
  const icon = `battery-level-${Math.floor(percent * 10) * 10}-symbolic`;
  const label = ` ${Math.floor(percent * 100)}%`;
  const time = formatTime(battery.time_remaining);

  return Widget.Box({
    class_name: "battery",
    visible: battery.available,
    tooltip_text: time ? `Time remaining: ${time}` : "Charging",
    children: [Widget.Icon({ icon }), Widget.Label({ label })],
  });
}

/* label: Battery.bind('percent').transform(p => {
                return ` ${Math.floor(p)}%`; */

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
//          │                Headphone Connect Button                 │
//          ╰─────────────────────────────────────────────────────────╯

function HeadphoneButton() {
  return Widget.Button({
    class_name: "headphone",
    on_primary_click: () =>
      Utils.exec("bluetoothctl connect 90:7A:58:D5:E2:7B"),
    child: Widget.Icon("audio-headphones-symbolic"),
    tooltip_text: "Connect to Sony WH-XB910N",
  });
}

//          ╭─────────────────────────────────────────────────────────╮
//          │                      App Launcher                       │
//          ╰─────────────────────────────────────────────────────────╯

function AppLauncher() {
  return Widget.Button({
    class_name: "app-launcher-button",
    on_primary_click: () => Utils.exec("rofi -show drun"),
    child: Widget.Icon("view-grid-symbolic"),
    tooltip_text: "Open App Launcher",
  });
}
//          ╭─────────────────────────────────────────────────────────╮
//          │                        Positions                        │
//          ╰─────────────────────────────────────────────────────────╯

function Left(monitor) {
  return Widget.Box({
    spacing: 8,
    children: [AppLauncher(), Workspaces(monitor), ClientTitle()],
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
    children: [
      Media(),
      Microphone(),
      Volume(),
      BatteryLabel(),
      SysTray(),
      HeadphoneButton(),
    ],
  });
}

//          ╭─────────────────────────────────────────────────────────╮
//          │                   Load the status bar                   │
//          ╰─────────────────────────────────────────────────────────╯

export function StatusBar(monitor) {
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
