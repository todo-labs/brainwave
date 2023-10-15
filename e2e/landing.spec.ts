import { expect, test } from "@playwright/test";
import content from "../public/locales/en/common.json";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

// Verify Content

test("Has Title", async ({ page }) => {
  await expect(page).toHaveTitle(content["appName"]);
});

test("Has Tagline", async ({ page }) => {
  const item = page.getByTestId("landing-devtagline");

  expect(item).toBeVisible();
  expect(await item.innerText()).toContain(
    `${content["landing-devtagline-pre"]} ${content["landing-devtagline-post"]}`
  );
});

test("Has Header", async ({ page }) => {
  const item = page.getByTestId("landing-title");

  expect(item).toBeVisible();
  expect(await item.innerText()).toContain(content["landing-title"]);
});

test("Has Description", async ({ page }) => {
  const item = page.getByTestId("landing-desc");

  expect(item).toBeVisible();
  expect(await item.innerText()).toContain(content["landing-desc"]);
});

test("Has Get Started Button", async ({ page }) => {
  const item = page.getByTestId("landing-getStarted");
  expect(item).toBeVisible();
});

test("Has How It Works", async ({ page }) => {
  const item = page.getByTestId("landing-howItWorks");
  expect(item).toBeVisible();
});

// Verify Connectivity

test("Navigate To Login", async ({ page }) => {
  const item = page.getByTestId("landing-getStarted");
  await item.click({ button: "left" });
  expect(page).toHaveURL("/auth/sign-in");
});

test("Navigate To Github", async ({ page }) => {
  const item = page.getByTestId("landing-howItWorks");
  await item.click({ button: "left" });
  expect(page).toHaveURL("https://github.com/todo-labs/brainwave#about-the-project");
});
