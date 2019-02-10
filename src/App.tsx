import React, { Component } from 'react';
import './App.scss';

import { Navigation } from './components/Navigation';

import Particles from 'react-particles-js';
import { Container, Segment } from 'semantic-ui-react';

import { particlesConfig } from './particlesConfig';

class App extends Component {
  public render() {
    return (
      <>
        <div id='particles-js'>
          <Particles params={particlesConfig} />
        </div>

        <Container id='application'>
          <Navigation />
          <Segment>Content</Segment>
        </Container>
      </>
    );
  }
}

export default App;
