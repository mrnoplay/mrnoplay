<template>
    <div>
        Mr.Noplay / 不玩家 <br>
        <div v-if="canabout"><b-btn variant="light" class="bfa" @click="about">About</b-btn></div>
    </div>
</template>

<script>
export default {
    name: 'titlepart',
    props: ['canabout'],
    methods: {
        about() {
            this.$router.push('about');
        }
    }
}
</script>
