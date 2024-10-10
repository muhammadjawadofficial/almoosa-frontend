<template>
  <router-view />
</template>
<script>
export default {
  mounted() {
    this.$socket.on("connect", () => {
      console.log("WebSocket connected");
    });
  },
  beforeDestroy() {
    this.$socket.off("connect");
    this.$socket.off("connect_error");
    this.$socket.off("admins-availability-updated");
    this.$socket.off("call-connect");
    this.$socket.off("error-connecting");
  },
};
</script>
