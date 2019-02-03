import Action from "./action.js";
import Reflux from "reflux";

export default (Store = Reflux.createStore({
  listables: [Action],
  items: [1, 2],
  onAddItems: function(tiem) {
    this.items.push(item);
    this.trigger(this.items);
  }
}));
