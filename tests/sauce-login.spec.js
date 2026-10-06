const { test, expect } = require('@playwright/test');

test.describe('SauceDemo login automation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
    });

    test('TC-AUT-01: successful login with valid credentials', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page).toHaveURL(/\/inventory\.html$/);
        await expect(page.locator('.title')).toHaveText('Products');
    });

    test('TC-AUT-02: login rejected for wrong password', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'wrong_password');
        await page.click('#login-button');

        await expect(page).toHaveURL(/https:\/\/www\.saucedemo\.com\/?$/);
        const error = page.locator('[data-test="error"]');
        await expect(error).toContainText('Username and password do not match any user in this service');
    });

    test('TC-AUT-03: locked user is rejected', async ({ page }) => {
        await page.fill('#user-name', 'locked_out_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page).toHaveURL(/https:\/\/www\.saucedemo\.com\/?$/);
        const error = page.locator('[data-test="error"]');
        await expect(error).toContainText('Sorry, this user has been locked out.');
    });

    test('TC-AUT-04: empty username is rejected', async ({ page }) => {
        await page.fill('#user-name', '');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page).toHaveURL(/https:\/\/www\.saucedemo\.com\/?$/);
        const error = page.locator('[data-test="error"]');
        await expect(error).toContainText('Username is required');
    });

    test('TC-AUT-05: empty password is rejected', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', '');
        await page.click('#login-button');

        await expect(page).toHaveURL(/https:\/\/www\.saucedemo\.com\/?$/);
        const error = page.locator('[data-test="error"]');
        await expect(error).toContainText('Password is required');
    });

    test('TC-AUT-06: invalid username is rejected', async ({ page }) => {
        await page.fill('#user-name', 'invalid_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page).toHaveURL(/https:\/\/www\.saucedemo\.com\/?$/);
        const error = page.locator('[data-test="error"]');
        await expect(error).toContainText('Username and password do not match any user in this service');
    });
});
