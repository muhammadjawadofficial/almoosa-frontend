<template>
  <li
    class="onclick-dropdown"
    :class="{ 'show-dropdown': showProfileDropdown }"
    tabindex="0"
    @click="toggleProfileDropdown"
    @focusout="toggleProfileDropdown($event, false)"
    >
    <div class="notification-box">
      <!-- <feather type="bell" @click="notification_open()"></feather> -->
      <img class="" src="../assets/images/header/bell.png" alt="bell" />
      <span v-if="unread" class="badge badge-pill badge-danger">
        {{ unread }}
      </span>
    </div>
    <div
      class="onhover-show-div notification-dropdown"
      :class="{ active: notification }"
    >
      <div class="mb-0 dropdown-title w500">
        {{ $t("header.notifications") }}
      </div>
      <div
        class="dropdown-sub-title px-3 pt-3 pb-0 text-right"
        v-if="unread > 0"
      >
        <span class="pointer" @click="markAllAsRead">
          {{ $t("header.markAllRead") }}
        </span>
      </div>
      <ul>
        <template v-if="notifications.length">
          <li
            class="notification-row"
            :class="getNotificationRowClass(index)"
            v-for="(notification, index) in notifications"
            :key="'notification-' + index"
          >
            <div class="icon" :class="{ unread: !notification.seen }">
              <bell-fill-svg />
            </div>
            <p>
              <span class="multi-line-ellipse">
                {{ notification[getLocaleKey("title", "_en")] }}
              </span>
              <span class="multi-line-ellipse">
                {{ notification[getLocaleKey("message", "_en")] }}
              </span>
              <span class="time-warning">
                <reminder-svg />
                {{ formatNotificationTime(notification.created_at) }}</span
              >
            </p>
          </li>
          <div v-if="notifications.length < total" class="text-center">
            <a class="btn btn-primary mt-3" @click.stop="loadMore">
              {{ $t("loadMore") }}
            </a>
          </div>
        </template>
        <div v-else class="no-data pt-0">
          {{ $t("header.noData") }}
        </div>
        <!-- <li><a class="" href=""></a></li> -->
      </ul>
    </div>
  </li>
</template>

<script>
import { userService } from "../services";
export default {
  name: "Notifications",
  data() {
    return {
      notification: false,
      notifications: [],
      showProfileDropdown: false,
      total: 0,
      unread: 0,
      page: 1,
      limit: 10,
    };
  },
  computed: {
    getUnreadCount() {
      return this.notifications.filter((x) => !x.seen).length;
    },
  },
  methods: {
    toggleProfileDropdown(event, status) {
      event.preventDefault();
      if (status != undefined) {
        this.showProfileDropdown = status;
      } else {
        this.showProfileDropdown = !this.showProfileDropdown;
      }
    },
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
    async fetchNotifications(page = 1) {
      if (page == 1) this.notifications = [];
      let query = `?id=${this.getUserInfo.id}&limit=${this.limit}&page=${page}&orderBy=id&orderType=DESC`;
      try {
        let response = await userService.fetchNotifications(query);
        if (response.data.status) {
          let res = response.data.data;
          this.notifications.push(...res.notifications);
          this.total = res.count;
          this.unread = res.unReadCount;
        }
      } catch (error) {
        if (!this.isAPIAborted(error))
          this.failureToast(
            error.response && error.response.data && error.response.data.message
          );
      }
    },
    async markAllAsRead() {
      try {
        let payload = {
          userId: this.getUserInfo.id,
          readAll: true,
        };
        let response = await userService.markAllAsRead(payload);
        if (response.data.status) {
          this.notifications = [
            ...this.notifications.map((x) => {
              x.seen = true;
              return x;
            }),
          ];
          this.unread = 0;
        } else {
          this.failureToast(response.data.message);
        }
      } catch (error) {
        if (!this.isAPIAborted(error))
          this.failureToast(
            error.response && error.response.data && error.response.data.message
          );
      }
    },
    loadMore() {
      this.page++;
      this.fetchNotifications(this.page);
    },
  },
  mounted() {
    navigator.serviceWorker.addEventListener("message", (event) => {
      let notification =
        event.data && event.data.data && event.data.data.metadata;
      if (!notification) {
        return;
      }
      notification = JSON.parse(notification);
      this.notifications.unshift({
        ...notification,
        created_at: new Date(),
      });
    });
    this.fetchNotifications();
  },
};
</script>
