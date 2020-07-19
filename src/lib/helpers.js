function fmtTime(num) {
  const padZero = str => str.padStart(2, '0');

  const hours = Math.floor(num / 3600);
  const minutes = Math.floor((num % 3600) / 60);
  const seconds = Math.floor(num % 60);

  const h = padZero(`${hours}`);
  const min = padZero(`${minutes}`);
  const sec = padZero(`${seconds}`);

  const t = `${min}:${sec}`;
  return hours > 0 ? `${h}:${t}` : t;
}

function getDefaultValue(obj) {
  const value = Object.values(obj).find(x => x.default);
  return value ? value.key : null;
}

const asyncHandler = (callback) =>
  (req, res, next) => {
    callback(req, res, next).catch(next);
  };

module.exports = { asyncHandler, fmtTime, getDefaultValue };
