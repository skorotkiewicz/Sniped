// deno-lint-ignore-file no-explicit-any
import { useState } from "react";
import { useAtom } from "react-atomize-store";
import { useNavigate } from "react-router-dom";
import { sendSignEvent } from "../utils";
import { useNostr } from "../context/NostrProvider";

const Settings = () => {
  const [keypair] = useAtom("keypair");
  const navigate = useNavigate();
  const { publish } = useNostr();

  if (!keypair.pk) return navigate("/");

  const onRevokeKey = () => {
    sendSignEvent({
      kind: 5,
      content: "delete",
      tags: [
        ["p", keypair.pk],
        ["intent", "delete"],
      ],
      keypair,
      publish,
    }).then(() => navigate("/"));
  };

  // d04dacdd491a8221359c5a100010dc44b59e14a0d9c3cc1067b4431e438e2fb7

  return (
    <div className="container">
      <h3>Settings</h3>

      {keypair.sk !== "nip07" && <Keys keypair={keypair} />}

      <button onClick={() => onRevokeKey()}>Revoke key</button>
    </div>
  );
};

const Keys = ({ keypair }) => {
  const [showSk, setShowSk] = useState({ enable: false, show: false });

  return (
    <div className="col">
      <div className="col-2">
        <strong>Public key</strong>
        <pre>{keypair.pk}</pre>
      </div>
      <div className="col-2">
        <strong>Private key</strong>
        <pre>{!showSk.show ? "*".repeat(keypair.sk.length) : keypair.sk}</pre>
      </div>

      {!showSk.enable && (
        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                setShowSk((prev) => ({
                  ...prev,
                  enable: !prev.show,
                }));
              }
            }}
          />{" "}
          <span>Yes, I want to see my private key</span>
        </label>
      )}

      {showSk.enable && (
        <button
          onClick={() => {
            setShowSk((prev) => ({
              ...prev,
              show: !prev.show,
            }));
          }}
          className="btn"
        >
          {showSk.show ? "Hide" : "Show"} private key
        </button>
      )}
    </div>
  );
};

export default Settings;
