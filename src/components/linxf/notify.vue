<template></template>

<script>
import { Plugins, Storage } from "@capacitor/core";
const { LocalNotifications } = Plugins;
export default {
  name: "notify",
  data() {
    return {
      cannotify: false
    };
  },
  methods: {
    send(obj) {
      var title = obj.title;
      var message = obj.message;
      var id = obj.id;
      this.canwenotify().then(() => {
        if (process.env.VUE_APP_LINXF == "electron") {
          if (this.cannotify) {
            var notification = new Notification(title, {
              body: message
            });
          } else {
            this.$parent.$breadstick.notify(title + ": " + message, {
              position: "top-right"
            });
          }
        } else {
          if (process.env.VUE_APP_LINXF == 'web') {
            if (window.Notification) {
              LocalNotifications.schedule({
                notifications: [
                  {
                    title: title,
                    body: message,
                    id: id
                  }
                ]
              });
            } else {
              this.$parent.$breadstick.notify(title + ": " + message, {
                position: "top-right"
              });
            }
          } else {
            LocalNotifications.schedule({
              notifications: [
                {
                  title: title,
                  body: message,
                  id: id
                }
              ]
            });
          }
        }
      });
    },
    async canwenotify() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("cannotify") != -1) {
        const ret = await Storage.get({ key: "cannotify" });
        if (ret.value != null) {
          var val = JSON.parse(ret.value);
          if (val == false) {
            this.cannotify = false;
          } else {
            this.cannotify = true;
          }
        } else {
          this.cannotify = false;
        }
      } else {
        this.cannotify = false;
      }
    }
  }
};
</script>
