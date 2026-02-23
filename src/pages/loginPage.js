import {test} from '@playwright/test';
export class LoginPage {
    constructor(page) {
        this.page = page;
        this.loginField =page.getByRole('textbox', { name: 'Логин' });
        this.passwordField = page.getByRole('textbox', { name: 'Пароль' });
        this.loginButton = page.getByRole('button', { name: 'Войти' });
        this.sessionDialog = page.getByText('Пользователь с таким именем уже вошел в систему. Если продолжить вход, то работа');
    }

    async getAuthorization(login, password) {
        await test.step('Авторизоваться', async () => {
            await this.loginField.click();
            await this.loginField.fill(login);
            await this.passwordField.click();
            await this.passwordField.fill(password);
            await this.loginButton.click();
            await this.sessionDialog.waitFor({ timeout: 6000 }).catch(() => {});
            await test.step('Появилось окно подтверждения перед входом', async () => {
                if (await this.sessionDialog.isVisible()) {
                    await this.page.getByRole('button', { name: 'Да' }).click();
                }
            });
        });
    }

    async open(url = 'https://demo.app.stack-it.ru/fl/') {
        await test.step('Открыть сайт', async () => {
            await this.page.goto(url);
        });
    }
}