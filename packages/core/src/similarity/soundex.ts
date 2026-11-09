const SOUNDEX_MAP: Record<string, string> = {
  B: "1",
  F: "1",
  P: "1",
  V: "1",

  C: "2",
  G: "2",
  J: "2",
  K: "2",
  Q: "2",
  S: "2",
  X: "2",
  Z: "2",

  D: "3",
  T: "3",

  L: "4",

  M: "5",
  N: "5",

  R: "6",
};

export function soundex(value: string): string {
  const word = value.toUpperCase().replace(/[^A-Z]/g, "");

  if (word.length === 0) {
    return "";
  }

  const firstLetter = word[0];
  const digits: string[] = [];

  let previousCode = SOUNDEX_MAP[firstLetter] ?? "";

  for (const character of word.slice(1)) {
    const currentCode = SOUNDEX_MAP[character] ?? "";

    if (currentCode === "") {
      // H and W do not break consecutive Soundex groups.
      // Vowels reset duplicate-code tracking.
      if (character !== "H" && character !== "W") {
        previousCode = "";
      }

      continue;
    }

    if (currentCode !== previousCode) {
      digits.push(currentCode);
    }

    previousCode = currentCode;

    if (digits.length === 3) {
      break;
    }
  }

  return (firstLetter + digits.join("")).padEnd(4, "0");
}

export function soundexSimilarity(a: string, b: string): number {
  return soundex(a) === soundex(b) ? 1 : 0;
}