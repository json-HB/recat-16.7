import React, { Component } from "react";
import ReactDOM from "react-dom";
import Slider from "react-slick";

class SimpleSlider extends Component {
  render() {
    return (
      <div>
        <h2> Single Item</h2>
      </div>
    );
  }
}

ReactDOM.render(
  React.createElement(SimpleSlider, { name: "haibo" }),
  document.querySelector("#portal"),
  function() {
    console.log("loading success!");
  }
);
