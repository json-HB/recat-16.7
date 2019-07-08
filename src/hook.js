import React, {
  useState,
  createContext,
  Component,
  useReducer,
  useEffect,
  useContext,
  useRef
} from "react";
import PropTypes from "prop-types";

document.documentElement.style.cssText = "height: 300vh";

const { log } = console;

function useCounter({ int, step }) {
  const [count, serCounter] = useState(int);
  const add = () => serCounter(count + step);
  return { count, serCounter, add };
}

function reducer(state, action) {
  switch (action.type) {
    case "reset":
      return { count: 0 };
    case "increment":
      return { count: state.count + (state.step || 1) };
    case "decrement":
      return { count: Math.max(state.count - 1, 0) };
    default:
      return state;
  }
}

function Reducer() {
  let [state, dispatch] = useReducer(reducer, { count: 0 });
  console.log(state);
  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>reset</button>
    </div>
  );
}

let TodoContent = createContext();

function todos(state, action) {
  switch (action.type) {
    case "add":
      return [
        ...state,
        {
          id: Math.random(),
          value: "",
          time: new Date(),
          completed: false
        }
      ];
    case "delete":
      return state.filter(item => item.id != action.id);
    case "isComplete":
      const id = state.findIndex(i => i.id == action.id);
      state[id].completed = action.complete;
      return state;
    case "reset":
      return action.payload;
    case "text":
      return state.map(item => {
        if (item.id === action.id) {
          return {
            ...item,
            value: action.text
          };
        }
        return item;
      });
    default:
      return state;
  }
}

function useEffectOnece(cb) {
  let didRun = useRef(false);
  if (!didRun.current) {
    cb();
    didRun.current = true;
  }
}

function AddTodo() {
  const [state, dispatch] = useReducer(todos, []);
  useEffectOnece(() => {
    dispatch({
      type: "reset",
      payload: JSON.parse(localStorage.getItem("name"))
    });
  });

  useEffect(() => {
    localStorage.setItem("name", JSON.stringify(state));
  });

  return (
    <div>
      <TodoContent.Provider value={dispatch}>
        <button onClick={() => dispatch({ type: "add" })}>add</button>
        <TodoList data={state} />
      </TodoContent.Provider>
    </div>
  );
}

function TodoList({ data }) {
  return data.map(item => <Item key={item.id} data={item} />);
}

function Item({ data }) {
  let dispatch = useContext(TodoContent);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        maxWidth: "50vw"
      }}
    >
      <input
        onChange={ev =>
          dispatch({
            type: "isComplete",
            complete: ev.target.checked,
            id: data.id
          })
        }
        defaultChecked={data.completed}
        type="checkbox"
      />
      <input
        onChange={ev => {
          dispatch({ type: "text", text: ev.target.value, id: data.id });
        }}
        className="form-control"
        type="text"
        defaultValue={data.value}
      />
      <button onClick={() => dispatch({ type: "delete", id: data.id })}>
        delete
      </button>
    </div>
  );
}

Item.defaultValue = {
  value: "haibo"
};

Item.propTypes = {
  data: PropTypes.object.isRequired
};

function Scroll(props) {
  let [position, setPositon] = useState(0);
  useEffectOnece(() => {
    window.addEventListener("scroll", function() {
      let top = (document.documentElement || document.body).scrollTop;
      setPositon(top);
    });
  });
  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", function() {});
    };
  });
  return <div>{props.children(position)}</div>;
}

let A = React.memo(
  function(props) {
    return (
      <div>
        {props.value}
        <p>{props.render("cao zhangle & songtan")}</p>
      </div>
    );
  },
  function(p, c) {
    console.log(p, c);
    if (p.value != c.value) return false;
    return true;
  }
);

const AppContext = createContext();

class B extends Component {
  static contextType = AppContext;
  render() {
    log(this, 999);
    return (
      <div
        style={{
          backgroundColor: this.context[this.context.type]
        }}
      >
        <p>I am B</p>
        <button
          onClick={() => {
            this.context.promise("haibo I love You !s");
          }}
        >
          click change context
        </button>
      </div>
    );
  }
}

class C extends Component {
  static getDerivedStateFromProps(p, s) {
    log(p, s, 888);
    if (p.value == "haibo") return null;
    return p;
  }

  getSnapshotBeforeUpdate(p, s) {
    const len = p.value.length;
    const arr = ["red", "yellow", "blue", "pink", "green", "purple"];
    return arr[parseInt(len / 5)];
  }

  state = {
    value: "1234567"
  };

  componentDidUpdate(p, s, s1) {
    if (s1) {
      document.body.style.backgroundColor = s1;
    }
  }

  render() {
    return (
      <div>
        <span>{this.state.value || "default"}</span>
      </div>
    );
  }
}

class E extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <p>hello E</p>
        <p>{this.props.name}</p>
        <button onClick={this.say.bind(this, "asg")}>click</button>
      </div>
    );
  }
}

function Ch(props) {
  return (
    <div>
      helo
      {props.children}
    </div>
  );
}

function decorator(Wrap) {
  return class Decorator extends Wrap {
    constructor(props) {
      super(props);
    }
    say(data) {
      alert(data);
    }
    render() {
      let Dom = super.render();
      return React.cloneElement(Dom, {
        ...this.props,
        className: "text-info"
      });
    }
  };
}

let D = decorator(E);

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    value: "haibo"
  };

  state = {
    value: this.props.value,
    thme: {
      dark: "black",
      light: "yellow",
      type: "dark",
      promise: data => {
        this.setState({
          value: data
        });
      }
    }
  };

  input = ev => {
    let { value } = ev.target;
    this.setState({
      value
    });
  };

  radio = ev => {
    let { value } = ev.target;
    this.setState(preState => {
      preState.thme.type = value;
      return preState;
    });
  };

  renderChild = data => {
    return <div>{data}</div>;
  };

  render() {
    return (
      <AppContext.Provider value={this.state.thme}>
        <div>
          <input type="text" onInput={this.input} />
          <label>dark</label>
          <input onChange={this.radio} type="radio" value="dark" name="thme" />
          <label>light</label>
          <input onChange={this.radio} type="radio" value="light" name="thme" />
          <A value={this.state.value} render={this.renderChild} />
          <B />
          <C value={this.state.value} />
          <br />
          <D name={"E"} />
        </div>
      </AppContext.Provider>
    );
  }
}

export default function Count() {
  const { count, serCounter, add } = useCounter({ int: 10, step: 4 });
  return (
    <div>
      <button onClick={add}>+</button>
      <p>{count}</p>
      <br />
      <Reducer />
      <AddTodo />
      <Scroll>
        {pos => (
          <div
            style={{
              display: "flex",
              fontSize: "50px",
              height: "100px",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotateY(${pos}deg)`
            }}
          >
            {pos}
          </div>
        )}
      </Scroll>
      <App />
    </div>
  );
}
