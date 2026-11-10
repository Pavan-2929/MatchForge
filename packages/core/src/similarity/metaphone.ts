export function metaphone(value: string): string {
  let word = value.toUpperCase().replace(/[^A-Z]/g, "");

  if (word.length === 0) {
    return "";
  }

  // Handle silent initial letter combinations.
  if (/^(KN|GN|PN|AE|WR)/.test(word)) {
    word = word.slice(1);
  } else if (word.startsWith("X")) {
    word = `S${word.slice(1)}`;
  }

  let result = "";

  const isVowel = (char: string | undefined) => "AEIOU".includes(char ?? "");

  for (let i = 0; i < word.length; i++) {
    const current = word[i];
    const previous = word[i - 1];
    const next = word[i + 1];
    const nextNext = word[i + 2];

    // Ignore duplicate adjacent letters, except C.
    if (current === previous && current !== "C") {
      continue;
    }

    switch (current) {
      case "A":
      case "E":
      case "I":
      case "O":
      case "U":
        if (i === 0) result += current;
        break;

      case "B":
        if (!(previous === "M" && i === word.length - 1)) {
          result += "B";
        }
        break;

      case "C":
        if (previous === "S" && "IEY".includes(next ?? "")) {
          break;
        }

        if (next === "H") {
          result += "X";
          i++;
        } else if ("IEY".includes(next ?? "")) {
          result += "S";
        } else {
          result += "K";
        }
        break;

      case "D":
        if (next === "G" && "IEY".includes(nextNext ?? "")) {
          result += "J";
          i++;
        } else {
          result += "T";
        }
        break;

      case "G":
        if (next === "H") {
          if (i + 2 < word.length && !isVowel(previous)) {
            i++;
            break;
          }

          if (i > 0 && isVowel(previous) && i + 2 >= word.length) {
            i++;
            break;
          }

          if (i === 0) {
            result += "K";
            i++;
            break;
          }

          i++;
          break;
        }

        if (next === "N" && i + 1 === word.length - 1) {
          break;
        }

        if ("IEY".includes(next ?? "")) {
          result += "J";
        } else {
          result += "K";
        }
        break;

      case "H":
        if ((i === 0 || isVowel(previous)) && isVowel(next)) {
          result += "H";
        }
        break;

      case "F":
      case "J":
      case "L":
      case "M":
      case "N":
      case "R":
        result += current;
        break;

      case "K":
        if (previous !== "C") result += "K";
        break;

      case "P":
        result += next === "H" ? "F" : "P";
        if (next === "H") i++;
        break;

      case "Q":
        result += "K";
        break;

      case "S":
        if (next === "H") {
          result += "X";
          i++;
        } else if (next === "I" && (nextNext === "O" || nextNext === "A")) {
          result += "X";
        } else {
          result += "S";
        }
        break;

      case "T":
        if (next === "H") {
          result += "0";
          i++;
        } else if (next === "I" && (nextNext === "O" || nextNext === "A")) {
          result += "X";
        } else if (next === "C" && nextNext === "H") {
          break;
        } else {
          result += "T";
        }
        break;

      case "V":
        result += "F";
        break;

      case "W":
      case "Y":
        if (isVowel(next)) result += current;
        break;

      case "X":
        result += "KS";
        break;

      case "Z":
        result += "S";
        break;
    }
  }

  return result;
}

export function metaphoneSimilarity(a: string, b: string): number {
  return metaphone(a) === metaphone(b) ? 1 : 0;
}
