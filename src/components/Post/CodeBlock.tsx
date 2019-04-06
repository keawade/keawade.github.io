import React from 'react';

import hljs from 'highlight.js';

interface IProps {
  language?: string;
  value: string;
}

export class CodeBlock extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  private codeEl!: any;

  private setRef = (el: any) => {
    this.codeEl = el;
  };

  public componentDidMount() {
    this.highlightCode();
  }

  public componentDidUpdate() {
    this.highlightCode();
  }

  private highlightCode = () => {
    hljs.highlightBlock(this.codeEl);
  };

  public render() {
    return (
      <pre>
        <code ref={this.setRef} className={`language-${this.props.language}`}>
          {this.props.value}
        </code>
      </pre>
    );
  }
}
