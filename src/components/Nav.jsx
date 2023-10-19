import { Link } from "react-router-dom";
import { useAtom } from "react-atomize-store";
import { shortPubKey } from "../utils";

const Nav = ({ location }) => {
  const [keypair, setKeypair] = useAtom("keypair");

  const current = (pathname) => {
    if (location.pathname === pathname) {
      return "current";
    } else {
      return null;
    }
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/" className={current("/")}>
            Home
          </Link>
        </li>

        {!keypair || !keypair.pk ? (
          <li>
            <Link to="/login" className={current("/login")}>
              Login
            </Link>
          </li>
        ) : (
          <>
            {/* <li>
              <Link to="/dashboard" className={current("/dashboard")}>
                Dashboard
              </Link>
            </li> */}
            <li>
              <Link to="/new-snip" className={current("/new-snip")}>
                New Snip
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${keypair.pk}`}
                className={current(`/profile/${keypair.pk}`)}
              >
                {shortPubKey(keypair.pk)}
              </Link>
            </li>
            <li>
              <a
                onClick={() => {
                  localStorage.removeItem("sniped-keypair");
                  return setKeypair({});
                }}
                style={{ cursor: "pointer" }}
              >
                Logout
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
