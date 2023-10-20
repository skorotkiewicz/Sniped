import { useEffect } from "react";
import { Routes, Route, Outlet, useLocation, Link } from "react-router-dom";
import { useStore, useAtom } from "react-atomize-store";
import "./styles/App.scss";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import NewSnip from "./pages/NewSnip";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NoMatch from "./pages/NoMatch";
import Aside from "./components/Aside";
import Nav from "./components/Nav";
import { getLoginKeys } from "./utils";
import { useNostr } from "./context/NostrProvider";
import Sniped from "./pages/Sniped";
import { Loading } from "./components/Loading";
import SnipByTag from "./pages/SnipByTag";

export default function App() {
  const [keypair, setKeypair] = useAtom("keypair");

  useEffect(() => {
    const loginKeys = getLoginKeys();
    if (loginKeys && loginKeys.pk) {
      setKeypair(loginKeys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useStore(
    {
      theme: "dracula",
      keypair: "",
    },
    true, // Redux
    [] // IndexedDB
  );

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lang/:lang" element={<SnipByTag />} />
        <Route path="about" element={<About />} />
        <Route path="profile?/:id" element={<Profile />} />
        <Route path="snip?/:id" element={<Sniped />} />

        {keypair && keypair.pk ? (
          <>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="new-snip" element={<NewSnip />} />
          </>
        ) : (
          <Route path="login" element={<Login />} />
        )}

        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  const location = useLocation();
  const { isLoading } = useNostr();

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>Sniped</header>

          <Nav location={location} />

          <main>
            <article>
              <Outlet />
            </article>

            <Aside pathname={location.pathname} />
          </main>

          <footer>
            <Link to="/about">About</Link>
          </footer>
        </>
      )}
    </>
  );
}
