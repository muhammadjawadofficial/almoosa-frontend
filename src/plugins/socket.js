import io from 'socket.io-client';

const socket = io(process.env.VUE_APP_SERVER);

export default {
  install(Vue) {
    Vue.prototype.$socket = socket;
  },
};
