import React, { Component, useState } from "react";

let Wrap = WrapComponent => {
  return class Wrap extends Component {
    render() {
      WrapComponent.prototype.say = function() {
        console.log("hello");
      };
      Object.setPrototypeOf(WrapComponent.prototype, Component.prototype);
      Object.setPrototypeOf(WrapComponent, Component);
      Object.defineProperty(WrapComponent.prototype, "componentDidMount", {
        value: function() {
          console.log("mount");
        }
      });
      WrapComponent.defaultProps = {
        name: "haibo"
      };
      return (
        <React.Fragment>
          <div>hello</div>
          <WrapComponent {...this.props} />
        </React.Fragment>
      );
    }
  };
};

@Wrap
export class App {
  render() {
    console.log(this);
    return (
      <div>
        <p>decorator</p>
        <p>{this.props.name}</p>
        <Text text={artical} />
      </div>
    );
  }
}

var artical =
  "adsfjalkjdflkajsdl;kfj alkjsdfl;kajsl;djf akdsjfl;kajldsfj alksdjfl;ka dlkfja;ldkjfl;aksjdf kajsd ";

function Text({ text }) {
  const short = text.slice(0, 50);
  const [status, useStatus] = useState(false);
  const change = () => {
    useStatus(old => {
      return !old;
    });
  };
  return (
    <div>
      {status ? short : text}
      <button onClick={change}>{status ? "more" : "less"}</button>
    </div>
  );
}
