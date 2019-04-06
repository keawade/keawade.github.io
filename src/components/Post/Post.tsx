import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import './Post.scss';

import moment from 'moment';
import Markdown from 'react-markdown';
import { Header, Loader, Segment } from 'semantic-ui-react';

import { FourOhFour } from '../FourOhFour';
import { CodeBlock } from './CodeBlock';

interface IPostProps extends RouteComponentProps<{ post: string }> {}

interface IPostState {
  markdownSource?: string;
  error?: string;
}

export class Post extends React.Component<IPostProps, IPostState> {
  constructor(props: IPostProps) {
    super(props);

    this.state = {
      markdownSource: undefined,
      error: undefined,
    };
  }

  public async componentDidMount() {
    let markdownSource: string | undefined;
    try {
      markdownSource = await this.fetchMarkdown(
        require(`../../posts/${this.props.match.params.post}.md`),
      );
    } catch (err) {
      // Swallow error.
    }
    this.setState(prevState => ({
      ...prevState,
      markdownSource,
      error: !markdownSource ? 'Failed to load article.' : undefined,
    }));
  }

  private fetchMarkdown = async (path: string) => {
    const response = await fetch(path);
    if (response.ok) {
      return response.text();
    }
    return undefined;
  };

  public render() {
    if (!this.state.markdownSource && !this.state.error) {
      return (
        <Segment id='post'>
          <Loader />
        </Segment>
      );
    }

    if (this.state.error) {
      return <FourOhFour {...this.props} />;
    }

    const title = this.props.match.params.post
      .slice(11)
      .split('_')
      .join(' ');
    const date = moment(this.props.match.params.post.slice(0, 10)).format('LL');
    const author = 'Keith Wade';

    return (
      <Segment id='post'>
        <Header as='h1'>
          {title}
          <Header.Subheader>
            {author} - {date}
          </Header.Subheader>
        </Header>

        <Markdown
          source={this.state.markdownSource}
          renderers={{ code: CodeBlock }}
        />
      </Segment>
    );
  }
}
