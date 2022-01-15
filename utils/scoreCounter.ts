export const countScore = (
  diceArray: number[],
  selectedArray: boolean[],
  usedDice: number[]
): {
  score: number;
  validSelection: boolean;
  clearedBoard: boolean;
  zilched: boolean;
} => {
  let score = 0;
  let validSelection = true;

  //create an array of the currently selected dice
  let activeArray: number[] = [];
  diceArray.forEach((die, i) =>
    selectedArray[i] ? activeArray.push(die) : null
  );
  activeArray.sort((a, b) => b - a);

  //count major hands
  if (activeArray.length === 6) {
    [score, activeArray, validSelection] = countMajorHands(score, activeArray);
  }

  //count mid tier hands
  if (activeArray.length >= 3) {
    [score, activeArray, validSelection] = countMidTierHands(
      score,
      activeArray
    );
  }

  //count remaining dice
  while (activeArray.length > 0) {
    [score, activeArray] = isAOne(score, activeArray);
    [score, activeArray] = isAFive(score, activeArray);
    [score, activeArray, validSelection] = isMeaningless(score, activeArray);
  }

  //determine if board was cleared
  let clearedBoard = isBoardCleared(
    score,
    selectedArray,
    usedDice,
    validSelection
  );

  //determine if zilched
  let zilched = didZilch(diceArray, usedDice);

  return { score, validSelection, clearedBoard, zilched };
};

const countMajorHands = (
  score: number,
  activeArray: number[]
): [number, number[], boolean] => {
  // check for the tier 1 rolls
  let validSelection = true;

  [score, activeArray] = isOobiJoobi(score, activeArray);
  [score, activeArray] = isStraight(score, activeArray);
  [score, activeArray] = isTwoSets(score, activeArray);
  [score, activeArray] = isThreePairs(score, activeArray);

  return [score, activeArray, validSelection];
};

const countMidTierHands = (
  score: number,
  activeArray: number[]
): [number, number[], boolean] => {
  // check for the tier 1 rolls
  let validSelection = true;

  [score, activeArray] = isThreeOfAKind(score, activeArray, 6);
  [score, activeArray] = isThreeOfAKind(score, activeArray, 5);
  [score, activeArray] = isThreeOfAKind(score, activeArray, 4);
  [score, activeArray] = isThreeOfAKind(score, activeArray, 3);
  [score, activeArray] = isThreeOfAKind(score, activeArray, 2);
  [score, activeArray] = isThreeOfAKind(score, activeArray, 1);

  return [score, activeArray, validSelection];
};

const isOobiJoobi = (score: number, array: number[]): [number, number[]] => {
  let test = true;

  if (array.length !== 6) {
    test = false;
  } else {
    array.forEach((element) => {
      if (element !== array[0]) {
        test = false;
      }
    });
  }

  //compute score
  if (test) score += 5000;

  //calculate return array
  if (test) array = [];

  return [score, array];
};

const isStraight = (score: number, array: number[]): [number, number[]] => {
  let test = true;
  if (array.join("") !== "654321") {
    test = false;
  }

  //compute score
  if (test) score += 2500;

  //calculate return array
  if (test) array = [];

  return [score, array];
};

const isTwoSets = (score: number, array: number[]): [number, number[]] => {
  let test = false;

  if (array.length === 6)
    if (
      array[0] === array[1] &&
      array[1] === array[2] &&
      array[3] === array[4] &&
      array[4] === array[5]
    )
      test = true;

  if (test) score += 2000;
  if (test) array = [];

  return [score, array];
};

const isThreePairs = (score: number, array: number[]): [number, number[]] => {
  let test = false;

  if (array.length === 6)
    if (array[0] === array[1] && array[2] === array[3] && array[4] === array[5])
      test = true;

  if (test) score += 1500;
  if (test) array = [];

  return [score, array];
};

const isThreeOfAKind = (
  score: number,
  array: number[],
  type: number
): [number, number[]] => {
  let test = false;

  if (array.length >= 3) {
    if (array.filter((x) => x === type).length >= 3) {
      test = true;

      //pop out 3 of the matching elements
      let pops = 0;
      for (let i = 0; i < 3; i++) {
        let element = array.indexOf(type);
        if (pops < 3) {
          array.splice(element, 1);
          pops += 1;
        }
      }
    }
  }

  if (test && type === 6) score += 600;
  if (test && type === 5) score += 500;
  if (test && type === 4) score += 400;
  if (test && type === 3) score += 300;
  if (test && type === 2) score += 200;
  if (test && type === 1) score += 1000;

  return [score, array];
};

const isAOne = (score: number, array: number[]): [number, number[]] => {
  let test = false;

  if (array.indexOf(1) > -1) {
    test = true;
    array.splice(array.indexOf(1), 1);
  }

  if (test) score += 100;

  return [score, array];
};

const isAFive = (score: number, array: number[]): [number, number[]] => {
  let test = false;

  if (array.indexOf(5) > -1) {
    test = true;
    array.splice(array.indexOf(5), 1);
  }

  if (test) score += 50;

  return [score, array];
};

const isMeaningless = (
  score: number,
  array: number[]
): [number, number[], boolean] => {
  let validSelection = true;
  if (array.length > 0 && array[0] !== 1 && array[0] !== 5) {
    array.splice(array.indexOf(0), 1);
    validSelection = false;
  }

  return [score, array, validSelection];
};

const isBoardCleared = (
  score: number,
  selectedArray: boolean[],
  usedDice: number[],
  validSelection: boolean
): boolean => {
  let test = false;

  // first ensure a valid selection was made and a score was registered
  // (you can clear the board without both of these)
  if (validSelection && score) {
    //count dice selected
    let selectedCount = 0;
    selectedArray.forEach((item) => (item ? (selectedCount += 1) : null));

    //count dice selected
    let unusedDice = 0;
    usedDice.forEach((item) => (!item ? (unusedDice += 1) : null));

    if (selectedCount === unusedDice) test = true;
  }

  return test;
};

const didZilch = (diceArray: number[], usedDice: number[]): boolean => {
  let test = false;

  //generate an array of available dice
  let availableDice: number[] = [];
  usedDice.forEach((dice, i) => {
    if (!dice) availableDice.push(diceArray[i]);
  });

  //check if any scoring options are available from available dice
  let score = 0;
  [score] = countMajorHands(score, availableDice);
  [score] = countMidTierHands(score, availableDice);
  [score] = isAOne(score, availableDice);
  [score] = isAFive(score, availableDice);

  if (score === 0) test = true;

  return test;
};
