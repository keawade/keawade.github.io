import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.scss';

import { About } from './components/About';
import { FourOhFour } from './components/FourOhFour';
import { Home } from './components/Home';
import { Navigation } from './components/Navigation';
import { Post } from './components/Post';

import Particles from 'react-particles-js';
import { Container } from 'semantic-ui-react';

import { particlesConfig } from './particlesConfig';

class App extends Component {
  public render() {
    return (
      <>
        <div id='particles-js'>
          <Particles params={particlesConfig} />
        </div>

        <Router>
          <Container id='application'>
            <Route component={Navigation} />

            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/about' component={About} />
              <Route exact path='/posts/:post' component={Post} />
              <Route component={FourOhFour} />
            </Switch>
          </Container>
        </Router>
      </>
    );
  }
}

export default App;
