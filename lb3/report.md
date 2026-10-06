# Лабораторна робота №3
## Автоматизація тестування веб-додатку SauceDemo

**Виконав:** Ковальов Гордій  
**Група:** 6.1213.1  
**Дата виконання:** 06.10.2026  
**Гілка:** `lb3`

## Мета
Автоматизувати перевірку основних сценаріїв авторизації в додатку SauceDemo та підтвердити, що система коректно реагує на валідні та невалідні облікові дані.

## Тестовий об'єкт
SauceDemo: https://www.saucedemo.com/

## Test Basis

- **TB-01. Username є обов'язковим.** Якщо поле Username порожнє, система показує повідомлення `Epic sadface: Username is required`.
- **TB-02. Password є обов'язковим.** Якщо Username заповнений, а Password порожній, система показує повідомлення `Epic sadface: Password is required`.
- **TB-03. Валідні дані.** Для активного користувача `standard_user` пароль `secret_sauce` є коректним.
- **TB-04. Заблокований користувач.** Для `locked_out_user` авторизація відхиляється повідомленням `Epic sadface: Sorry, this user has been locked out.`
- **TB-05. Невалідні дані.** Неправильний Username або Password призводять до повідомлення `Epic sadface: Username and password do not match any user in this service`.
- **TB-06. Успішний вхід.** При вірних даних користувач переходить на сторінку `/inventory.html`.

## Тестове середовище

- ОС: macOS
- Браузер: Chromium / Playwright
- Дата виконання: 06.10.2026
- Платформа: Web

## Інструменти автоматизації

Для автоматизації обрано Playwright — інструмент для UI-автотестів, який дозволяє виконувати сценарії в реальному браузері, перевіряти URL, тексти помилок і вміст сторінок.

## Прототип сценарію автоматизації

```js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.waitForURL(/\/inventory\.html/);
  console.log('Login successful');

  await browser.close();
})();
```

## Checklist

- [x] Успішний вхід з валідними credentials.
- [x] Відхилення при неправильному Password.
- [x] Відхилення для заблокованого користувача.
- [x] Відхилення при пустому Username.
- [x] Відхилення при пустому Password.
- [x] Відхилення при неправильному Username.

## Test Cases

### TC-AUT-01. Успішна авторизація

- **Type:** Positive
- **Preconditions:** Користувач не авторизований; сторінка логіну відкрита.
- **Test Data:** Username = `standard_user`, Password = `secret_sauce`
- **Steps:**
  1. Ввести `standard_user` в поле Username.
  2. Ввести `secret_sauce` в поле Password.
  3. Натиснути Login.
- **Expected Result:** Відбувається перехід на сторінку `/inventory.html`.
- **Actual Result:** URL змінюється на `https://www.saucedemo.com/inventory.html`.
- **Result:** Pass

### TC-AUT-02. Неправильний Password

- **Type:** Negative
- **Preconditions:** Користувач не авторизований.
- **Test Data:** Username = `standard_user`, Password = `wrong_password`
- **Steps:**
  1. Ввести `standard_user` в Username.
  2. Ввести `wrong_password` в Password.
  3. Натиснути Login.
- **Expected Result:** Вхід не виконаний, показано повідомлення `Epic sadface: Username and password do not match any user in this service`.
- **Actual Result:** Повідомлення про помилку відображається, сторінка залишається Login.
- **Result:** Pass

### TC-AUT-03. Заблокований користувач

- **Type:** Negative
- **Preconditions:** Користувач не авторизований.
- **Test Data:** Username = `locked_out_user`, Password = `secret_sauce`
- **Steps:**
  1. Ввести `locked_out_user` в Username.
  2. Ввести `secret_sauce` в Password.
  3. Натиснути Login.
- **Expected Result:** Авторизація блокується, відображається `Epic sadface: Sorry, this user has been locked out.`
- **Actual Result:** Повідомлення про блокування відображається, вхід не виконується.
- **Result:** Pass

### TC-AUT-04. Порожній Username

- **Type:** Negative
- **Preconditions:** Користувач не авторизований.
- **Test Data:** Username = пусто, Password = `secret_sauce`
- **Steps:**
  1. Залишити Username порожнім.
  2. Ввести `secret_sauce` в Password.
  3. Натиснути Login.
- **Expected Result:** Показано `Epic sadface: Username is required`.
- **Actual Result:** Повідомлення відображається, вхід не виконано.
- **Result:** Pass

### TC-AUT-05. Порожній Password

- **Type:** Negative
- **Preconditions:** Користувач не авторизований.
- **Test Data:** Username = `standard_user`, Password = пусто
- **Steps:**
  1. Ввести `standard_user` в Username.
  2. Залишити Password порожнім.
  3. Натиснути Login.
- **Expected Result:** Показано `Epic sadface: Password is required`.
- **Actual Result:** Повідомлення відображається, вхід не виконано.
- **Result:** Pass

### TC-AUT-06. Неправильний Username

- **Type:** Negative
- **Preconditions:** Користувач не авторизований.
- **Test Data:** Username = `invalid_user`, Password = `secret_sauce`
- **Steps:**
  1. Ввести `invalid_user` в Username.
  2. Ввести `secret_sauce` в Password.
  3. Натиснути Login.
- **Expected Result:** Вхід не виконаний, система показує `Epic sadface: Username and password do not match any user in this service`.
- **Actual Result:** Повідомлення відображається, вхід не виконано.
- **Result:** Pass

## Decision Table

| Username valid | Password valid | User locked | Action |
|---|---|---|---|
| T | T | F | Дозволити вхід і перейти на `/inventory.html` |
| T | F | F | Показати помилку про невірний пароль |
| F | T | F | Показати помилку про невірні credentials |
| T | T | T | Показати помилку про блокування користувача |
| F | F | F | Показати помилку про невірні credentials |

## Результати виконання

| Test Case | Result |
|---|---|
| TC-AUT-01 | Pass |
| TC-AUT-02 | Pass |
| TC-AUT-03 | Pass |
| TC-AUT-04 | Pass |
| TC-AUT-05 | Pass |
| TC-AUT-06 | Pass |

## Висновок

Під час виконання лабораторної роботи було реалізовано базову автоматизацію перевірки авторизації в SauceDemo за допомогою Playwright. Автоматизовані сценарії підтвердили, що система коректно виконує вхід для валідного користувача і правильно блокує доступ у невалідних або заблокованих випадках. Запропонована автоматизація є зручною основою для подальшого розширення тестового набору і включення перевірок інших функціональних сценаріїв.

## Контрольні питання

1. **Що таке автоматизація тестування?**  
   Це процес виконання тестів за допомогою спеціальних інструментів і сценаріїв без ручного втручання.

2. **Навіщо потрібні UI-автотести?**  
   Для перевірки реальної поведінки веб-додатку з точки зору користувача в браузері.

3. **Чим відрізняється позитивний сценарій від негативного?**  
   Позитивний сценарій перевіряє коректну поведінку при правильних даних, негативний — реакцію системи на помилки.

4. **Що таке Playwright?**  
   Це інструмент для автоматизації веб-тестування, який працює з браузерами і дозволяє перевіряти UI та навігацію.

5. **Чому автоматизація корисна в QA?**  
   Вона зменшує час перевірки, підвищує повторюваність і дозволяє швидко знаходити регресії.
