import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import './Post.scss';

import Markdown from 'react-markdown';
import { Loader, Segment } from 'semantic-ui-react';
import { FourOhFour } from '../FourOhFour';

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
        <Segment>
          <Loader />
        </Segment>
      );
    }

    if (this.state.error) {
      return <FourOhFour {...this.props} />;
    }

    return (
      <Segment>
        <Markdown source={this.state.markdownSource} />
      </Segment>
    );
  }
}
