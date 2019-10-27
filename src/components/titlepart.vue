<template>
    <div>
        Mr.Noplay / 不玩家 <br>
        <b-btn variant="light" class="bfa" @click="about">About</b-btn>
    </div>
</template>

<script>
export default {
    name: 'titlepart',
    methods: {
        about() {
            this.$router.push('about');
        }
    }
}
</script>
