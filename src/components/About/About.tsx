import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import './About.scss';

import Markdown from 'react-markdown';
import { Loader, Segment } from 'semantic-ui-react';

interface IAboutState {
  markdownSource?: string;
}

export class About extends React.Component<RouteComponentProps, IAboutState> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      markdownSource: undefined,
    };
  }

  public async componentDidMount() {
    let markdownSource: string | undefined;
    try {
      markdownSource = await this.fetchMarkdown(require(`./about.md`));
    } catch (err) {
      // Swallow error.
    }
    this.setState(prevState => ({
      ...prevState,
      markdownSource,
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
    if (!this.state.markdownSource) {
      return (
        <Segment id='about'>
          <Loader />
        </Segment>
      );
    }

    return (
      <Segment id='about'>
        <Markdown
          source={this.state.markdownSource}
          // renderers={{ code: CodeBlock }}
        />
      </Segment>
    );
  }
}
