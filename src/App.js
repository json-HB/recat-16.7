import React, {
  Component,
  Fragment,
  Suspense,
  lazy,
  createRef,
  createContext
} from "react";
import ReactDOM from "react-dom";
import logo from "./logo.svg";
import "./App.css";
import { List, Map } from "immutable";
import PropTypes from "prop-types";
import { Transition } from "react-transition-group";

const Content = createContext({
  text: "hello"
});

function ChildText(props) {
  return (
    <Content.Consumer>
      {context => <p {...props}>{context.text} - child</p>}
    </Content.Consumer>
  );
}

class Text extends Component {
  render() {
    return (
      <Content.Consumer>
        {context => (
          <p {...this.props}>
            {context.text}
            <ChildText />
          </p>
        )}
      </Content.Consumer>
    );
  }
}

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "hello"
    };

    this.toggleTheme = () => {
      this.setState(state => ({
        text: Math.random()
      }));
    };
  }

  render() {
    // The ThemedButton button inside the ThemeProvider
    // uses the theme from state while the one outside uses
    // the default dark theme
    return (
      <Fragment>
        <Content.Provider value={this.state}>
          <Text />
        </Content.Provider>
        <button onClick={this.toggleTheme}>change</button>
      </Fragment>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.el = document.createElement("div");
    this.el.id = "app1";
    document.body.appendChild(this.el);
    this.input = createRef();
  }

  state = {
    name: "haibo",
    list: List.of(1, 2, 3, 4),
    in: false
  };

  static defaultProps = {
    age: 24
  };

  static getDerivedStateFromProps(p, s) {
    console.log(p, s, 888);
    return null;
  }

  getSnapshotBeforeUpdate(p, s) {
    console.log(p, s);
    return s.name === "haibo" ? "1" : null;
  }

  componentDidUpdate(p, s, n) {
    console.log(p, s, n);
  }

  inFuc() {
    console.log("inner");
  }

  click = () => {
    console.log(222, this);
    this.inFuc();
  };

  componentDidMount() {
    document.onclick = function() {
      fetch("https://localhost:3008/demo.json", {
        method: "GET",
        mode: "cors",
        headers: {
          "content-type": "javascript/json"
        },
        credentials: "include",
        cache: "reload",
        redirect: "follow",
        referrer: "client"
      })
        .then(res => {
          return res.json();
        })
        .then(res => {
          console.log(res);
        });
    };
    console.info(this.input.current, 888);
  }

  render() {
    console.log(this.state, 77);
    return (
      <div className="App">
        <header
          className="App-header"
          onClick={() => this.setState({ name: Math.random() })}
        >
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <div />
        {(() => {
          return ReactDOM.createPortal(<Demo name="2345" />, this.el);
        })()}
        <Fragment>{this.state.name}</Fragment>
        <Demo
          setProps={data => this.setState({ name: data })}
          name={this.state.name}
        />
        <input type="text" ref={this.input} />
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div />
        <p onClick={this.click}>click me fuc</p>
        <PropCheck
          arr={[1, 2]}
          string="string"
          number={33}
          func={() => console.log("func")}
          obj={{ a: "hello" }}
          bool
          enum="a"
        >
          <span>world2</span>
          <span>hello</span>
        </PropCheck>
        <Article />
      </div>
    );
  }
}

export default App;

class Demo extends Component {
  state = {};

  static defaultProps = {
    age: 27
  };

  static getDerivedStateFromProps(p, s) {
    console.log(p, s, "demo");
    return p;
  }

  render() {
    console.log(this.state, 877);
    return (
      <div onClick={() => this.props.setProps("haibo")}>{this.state.name}</div>
    );
  }
}

class PropCheck extends Component {
  static displayName = "haibo";
  render() {
    console.log(this.props, this);
    let child = React.Children.map(this.props.children, (ele, key) => {
      console.log(ele, key);
      return React.isValidElement(ele) ? (
        <div>
          {key}
          {ele}
        </div>
      ) : null;
    });
    return (
      <div>
        {JSON.stringify(this.porps)}
        {child}
      </div>
    );
  }
}

PropCheck.propTypes = {
  arr: PropTypes.array.isRequired,
  number: PropTypes.number.isRequired,
  bool: PropTypes.bool.isRequired,
  string: PropTypes.string.isRequired,
  func: PropTypes.func.isRequired,
  obj: PropTypes.object.isRequired,
  enum: PropTypes.oneOf(["a", "b"]).isRequired
};
