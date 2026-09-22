# Лабораторна робота №2
## Проєктування тестів. Checklist, Test Cases та Decision Table

**Виконав:** Ковальов Гордій  
**Дата виконання:** 22.09.2026  
**Гілка:** `lb2`

## Тестовий об'єкт

SauceDemo Login: https://www.saucedemo.com/

## Тестове середовище

- Операційна система: Windows
- Браузер: інтегрований браузер VS Code
- Дата тестування: 22.09.2026

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

Окремими Test Cases не покриті правила **R3** (неправильний Username + правильний Password) та **R5** (неправильний Username + неправильний Password).

## Результати виконання

| Test Case | Type | Result |
|---|---|---|
| TC-LOGIN-01 | Positive | Pass |
| TC-LOGIN-02 | Negative | Pass |
| TC-LOGIN-03 | Negative | Pass |

Негативні Test Cases мають результат Pass, оскільки фактична поведінка системи відповідає очікуваній: система коректно відхилила неправильні або заблоковані credentials.

## Висновок

Під час лабораторної роботи було визначено Test Conditions на основі Test Basis, сформовано checklist, описано один позитивний і два негативні Test Cases та побудовано Decision Table для комбінацій Username і Password. У SauceDemo виконано всі три Test Cases, кожен завершився результатом Pass. Decision Table додатково показала два непокриті правила R3 і R5, які можуть бути використані для розширення набору тестів.

## Контрольні питання

1. **Що таке Test Basis і навіщо він потрібний?**  
   Test Basis - це вимоги, специфікації або інші матеріали, на основі яких визначають умови тестування та Expected Result.

2. **Чим Test Condition відрізняється від Test Case?**  
   Test Condition описує, що потрібно перевірити. Test Case описує конкретні дані, передумови, кроки та очікуваний результат перевірки.

3. **На яке питання відповідає Test Analysis?**  
   На питання: «Що саме потрібно перевірити?».

4. **На яке питання відповідає Test Design?**  
   На питання: «Як це перевірити?».

5. **Для чого використовується checklist?**  
   Для компактної фіксації переліку перевірок без детального опису всіх кроків.

6. **Чому checklist не завжди може замінити детальний test case?**  
   Checklist може не містити тестових даних, передумов, точних кроків та Expected Result, тому його недостатньо для повної відтворюваності важливого сценарію.

7. **Чим positive test відрізняється від negative test?**  
   Positive test перевіряє очікуване використання з коректними даними. Negative test перевіряє обробку некоректних даних або нештатних умов.

8. **Чому negative test може мати результат Pass?**  
   Тому що Pass означає відповідність фактичного результату очікуваному. Якщо система правильно відхилила некоректні дані, негативний тест пройдено.

9. **Для чого використовується Decision Table?**  
   Для систематизації комбінацій умов і визначення відповідних дій системи.

10. **Навіщо порівнювати Expected Result та Actual Result?**  
    Щоб визначити, чи відповідає фактична поведінка системи вимогам.

11. **Що означають Pass та Fail?**  
    Pass означає, що Actual Result відповідає Expected Result. Fail означає, що Actual Result не відповідає Expected Result.
