import { StatusBar } from "./statusBar.js";
import { NotificationPopups } from "./notificationPopups.js";

const nMonitors = imports.gi.Gdk.Screen.get_default().get_n_monitors();
const windows = [];

// Start status bar on each monitor
for (let i = 0; i < nMonitors; i++) {
  windows.push(StatusBar(i));
}

// Start notification daemon
windows.push(NotificationPopups());

App.config({ style: "./style.css", windows: windows });
