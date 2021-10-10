import React from  'react';

import { Navbar, Container, Button } from 'react-bootstrap';

class MenuNavbar extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      socket: props.socket
    };

    this.playPause = this.playPause.bind(this)
  }

  playPause() {
    this.state.socket.emit('teste', 'play');
  }

  render() {
    return(
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">RSP</Navbar.Brand>
          <Navbar.Text>
            Now playing: {this.props.socket !== null} Teste
          </Navbar.Text>
          <Navbar.Text>
            <Button variant="primary" onClick={this.playPause}>>/||</Button>
          </Navbar.Text>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar>
      )
  }
}

export default MenuNavbar;