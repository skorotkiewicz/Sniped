import Select from "react-select";
import { modes } from "../data/modes";

const SelectMode = ({ setMode }) => {
  return (
    <Select
      placeholder="Select Mode"
      options={modes}
      defaultValue={modes[0]}
      onChange={(e) => setMode(e.value)}
      // styles={colourStyles}
      isSearchable={true}
      // filterOption={customFilter}
      // styles={{
      //   option: (base) => ({
      //     ...base,
      //     // border: `1px dotted ${colourOptions[2].color}`,
      //     height: "5px",
      //   }),
      // }}
      id="select-editor"
      theme={(theme) => ({
        ...theme,
        // borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: "#474747",
          primary: "#383838",

          // primary: "#2684FF", // selected
          // primary25: "#DEEBFF", // hover
          // primary50: "#B2D4FF",
          // primary75: "#606060",
        },
        spacing: {
          controlHeight: 25,
        },
      })}
    />
  );
};

export default SelectMode;
