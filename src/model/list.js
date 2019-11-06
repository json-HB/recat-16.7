import { observable, action, computed, autorun, when, reaction } from "mobx";

class List {
  constructor() {
    this.list = JSON.parse(localStorage.getItem("list")) || [];
    autorun(
      () => {
        console.log(this.list.length);
      },
      {
        delay: 0
      }
    );
    // when(() => this.list.length === 3, () => this.clear());
    reaction(
      () => this.list.reduce((pre, n) => pre + n.price, 0),
      (res, reaction) => {
        if (res > 10000) {
          reaction.dispose();
        }
      },
      {
        fireImmediately: true
      }
    );
  }
  @observable list = [];
  @action add(item) {
    if (this.list.some(i => i.price === item.price)) return;
    this.list.push(item);
  }
  @action clear() {
    this.list.length = 0;
  }
  @action remote(index) {
    this.list.split(index, 1);
  }
  @computed get total() {
    return this.list.reduce((pre, n) => pre + n.price, 0);
  }
}
export default new List();
