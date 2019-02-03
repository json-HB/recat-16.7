import ReactDOM from "react-dom";
import React from "react";

export default class Portal extends React.Component {
  render() {
    return ReactDOM.render(
      React.cloneElement(<A age={23} />, { name: "asdf" }, "asdfasdfa"),
      document.getElementById("portal")
    );
  }
}

class A extends React.Component {
  render() {
    console.log(this.props);
    return (
      <p>
        {this.props.name}
        {this.props.age}
        {this.props.children}
      </p>
    );
  }
}
