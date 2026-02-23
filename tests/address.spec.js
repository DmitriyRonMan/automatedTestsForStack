import { test, expect } from '@playwright/test';
import { LoginPage, AddressPage } from '../src/pages/index';
import { UserBuilder, TextBuilderBuilder } from '../src/helpers/builder';

test.describe('Тесты раздела "Адреса проживающих"', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const userBuilder = new UserBuilder()
      .addLoginAuth()
      .addPasswordAuth()
      .generate();
    await loginPage.open();
    await loginPage.getAuthorization(userBuilder.login, userBuilder.password);
    await test.step('Открыта страница "Главное меню"', async () => {
      await expect(page.getByRole('heading', { name: 'Главное меню' })).toBeVisible();
    });
  });

  test('Добавление записи в таблицу', async ({ page }) => {
    const textBuilder = new TextBuilderBuilder()
        .getTextForName()
        .generate();
    const addressPage = new AddressPage(page);
    await addressPage.addingAnEntry(textBuilder.name);
    await addressPage.displayingRecordInTable(textBuilder.name);
  });

  test('Редактирование существующей записи', async ({ page }) => {
    const addressPage = new AddressPage(page);
    const textBuilder = new TextBuilderBuilder()
        .getTextForName()
        .generate();
    const textBuilderNew = new TextBuilderBuilder()
        .getTextForName()
        .generate();
      await addressPage.addingAnEntry(textBuilder.name);
      await addressPage.displayingRecordInTable(textBuilder.name);
    await test.step('Найти запись, нажать редактировать, изменить название, Сохранить', async () => {
      await addressPage.editDistrictRecord(textBuilder.name, textBuilderNew.name);
    });
    await test.step('Новое название записи отображается в таблице', async () => {
      await expect(page.getByText(textBuilderNew.name).first()).toBeVisible();
    });
  });

  test('Удаление записи из таблицы', async ({ page }) => {
    const addressPage = new AddressPage(page);
    const textBuilder = new TextBuilderBuilder()
        .getTextForDeleteTest()
        .generate();
    await addressPage.addingAnEntry(textBuilder.name);
    await addressPage.displayingRecordInTable(textBuilder.name);
    await addressPage.selectRecordByCheckbox(textBuilder.name);
    await addressPage.deleteSelectedWithConfirm();
    await addressPage.recordRemovedFromTable(textBuilder.name);
  });

  test('Отклонить удаление записи из таблицы', async ({ page }) => {
    const addressPage = new AddressPage(page);
    const textBuilder = new TextBuilderBuilder()
        .getTextForName()
        .generate();
      await addressPage.addingAnEntry(textBuilder.name);
      await addressPage.displayingRecordInTable(textBuilder.name);
    await test.step('Отметить чекбокс, нажать "Удалить выбранные записи", нажать "Отмена" в диалоге', async () => {
      await addressPage.selectRecordByCheckbox(textBuilder.name);
      await addressPage.deleteSelectedButton.click();
      await addressPage.cancelDeletionInDialog();
    });
      await addressPage.displayingRecordInTable(textBuilder.name);
  });

  test('Создание записи с пустым полем "Название"', async ({ page }) => {
    const addressPage = new AddressPage(page);
      await addressPage.openAddressSection();
      await addressPage.openAddDistrictModal();
      await addressPage.saveWithEmptyNameAndExpectValidationError();
  });
});
