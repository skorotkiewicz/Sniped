export const shortPubKey = (pubkey, lng = 4) => {
  const ln = lng + 2;

  if (pubkey)
    return (
      pubkey.substring(0, lng) + "....." + pubkey.substring(pubkey.length - ln)
    );
};

// {dateFormatter.format(createdAt * 1000)}
const dateFormatterInit = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export const dateFormatter = (data) => {
  return dateFormatterInit.format(data * 1000);
};

export const uniqBy = (arr, key) => {
  return Object.values(
    arr.reduce(
      (map, item) => ({
        ...map,
        [`${item[key]}`]: item,
      }),
      {}
    )
  );
};

export const uniqValues = (value, index, self) => {
  return self.indexOf(value) === index;
};

export const dateToUnix = (_date) => {
  const date = _date || new Date();

  return Math.floor(date.getTime() / 1000);
};

export const log = (isOn, type, ...args) => {
  if (!isOn) return;
  // eslint-disable-next-line no-console
  console[type](...args);
};
