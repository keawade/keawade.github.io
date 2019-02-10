import * as React from 'react';

import './About.scss';

import { Segment } from 'semantic-ui-react';

// tslint:disable-next-line:no-empty-interface
interface IAboutProps {
  // stuff
}

export const About: React.FunctionComponent = (props: IAboutProps) => {
  return <Segment>About Page</Segment>;
};
