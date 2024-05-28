<template>
  <div class="zoom-connect">
    <video id="my-self-view-video" width="1920" height="1080"></video>
    <canvas id="my-self-view-canvas" width="1920" height="1080"></canvas>
    <canvas id="participant-videos-canvas" width="1920" height="1080"></canvas>

    <video
      id="my-screen-share-content-video"
      height="1080"
      width="1920"
    ></video>
    <canvas
      id="my-screen-share-content-canvas"
      height="1080"
      width="1920"
    ></canvas>

    <div class="d-flex justify-content-center">
      <button @click="toggleAudio">
        audio {{ audioEnabled ? "off" : "on" }}
      </button>
      <button @click="toggleVideo">
        video {{ videoEnabled ? "off" : "on" }}
      </button>
      <button @click="stopScreenShare" v-if="screenShared">stop share</button>
      <button @click="startScreenShare" v-else>share</button>
    </div>
  </div>
</template>

<script>
import ZoomVideo from "@zoom/videosdk";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      stream: null,
      client: null,
      audioEncode: false,
      audioDecode: false,
      audioEnabled: true,
      videoEnabled: true,
      screenShared: false,
    };
  },
  computed: {
    ...mapGetters("appointment", ["getTeleConsultation"]),
    ...mapGetters("user", ["getUserInfo"]),
  },
  async mounted() {
    this.client = ZoomVideo.createClient();

    let sessionName = this.getTeleConsultation.sessionName;
    let token = this.getTeleConsultation.signature;
    let username = this.getFullName(this.getUserInfo);
    let password = this.getTeleConsultation.password;

    await this.client.init("en-US", "Global", { patchJsMedia: true });
    await this.client.join(sessionName, token, username, password);

    this.stream = this.client.getMediaStream();

    this.connectAudio();
    this.connectVideo();

    this.client.getAllUser().forEach((user) => {
      if (user.bVideoOn) {
        this.stream.renderVideo(
          document.querySelector("#participant-videos-canvas"),
          user.userId,
          1920,
          1080,
          0,
          0,
          3
        );
      }
      if (user.sharerOn) {
        this.stream.startShareView(
          document.querySelector("#users-screen-share-content-canvas"),
          user.userId
        );
      }
    });

    this.client.on("peer-video-state-change", (payload) => {
      console.log("payload", payload);
      if (payload.action === "Start") {
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

    this.client.on("video-active-change", (payload) => {
      console.log("Active speaker, use for any video adjustments", payload); // new active speaker, for example, use for video rendering changes, size changes, depending on your use case.
    });

    this.client.on("passively-stop-share", (payload) => {
      console.log(payload);
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
  },
  methods: {
    async startScreenShare() {
      if (this.stream.isStartShareScreenWithVideoElement()) {
        await this.stream.startShareScreen(
          document.querySelector("#my-screen-share-content-video")
        );
        // screen share successfully started and rendered
      } else {
        await this.stream.startShareScreen(
          document.querySelector("#my-screen-share-content-canvas")
        );
        // screen share successfully started and rendered
      }
    },
    stopScreenShare() {
      this.stream.stopShareScreen();
    },
    async connectVideo() {
      if (this.stream.isRenderSelfViewWithVideoElement()) {
        await this.stream.startVideo({
          videoElement: document.querySelector("#my-self-view-video"),
        });
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
        // video successfully started and rendered
      }
    },
    connectAudio() {
      // if desktop Safari
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
  },
};
</script>

<style>
.zoom-connect {
  position: relative;
  height: 100%;
}
#my-self-view-video,
#my-self-view-canvas,
#participant-videos-canvas,
#my-screen-share-content-video,
#my-screen-share-content-canvas {
  position: absolute;
  width: 100%;
  height: auto;
}
</style>