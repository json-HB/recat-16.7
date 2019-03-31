import React, { Component } from "react";
import ReactDOM, { render } from "react-dom";
import ProtoType from "prop-types";

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
      ReactDOM.findDOMNode(this).addEventListener(
        "click",
        function() {
          self.props.click && self.props.click(self.props.data);
        },
        { capture: false }
      );
    }

    handleEvent = () => {
      let props = this.props;
      console.log(props, 3);
      props.click && props.click(this.WrapInstance.current);
    };

    render() {
      return (
        <WrapComponent
          ref={this.WrapInstance}
          {...this.props}
          click={this.handleEvent}
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

  render() {
    const props = this.props;
    return (
      <div>
        <ul>
          {props.data.map((item, i) => {
            return (
              <ListItem click={item => console.log(item)} key={i} data={item} />
            );
          })}
        </ul>
      </div>
    );
  }
}

const Data = ["angular", "react", "vue"];

render(<List data={Data} />, document.querySelector("#root"), function() {
  console.log("render success!");
});
