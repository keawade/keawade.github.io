import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import './Navigation.scss';

import {
  faGitlab,
  faLinkedin,
  faMastodon,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Image, Menu } from 'semantic-ui-react';

export const Navigation: React.FunctionComponent<
  RouteComponentProps
> = props => {
  return (
    <Menu id='navigation' stackable>
      <Menu.Item as={Link} to='/' header className='icon-heading'>
        <Image avatar className='keawade-avatar' src='/GithubAvatar.png' />
        <span>Keith Wade</span>
      </Menu.Item>
      <Menu.Item as={Link} to='/about' link>
        about
      </Menu.Item>
      <Menu.Item href='https://twitter.com/TheKeithWade' target='_blank'>
        <FontAwesomeIcon className='heading-icon' size='lg' icon={faTwitter} />
      </Menu.Item>
      <Menu.Item href='https://fosstodon.org/@keawade' target='_blank'>
        <FontAwesomeIcon className='heading-icon' size='lg' icon={faMastodon} />
      </Menu.Item>
      <Menu.Item href='https://gitlab.com/keawade' target='_blank'>
        <FontAwesomeIcon className='heading-icon' size='lg' icon={faGitlab} />
      </Menu.Item>
      <Menu.Item href='https://linkedin.com/in/keawade' target='_blank'>
        <FontAwesomeIcon className='heading-icon' size='lg' icon={faLinkedin} />
      </Menu.Item>
    </Menu>
  );
};
