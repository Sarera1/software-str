# Лабораторна робота №2
## Проєктування тестів. Checklist, Test Cases та Decision Table

**Виконав:** Ковальов Гордій  
**Дата виконання:** 21.09.2026  
**Гілка:** `lb2`

## Тестовий об'єкт

SauceDemo Login: https://www.saucedemo.com/

## Тестове середовище

- Операційна система: Windows
- Браузер: інтегрований браузер VS Code
- Дата тестування: 21.09.2026

## Test Basis

- **TB-01. Обов'язковий Username.** Якщо поле Username порожнє, авторизація не виконується, відображається `Epic sadface: Username is required`.
- **TB-02. Обов'язковий Password.** Якщо Username заповнений, а Password порожній, авторизація не виконується, відображається `Epic sadface: Password is required`.
- **TB-03. Валідні облікові дані.** Допустимі користувачі: `standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`. Пароль для користувачів: `secret_sauce`.
- **TB-04. Успішний Login.** Валідні credentials для незаблокованого користувача перенаправляють на `/inventory.html`, сторінку Products.
- **TB-05. Заблокований користувач.** Для `locked_out_user` вхід відхиляється з повідомленням `Epic sadface: Sorry, this user has been locked out.`
- **TB-06. Невалідні credentials.** Невалідні Username або Password відхиляються з повідомленням `Epic sadface: Username and password do not match any user in this service`.

## Test Conditions

- **TCND-01** - успішна авторизація валідного незаблокованого користувача.
- **TCND-02** - авторизація з неправильним Username.
- **TCND-03** - авторизація з неправильним Password.
- **TCND-04** - авторизація з порожнім Username.
- **TCND-05** - авторизація з порожнім Password.
- **TCND-06** - авторизація заблокованого користувача.

## Checklist

- [x] Успішна авторизація з валідними даними.
- [ ] Відмова в авторизації з неправильним Username.
- [x] Відмова в авторизації з неправильним Password.
- [ ] Перевірка порожнього Username.
- [ ] Перевірка порожнього Password.
- [x] Відмова в авторизації заблокованого користувача.

## Test Cases

### TC-LOGIN-01 - Успішна авторизація standard_user

- **Type:** Positive
- **Test Condition:** TCND-01
- **Preconditions:** Відкрита сторінка Login SauceDemo; користувач не авторизований.
- **Test Data:** Username: `standard_user`; Password: `secret_sauce`.
- **Steps:**
  1. У поле Username ввести `standard_user`.
  2. У поле Password ввести `secret_sauce`.
  3. Натиснути кнопку Login.
- **Expected Result:** Після введення валідних даних і натискання Login користувач успішно авторизується та переходить на сторінку Products за адресою `/inventory.html`.
- **Actual Result:** Після введення `standard_user` і `secret_sauce` та натискання Login відкрилася сторінка Products за адресою `https://www.saucedemo.com/inventory.html`.
- **Result:** **Pass**

### TC-LOGIN-02 - Авторизація з неправильним Password

- **Type:** Negative
- **Test Condition:** TCND-03
- **Preconditions:** Відкрита сторінка Login SauceDemo; користувач не авторизований.
- **Test Data:** Username: `standard_user`; Password: `wrong_password`.
- **Steps:**
  1. У поле Username ввести `standard_user`.
  2. У поле Password ввести `wrong_password`.
  3. Натиснути кнопку Login.
- **Expected Result:** Авторизація не виконується, залишається сторінка Login, відображається `Epic sadface: Username and password do not match any user in this service`.
- **Actual Result:** Авторизація не виконалася, URL залишився `https://www.saucedemo.com/`, відображено `Epic sadface: Username and password do not match any user in this service`.
- **Result:** **Pass**

### TC-LOGIN-03 - Авторизація заблокованого користувача

- **Type:** Negative
- **Test Condition:** TCND-06
- **Preconditions:** Відкрита сторінка Login SauceDemo; користувач не авторизований.
- **Test Data:** Username: `locked_out_user`; Password: `secret_sauce`.
- **Steps:**
  1. У поле Username ввести `locked_out_user`.
  2. У поле Password ввести `secret_sauce`.
  3. Натиснути кнопку Login.
- **Expected Result:** Авторизація не виконується, залишається сторінка Login, відображається `Epic sadface: Sorry, this user has been locked out.`
- **Actual Result:** Авторизація не виконалася, URL залишився `https://www.saucedemo.com/`, відображено `Epic sadface: Sorry, this user has been locked out.`
- **Result:** **Pass**

## Decision Table

Позначення: `T` - True, `F` - False, `-` - значення не впливає на результат, `X` - виконується дія.

| Умови / дії | R1 | R2 | R3 | R4 | R5 |
|---|---:|---:|---:|---:|---:|
| Username входить до списку допустимих? | T | T | F | T | F |
| Password правильний? | T | T | T | F | F |
| Користувач заблокований? | F | T | - | - | - |
| **A1: перейти до Products** | X |  |  |  |  |
| **A2: показати повідомлення про блокування** |  | X |  |  |  |
| **A3: показати повідомлення про неправильні credentials** |  |  | X | X | X |

Випадки з порожніми Username або Password не включені до Decision Table, оскільки SauceDemo перевіряє обов'язковість полів окремо до перевірки credentials.

### Покриття правил Test Cases

| Test Case | Покрите правило |
|---|---|
| TC-LOGIN-01 | R1 |
| TC-LOGIN-02 | R4 |
| TC-LOGIN-03 | R2 |


## Результати виконання

| Test Case | Type | Result |
|---|---|---|
| TC-LOGIN-01 | Positive | Pass |
| TC-LOGIN-02 | Negative | Pass |
| TC-LOGIN-03 | Negative | Pass |



## Висновок

Під час лабораторної роботи було визначено test conditions на основі test basis, сформовано checklist, описано один позитивний і два негативні test cases та побудовано decision table для комбінацій username і password. У SauceDemo виконано всі три test cases, кожен завершився результатом Pass.

