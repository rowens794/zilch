import { countScore } from "../../utils/scoreCounter";

test("test scoring function : select a 1", () => {
  let { score, validSelection, clearedBoard, zilched } = countScore(
    [1, 2, 2, 3, 3, 4],
    [true, false, false, false, false, false],
    [0, 0, 0, 0, 0, 0]
  );

  expect(score).toEqual(100);
});

test("test scoring function : select a 5", () => {
  let { score, validSelection, clearedBoard, zilched } = countScore(
    [5, 2, 2, 3, 3, 4],
    [true, false, false, false, false, false],
    [0, 0, 0, 0, 0, 0]
  );

  expect(score).toEqual(50);
});

test("test scoring function : select three 1's", () => {
  let { score, validSelection, clearedBoard, zilched } = countScore(
    [1, 1, 1, 3, 3, 4],
    [true, true, true, false, false, false],
    [0, 0, 0, 0, 0, 0]
  );

  expect(score).toEqual(1000);
});

test("test scoring function : select three 1's + a 5", () => {
  let { score, validSelection, clearedBoard, zilched } = countScore(
    [1, 1, 1, 5, 3, 4],
    [true, true, true, true, false, false],
    [0, 0, 0, 0, 0, 0]
  );

  expect(score).toEqual(1050);
});

test("test scoring function : select two sets", () => {
  let { score, validSelection, clearedBoard, zilched } = countScore(
    [2, 2, 2, 3, 3, 3],
    [true, true, true, true, true, true],
    [0, 0, 0, 0, 0, 0]
  );

  expect(score).toEqual(2000);
});

test("test scoring function : select three pairs", () => {
  let { score, validSelection, clearedBoard, zilched } = countScore(
    [2, 2, 3, 3, 4, 4],
    [true, true, true, true, true, true],
    [0, 0, 0, 0, 0, 0]
  );

  expect(score).toEqual(1500);
});

test("test scoring function : select straight", () => {
  let { score, validSelection, clearedBoard, zilched } = countScore(
    [3, 2, 1, 5, 4, 6],
    [true, true, true, true, true, true],
    [0, 0, 0, 0, 0, 0]
  );

  expect(score).toEqual(2500);
});

test("test scoring function : select gargantuan", () => {
  let { score, validSelection, clearedBoard, zilched } = countScore(
    [2, 2, 2, 2, 2, 2],
    [true, true, true, true, true, true],
    [0, 0, 0, 0, 0, 0]
  );

  expect(score).toEqual(5000);
});

test("test scoring function : select invalid dice", () => {
  let { score, validSelection, clearedBoard, zilched } = countScore(
    [2, 1, 3, 4, 4, 5],
    [true, true, true, true, true, true],
    [0, 0, 0, 0, 0, 0]
  );

  expect(validSelection).toEqual(false);
});

test("test scoring function : select zilched", () => {
  let { score, validSelection, clearedBoard, zilched } = countScore(
    [2, 6, 3, 4, 4, 2],
    [false, false, false, false, false, false],
    [0, 0, 0, 0, 0, 0]
  );

  expect(zilched).toEqual(true);
});

test("test scoring function : select zilched2", () => {
  let { score, validSelection, clearedBoard, zilched } = countScore(
    [2, 1, 1, 6, 4, 1],
    [false, true, false, false, false, false],
    [0, 1, 1, 0, 0, 1]
  );

  expect(zilched).toEqual(true);
});
