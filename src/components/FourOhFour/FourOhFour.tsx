import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import './FourOhFour.scss';

import { Segment } from 'semantic-ui-react';

export const FourOhFour: React.FunctionComponent<RouteComponentProps> = ({
  history,
  location,
  match,
}) => {
  return <Segment>Not Found</Segment>;
};
