import * as React from 'react';

import './Post.scss';

import { Segment } from 'semantic-ui-react';

// tslint:disable-next-line:no-empty-interface
interface IPostProps {
  // stuff
}

export const Post: React.FunctionComponent = (props: IPostProps) => {
  return <Segment>Post Page</Segment>;
};
