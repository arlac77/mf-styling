import { Selector } from "testcafe";

const base = "http://localhost:4173/examples/mf-styling/";

fixture`visual`.page`${base}`;

test("tables", async t => {
  const s = Selector("a").withText("Tables");

  await t.click(s);

  await t.expect(Selector(".bordered").visible).ok();

  await t.takeScreenshot();
});
