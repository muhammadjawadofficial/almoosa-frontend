<template>
  <div class="zoom-connect">
    <div
      class="loader-wrapper"
      :class="{ loderhide: getLoading || isZoomReady }"
    >
      <lottie-player
        autoplay
        loop
        mode="normal"
        src="/loader.json"
        style="width: 320px"
      >
      </lottie-player>
      <!-- Previous Loader (Build using HTML + CSS) -->
      <!-- <div class="loader-index">
        <span>S</span>
      </div> -->
    </div>
    <div class="zoom-call-container" :class="chatOpened ? 'show' : 'hide'">
      <div class="host-video">
        <video
          id="my-self-view-video"
          class="placeholder rounded"
          width="1920"
          height="1080"
        ></video>
        <canvas
          id="my-self-view-canvas"
          class="placeholder rounded"
          width="1920"
          height="1080"
          style="display: none"
        ></canvas>
        <div class="display-name">
          {{ getFullName(getUserInfo) }}
        </div>
      </div>
      <div
        class="participant-vid"
        :style="
          isParticipantJoined && false
            ? '--profile-image: url(' +
              getImageUrl(
                isDoctor
                  ? getSelectedAppointment.patient
                  : getSelectedAppointment.doctor
              ) +
              ')'
            : ''
        "
      >
        <canvas
          id="participant-videos-canvas"
          class="placeholder"
          width="1920"
          height="1080"
        ></canvas>
        <div class="display-name responsive">
          {{
            isParticipantJoined
              ? getFullName(
                  isDoctor
                    ? getSelectedAppointment.patient
                    : getSelectedAppointment.doctor
                )
              : $t("noOneJoined")
          }}
        </div>
      </div>
      <div class="screen-share">
        <video
          id="my-screen-share-content-video"
          height="1080"
          width="1920"
          style="display: none"
        ></video>
        <canvas
          id="my-screen-share-content-canvas"
          height="1080"
          width="1920"
          style="display: none"
        ></canvas>
        <canvas
          id="users-screen-share-content-canvas"
          height="1080"
          width="1920"
        ></canvas>
      </div>
      <div class="zoom-controls">
        <span
          v-if="isDoctor"
          @click="ringPatient"
          :class="{ disabled: isParticipantJoined }"
        >
          <span style="font-size: 1rem" v-if="timer > 0">
            {{ getCounterValue }}
          </span>
          <i v-else class="fa fa-phone" aria-hidden="true"></i>
        </span>
        <span v-if="!audioStarted" @click="connectAudio">
          <i class="fa fa-volume-up" aria-hidden="true"></i>
        </span>
        <span v-else @click="toggleAudio">
          <i
            class="fa fa-microphone"
            :class="{ off: !audioEnabled }"
            aria-hidden="true"
          ></i>
        </span>
        <span v-if="!videoStarted" @click="connectVideo">
          <i
            class="fa fa-video-camera"
            :class="{ off: !videoEnabled }"
            aria-hidden="true"
          ></i>
        </span>
        <span v-else @click="toggleVideo">
          <i
            class="fa fa-video-camera"
            :class="{ off: !videoEnabled }"
            aria-hidden="true"
          ></i>
        </span>
        <span v-if="screenShared" @click="stopScreenShare">
          <i class="fa fa-times" aria-hidden="true"></i>
        </span>
        <span v-else @click="startScreenShare">
          <i class="fa fa-share-square-o" aria-hidden="true"></i>
        </span>
        <span @click="toggleChatWindow" :class="{ new: newMessages }">
          <i class="fa fa-comments" aria-hidden="true"></i>
        </span>
        <span @click="leaveSession" class="end-call">
          <i class="fa fa-sign-out" aria-hidden="true"></i>
        </span>
      </div>
    </div>
    <div class="zoom-chat-container" :class="chatOpened ? 'show' : 'hide'">
      <div class="chat-header px-3">
        {{ $t("chat") }}
        <span class="close-chat pointer" @click="chatOpened = false"
          ><i class="fa fa-times"></i
        ></span>
      </div>
      <div class="chat-container p-3" ref="scrollDiv">
        <div
          class="chat-message"
          :class="{
            self: currentUser && chat.sender.userId == currentUser.userId,
          }"
          v-for="(chat, index) in chatHistory"
          :key="'chat-' + index"
        >
          <div class="user-name">{{ chat.sender.name }}</div>
          <div class="user-message">{{ chat.message }}</div>
          <div class="user-time">
            {{ formatDateTime(chat.timestamp, false) }}
          </div>
        </div>
        <div class="noData" v-if="!chatHistory.length">
          {{ $t("noChatMessages") }}
        </div>
      </div>
      <div class="chat-footer px-3 py-1">
        <input
          @keyup.enter="sendMessage"
          type="text"
          name="chatInput"
          v-model="chatMessage"
          :placeholder="$t('enterMessage')"
        />
        <span class="send-btn" @click="sendMessage">
          <i class="fa fa-send" aria-hidden="true"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import ZoomVideo from "@zoom/videosdk";
