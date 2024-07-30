import { Bar } from "./widget/bar/Bar";
import { NotificationPopup } from "./widget/notifications/Notification";
import { forMonitors } from "lib/utils";
import { PowerMenu } from "./widget/powermenu/PowerMenu";
import { AppLauncher } from "./widget/launcher/AppLauncher";

App.config({
  style: "./style/style.css",
  windows: () => [
    ...forMonitors(Bar),
    NotificationPopup(),
    PowerMenu,
    AppLauncher,
  ],
});
