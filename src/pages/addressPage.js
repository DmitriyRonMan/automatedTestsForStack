import { expect, test } from '@playwright/test';

export class AddressPage {
  constructor(page) {
    this.page = page;

    this.addressFundLink = page.locator('[data-test-id="Адресный фонд"]');
    this.addressFundMenuLink = page.getByRole('link', { name: 'Адресный фонд' });
    this.addressOfResidentsLink = page.locator('[data-test-id="Адреса проживающих"]');
    this.addressOfResidentsMenuLink = page.getByRole('link', { name: 'Адреса проживающих' });
    this.addEntryButton = page.getByRole('button', { name: 'Добавить запись' });
    this.districtLink = page.getByText('Район', { exact: true });
    this.nameDistrictInput = page.locator('[data-test-id="Название района"]');
    this.contributeButton = page.getByRole('button', { name: 'Внести' });
    this.saveButton = page.getByRole('button', { name: 'Сохранить' });
    this.confirmYesButton = page.locator('[data-test-id="stack-yes-no"]').getByRole('button', { name: 'Да' });
    this.confirmNoButton = page.locator('[data-test-id="stack-yes-no"]').getByRole('button', { name: /Нет|Отмена/ });
    this.deleteSelectedButton = page.getByRole('button', { name: 'Удалить выбранные записи' });
    this.validationErrorText = page.getByText('Поле не может быть пустым');
  }

  async openAddressSection() {
    await test.step('Нажать на вкладку "Адресный фонд"', async () => {
      await this.addressFundLink.first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
      const byTestId = await this.addressFundLink.first().isVisible().catch(() => false);
      if (byTestId) await this.addressFundLink.first().click();
      else await this.addressFundMenuLink.first().click();
    });
    await test.step('Перейти в раздел «Адреса проживающих»', async () => {
      await this.addressOfResidentsLink.first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
      const byTestId = await this.addressOfResidentsLink.first().isVisible().catch(() => false);
      if (byTestId) await this.addressOfResidentsLink.first().click();
      else await this.addressOfResidentsMenuLink.first().click();
    });
  }

  async addingAnEntry(nameDistrict) {
    await test.step('Нажать на вкладку "Адресный фонд"', async () => {
      await this.addressFundLink.first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
      const byTestId = await this.addressFundLink.first().isVisible().catch(() => false);
      if (byTestId) await this.addressFundLink.first().click();
      else await this.addressFundMenuLink.first().click();
    });
    await test.step('Перейти в раздел «Адреса проживающих»', async () => {
      await this.addressOfResidentsLink.first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
      const byTestId = await this.addressOfResidentsLink.first().isVisible().catch(() => false);
      if (byTestId) await this.addressOfResidentsLink.first().click();
      else await this.addressOfResidentsMenuLink.first().click();
    });
    await test.step('Нажать кнопку "Добавить запись"', async () => {
      await this.addEntryButton.click();
    });
    await test.step('Выбрать из списка "Район"', async () => {
      await this.districtLink.click();
    });
    await test.step('Открыто модальное окно "Район (создание)"', async () => {
      await expect(this.page.getByText('Район (создание)')).toBeVisible();
    });
    await test.step('Ввести название района', async () => {
      await this.nameDistrictInput.click();
      await this.nameDistrictInput.fill(nameDistrict);
    });
    await test.step('Нажать кнопку "Внести"', async () => {
      await this.contributeButton.click();
    });
  }

  async displayingRecordInTable(nameDistrict) {
    await test.step('Проверить запись в таблице', async () => {
      await expect(this.page.getByText(nameDistrict).first()).toBeVisible();
    });
  }

  async clickEditForRecord(nameDistrict) {
    await test.step('Найти запись в таблице и нажать кнопку редактировать', async () => {
      const row = this.page.getByRole('row').filter({ hasText: nameDistrict }).first();
      await row.locator('.tdaction.text-right .notranslate').click();
    });
  }

  async editDistrictRecord(oldName, newName) {
    await this.clickEditForRecord(oldName);
    await test.step('Изменить название района', async () => {
      await this.nameDistrictInput.clear();
      await this.nameDistrictInput.fill(newName);
      await this.nameDistrictInput.press('Tab');
    });
    await test.step('Нажать кнопку "Сохранить"', async () => {
      await this.saveButton.click();
      /*await this.saveButton.click();*/
    });
    await test.step('Дождаться закрытия модалки', async () => {
      await this.saveButton.waitFor({ state: 'hidden', timeout: 15000 });
    });
  }

  async selectRecordByCheckbox(nameDistrict) {
    await test.step('Отметить чекбокс у записи', async () => {
      const row = this.page.getByRole('row').filter({ hasText: nameDistrict }).first();
      await row.scrollIntoViewIfNeeded();
      await row.locator('.tdaction .v-input--checkbox .v-input--selection-controls__ripple').click();
    });
  }

  async deleteSelectedWithConfirm() {
    await test.step('Нажать кнопку "Удалить выбранные записи"', async () => {
      await this.deleteSelectedButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.deleteSelectedButton.click();
    });
    await test.step('Подтвердить удаление в диалоге', async () => {
      await this.confirmYesButton.click();
      await this.page.locator('[data-test-id="stack-yes-no"]').waitFor({ state: 'hidden', timeout: 10000 });
    });
  }

  async cancelDeletionInDialog() {
    await test.step('Отменить удаление в диалоге', async () => {
      await this.confirmNoButton.click();
    });
  }

  async recordRemovedFromTable(nameDistrict) {
    await test.step('Проверить, что запись удалена из таблицы', async () => {
      await expect(this.page.getByRole('row').filter({ hasText: nameDistrict })).toHaveCount(0, { timeout: 15000 });
    });
  }

  async openAddDistrictModal() {
    await test.step('Нажать кнопку "Добавить запись"', async () => {
      await this.addEntryButton.click();
    });
    await test.step('Выбрать из списка "Район"', async () => {
      await this.districtLink.first().scrollIntoViewIfNeeded();
      await this.districtLink.first().click({ timeout: 15000 });
    });
    await test.step('Открыто модальное окно "Район (создание)"', async () => {
      await expect(this.page.getByText('Район (создание)')).toBeVisible();
    });
  }

  async saveWithEmptyNameAndExpectValidationError() {
    await test.step('Нажать кнопку "Внести" (сохранить с пустым полем)', async () => {
      await this.contributeButton.click();
    });
    await test.step('Ожидаем сообщение об ошибке "Поле не может быть пустым"', async () => {
      await expect(this.validationErrorText).toBeVisible();
    });
  }
}
