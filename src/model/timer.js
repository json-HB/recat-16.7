import { observable, action, computed, reaction, when } from "mobx";

class Timer {
  @observable timer = 0;
  @action start() {
    this.timer += 1;
  }
  @action reset() {
    this.timer = 0;
  }
}
export default new Timer();
