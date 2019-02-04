import React, {
  Component,
  Fragment,
  lazy,
  Suspense,
  createContext,
  useContext,
  memo,
  useState,
  useEffect,
  useReducer,
  useCallback,
  useRef,
  useImperativeMethods,
  forwardRef
} from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {
  types,
  flow,
  onAction,
  onSnapshot,
  applySnapshot,
  getEnv,
  getParent,
  getSnapshot,
  destroy
} from "mobx-state-tree";
import { observer, Provider, inject } from "mobx-react";
import Signals from "signals";

import Lazy from "././lazy";

const Help = new Signals();

const ProduceItem = types
  .model({
    name: types.string,
    price: types.number,
    title: types.string,
    onSale: types.boolean,
    discount: types.number,
    id: types.number
  })
  .actions(self => ({
    changeSale() {
      self.onSale = !self.onSale;
    },
    deleteItem() {
      getParent(self, 2).remove(self);
    },
    beforeDestroy() {
      console.log("beforeDestroy");
    }
  }));

const ProductList = types
  .model({
    items: types.optional(types.array(ProduceItem), []),
    loading: types.boolean,
    totalPrice: types.number
  })
  .volatile(self => ({
    localstate: 3
  }))
  .actions(self => ({
    add(item) {
      console.log(item);
      self.items.push(item);
    },
    afterCreate() {
      console.log("afterCreate");
      self.int();
    },
    remove(item) {
      getEnv(self).logger(item.id);
      destroy(item);
    },
    edit(item) {
      self.items.splice(self.items.findIndex(i => (i.id = item.id)), 1, item);
    },
    int: flow(function*() {
      self.loading = true;
      try {
        const res = yield fetch("http://localhost:3008/product").then(res =>
          res.json()
        );
        self.loading = false;
        self.items = res;
      } catch (e) {
        self.loading = false;
      }
    })
  }))
  .views(self => ({
    get productList() {
      return self.items;
    },
    get count() {
      return self.items.length;
    },
    get totalP() {
      return self.items.reduce((sum, next) => {
        let price =
          (next.onSale &&
            dealNum((next.price * next.discount) / 100, {
              round: true,
              len: 2
            })) ||
          0;
        return sum + price;
      }, 0);
    }
  }));

function dealNum(price, option) {
  if (typeof price !== "number") return 0;
  if (option && option.round) {
    return (
      Math.round(price * Math.pow(10, option.len)) / Math.pow(10, option.len)
    );
  }
  if (option && option.ceil) {
    return Math.ceil(price);
  }
  return Number(price);
}

