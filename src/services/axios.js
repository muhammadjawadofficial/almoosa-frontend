import axios from 'axios';

let CancelToken = axios.CancelToken;
let source = CancelToken.source();

let controller = new AbortController();

let resetCancellation = function () {
    source.cancel('Operation canceled by the user.');
    source = CancelToken.source();
    controller.abort();
    controller = new AbortController();
}

controller.signal.addEventListener('abort', () => {
    console.log(controller.signal.aborted, 'aborted');
});

export { axios, source, controller, resetCancellation };