const Spinnies = require("spinnies");

const spinner = { interval: 80, frames: ["🍇", "🍈", "🍉", "🍋"] };
const spinnies = new Spinnies({
  color: "blue",
  succeedColor: "green",
  spinner,
});

async function spinniesAction({ name, text, handler }) {
  spinnies.add(name, {
    text,
  });

  let result = await Promise.resolve(handler());

  result.then(
    () => spinnies.succeed(name),
    () => spinnies.fail(name)
  );

  return result;
}

module.exports = {
    spinniesAction
};
