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
            LocalNotifications.schedule({notifications: [{
                title: title,
                body: message,
                id: id,
            }]})
        }
    }
}
</script>
