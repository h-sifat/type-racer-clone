type Keypress = { key: string; timestamp: number };

export interface PrintableKeypressLog extends Keypress {
  printable: true;
  matched: boolean;
  textCharIndex: number;
}

export interface NonPrintableKeypressLog extends Keypress {
  printable: false;
}

export type KeypressLog = PrintableKeypressLog | NonPrintableKeypressLog;

export type CharState =
  | "correct"
  | "incorrect"
  | "cursor-left"
  | "cursor-right";

export type FormattedChar = { char: string; states: CharState[] };

export type FormattedCurrentWord = {
  hasTypo: boolean;
  canTypeMore: boolean;
  wordChars: FormattedChar[];
  trailingSpaceStates: CharState[];
};
