<template>
  <li class="onhover-dropdown">
    <div class="notification-box">
      <!-- <feather type="bell" @click="notification_open()"></feather> -->
      <img class="" src="../assets/images/header/bell.png" alt="bell" />
      <span class="badge badge-pill badge-danger">4</span>
    </div>
    <div
      class="onhover-show-div notification-dropdown"
      :class="{ active: notification }"
    >
      <div class="mb-0 dropdown-title w500">
        {{ $t("header.notifications") }}
      </div>
      <ul>
        <div class="dropdown-sub-title">{{ $t("header.today") }}</div>
        <li class="notification-row warning">
          <div class="icon"><bell-fill-svg /></div>
          <p>
            <span
              >Doctor has initiated the call, you can now join the call</span
            >
            <span class="time-warning">
              <reminder-svg /> May 2022 - 11:00 - 12:00 PM</span
            >
          </p>
        </li>
        <li class="notification-row default">
          <div class="icon"><bell-fill-svg /></div>
          <p>
            <span
              >Doctor has initiated the call, you can now join the call</span
            >
            <span class="time-default">
              <reminder-svg /> May 2022 - 11:00 - 12:00 PM</span
            >
          </p>
        </li>
        <li class="notification-row info">
          <div class="icon"><bell-fill-svg /></div>
          <p>
            <span
              >Doctor has initiated the call, you can now join the call</span
            >
            <span class="time-info">
              <reminder-svg /> May 2022 - 11:00 - 12:00 PM</span
            >
          </p>
        </li>
        <li class="notification-row success">
          <div class="icon"><bell-fill-svg /></div>
          <p>
            <span
              >Doctor has initiated the call, you can now join the call</span
            >
            <span class="time-success">
              <reminder-svg /> May 2022 - 11:00 - 12:00 PM</span
            >
          </p>
        </li>
        <li><a class="" href=""></a></li>
      </ul>
    </div>
  </li>
</template>

<script>
export default {
  name: "Notifications",
  data() {
    return {
      notification: false,
    };
  },
  methods: {
    notification_open() {
      this.notification = !this.notification;
    },
  },
};
</script>
