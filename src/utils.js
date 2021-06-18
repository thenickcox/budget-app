export const dollarFormatter = (v) =>
  `$${v.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
