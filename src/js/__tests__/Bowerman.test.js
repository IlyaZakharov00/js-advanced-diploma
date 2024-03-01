import Bowerman from "../characters/Bowerman.js";

test("should create Bowerman", () => {
  const result = new Bowerman(1);
  expect(result).toEqual({
    health: 100,
    level: 1,
    attack: 25,
    defence: 25,
    type: "bowman",
  });
});
