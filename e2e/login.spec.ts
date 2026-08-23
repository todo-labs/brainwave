import { expect, test } from "@playwright/test";
import content from "../public/locales/en/common.json";

test.beforeEach(async ({ page }) => {
  await page.goto("./auth/sign-in");
});

test("Has Title", async ({ page }) => {
    await expect(page).toHaveTitle(content["appName"]);
});

test("Has Logo", async ({ page }) => {
    const item = page.getByTestId("auth-title");

    expect(item).toBeVisible();
    expect(await item.innerText()).toContain(content['appName']);
});


test("Has Header", async ({ page }) => {
    const item = page.getByTestId("auth-header");

    expect(item).toBeVisible();
    expect(await item.innerText()).toContain(content['login-title']);
});


test("Has Description", async ({ page }) => {
    const item = page.getByTestId("auth-subtitle");

    expect(item).toBeVisible();
    expect(await item.innerText()).toContain(content['login-subheading']);
});

test("Invalid Email", async ({ page }) => {
    const item = page.getByTestId("auth-email");
    await item.fill('wrong_email_format')
    const btn = page.getByTestId("auth-continue");
    await btn.click();
    expect(page.url()).toContain('error=EmailSignin')
})

test("Valid Email", async ({ page }) => {
    const item = page.getByTestId("auth-email");
    await item.fill('name@example.com')
    const btn = page.getByTestId("auth-continue");
    await btn.click();
    await 
    expect(page).toHaveURL('/auth/verify-request')
})

test("Navigate To Terms", async ({ page }) => {
    const item = page.getByTestId("auth-terms");
    await item.click({ button: "left" });
    expect(page).toHaveURL("/terms");
  });
  
  test("Navigate To Privacy", async ({ page }) => {
    const item = page.getByTestId("auth-privacy");
    await item.click({ button: "left" });
    expect(page).toHaveURL("/privacy");
  });