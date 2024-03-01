import Daemon from "../characters/Daemon.js";

test("should create Daemon", () => {
  const result = new Daemon(1);
  expect(result).toEqual({
    health: 100,
    level: 1,
    attack: 10,
    defence: 10,
    type: "daemon",
  });
});
