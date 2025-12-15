// @ts-check
import { test, expect } from "@playwright/test";

test("tables", async ({ page }) => {
  await page.goto("http://localhost:5173/tests/app/");

  await page.getByRole("link", { name: "Tables" }).click();

  await page.screenshot({ path: "test-results/screenshots/tables.png" });

  await page
    .getByRole("table")
    .filter({
      hasText:
        "Column A Column B Column C Column D Cell D 1 Cell B 1 Cell C 1 Cell A 1 Cell A"
    })
    .getByLabel("sortable 0")
    .click();
  await expect(
    page.getByRole("cell", { name: "Cell A" }).first()
  ).toBeVisible();
});
