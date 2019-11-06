import React from "react";
import ReactDOM from "react-dom";
import Timer from "./model/timer";
import List from "./model/list";
import { observer, Provider, inject, Observer } from "mobx-react";
import md5 from "md5";
import enJson from "./lang/en.json";
import zhJson from "./lang/zh.json";
import moment from "moment";

console.log(React);

const LangContext = React.createContext();

function safeAccess(obj, props, fallback) {
  let res;
  if (typeof props === "string") {
    const parts = props.split(".");
    for (let i = 0, l = parts.length; i < l; i++) {
      res = obj[parts[i]];
      if (res) obj = res;
      else {
        res = fallback;
        let wrong = JSON.parse(
          localStorage.getItem("failList")
            ? localStorage.getItem("failList")
            : "{}"
        );
        wrong[props] = ++wrong[props] || 1;
        localStorage.setItem("failList", JSON.stringify(wrong));
        break;
      }
    }
    return res;
  }
}

const StringStragegy = {
  uppercase: function(val) {
    return val.toUpperCase();
  },
  lowercase: function(val) {
    return val.toLowerCase();
  },
  reverse(val) {
    return val
      .split("")
      .reverse()
      .join("");
  }
};

function replace(value, obj, prefix = "{") {
  console.log(`${prefix.repeat(2)}([^${prefix}]+)${prefix.repeat(2)}`);
  let reg =
    prefix === "{"
      ? new RegExp(`{{([^}]+)}}`, "g")
      : new RegExp(
          `${prefix.repeat(2)}([^${prefix}]+)${prefix.repeat(2)}`,
          "g"
        );
  return value.replace(reg, function(full, $1) {
    console.log(full);
    if ($1 && $1.indexOf(":") > -1) {
      console.log(111);
      let parts = $1.split(":");
      const part1 = obj[parts[0]];
      if (part1 instanceof Date) {
        console.log(222);
        return moment(part1).format(parts[1]);
      }
      if (typeof part1 === "string") {
        return parts.slice(1).reduce((pre, n) => {
          return StringStragegy[n] ? StringStragegy[n](pre) : pre;
        }, part1);
      }
    }
    if ($1 && obj[$1]) {
      return obj[$1];
    }
    return full;
  });
}

function $t(value, opt = {}) {
  return (
    <LangContext.Consumer>
      {content => {
        console.log(content);
        return (
          <div>
            <button onClick={content.changeLang}>toggle</button>
            <p>
              {opt.obj
                ? replace(
                    safeAccess(content.langs, value, "default"),
                    opt.obj,
                    opt.prefix
                  )
                : safeAccess(content.langs, value, "default")}
            </p>
          </div>
        );
      }}
    </LangContext.Consumer>
  );
}

function App(props) {
  console.log(props, 99999);
  return (
    <div>
      <T />
      <br />
      <ProfductList></ProfductList>
      <div>{$t("list.apple", { obj: { count: "10", date: new Date() } })}</div>
      <div>
        {$t("list.android", { obj: { text: "I cao xu shan" }, prefix: "%" })}
      </div>
    </div>
  );
}

@inject("timer")
@observer
class T extends React.Component {
  render() {
    const timer = this.props.timer;
    return (
      <div>
        <p>{timer.timer}</p>
        <br />
        <button onClick={() => timer.start()}>start</button>
        <button onClick={() => timer.reset()}>reset</button>
        <button onClick={() => this.setState({})}>reset</button>
      </div>
    );
  }
}

@inject("list")
@observer
class ProfductList extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }
  get list() {
    return (
      <ul>
        {this.props.list.list.map((item, i) => {
          return (
            <li key={i}>
              price: {item.price}, id: {item.id}
            </li>
          );
        })}
      </ul>
    );
  }

  add = ev => {
    if (ev.target.tagName === "INPUT" && ev.keyCode !== 13) return;
    const val = this.input.current.value;
    if (!val) return alert("no value");
    this.props.list.add({ price: +val, id: md5(val) });
  };

  render() {
    return (
      <div>
        <div>
          <input
            onKeyDown={this.add}
            type="number"
            step="10"
            ref={this.input}
          />
          <button onClick={this.add}>add</button>
          <br />
          {this.list}
          <h4>{this.props.list.total}</h4>
        </div>
      </div>
    );
  }
}

const AppD = observer(App);

const store = {
  list: List,
  timer: Timer
};

class LangComponment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: "en",
      langs: {},
      changeLang: this.changeLang
    };
  }

  componentDidMount() {
    this.setState(preState => {
      return {
        langs: enJson
      };
    });
  }

  changeLang = () => {
    this.setState(pre => ({
      lang: pre.lang === "en" ? "zh" : "en",
      langs: pre.lang === "en" ? zhJson : enJson
    }));
  };

  render() {
    const children =
      React.Children.count(this.props.children) === 1
        ? this.props.children
        : null;
    const res = React.cloneElement(children, {
      className: "haibo-dad"
    });
    return (
      <LangContext.Provider value={this.state}>{res}</LangContext.Provider>
    );
  }
}

ReactDOM.render(
  <LangComponment>
    <Provider {...store}>
      <AppD />
    </Provider>
  </LangComponment>,
  document.querySelector("#root"),
  function() {
    console.log("render");
    window._store_ = store;
  }
);
