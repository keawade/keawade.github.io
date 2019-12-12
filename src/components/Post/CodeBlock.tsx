import React from 'react';

import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-typescript';
import 'prismjs/plugins/autolinker/prism-autolinker';

interface IProps {
  language?: string;
  value: string;
}

export class CodeBlock extends React.Component<IProps> {
  private ref: React.RefObject<HTMLElement>;

  constructor(props: IProps) {
    super(props);
    this.ref = React.createRef();
  }

  public componentDidMount() {
    this.highlightCode();
  }

  public componentDidUpdate() {
    this.highlightCode();
  }

  private highlightCode = () => {
    if (this.ref && this.ref.current) {
      Prism.highlightElement(this.ref.current);
    }
  };

  public render() {
    console.log(this.props.language);
    return (
      <pre>
        <code ref={this.ref} className={`language-${this.props.language}`}>
          {this.props.value.trim()}
        </code>
      </pre>
    );
  }
}
