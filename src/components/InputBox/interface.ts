export interface InputBoxEventMap {
  keypress: {
    key: string;
    value: string;
    timestamp: number;
    printable?: boolean;
    valueChanged: boolean;
  };
}
