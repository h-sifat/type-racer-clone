export function isValidChar(char: string) {
  const code = char.charCodeAt(0);
  // from " " to "~"
  return code > 31 && code < 127;
}

export function resetSelection(
  e: Event & {
    currentTarget: EventTarget & HTMLInputElement;
  }
) {
  const input = e.target as HTMLInputElement;

  input.selectionStart = input.value.length;
  input.selectionEnd = input.value.length;
}

export function ctrlBackspace(string: string) {
  string = string.trimEnd();
  const lastIndex = string.length - 1;

  for (let i = lastIndex; i > -1; i--) {
    const char = string[i];
    if (/\w/.test(char)) continue;

    if (i === lastIndex) return string.slice(0, -1);
    else return string.slice(0, i + 1);
  }

  return "";
}
