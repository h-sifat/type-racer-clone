import type { FormattedChar, FormattedCurrentWord } from "./interface";

export function getEmptyFormattedCurrentWord(): FormattedCurrentWord {
  return {
    wordChars: [],
    hasTypo: false,
    canTypeMore: true,
    trailingSpaceStates: [],
  };
}

export interface formatCurrentWord_Arg {
  word: string;
  input: string;
}

export function formatCurrentWord(
  arg: formatCurrentWord_Arg
): FormattedCurrentWord {
  const { input, word } = arg;

  if (!word) return getEmptyFormattedCurrentWord();

  const allChars: FormattedChar[] = (word + " ")
    .split("")
    .map((char) => ({ char, states: [] }));

  let hasError = false;

  input.split("").forEach((inputChar, index) => {
    if (inputChar === allChars[index].char)
      allChars[index].states.push("correct");
    else {
      allChars[index].states.push("incorrect");
      hasError = true;
    }
  });

  if (input.length) allChars[input.length - 1].states.push("cursor-right");
  else allChars[0].states.push("cursor-left");

  const trailingSpaceStates = allChars.pop().states;

  return {
    hasTypo: hasError,
    trailingSpaceStates,
    wordChars: allChars,
    canTypeMore: input.length <= word.length,
  };
}

/**
 * Example:
 *
 * ```js
 * const text = "abc de xyz";
 * // output
 * const words = ["abc", "de", "xyz"];
 * const startIndices = [0, 4, 7]
 * ```
 * */
export function splitTextIntoWords(text: string): {
  words: string[];
  startIndices: number[];
} {
  const words = text.split(" ");
  let startIndices: number[] = new Array(words.length);

  if (!words.length) return { words, startIndices };

  // a 1 is added to totalLength in every loop initially setting
  // totalLength = -1 will cause the first index to be 0
  let totalLength = -1;

  // the first word starts from zero
  // startIndices[0] = 0;

  for (let i = 0; i < words.length; i++) {
    // +1 for the word break: " "
    totalLength++;
    startIndices[i] = totalLength;

    totalLength += words[i].length;
  }

  return { words, startIndices };
}

export function lastIndex(value: string | any[]) {
  return value.length - 1;
}
