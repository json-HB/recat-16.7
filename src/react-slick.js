import React, { Component } from "react";
import ReactDOM from "react-dom";
import Slider from "react-slick";

export default class SimpleSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <div>
        <h2> Single Item</h2>
        <Slider {...settings}>
          <div>
            <h3>1</h3>
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
        </Slider>
      </div>
    );
  }
}

ReactDOM.render(
  <SimpleSlider />,
  document.querySelector("#portal"),
  function() {
    let link = document.createElement("link");
    Object.entries({
      rel: "stylesheet",
      type: "text/css",
      charset: "UTF-8",
      href:
        "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
    }).forEach(item => {
      link.setAttribute(item[0], item[1]);
    });
    link.async = true;
    link.addEventListener(
      "load",
      function() {
        console.log("link react-slick.css success!");
      },
      false
    );
    document.head.appendChild(link);
    document.head.innerHTML += `<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />`;
  }
);
