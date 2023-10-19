import { Grid, Radio } from "react-loader-spinner";

export const Loading = () => {
  return (
    <div className="loading-app">
      <Grid
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="grid-loading"
        radius="12.5"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export const LoadingRadio = () => {
  return (
    <div className="loading">
      <Radio
        visible={true}
        height="60"
        width="60"
        ariaLabel="radio-loading"
        wrapperStyle={{}}
        wrapperClass="loading"
      />
    </div>
  );
};
