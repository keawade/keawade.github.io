import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import './Home.scss';

import moment from 'moment';
import { Header, List, Segment } from 'semantic-ui-react';

import { IPost, posts } from '../../posts/posts';

export const Home: React.FunctionComponent<RouteComponentProps> = props => {
  return (
    <Segment id='home'>
      <Header as='h1'>Articles and Projects</Header>
      <List className='article-list'>
        {posts
          .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1))
          .map(post => (
            <PostItem post={post} key={post.title} />
          ))}
      </List>
    </Segment>
  );
};

export const PostItem: React.FunctionComponent<{ post: IPost }> = ({
  post,
}) => {
  return (
    <List.Item className='article'>
      <div className='title'>
        <Header as='h2'>
          <Link to={`/posts/${post.filename}`}>{post.title}</Link>
        </Header>
        <div className='date'>
          {moment(post.date).format('LL')} - {post.author}
        </div>
      </div>
      <div className='excerpt'>{post.excerpt}</div>
    </List.Item>
  );
};
