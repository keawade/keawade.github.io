import { useEffect } from "react";
import markdownStyles from "./markdown-styles.module.css";
import prism from "prismjs";

// Add more languages here as they are needed
require("prismjs/components/prism-bash");
require("prismjs/components/prism-javascript");
require("prismjs/components/prism-json");
require("prismjs/components/prism-python");
require("prismjs/components/prism-powershell");

type Props = {
  content: string;
};

const PostBody = ({ content }: Props) => {
  useEffect(() => {
    prism.highlightAll();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default PostBody;
