import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("lazy");
    return <div>lazyComponnet</div>;
  }
}

export default App;
