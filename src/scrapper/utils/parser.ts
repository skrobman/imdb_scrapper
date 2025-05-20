export const parseRank = (label: string) => {
  return parseInt(label.replace('Ranking ', ''), 10);
}

export const parseYear = (yearText: string)=> {
  return parseInt(yearText, 10) || 0;
}

export const parseRuntime = (text: string)=> {
  let total = 0;
  const h = text.match(/(\d+)\s*h/);
  const m = text.match(/(\d+)\s*m/);
  if (h) total += +h[1] * 60;
  if (m) total += +m[1];
  return total;
}

export const parseRating = (text: string) => {
  return parseFloat(text) || 0;
}