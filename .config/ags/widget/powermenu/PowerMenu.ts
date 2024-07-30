const WINDOW_NAME = "PowerMenu";

const Menu = ({ spacing = 12 }) => {
  return Widget.Box({
    vertical: false,
    css: `margin: ${spacing * 2}px;`,
    children: [
      Action("Logout", "hyprctl dispatch exit"),
      Action("Poweroff", "poweroff"),
      Action("Reboot", "reboot"),
    ],
    setup: (self) =>
      self.hook(App, (_, windowName) => {
        if (windowName !== WINDOW_NAME) return;
      }),
  });
};

const Action = (label: string, onClicked: string) => {
  return Widget.Button({
    child: Widget.Label(label),
    onClicked: () => Utils.exec(onClicked),
  });
};

export const PowerMenu = Widget.Window({
  name: WINDOW_NAME,
  setup: (self) =>
    self.keybind("Escape", () => {
      App.closeWindow(WINDOW_NAME);
    }),
  visible: false,
  className: "powermenu",
  keymode: "exclusive",
  child: Menu({
    spacing: 12,
  }),
});
