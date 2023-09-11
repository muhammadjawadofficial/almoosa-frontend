<template>
    <div class="standard-width">
        <div class="notification-label">
            <h3>{{ $t("header.allNotification") }}</h3>
        </div>
        <hr>

        <ul>
            <li class="notification-row" :class="getNotificationRowClass(index)"
                v-for="(notification, index) in notifications" :key="'notification-' + index">
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
                        <reminder-svg class="custom-reminder-svg" />
                        <span class="time">
                            {{ formatNotificationTime(notification.created_at) }}
                        </span>
                    </span>
                </p>
            </li>
        </ul>

        <div v-if="noMoreNotifications" class="mb-1 d-flex justify-content-center no-data">
            {{ $t("header.noData") }}
        </div>

        <div v-else class="mb-1 d-flex justify-content-center">
        </div>
    </div>
</template>
  
<script>
import { userService } from "../services";
export default {
    name: "AllNotifications",
    data() {
        return {
            notifications: [],
            totalNotifications: 0,
            page: 1,
            limit: 10,
            loadingMore: false,
            noMoreNotifications: false,
        };
    },

    computed: {
        showLoadMore() {
            return this.notifications.length < this.totalNotifications;
        },
    },
    methods: {
        async fetchNotifications() {
            try {
                if (this.loadingMore || this.noMoreNotifications) return; // Do not load more if already loading or there are no more notifications

                this.loadingMore = true;

                let query = `?id=${this.getUserInfo.id}&limit=${this.limit}&orderBy=id&orderType=DESC`;

                if (this.notifications.length < this.totalNotifications) {
                    query += `&page=${Math.ceil(this.notifications.length / this.limit) + 1}`;
                }

                const response = await userService.fetchNotifications(query);

                if (response.data.status) {
                    const res = response.data.data;
                    this.notifications.push(...res.notifications);
                    this.totalNotifications = res.count;

                    if (this.notifications.length >= this.totalNotifications) {
                        this.noMoreNotifications = true;
                    }
                }
            } catch (error) {
                if (!this.isAPIAborted(error))
                    this.failureToast(
                        error.response && error.response.data && error.response.data.message
                    );
            } finally {
                this.loadingMore = false;
            }
        },

        handleScroll() {
            const scrollY = window.scrollY || window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (
                !this.loadingMore &&
                !this.noMoreNotifications &&
                scrollY + windowHeight >= documentHeight - 50
            ) {
                this.fetchNotifications();
            }
        },

        loadMore() {
            this.page++;
            this.fetchNotifications();
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
        }
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
        window.addEventListener("scroll", this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.handleScroll);
    },
};
</script>
  

<style scoped lang="scss">

ul {
    padding: 0.938rem;
}

li {
    padding: 0.938rem;

    p {
        font-size: 0.875rem;
        letter-spacing: 0.3px;
        margin-bottom: 0;
    }

    a {
        text-decoration: underline;
        letter-spacing: 0.3px;
    }

    &+li {
        margin-top: 0.938rem;
    }

    &:last-child {
        padding-bottom: 0.938rem;
    }

}
.custom-reminder-svg {
    width: 20px;
    height: 17px;
}

.notification-label {
    padding: 1rem 0 0 1rem;
}

.time {
    position: relative;
    bottom: 4px;
}
</style>