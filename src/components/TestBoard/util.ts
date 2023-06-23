export type FormattedChar = Record<"char" | "className", string>;

export type FormattedCurrentWord = {
  hasTypo: boolean;
  canTypeMore: boolean;
  trailingSpaceClass: string;
  wordChars: FormattedChar[];
};

export type FormatCurrentWord = (arg: {
  word: string;
  input: string;
}) => FormattedCurrentWord;

export interface CurrentWordFormatterClassNames {
  match: string;
  noMatch: string;
  cursorLeft: string;
  cursorRight: string;
}

export function getEmptyFormattedCurrentWord() {
  return {
    wordChars: [],
    hasTypo: false,
    canTypeMore: true,
    trailingSpaceClass: "",
  };
}

export function makeFormatCurrentWord(
  factoryArg: CurrentWordFormatterClassNames
): FormatCurrentWord {
  const { match, noMatch, cursorLeft, cursorRight } = factoryArg;

  return function formattedCurrentWord({ input, word }) {
    if (!word.length) return getEmptyFormattedCurrentWord();

    const allChars: FormattedChar[] = (word + " ")
      .split("")
      .map((char) => ({ char, className: "" }));

    let hasError = false;

    input.split("").forEach((inputChar, index) => {
      if (inputChar === allChars[index].char) allChars[index].className = match;
      else {
        allChars[index].className = noMatch;
        hasError = true;
      }
    });

    if (input.length) allChars[input.length - 1].className += " " + cursorRight;
    else allChars[0].className += " " + cursorLeft;

    return {
      hasTypo: hasError,
      wordChars: allChars.slice(0, -1),
      canTypeMore: input.length <= word.length,
      trailingSpaceClass: allChars.at(allChars.length - 1).className,
    };
  };
}
