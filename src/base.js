export default {
  install(Vue) {
    Vue.prototype.globalGetData = function () {
      console.log('getData');
    };
  }
}
