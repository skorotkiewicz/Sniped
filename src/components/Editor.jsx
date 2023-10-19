import { useState } from "react";
import AceEditor from "react-ace";
import ace from "ace-builds";
import SelectMode from "./SelectMode";
import { useAtom } from "react-atomize-store";
import { useNostr } from "../context/NostrProvider";
import { sendSignEvent } from "../utils";
import { useNavigate } from "react-router-dom";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github"; // monokai
import "ace-builds/src-noconflict/ext-language_tools";
import { TOPIC } from "../config";

const Editor = () => {
  const [mode, setMode] = useState("javascript");
  const [theme] = useAtom("theme");
  const [snip, setSnip] = useState("");
  const [fileName, setFileName] = useState("");
  const [keypair] = useAtom("keypair");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { publish } = useNostr();

  ace.config.set("basePath", "modes/");

  const sendMessage = () => {
    if (!(snip && fileName)) return;

    setLoading(true);

    sendSignEvent({
      kind: 1,
      keypair,
      tags: [["t", TOPIC]],
      content: JSON.stringify({ snip, mode, fileName }),
      publish,
    }).then(() => {
      setSnip("");
      setFileName("");
      setLoading(false);
      navigate(`/profile/${keypair.pk}`);
    });
  };

  return (
    <div className="Editor">
      <div className="inputs">
        <div className="in-p">
          <input
            type="text"
            onChange={(e) => setFileName(e.target.value)}
            placeholder="File name"
          />
        </div>

        <div className="in-p">
          <SelectMode setMode={setMode} />
        </div>
      </div>

      <AceEditor
        mode={mode}
        theme={theme}
        onChange={setSnip}
        name="editor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
        style={{ width: "100%" }}
      />

      {loading ? (
        <button>Loading...</button>
      ) : (
        <button onClick={sendMessage}>Create Snip</button>
      )}
    </div>
  );
};

export default Editor;
