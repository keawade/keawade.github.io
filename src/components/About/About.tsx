import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import './About.scss';

import { Segment } from 'semantic-ui-react';

export const About: React.FunctionComponent<RouteComponentProps> = props => {
  return <Segment>About Page</Segment>;
};
