import React, {
  Component,
  useState,
  useContext,
  createContext,
  useRef,
  useEffect
} from "react";
import { Spring, Transition, animated, Trail } from "react-spring";
import Portal from "./a.js";
const { log } = console;

const items = [
  {
    text: 1,
    key: 1
  },
  {
    text: 2,
    key: 2
  },
  {
    text: 3,
    key: 3
  },
  {
    text: 4,
    key: 4
  }
];

/* const UserContext = createContext();

const initalState = {
  user: [],
  canEdit: false
};

function UserStrore({ children }) {
  const [state, setState] = useState(initalState);
  const contentValue = React.useMemo(() => [state, setState], [state]);
  return (
    <UserContext.Provider value={contentValue}>{children}</UserContext.Provider>
  );
}

function Debug() {
  const [state] = useContext(UserContext);
  return <div>{JSON.stringify(state, null, 2)}</div>;
}

function User() {
  const [user, state] = useContext(UserContext);
  const addUser = () => {
    state(old => {
      return {
        ...old,
        user: [...old.user, Math.random()]
      };
    });
  };
  return (
    <div>
      <button onClick={() => addUser()}>add usr</button>
      <div>{user.user.join(", ")}</div>
    </div>
  );
}

function CanEdit() {
  const [{ canEdit }, action] = useContext(UserContext);
  const toggle = ev => {
    action(old => {
      return {
        ...old,
        canEdit: !canEdit
      };
    });
  };
  return (
    <div>
      <p>{canEdit.toString()}</p>
      <label htmlFor="">toggle</label>{" "}
      <input type="checkbox" onChange={ev => toggle(ev)} />
    </div>
  );
}

function InputUser() {
  const [user, setUser] = useState([{ use: "", complete: false }]);
  const [, setUserList] = useContext(UserContext);
  const value = useRef();
  const addUsr = ev => {
    setUser(old => {
      return [
        ...old,
        {
          use: value.current.value,
          complete: false
        }
      ];
    });
    setUserList(old => {
      return {
        ...old,
        user: user.map(item => item.use)
      };
    });
  };
  useEffect(() => {
    log("updating...");
    value.current.value = "";
  });
  const remove = j => {
    setUser(old => {
      return old.filter(i => i.use != j.use);
    });
  };
  return (
    <div>
      <input ref={value} type="text" />
      <button onClick={addUsr}>add User test</button>
      {user.map(item => (
        <p key={item.value}>
          {item.use} <span onClick={() => remove(item)}>X</span>
        </p>
      ))}
    </div>
  );
}

function UserLength() {
  const [{ user }] = useContext(UserContext);
  return (
    <h2>
      <em>User.length</em> {user.length}
    </h2>
  );
} */

export class App extends Component {
  state = {
    err: false,
    errMsg: null
  };

  static getDerivedStateFromError(err) {
    console.log(err);
    return {
      err: true
    };
  }

  componentDidCatch(err) {
    console.log(12);
    if (err) {
      this.setState({
        err: true,
        errMsg: err
      });
    }
  }

  render() {
    if (this.state.err) {
      return <p>err</p>;
    }
    return (
      <div>
        <SpringDemo />
      </div>
    );
  }
}
const text = "hello world";

class SpringDemo extends React.PureComponent {
  state = {
    reverse: false,
    arrText: [],
    toggle: false
  };
  onToggle = () => {
    this.setState(pre => ({
      toggle: !pre.toggle
    }));
  };

  onAddText = () => {
    const { arrText } = this.state;
    this.setState({
      toggle: true,
      arrText: [...arrText, text]
    });
  };

  onRemoveText = () => {
    const { arrText } = this.state;
    this.setState({
      toggle: true,
      arrText: arrText.slice(1)
    });
  };

  render() {
    let { reverse, arrText, toggle } = this.state;
    console.log(reverse);
    return (
      <div>
        <Spring
          from={{ number: 0 }}
          to={{ number: 100 }}
          onStart={props => {
            log(1);
          }}
        >
          {props => <div>{props.number}</div>}
        </Spring>
        <div className="container">
          <button onClick={this.onToggle}>Toggle</button>
          <button onClick={this.onAddText}>Add text</button>
          <button onClick={this.onRemoveText}>Remove text</button>
          <Spring
            from={{
              width: "300px",
              height: toggle ? 0 : "auto",
              overflow: "hidden"
            }}
            onStart={() => {
              console.log("start");
            }}
            force
            config={{ tension: 2000, friction: 100, precision: 1 }}
            to={{
              width: "300px",
              height: toggle ? "auto" : 0,
              overflow: "hidden"
            }}
          >
            {props => (
              <animated.div style={props}>
                {arrText.map(item => (
                  <p key={Math.random()}>{item}</p>
                ))}
              </animated.div>
            )}
          </Spring>
        </div>
        <Transition
          items={items}
          keys={item => item.key}
          from={{ transform: "translate3d(0,-40px,0)" }}
          enter={{ transform: "translate3d(0,0px,0)" }}
          leave={{ transform: "translate3d(0,-40px,0)" }}
        >
          {item => props => <div style={props}>{item.text}</div>}
        </Transition>
        <Transition
          items={toggle}
          from={{ position: "absolute", opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {toggle =>
            toggle
              ? props => <div style={props}>😄</div>
              : props => <div style={props}>🤪</div>
          }
        </Transition>
        <Transition
          native
          items={this.state.show}
          from={{ position: "absolute", overflow: "hidden", height: 0 }}
          enter={[{ height: "auto" }]}
          leave={{ height: 0 }}
        >
          {show =>
            show && (props => <animated.div style={props}>hello</animated.div>)
          }
        </Transition>
      </div>
    );
  }
}