import { mapGetters } from "vuex";
import { appointmentService, systemConfigService } from "../services";

export default {
  data() {
    return {
      stream: null,
      client: null,
      chat: null,
      audioEncode: false,
      audioDecode: false,
      audioEnabled: null,
      videoEnabled: null,
      screenShared: false,
      users: [],
      isZoomReady: false,
      audioStarted: false,
      videoStarted: false,
      chatOpened: false,
      chatMessage: "",
      chatHistory: [],
      currentUser: null,
      newMessages: false,
      ringing: false,
      timer: 0,
      hostPosition: {
        pos1: 0,
        pos2: 0,
        pos3: 0,
        pos4: 0,
      },
      systemConfig: null,
    };
  },
  computed: {
    ...mapGetters("appointment", [
      "getTeleConsultation",
      "getSelectedAppointment",
    ]),
    ...mapGetters("user", ["getUserInfo"]),
    isParticipantJoined() {
      if (this.currentUser && this.users && this.users.length) {
        let participantList = this.users.filter(
          (x) => x.userId != this.currentUser.userId
        );
        if (participantList.length) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    },
    getCounterValue() {
      if (this.timer <= 0) return;

      let minutes = Math.floor(this.timer / 60);
      if (minutes < 10) minutes = `0${minutes}`;

      let seconds = this.timer % 60;
      if (seconds < 10) seconds = `0${seconds}`;

      return `${minutes}:${seconds}`;
    },
  },
  async mounted() {
    if (!this.getTeleConsultation || !this.getSelectedAppointment) {
      this.navigateTo("default");
      return;
    }
    try {
      this.fetchContactConfig();
      this.setLoadingState(true);
      this.client = ZoomVideo.createClient();

      let sessionName = this.getTeleConsultation.sessionName;
      let token = this.getTeleConsultation.signature;
      let username = this.getFullName(this.getUserInfo);
      let password = this.getTeleConsultation.password;

      await this.client.init("en-US", "Global", { patchJsMedia: true });
      await this.client.join(sessionName, token, username, password);

      this.currentUser = this.client.getCurrentUserInfo();

      this.stream = this.client.getMediaStream();

      this.chat = this.client.getChatClient();

      this.client.getAllUser().forEach((user) => {
        if (user.bVideoOn) {
          document
            .querySelector("#participant-videos-canvas")
            .classList.remove("placeholder");
          this.stream.renderVideo(
            document.querySelector("#participant-videos-canvas"),
            user.userId,
            1920,
            1080,
            0,
            0,
            3
          );
        } else {
          document
            .querySelector("#participant-videos-canvas")
            .classList.add("placeholder");
        }
        if (user.sharerOn) {
          this.stream.startShareView(
            document.querySelector("#users-screen-share-content-canvas"),
            user.userId
          );
        }
      });

      this.client.on("peer-video-state-change", (payload) => {
        this.$set(this, "users", [...this.client.getAllUser()]);
        if (payload.action === "Start") {
          document
            .querySelector("#participant-videos-canvas")
            .classList.remove("placeholder");
          this.stream.renderVideo(
            document.querySelector("#participant-videos-canvas"),
            payload.userId,
            1920,
            1080,
            0,
            0,
            3
          );
        } else if (payload.action === "Stop") {
          document
            .querySelector("#participant-videos-canvas")
            .classList.add("placeholder");
          this.stream.stopRenderVideo(
            document.querySelector("#participant-videos-canvas"),
            payload.userId
          );
        }
      });

      // event listener to see when desktop Safari has initialized audio
      this.client.on("media-sdk-change", (payload) => {
        if (payload.type === "audio" && payload.result === "success") {
          if (payload.action === "encode") {
            // encode for sending audio stream (speak)
            this.audioEncode = true;
          } else if (payload.action === "decode") {
            // decode for receiving audio stream (hear)
            this.audioDecode = true;
          }
        }
      });
      this.client.on("active-speaker", (payload) => {
        console.log("Active speaker, use for CSS visuals", payload); // new active speaker, for example, use for microphone visuals, css video border, etc.
        if (this.users && this.users.length) {
          let filterUser = this.users.filter(
            (x) => x.userId == payload[0].userId
          );
          if (filterUser && filterUser.bVideoOn)
            this.stream.renderVideo(
              document.querySelector("#participant-videos-canvas"),
              payload.userId,
              1920,
              1080,
              0,
              0,
              3
            );
        }
      });

      this.client.on("video-active-change", (payload) => {
        this.$set(this, "users", [...this.client.getAllUser()]);
        console.log("Active speaker, use for any video adjustments", payload); // new active speaker, for example, use for video rendering changes, size changes, depending on your use case.
      });

      this.client.on("passively-stop-share", (payload) => {
        this.screenShared = false;
        document.querySelector(
          "#my-screen-share-content-canvas"
        ).style.display = "none";
        document.querySelector("#my-screen-share-content-video").style.display =
          "none";
      });

      this.client.on("active-share-change", (payload) => {
        if (payload.state === "Active") {
          this.stream.startShareView(
            document.querySelector("#users-screen-share-content-canvas"),
            payload.userId
          );
        } else if (payload.state === "Inactive") {
          this.stream.stopShareView();
        }
      });

      this.client.on("chat-on-message", (payload) => {
        this.chatHistory.push(payload);
        if (!this.chatOpened) this.newMessages = true;
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      });

      this.client.on("user-removed", (payload) => {
        if (this.users && this.users.length) {
          const userRemovedList = payload.map((x) => x.userId);
          let filterList = this.users.filter(
            (x) => !userRemovedList.includes(x.userId)
          );
          this.$set(this, "users", [...filterList]);
        }
      });

      // await this.connectVideo();
      // this.videoEnabled = false;
      this.$set(this, "users", [...this.client.getAllUser()]);
      let chatHistory = await this.chat.getHistory();
      console.log("chatHistory", chatHistory);
      this.$set(this, "chatHistory", [...chatHistory]);
      this.isZoomReady = true;
      this.setLoadingState(false);
    } catch (error) {
      this.setLoadingState(false);
      console.log("error", error);
      this.failureToast(error.reason);
      this.navigateTo("default");
    }
  },
  async beforeRouteLeave(to, from, next) {
    if (this.client) {
      this.client.off("peer-video-state-change", () => {});
      this.client.off("media-sdk-change", () => {});
      this.client.off("active-speaker", () => {});
      this.client.off("video-active-change", () => {});
      this.client.off("passively-stop-share", () => {});
      this.client.off("active-share-change", () => {});
      this.client.off("chat-on-message", () => {});
      this.client.off("user-removed", () => {});
      await this.client.leave();
    }
    ZoomVideo.destroyClient();
    this.setSelectedOnspotConsultation({});
    next();
  },
  methods: {
    fetchContactConfig() {
      systemConfigService.fetchConfig("?title=APPOINTMENT_CONFIG").then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            let config = JSON.parse(data[0].value);
            this.systemConfig = config;
          } else {
            this.failureToast(response.data.messsage);
          }
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    async startScreenShare() {
      console.log("startScreenShare");
      if (this.stream.isStartShareScreenWithVideoElement()) {
        await this.stream.startShareScreen(
          document.querySelector("#my-screen-share-content-video")
        );
        document.querySelector("#my-screen-share-content-video").style.display =
          null;
        // screen share successfully started and rendered
      } else {
        await this.stream.startShareScreen(
          document.querySelector("#my-screen-share-content-canvas")
        );
        document.querySelector(
          "#my-screen-share-content-canvas"
        ).style.display = null;
        // screen share successfully started and rendered
      }
      this.screenShared = true;
    },
    stopScreenShare() {
      console.log("stopScreenShare");
      this.stream.stopShareScreen();
      this.screenShared = false;
      document.querySelector("#my-screen-share-content-canvas").style.display =
        "none";
      document.querySelector("#my-screen-share-content-video").style.display =
        "none";
    },
    async connectVideo() {
      try {
        if (this.stream.isRenderSelfViewWithVideoElement()) {
          await this.stream.startVideo({
            videoElement: document.querySelector("#my-self-view-video"),
          });
          document.querySelector("#my-self-view-canvas").style.display = "none";
          document.querySelector("#my-self-view-video").style.display = null;
          // video successfully started and rendered
        } else {
          await this.stream.startVideo();
          await this.stream.renderVideo(
            document.querySelector("#my-self-view-canvas"),
            this.client.getCurrentUserInfo().userId,
            1920,
            1080,
            0,
            0,
            3
          );
          document.querySelector("#my-self-view-video").style.display = "none";
          document.querySelector("#my-self-view-canvas").style.display = null;
          // video successfully started and rendered
        }
        this.videoEnabled = true;
        this.videoStarted = true;
      } catch (error) {
        this.failureToast(error.reason);
      }
    },
    // if desktop Safari
    connectAudio() {
      var isSafari = window.safari !== undefined;
      if (isSafari) {
        // desktop Safari, check if desktop Safari has initialized audio
        if (this.audioEncode && this.audioDecode) {
          // desktop Safari has initialized audio, continue to start audio
          this.stream.startAudio();
        } else {
          // desktop Safari has not initialized audio, retry or handle error
          console.log("safari audio has not finished initializing");
        }
      } else {
        // not desktop Safari, continue to start audio
        this.stream.startAudio();
      }

      this.audioStarted = true;
      this.audioEnabled = true;
    },
    toggleAudio() {
      if (this.audioEnabled) this.stream.muteAudio();
      else this.stream.unmuteAudio();

      this.audioEnabled = !this.audioEnabled;
    },
    async toggleVideo() {
      if (this.videoEnabled) {
        this.stream.stopVideo();
      } else {
        this.connectVideo();
      }
      this.videoEnabled = !this.videoEnabled;
    },
    toggleChatWindow() {
      this.chatOpened = !this.chatOpened;

      if (this.chatOpened) this.newMessages = false;
    },
    sendMessage() {
      this.chat.sendToAll(this.chatMessage);
      this.chatMessage = "";
    },
    scrollToBottom() {
      const div = this.$refs.scrollDiv;
      div.scrollTop = div.scrollHeight;
    },
    async leaveSession() {
      this.destroySession();
    },
    async ringPatient() {
      if (this.timer > 0 || this.ringing || this.isParticipantJoined) return;

      try {
        this.ringing = true;
        let response = await appointmentService.ringPatient({
          session_name: this.getTeleConsultation.sessionName,
        });

        let timeInSeconds =
          (this.systemConfig &&
            this.systemConfig.virtual &&
            this.systemConfig.virtual.wait_time) ||
          0.5;

        this.timer = timeInSeconds * 60;

        this.timerInterval = setInterval(() => {
          this.timer--;
          if (this.timer <= 0) {
            clearInterval(this.timerInterval);
          }
        }, 1000);

        this.ringing = false;
      } catch (error) {
        this.ringing = false;
        this.failureToast(
          error.response && error.response.data && error.response.data.message
        );
      }
    },
    destroySession() {
      if (this.isDoctor) this.navigateTo("default");
      else this.navigateTo("Rate Doctor");
    },
  },
};
</script>

<style lang='scss'>
.loader-wrapper.loderhide {
  display: none;
}
</style>