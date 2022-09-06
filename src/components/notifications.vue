<template>
  <li class="onhover-dropdown">
    <div class="notification-box">
      <!-- <feather type="bell" @click="notification_open()"></feather> -->
      <img class="" src="../assets/images/header/bell.png" alt="bell" />
      <span v-if="notifications.length" class="badge badge-pill badge-danger">{{
        notifications.length
      }}</span>
    </div>
    <div
      class="onhover-show-div notification-dropdown"
      :class="{ active: notification }"
    >
      <div class="mb-0 dropdown-title w500">
        {{ $t("header.notifications") }}
      </div>
      <div class="dropdown-sub-title px-3 pt-3 pb-0">
        {{ $t("header.today") }}
      </div>
      <ul>
        <template v-if="notifications.length">
          <li
            class="notification-row"
            :class="getNotificationRowClass(index)"
            v-for="(notification, index) in notifications"
            :key="'notification-' + index"
          >
            <div class="icon"><bell-fill-svg /></div>
            <p>
              <span class="multi-line-ellipse">{{ notification.title }} </span>
              <span class="time-warning">
                <reminder-svg />
                {{ formatNotificationTime(notification.datetime) }}</span
              >
            </p>
          </li>
        </template>
        <div v-else class="no-data pt-0">{{ $t("header.noData") }}</div>
        <!-- <li><a class="" href=""></a></li> -->
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
      notifications: [],
    };
  },
  methods: {
    notification_open() {
      this.notification = !this.notification;
    },
    getNotificationRowClass(index) {
      if (index % 4 == 0) {
        return "success";
      } else if (index % 3 == 0) {
        return "info";
      } else if (index % 2 == 0) {
        return "default";
      } else {
        return "warning";
      }
    },
  },
  mounted() {
    navigator.serviceWorker.addEventListener("message", (event) => {
      this.notifications.unshift({
        ...event.data.notification,
        datetime: new Date(),
      });
    });
  },
};
</script>
