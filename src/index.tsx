import React, { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";
import { createRoot } from "react-dom/client";
import "./style.css";

async function getData() {
  const res = await fetch(process.env.PUBLIC_URL + "/vimtutor_base.txt");
  return res.text();
}
const App = () => {
  const [data, setData] = useState("");
  useEffect(() => {
    getData().then((text) => {
      setData(text);
    });
  }, []);

  function handleEditorDidMount(editor, monaco) {
    // setup key bindings before monaco-vim setup

    // setup key bindings
    editor.addAction({
      // an unique identifier of the contributed action
      id: "some-unique-id",
      // a label of the action that will be presented to the user
      label: "Some label!",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],

      // the method that will be executed when the action is triggered.
      run: function (editor) {
        console.log("Saving data...");
        localStorage.setItem("editor-code", editor.getValue());
        return null;
      },
    });

    // setup monaco-vim
    window.require.config({
      paths: {
        "monaco-vim": process.env.PUBLIC_URL + "/monaco-vim.0.4.1.min.js", // https://unpkg.com/monaco-vim@0.4.1/dist/monaco-vim.js
      },
    });
    window.require(["monaco-vim"], function (MonacoVim) {
      const statusNode = document.querySelector(".status-node");
      MonacoVim.initVimMode(editor, statusNode);
    });

    editor.focus();
  }
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Editor
        height="90vh"
        language="markdown"
        onMount={handleEditorDidMount}
        defaultValue={data}
        theme="vs-dark"
        options={{ detectIndentation: false, tabSize: 8 }}
      />
      <code className="status-node"></code>
    </div>
  );
};

const rootNode = document.getElementById("root");
if (rootNode) {
  const root = createRoot(rootNode);
  root.render(<App />);
}
