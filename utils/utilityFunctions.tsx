//Generating unique id
export function makeID(length: number): string {
  const alphabet = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  var str = "";
  for (let i = 0; i < length; i += 1) {
    let rand = Math.floor(Math.random() * alphabet.length);
    str += alphabet[rand].toUpperCase(); //alphanumeric chars
  }
  return str;
}
