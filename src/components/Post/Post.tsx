import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import './Post.scss';

import { Segment } from 'semantic-ui-react';

interface IPostProps extends RouteComponentProps<{ post: string }> {}

export const Post: React.FunctionComponent<IPostProps> = ({
  history,
  location,
  match,
}) => {
  return <Segment>{match.params.post}</Segment>;
};
