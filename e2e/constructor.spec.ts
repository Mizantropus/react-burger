import { test, expect, type Page } from '@playwright/test';

const ORDER_NUMBER = 1234;

const IdConst = '692889f16bf770001bfeb4d6';

async function openModalWindow(page: Page): Promise<void> {
  await page.locator(`[id="${IdConst}"]`).click();
  await page.waitForTimeout(1000);
}

async function moveItem2Order(
  page: Page,
  first_id = '692889f16bf770001bfeb4cd',
  second_id = '692889f16bf770001bfeb4d9'
): Promise<void> {
  const firstItem = page.locator(`[id="${first_id}"]`);
  const secondItem = page.locator(`[id="${second_id}"]`);
  const orderSpace = page.locator('[class*="burger-constructor__ingredients"]');
  await firstItem.waitFor({ state: 'visible' });
  await firstItem.dragTo(orderSpace);
  await secondItem.dragTo(orderSpace);
}

test.describe('Тестирование процесса создания заказа', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: '**api/ingredients',
      update: false,
    });
    await page.routeFromHAR('./e2e/hars/auth.har', {
      url: '**api/auth/**',
      update: false,
    });
    await page.routeFromHAR('./e2e/hars/createOrder.har', {
      url: '**api/orders',
      update: false,
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Перетаскиваем ингредиенты в конструктор', async ({ page }): Promise<void> => {
    await moveItem2Order(page);
    const orderButton = page.getByText('Подтвердить заказ');
    await expect(orderButton).toBeVisible();
    await expect(orderButton).toBeEnabled();
  });

  test('открытие модального окна с описанием ингредиента', async ({
    page,
  }): Promise<void> => {
    await openModalWindow(page);
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
  });

  test('отображение в модальном окне данных ингредиента', async ({
    page,
  }): Promise<void> => {
    await page.locator(`[id="${IdConst}"]`).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Калории,ккал')).toBeVisible();
    await expect(page.getByText('Белки, г')).toBeVisible();
    await expect(page.getByText('Жиры, г')).toBeVisible();
    await expect(page.getByText('Углеводы, г')).toBeVisible();
  });

  test('закрытие модальных окон при клике на кнопку закрытия', async ({
    page,
  }): Promise<void> => {
    await openModalWindow(page);
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await page.locator('[class*="modal__modal__closeicon"]').click();
    await expect(page.getByText('Детали ингредиента')).toBeHidden();
  });

  test('создание заказа', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'Bearer testtoken');
      localStorage.setItem('refreshToken', 'testrefresh');
    });

    await Promise.all([page.waitForResponse('**/api/auth/user'), page.reload()]);
    await page.waitForLoadState('networkidle');

    await moveItem2Order(page);

    const orderButton = page.getByText('Подтвердить заказ');
    await expect(orderButton).toBeVisible();
    await expect(orderButton).toBeEnabled();
    await Promise.all([
      page.waitForResponse('**/api/orders'),
      orderButton.click(),
    ]);

    await expect(page.getByText('идентификатор заказа')).toBeVisible();
    await expect(page.getByText(String(ORDER_NUMBER))).toBeVisible();
  });
});
