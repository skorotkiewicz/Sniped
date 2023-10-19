import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { getPublicKey, nip19 } from "nostr-tools";
import { useAtom } from "react-atomize-store";
import { generateKeys } from "../utils";

const Login = () => {
  const [loginType, setLoginType] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="login-popup">
      <div onClick={() => setLoginType(1)}>
        <h2>Generate keys</h2>
        {loginType === 1 && <GenerateKeys navigate={navigate} />}
      </div>

      <div onClick={() => setLoginType(2)}>
        <h2>Login with priv key or nsec</h2>
        {loginType === 2 && <LoginPrivKeys navigate={navigate} />}
      </div>

      <div onClick={() => setLoginType(3)}>
        <h2>Login with nos2x</h2>
        {loginType === 3 && <LoginNos2x navigate={navigate} />}
      </div>
    </div>
  );
};

const GenerateKeys = ({ navigate }) => {
  const [, setKeypair] = useAtom("keypair");
  const keys = generateKeys();

  const generate = useCallback(() => {
    setKeypair(keys);
    localStorage.setItem(
      "sniped-keypair",
      JSON.stringify({ sk: keys.sk, pk: keys.pk })
    );
    navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="col">
      <div className="col-2">
        <strong>Public key</strong>
        <pre>{keys.pk}</pre>
      </div>
      <div className="col-2">
        <strong>Private key</strong>
        <pre>{keys.sk}</pre>
      </div>

      <div>
        <button onClick={generate} className="btn">
          Noted and login
        </button>
      </div>
    </div>
  );
};

const LoginPrivKeys = ({ navigate }) => {
  const [, setKeypair] = useAtom("keypair");
  const [privKey, setPrivKey] = useState("");
  const [error, setError] = useState(false);

  const login = useCallback(() => {
    if (!privKey) return;
    let pk;
    let sk;

    if (privKey) {
      try {
        if (privKey.startsWith("nsec")) {
          const { data } = nip19.decode(privKey);
          pk = getPublicKey(data);
          sk = data;
        } else {
          pk = getPublicKey(privKey);
          sk = privKey;
          if (!pk) return setError(true);
        }
      } catch (_) {
        return setError(true);
      }

      localStorage.setItem("sniped-keypair", JSON.stringify({ sk, pk }));

      const keys = { sk, pk };
      setKeypair(keys);

      if (keys && keys.pk && keys.sk) return navigate("/");
    }

    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privKey]);

  return (
    <div className="col">
      <p>
        <input
          type="password"
          className="l-input"
          placeholder="Private Key / nsec"
          onChange={(e) => setPrivKey(e.target.value)}
        />
      </p>
      <p>
        {error && <p style={{ color: "red" }}>Private kay is not valid</p>}
        <button onClick={login} className="btn">
          Login
        </button>
      </p>
    </div>
  );
};

const LoginNos2x = ({ navigate }) => {
  // const setKeypair = useStore((state) => state.setKeypair);
  const [, setKeypair] = useAtom("keypair");

  if (window.nostr) {
    window.nostr.getPublicKey().then((publicKey) => {
      if (publicKey) {
        setKeypair({ pk: publicKey, sk: "nip07" });

        localStorage.setItem(
          "sniped-keypair",
          JSON.stringify({ pk: publicKey, sk: "nip07" })
        );

        return navigate("/");
      }
    });
  }

  return (
    <div className="col">
      <p>It should now open a window to authorize.</p>

      <div className="nos2x">
        If you don&apos;t have plugin, you can download for:
        <p>
          <a
            href="https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp"
            className="btn"
          >
            Chrome/Chromium
          </a>
          or
          <a
            href="https://addons.mozilla.org/en-US/firefox/addon/nos2x-fox/"
            className="btn"
          >
            Firefox
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
