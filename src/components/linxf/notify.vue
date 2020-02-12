<template>

</template>

<script>
import { Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;
export default {
    name: 'notify',
    methods: {
        send(obj) {
            var title = obj.title;
            var message = obj.message;
            var id = obj.id;
            if (process.env.VUE_APP_LINXF == "electron") {
                var notification = new Notification(title, {
                    body: message,
                })
            } else {
                LocalNotifications.schedule({notifications: [{
                    title: title,
                    body: message,
                    id: id,
                }]})
            }
        }
    }
}
</script>
