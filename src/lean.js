import React, {
  Component,
  PureComponent,
  Fragment,
  Suspense,
  lazy,
  createRef,
  useReducer,
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
  Consumer,
  Provider
} from "react";
import { render } from "react-dom";
import "./App.css";

const context = createContext({
  name: "haibo"
});

function App() {
  const [count, setCount] = useState(() => {
    return parseInt(Math.random() * 10);
  });
  const [color, setColor] = useState(true);
  const [name, setName] = useState("haibo");

  return (
    <div>
      <p style={{ backgroundColor: color ? "red" : "yellow" }}>{count}</p>
      <button className="btn btn-prinary" onClick={() => setCount(count + 1)}>
        add
      </button>
      <button className="btn btn-prinary" onClick={() => setCount(count - 1)}>
        substract
      </button>
      <button className="btn btn-prinary" onClick={() => setColor(!color)}>
        change Color
      </button>
      <button
        className="btn btn-prinary"
        onClick={() => {
          setName("jason");
        }}
      >
        change name
      </button>
      <TextRender nums={count} />
      {/* <CountDown hours={1} minutes={1} seconds={4} /> */}
      <Context />
      <context.Provider value={{ name }}>
        <context.Consumer>
          {data => {
            log(data);
            return <p>{data.name}</p>;
          }}
        </context.Consumer>
      </context.Provider>
      <Usereduce />
      <CallBack count1={count} />
      <Counter />
      <ChildrenNode>
        <A name="a" />
        <A name="b" />
      </ChildrenNode>
      <B name="b">
        <p>child</p>
      </B>
      {/* <Login /> */}
    </div>
  );
}

function C1({count}) {
  return <div>
    {count}
  </div>
}

var formcreate = WrapComponent =>
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {},
        submit: false
      };
    }

    change = field => e => {
      let { value } = e.target;
      let { fields } = this.state;
      fields[field] = value;
      log(value);
      this.setState({
        fields
      });
    };

    handleSubmit = () => {
      this.setState({
        submit: true
      });
    };

    render() {
      log(this.state);
      const newProps = Object.assign({}, this.props, {
        submit: this.handleSubmit,
        fields: filed => ({
          onChange: this.change(filed)
        })
      });
      const result = (
        <div>
          {Object.entries(this.state.fields).map(([key, val]) => {
            return (
              <p key={key}>
                {key}: {val}
              </p>
            );
          })}
        </div>
      );
      return (
        <div>
          <WrapComponent {...newProps} />
          {this.state.submit && result}
        </div>
      );
    }
  };

@formcreate
class Login extends Component {
  render() {
    return (
      <div>
        <div>
          <label htmlFor="1">name</label>
          <input type="text" {...this.props.fields("password")} />
        </div>
        <div>
          <label htmlFor="1">password</label>
          <input type="text" {...this.props.fields("password")} />
        </div>
        <div>
          <button type="buttom" onClick={this.props.submit}>
            submit
          </button>
        </div>
      </div>
    );
  }
}

function A(props) {
  log(props);
  return (
    <div>
      {props.name}
      <div>{props.children}</div>
    </div>
  );
}

let wrap = WrapComponent => {
  return class extends WrapComponent {
    constructor(props) {
      log(props, "------");
      super();
    }

    say = () => {
      this.setState({
        age: 20
      });
    };

    componentDidMount() {
      super.componentDidMount && super.componentDidMount();
      this.setState({
        num: 1
      });
      document.title = this.title;
    }

    render() {
      log(this.props, 88);
      const ele = super.render();
      log(ele, "ele");
      const Ele = React.cloneElement(
        ele,
        {
          defaultValue: "val",
          onChange: e => {
            log(e.target.value);
          }
        },
        ele.props.children
      );
      return (
        <div>
          parseInt
          <br />
          {!this.norender && Ele}
        </div>
      );
    }
  };
};

function C(props) {
  return <div>{props.name}</div>;
}

