import * as React from 'react';

import './Home.scss';

import { Segment } from 'semantic-ui-react';

// tslint:disable-next-line:no-empty-interface
interface IHomeProps {
  // stuff
}

export const Home: React.FunctionComponent = (props: IHomeProps) => {
  return <Segment>Home Page</Segment>;
};
