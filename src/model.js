import ReactDOM from "react-dom";
import React from "react";
import "./App.css";

const { log } = console;

const port = document.querySelector("#portal");

function $(dom) {
  return {
    css: function(obj) {
      for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
          dom.style[i] = obj[i];
        }
      }
    }
  };
}

export default class Portal extends React.Component {
  render() {
    return ReactDOM.render(
      React.cloneElement(<A age={23} />, { name: "asdf" }, "asdfasdfa"),
      document.getElementById("portal")
    );
  }
}

const Model = {
  show(params = {}) {
    log("sd");
    ReactDOM.render(<ModelComponent {...params} />, port);
  }
};

class ModelComponent extends React.Component {
  constructor(props) {
    super(props);
    this.dom = React.createRef();
  }

  componentDidMount() {
    let { clientX, clientY } = this.props.e;
    setTimeout(() => {
      $(this.dom.current).css({
        left: clientX + "px",
        top: clientY + "px",
        transformOrigin: clientX + "px " + clientY + "px"
      });
      this.dom.current.hasAttribute("hidden") &&
        this.dom.current.removeAttribute("hidden");
      this.dom.current.classList.add("show");
    }, 0);
    document.addEventListener(
      "click",
      e => {
        console.log(e.target);
        let target = e.target;
        if (
          !this.dom.current.contains(target) &&
          !this.dom.current.hasAttribute("hidden")
        ) {
          this.dom.current.setAttribute("hidden", "");
        }
      },
      false
    );
  }

  componentDidUpdate() {
    let { clientX, clientY } = this.props.e;
    setTimeout(() => {
      $(this.dom.current).css({
        left: clientX + "px",
        top: clientY + "px",
        transformOrigin: clientX + "px " + clientY + "px"
      });
      this.dom.current.hasAttribute("hidden") &&
        this.dom.current.removeAttribute("hidden");
      this.dom.current.classList.add("show");
    }, 0);
  }

  render() {
    return (
      <div className="model" ref={this.dom}>
        <div className="header">{this.props.title}</div>
        <div className="content">{this.props.content}</div>
        <div className="fotter">{this.props.fotter}</div>
      </div>
    );
  }
}

function B({ name }) {
  return <div>{name || "default"}</div>;
}

class P extends React.Component {
  render() {
    let dom = ReactDOM.createPortal(
      this.props.children,
      document.querySelector("#portal")
    );
    log(dom);
    return dom;
  }
}

class A extends React.Component {
  show = e => {
    Model.show({
      e: e,
      title: "title",
      content: "content",
      footer: "footer"
    });
  };
  render() {
    let b = React.createElement(B, {
      name: "age"
    });
    return (
      <div>
        <P>
          <B></B>
        </P>
        {b}
        <button
          style={{ position: "absolute", left: "300px", top: "500px" }}
          onClick={this.show}
        >
          click
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <A name="haibo" />,
  document.querySelector("#root"),
  function() {
    log("render success");
  }
);
