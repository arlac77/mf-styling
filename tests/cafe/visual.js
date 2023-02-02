import { Selector } from "testcafe";

const base = "http://localhost:5173/";

fixture`visual`.page`${base}`;

test("tables", async t => {
  const s = Selector("a").withText("Tables");

  await t.click(s);

  await t.expect(Selector(".bordered").visible).ok();

  await t.takeScreenshot();
});