@wrap
class B extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: 10
    };
    this.title = "B";
    this.norender = false;
  }
  render() {
    log(this, 89999);
    const Ele = React.createElement(C, {
      name: "c"
    });
    return <input type="text" />;
  }
}

class ChildrenNode extends Component {
  render() {
    const childs = React.Children.map(this.props.children, child =>
      React.cloneElement(
        child,
        {
          state: "parent"
        },
        <p>helo</p>
      )
    );
    return <div>{childs}</div>;
  }
}

function Counter() {
  const [count, setCount] = useState(0);
  const preRef = React.useRef();
  useEffect(() => {
    preRef.current = count;
  });
  var preCount = preRef.current;
  return (
    <div>
      {count} and {preCount}
      <br />
      <button onClick={() => setCount(pre => pre + 1)}>add</button>
    </div>
  );
}

function CallBack({ count1 }) {
  // const [count, setCount] = useState(count1);

  const c = useMemo(() => {
    return count1.toString() + Math.random();
  }, [count1]);

  return (
    <div>
      <h1>Count: {c}</h1>
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { count: state.count + 1 };
    case "sub":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Usereduce() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <div>
      <p>{state.count}</p>
      <div>
        <button onClick={() => dispatch({ type: "add" })}>add</button>
        <button onClick={() => dispatch({ type: "sub" })}>sub</button>
      </div>
    </div>
  );
}

function Context() {
  const value = useContext(context);
  return <div>{value.name}</div>;
}

function CountDown({ hours = 0, minutes = 0, seconds = 0 }) {
  const [over, setOver] = useState(false);
  const [pause, setPause] = useState(false);
  const [timer, setTimer] = useState({
    h: parseInt(hours),
    m: parseInt(minutes),
    s: parseInt(seconds)
  });

  let tick = () => {
    if (over || pause) return;
    let { h, m, s } = timer;
    if (h == 0 && m == 0 && s == 0) setOver(true);
    else if (m == 0 && h == 0)
      setTimer({
        h: h - 1,
        m: 59,
        s: 59
      });
    else if (s == 0)
      setTimer({
        h: h,
        m: m - 1,
        s: 59
      });
    else
      setTimer({
        h: h,
        m: m,
        s: s - 1
      });
  };

  let renderNums = nums => {
    log(timer);
    return nums.toString().padStart(2, "0");
  };

  let reset = () => {
    setTimer({
      h: parseInt(hours),
      m: parseInt(minutes),
      s: parseInt(seconds)
    });
    setPause(false);
    setOver(false);
  };

  useEffect(() => {
    log("effect1");
    let timer = setInterval(() => tick(), 1000);
    return () => clearInterval(timer);
  });

  return (
    <div>
      <p>
        <span>{renderNums(timer.h)}</span>:<span>{renderNums(timer.m)}</span>:
        <span>{renderNums(timer.s)}</span>
      </p>
      <div>{over && "Time is Over"}</div>
      <div className="btn">
        <button type="button" onClick={() => setPause(!pause)}>
          {pause ? "start" : "pause"}
        </button>
        <button type="button" onClick={reset}>
          reset
        </button>
      </div>
    </div>
  );
}

class TextRender extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nums: 0,
      name: "haob"
    };
  }

  static getDerivedStateFromProps(prePros, state) {
    log(prePros, state);
    if (prePros.nums == state.nums || prePros.nums == 0) {
      return null;
    }
    return {
      nums: prePros.nums
    };
  }

  shouldComponentUpdate(nextPro, state) {
    log(nextPro, state, "show");
    if (state.nums <= 0) {
      return false;
    }
    return true;
  }

  render() {
    log(2);
    return (
      <ul>
        {[...new Array(this.state.nums)].map((item, i) => {
          return <li key={i}>{i}</li>;
        })}
      </ul>
    );
  }
}

render(<App />, document.querySelector("#root"), () => {
  log("success");
});

function log(...arg) {
  console.log.apply(console, arg);
}