function Pro({ data }) {
  return (
    <div className="container">
      <div className="row">
        {data.map(item => (
          <ProItem data={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}

function ProItem({ data }) {
  return (
    <Fragment>
      <div className="col-md-4">
        <div className="well">
          <div>
            <label>name</label>: {data.name}
          </div>
          <div>
            <label>price</label>: {data.price}
          </div>
          <div>
            <label>title</label>: {data.title}
          </div>
          <div>
            <label>Sale</label>: {data.onSale ? "sale" : "noSale"}
          </div>
          <div>
            <label>Discount</label>: {data.discount}%
          </div>
        </div>
        <div className="alert alert-info clearfix">
          <button
            className="btn btn-danger pull-left"
            onClick={data.deleteItem}
          >
            delete
          </button>
          <button
            className="btn btn-warning pull-right"
            onClick={() => Model.edit(getSnapshot(data))}
          >
            edit
          </button>
        </div>
      </div>
    </Fragment>
  );
}

function Panpel({ data }) {
  console.log(data);
  return (
    <div className="panel panel-success">
      <div className="panel-heading">total</div>
      <div className="panel-body">
        <div className="row">
          <div className="col-md-6">
            <label>Total price</label> {data.totalP}
          </div>
          <div className="col-md-6">
            <label>Sale</label> {data.count}
          </div>
        </div>
      </div>
    </div>
  );
}
let increate = 4;

let AddItem = React.forwardRef(function(props, ref) {
  const name = useRef();
  const title = useRef();
  const price = useRef();
  const sale = useRef();
  const discount = useRef();
  let initState = () => {
    return {
      id: props.type ? props.id : increate++,
      name: name.current.value,
      title: title.current.value,
      price: +price.current.value,
      onSale: sale.current.checked,
      discount: +discount.current.value
    };
  };
  return (
    <div className="model-main">
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">
            {props.type ? "edit" : "add"} product
          </div>
          <div className="panel-body">
            <div>
              <label htmlFor="">name</label>
              <input
                defaultValue={props.name}
                ref={name}
                type="text"
                className="form-control"
              />
            </div>
            <div>
              <label htmlFor="">price</label>
              <input
                defaultValue={props.price}
                ref={price}
                type="number"
                min="100"
                max="1000000"
                step="100"
                className="form-control"
              />
            </div>
            <div>
              <label htmlFor="">title</label>

              <input
                defaultValue={props.title}
                ref={title}
                type="text"
                className="form-control"
              />
            </div>
            <div className="">
              <input
                defaultChecked={props.onSale}
                ref={sale}
                id="checkbox"
                type="checkbox"
              />
              <label htmlFor="checkbox">onSale</label>
            </div>
            <div>
              <label>Discount</label>
              <input
                type="number"
                min="0"
                defaultValue={props.discount}
                ref={discount}
                max="100"
                step="1"
                className="form-control"
              />
            </div>
          </div>
          <div className="panel-footer">
            <div className="clearfix">
              <button
                className="btn btn-primary pull-left"
                onClick={() => {
                  props.type
                    ? ProductStore.edit(initState())
                    : ProductStore.add(initState());
                  Model.close();
                }}
              >
                {props.type ? "edit" : "save"}
              </button>
              <button
                className="btn btn-danger pull-right"
                onClick={() => Model.close().then(res => console.log(res))}
              >
                close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

function Aside() {
  let addItem = () => {
    Model.open();
  };
  const aside = useRef();
  const [show, setShow] = useState(true);
  let slide = () => {
    setShow(pre => {
      return !pre;
    });
  };
  let showAlert = () => {
    Alerts.info("react", 10000);
  };
  let { menu, setMenu } = useContext(MenuContext);
  const toggleMenu = () => {
    setMenu(!menu);
    menu && (document.querySelector(".bgPosition").style.display = "none");
  };

  const lazyShow = () => {
    Dialog.open().then(res => {
      console.log(res);
      res.props.complete.dispatch("1000");
    });
  };
  useEffect(() => {
    let dom = aside.current;
    let width = dom.offsetWidth;
    if (show) {
      document.querySelector(".right-slide").style.left = "-36px";
      document.querySelector(".main").style.marginRight = "0px";
    } else {
      width = 0;
      document.querySelector(".right-slide").style.left = "0px";
      document.querySelector(".main").style.marginRight = "200px";
    }
    dom.style.transform = `translateX(${width}px)`;
  }, [show]);
  return (
    <div ref={aside} className="aside">
      <button className="btn btn-primary btn-block" onClick={addItem}>
        addItem
      </button>
      <button className="btn btn-info btn-block" onClick={showAlert}>
        alert
      </button>
      <button className="btn btn-info btn-block" onClick={toggleMenu}>
        {menu ? "hide" : "show"} contextmenu
      </button>
      <button className="btn btn-primary btn-block" onClick={lazyShow}>
        lazyLoading
      </button>
      <span onClick={slide} className="right-slide">
        {show ? ">" : "<"}
      </span>
    </div>
  );
}

let Dialog = {
  open(props = {}) {
    return new Promise(function(resolve, reject) {
      require(["./lazy.jsx"], function({ default: componnet }) {
        props = Object.assign({}, props, { complete: new Signals() });
        props.complete.add(res => console.log(res));
        let DialogCom = React.createElement(componnet, props);

        // DialogCom.complete = new Signals();
        ReactDOM.render(DialogCom, document.querySelector("#portal"), () => {
          console.log("loading success!");
        });
        resolve(DialogCom);
      });
    });
  }
};

const Model = {
  open(data) {
    console.log(data);
    ReactDOM.render(
      <AddItem {...data} type={!!data} />,
      document.querySelector("#app-model"),
      function() {
        let dom = document.querySelector("#app-model");
        dom.style.cssText = "transform: scale(1); opacity: 1;";
      }
    );
  },
  close() {
    let dom = document.querySelector("#app-model");
    dom.style.cssText = "transform: scale(0); opacity: 0;";
    ReactDOM.unmountComponentAtNode(document.querySelector("#app-model"));
    return Promise.resolve("ok");
  },
  edit(data) {
    this.open(data);
  }
};

@inject("store")
@observer
class App extends Component {
  componentDidMount() {
    Help.add(() => {
      this.forceUpdate();
    });
  }
  render() {
    const { store } = this.props;
    console.log(store);
    if (store.loading) {
      return <div>loading....</div>;
    }
    return (
      <div>
        <div className="main">
          <p className="hide">{store.localstate}</p>
          <Pro data={this.props.store.productList} />
          <Panpel data={this.props.store} />
          <Logger />
          <ClientXY render={data => <Position data={data} />} />
          <Select
            // checked
            disabledMethod={item => ["react", "rxjs"].includes(item)}
            data={[
              "react",
              "vue",
              "angular",
              "haibo",
              "rxjs",
              "mobx",
              "nodejs",
              "css3",
              "es6",
              "webpack"
            ]}
          />
        </div>
        <Aside />
      </div>
    );
  }
}

function containerDom(parent, node) {
  let one = function(parent, node) {
    return parent !== node && parent.contains(node);
  };
  let two = function(parent, node) {
    while (node) {
      if (node.parent === parent) return true;
      node = node.parent;
    }
    return false;
  };
  return document.documentElement.contains
    ? one(parent, node)
    : two(parent, node);
}

function Position({ data: { x, y } }) {
  const dom = useRef();
  useEffect(() => {
    document.addEventListener(
      "click",
      function(ev) {
        let currentDom = ev.target;
        if (dom.current && !containerDom(dom.current, currentDom)) {
          console.log("dom contaienr");
          dom.current.style.display = "none";
        }
      },
      false
    );
    return () => document.removeEventListener("click", function() {}, false);
  }, []);
  useEffect(() => {
    if (x == null || y == null) return;
    console.log(dom.current, "show");
    let { clientWidth, clientHeight } = document.documentElement;
    let width = parseInt(getComputedStyle(dom.current).width);
    let height = parseInt(getComputedStyle(dom.current).height);
    let marginBottom = parseInt(
      getComputedStyle(dom.current.firstChild).marginBottom
    );
    console.log(clientWidth, clientHeight, width, height, x, y, marginBottom);
    if (x + width > clientWidth) {
      x = x - width;
    }
    if (y + height > clientHeight) {
      y = y - height + marginBottom;
    }
    dom.current.style.cssText = `left: ${x}px;top:${y}px;`;
    dom.current.firstChild.style.display = "block";
  }, [x, y]);
  const changeBg = ev => {
    let bg = ev.target.innerText;
    changeBgMethod(bg);
  };
  const changeBgMethod = bg => {
    document.body.style.background = bg;
    changeTitle(`${bg} - App`);
  };
  return (
    <div ref={dom} className="bgPosition">
      <ul onClick={changeBg}>{Position.render(Position.colorMap)}</ul>
    </div>
  );
}

function changeTitle(val) {
  document.title = val;
}

Position.colorMap = [
  "red",
  "orange",
  "yellow",
  "blue",
  "green",
  "purple",
  "yellowgreen",
  "azure",
  "blanchedalmond",
  "burlywood",
  "darkgrey",
  "dimgrey"
];
Position.render = data => {
  return data.map((item, i) => {
    return <li key={i}>{item}</li>;
  });
};

class Models extends Component {
  render() {
    return ReactDOM.createPortal(
      this.props.children,
      document.querySelector("#app-model")
    );
  }
}

const ProductStore = ProductList.create(
  {
    items: [],
    loading: true,
    totalPrice: 0
  },
  {
    arr: [],
    logger(val) {
      this.arr.push(val);
      localStorage.setItem("logger", JSON.stringify(this.arr));
    }
  }
);

onAction(ProductStore, data => {
  console.log(data, "onAction");
  Help.dispatch();
  ServiceStore.logger(data);
  ServiceStore.listen.dispatch(ServiceStore.arr);
});

onSnapshot(ProductStore, data => {
  console.log(data, "onSnapshort");
});

const MenuContext = createContext();

function MenuContextPC(props) {
  const [menu, setMenu] = useState(true);
  return (
    <MenuContext.Provider value={{ menu, setMenu }}>
      {props.children}
    </MenuContext.Provider>
  );
}

ReactDOM.render(
  <Provider store={ProductStore}>
    <MenuContextPC>
      <App />
    </MenuContextPC>
  </Provider>,
  document.getElementById("root"),
  function() {
    console.log("load ok", React);
  }
);

window.onload = function() {
  preBoot();
};

function preBoot() {
  let iconfont = document.createElement("i");
  iconfont.className = "icon-repayment-management iconfont";
  document.body.appendChild(iconfont);
  let div = document.createElement("div");
  div.setAttribute("id", "app-model");
  document.body.appendChild(div);
  let alert = document.createElement("div");
  alert.setAttribute("id", "app-alert");
  document.body.appendChild(alert);
}

function AlertComponent(props) {
  return (
    <div className={`alert alert-${props.type || "info"}`}>
      {props.text}
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={Alerts.close}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

let Alerts = {
  alertTime: null,
  open(text, time, type) {
    const alertDom = document.getElementById("app-alert");
    ReactDOM.render(
      React.createElement(AlertComponent, {
        text,
        type
      }),
      alertDom,
      function() {
        alertDom.querySelector(".alert").classList.add("show");
      }
    );
    clearTimeout(this.alertTime);
    this.alertTime = setTimeout(() => {
      this.close();
    }, time || 10000);
  },
  close() {
    if (!document.getElementById("app-alert").hasChildNodes()) return;
    let alertDom = document.getElementById("app-alert").querySelector(".alert");
    alertDom.classList.remove("show");
    alertDom.addEventListener(
      "transitionend",
      function() {
        console.log("end");
        ReactDOM.unmountComponentAtNode(document.getElementById("app-alert"));
      },
      false
    );
  }
};

["danger", "primary", "info", "warning", "success", "default"].forEach(item => {
  Alerts[item] = function(text, time) {
    Alerts.open(text, time, item);
  };
});

class Service {
  constructor(arr) {
    this.arr = arr || [];
    this.listen = new Signals();
  }
  logger(val) {
    this.arr.push(val);
  }
  clear() {
    this.arr.length = 0;
  }
  get(i) {
    return this.arr[i] || "defalut";
  }
  delete(i) {
    this.arr.splice(i, 1);
  }
}

var ServiceStore = new Service();

function Logger() {
  const [action, setAction] = useState([]);
  ServiceStore.listen.add(arr => {
    setAction(arr);
  });
  const typeMap = {
    add: "success",
    delete: "danger",
    edit: "info"
  };

  const deleteItem = i => {
    console.log(i);
    ServiceStore.delete(i);
    ServiceStore.listen.dispatch(ServiceStore.arr);
  };
  return (
    <div className="list-group">
      {action.map((val, index) => {
        const type = typeMap[val.name] || "default";
        return (
          <div
            key={index}
            className={`list-group-item list-group-item-${type}`}
          >
            <span className="badge badge-info">{val.name}</span>{" "}
            {val.path || "no operator"}
            <button
              onClick={deleteItem.bind(this, index)}
              className="btn btn-danger"
              style={{ marginLeft: "50%", transform: "translateX(-50%)" }}
            >
              delete
            </button>
          </div>
        );
      })}
    </div>
  );
}

class ClientXY extends Component {
  state = {
    x: null,
    y: null
  };
  static contextType = MenuContext;
  componentDidMount() {
    let self = this;
    window.addEventListener(
      "contextmenu",
      function(ev) {
        ev.preventDefault();
        console.log(ev, 444);
        self.setState({
          x: ev.clientX,
          y: ev.clientY
        });
      },
      false
    );
  }

  render() {
    console.log(this.context);
    return this.context.menu && <div>{this.props.render(this.state)}</div>;
  }
}

function Select({ data, checked, count = 1, disabledMethod }) {
  const selectDetail = useRef();
  let selectVal = useRef();
  let [active, setActive] = useState(null);
  let [selectArr, setSelectArr] = useState([]);
  let show = () => {
    selectDetail.current.classList.remove("hide");
  };
  let hide = () => {
    selectDetail.current.classList.add("hide");
  };
  let selectItem = (ev, item) => {
    ev.stopPropagation();
    !checked && (selectVal.current.value = item);
    !checked && hide();
  };
  let search = () => {
    let val = selectVal.current.value;
    if (!val) {
      console.log("alerts ");
      return Alerts.danger("message is not null", 20000);
    }
    if (data.some(i => i.includes(val))) {
      let index = data.findIndex(i => i.includes(val));
      show();
      setActive(index);
    } else {
      Alerts.danger("no regexp", 2000);
      setActive(null);
      selectVal.current.value = "";
    }
  };
  const changebox = (ev, i) => {
    let check = ev.target.checked;
    setSelectArr(old => {
      if (check) {
        if (old.includes(i)) {
          return old;
        } else {
          if (old.length >= count) {
            console.log("alert");
            Alerts.danger("that is enough", 3000);
            return old;
          }
          old.push(i);
          return old;
        }
      } else {
        return old.filter(item => i != item);
      }
    });
  };
  useEffect(() => {
    selectDetail.current.classList.add("hide");
  }, []);
  useEffect(() => {
    if (checked) {
      selectVal.current.value = selectArr.join(", ");
    }
  });
  return (
    <div className="select-main">
      <div className="input-group">
        <input
          ref={selectVal}
          type="text"
          onFocus={show}
          onKeyDown={ev => {
            if (ev.keyCode === 13) {
              search();
            }
          }}
          className="form-control"
        />
        <div onClick={search} className="input-group-addon">
          search
        </div>
      </div>
      <div className="detail" ref={selectDetail}>
        <div className="list-group">
          {data.map((item, i) => {
            let disabled = disabledMethod && disabledMethod(item);
            return (
              <div
                onClick={ev => selectItem(ev, item)}
                className={`list-group-item list-group-item-success text-center ${
                  i === active ? "active" : ""
                } ${disabled ? "disabled" : ""}`}
                key={i}
              >
                {item}
                &emsp;
                {checked && (
                  <input type="checkbox" onChange={ev => changebox(ev, item)} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
