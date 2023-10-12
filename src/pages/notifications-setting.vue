<template>
    <div class="standard-width">
        <div class="notification-setting-label">
            <h3>{{ $t("header.settingsNotification") }}</h3>
            <!-- :style="{ visibility: isChange ? 'visible' : 'hidden' }" -->
            <button v-if="isChange"  type="button"
                @click="updateNotiSettings(notificationStatus)">
                Save
            </button>
        </div>
        <hr class="noti-setting-hr">
        <div class="setting-main-containter">
            <div v-for="(notiSettings, index) in notificationsSettings" class="setting-50-percent" :key="index">
                <div>
                    <h5>{{ getLocaleKey("title", "_en") == "title_en" ? notiSettings.module_en : notiSettings.module_ar }}
                    </h5>
                    <span>{{ $t("header.settingsNotificationEnabled") }}</span>/<span>{{
                        $t("header.settingsNotificationDisabled") }}</span>
                </div>
                <div>
                    <label class="switch">
                        <input type="checkbox" v-model="notificationStatus[notiSettings.key]">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { userService } from "../services";
export default {
    name: "NotificationsSettings",
    data() {
        return {
            notificationsSettings: [],
            notificationStatus: {},
            isChange: false,
            total: 0,
            unread: 0,
            page: 1,
            limit: 3,
        };
    },
    watch: {
        notificationStatus: {
            handler(newVal, oldVal) {
                if (newVal == oldVal) {
                    this.isChange = true
                }
            },
            deep: true,
        }
    },
    computed: {
        isStatusChecked() {
            return (key) => this.notificationsSettings[key] === this.notificationStatus[key];
        },
    },
    methods: {
        // fetch-notifications-settings
        async fetchNotificationsSettings(page = 1) {
            if (page == 1) this.notificationsSettings = [];
            try {
                let response = await userService.fetchNotificationSettings();
                if (response.data.status) {
                    let res = response.data.data;
                    this.notificationsSettings.push(...res.metadata);
                    this.notificationStatus = res.result;
                    this.total = res.count;
                    this.unread = res.unReadCount;
                    this.oldStatus = this.notificationStatus
                }
            } catch (error) {
                if (!this.isAPIAborted(error))
                    this.failureToast(
                        error.response && error.response.data && error.response.data.message
                    );
            }
        },
        // update-notifications-settings
        async updateNotiSettings(data) {
            try {
                let response = await userService.updateNotificationSettings(data);
                if (response.data.status) {
                    this.successToast(
                        "Notification Setting Updated"
                    );
                    this.isChange = false;
                }
            } catch (error) {
                if (!this.isAPIAborted(error))
                    this.failureToast(
                        error.response && error.response.data && error.response.data.message
                    );
            }
        },
    },
    mounted() {
        navigator.serviceWorker.addEventListener("message", (event) => {
            let notificationSettings =
                event.data && event.data.data && event.data.data.metadata;
            if (!notificationSettings) {
                return;
            }
            notificationSettings = JSON.parse(notificationSettings);
            this.notificationSettings.unshift({
                ...notificationSettings,
                created_at: new Date(),
            });
        });
        this.fetchNotificationsSettings();
        window.addEventListener("scroll", this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.handleScroll);
    },
};
</script>

<style scoped lang="scss">
.setting-main-containter {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
    margin-bottom: 40px;
}

.setting-50-percent {
    padding: 5px;
    min-width: 45%;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    align-items: center;
}

.setting-50-percent h5 {
    color: var(--theme-default);
    font-size: 20px;
    font-weight: 600;
}

.notification-setting-label {
    padding: 1rem 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
    position: relative;
}

.notification-setting-label button {
    border: none;
    background-color: inherit;
    padding: .80rem 1.9rem;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    display: inline-block;
    background: var(--theme-default);
    color: white;
    border-radius: 10px;
    transition: all;
    position: absolute;
    right: 0;
}

.notification-setting-label button:hover {
    background-color: rgb(57, 165, 57);
}

.switch {
    position: relative;
    display: inline-block;
    width: 45px;
    height: 15px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 0px;
    bottom: -2px;
    background-color: rgb(174, 174, 174);
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked+.slider {
    background-color: var(--theme-default);
}

input:focus+.slider {
    box-shadow: var(--theme-default);
}

input:checked+.slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
@media screen and (max-width: 320px) {
    

    .notification-setting-label button{
        position: relative;
        left:0 ;
    }
}

@media screen and (max-width: 768px) {
    .setting-50-percent {
        padding: 3px;
        min-width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        align-items: center;
    }

    .notification-setting-label h3 {
        font-size: 1.5rem;
    }
    .notification-setting-label button{
        position: relative;
        bottom:.80rem ;
    }
  

}
</style>