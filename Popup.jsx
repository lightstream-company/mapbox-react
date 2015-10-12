import React from 'react';

class Popup extends React.Component {
  render() {
    return <div>
      {this.props.children}
    </div>;
  }
}

export
default Popup;
