import React from "react";
import moment from "moment-timezone";

export default function Moment({
  children,
  format,
  fromNow,
  toNow,
  calendar,
  tz,
  locale,
  unix,
  ...rest
}) {
  let m = unix ? moment.unix(children) : moment(children);
  if (tz) m = moment.tz(m, tz);
  if (locale) m = m.clone().locale(locale);

  let text;
  if (fromNow) text = m.fromNow();
  else if (toNow) text = m.toNow();
  else if (calendar) text = m.calendar();
  else if (format) text = m.format(format);
  else text = m.toString();

  return (
    <time dateTime={m.toISOString()} {...rest}>
      {text}
    </time>
  );
}
