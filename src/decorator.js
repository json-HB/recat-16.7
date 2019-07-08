import React, { Component } from "react";
import ReactDOM, { render } from "react-dom";
import ProtoType from "prop-types";

const { log } = console;

let click = WrapComponent =>
  class extends Component {
    static displayName = "event-click";

    constructor(props) {
      super(props);
      this.WrapInstance = React.createRef();
    }

    componentDidMount() {
      console.log(this.WrapInstance);
      let self = this;
      // ReactDOM.findDOMNode(this).addEventListener(
      //   "click",
      //   function() {
      //     console.log(1123);
      //     self.props.click && self.props.click(self.props.data);
      //   },
      //   { capture: false }
      // );
    }

    handleEvent = () => {
      console.log(122);
      let props = this.props;
      console.log(props, 31);
      props.click && props.click(this.WrapInstance.current);
    };

    render() {
      return (
        <WrapComponent
          ref={this.WrapInstance}
          onClick={() => console.log(123)}
          {...this.props}
        />
      );
    }
  };

@click
class ListItem extends Component {
  render() {
    return <li>{this.props.data}</li>;
  }
}

class List extends React.Component {
  static protoTypes = {
    data: ProtoType.array.isRequired
  };

  state = {
    img: ""
  };

  componentDidMount() {}

  change = ev => {
    log(ev.target.files);
    let reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.addEventListener(
      "load",
      () => {
        log(reader.result);
        this.setState({ img: reader.result });
      },
      false
    );
  };

  render() {
    const props = this.props;
    return (
      <div>
        <ul>
          {props.data.map((item, i) => {
            return <ListItem key={i} data={item} />;
          })}
        </ul>
        <input onChange={this.change} type="file" />
        <img src={this.state.img} alt="" />
      </div>
    );
  }
}

const Data = ["angular", "react", "vue"];

render(<List data={Data} />, document.querySelector("#root"), function() {
  console.log("render success!");
});

var twice = {
  apply(target, ctx, args) {
    return Reflect.apply(target, ctx, args) * 2;
  }
};

function sum(left, right) {
  return left + right;
}

let p = new Proxy(sum, twice);
log(p(1, 2));
