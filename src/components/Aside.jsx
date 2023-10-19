import { useAtom } from "react-atomize-store";
import { themes } from "../data/themes";

const Aside = ({ pathname }) => {
  return (
    <aside>
      {pathname === "/new-snip" ? (
        <ThemeSelect />
      ) : pathname === "/dashboard" ? (
        <span>Dashboard</span>
      ) : (
        <span>Aside</span>
      )}
    </aside>
  );
};

const ThemeSelect = () => {
  const [theme, setTheme] = useAtom("theme");

  return (
    <div>
      Theme:
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        {themes.map((d, key) => (
          <option key={key} value={d.value}>
            {d.value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Aside;
