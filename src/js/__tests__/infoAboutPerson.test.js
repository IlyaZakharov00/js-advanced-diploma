import Daemon from "../characters/Daemon";

test("should show info", () => {
  const person = new Daemon(1);
  const result = {
    health: person.health,
    level: person.level,
    attack: person.attack,
    defence: person.defence,
    type: person.type,
  };

  expect(result).toEqual({
    health: person.health,
    level: person.level,
    attack: person.attack,
    defence: person.defence,
    type: person.type,
  });
});
