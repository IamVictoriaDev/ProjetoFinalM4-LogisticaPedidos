import { test, expect } from "@playwright/test";

// E2E: move card between columns and undo via toast
test("move card between columns and undo", async ({ page }) => {
  await page.goto("/");

  // Wait for orders to load
  await page.waitForSelector("[data-order-id]");

  // Find a card and its initial column
  const card = await page.locator("[data-order-id]").first();
  const orderId = await card.getAttribute("data-order-id");
  const initialColumn = await card.evaluate((el) =>
    el.closest("[data-column]")?.getAttribute("data-column"),
  );

  // Target column (pick a different one)
  const targetColumn = await page
    .locator("[data-column]")
    .filter({ hasText: /Em transporte|Em separação|Entregue|Recebido/ })
    .first();
  const targetColumnAttr = await targetColumn.getAttribute("data-column");
  if (targetColumnAttr === initialColumn) {
    // choose the next one instead
    const allCols = await page.locator("[data-column]");
    const second = allCols.nth(1);
    await second.scrollIntoViewIfNeeded();
    await second.waitFor();
  }

  // Drag card to target column using mouse drag
  const from = await page.locator(`[data-order-id="${orderId}"]`).boundingBox();
  const to = await page.locator("[data-column]").nth(1).boundingBox();
  if (!from || !to) throw new Error("could not determine bounding boxes");

  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, {
    steps: 10,
  });
  await page.mouse.up();

  // Expect toast with undo
  const toast = page.locator('[data-testid="toast"]');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText("Desfazer");

  // Click undo
  await toast.locator("button").click();

  // Verify order moved back to initial column
  const movedCard = page.locator(`[data-order-id="${orderId}"]`);
  await expect(movedCard).toHaveAttribute(
    "data-column",
    initialColumn || "Recebido",
  );
});
