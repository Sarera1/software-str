# Лабораторна робота №3

## Модульне тестування програмного коду за допомогою Vitest

**Виконав:** Ковальов Гордій  
**Група:** 6.1213.1  
**Дата:** 06.10.2026  
**Гілка:** `lb3`

## Мета роботи

Ознайомитися з принципами модульного тестування, навчитися створювати unit tests за допомогою Vitest за схемою Arrange–Act–Assert, використовувати assertions та параметризовані тести, застосовувати Equivalence Partitioning і Boundary Value Analysis та аналізувати Code Coverage.

## Тестове середовище

- Node.js: v24.11.1
- npm: 11.6.2
- Vitest: 5.0.3 (`@vitest/coverage-v8` 5.0.3)
- Встановлення залежностей: `npm ci`
- Запуск тестів: `npm test` (у звіті використано `npx vitest run`)
- Запуск coverage: `npm run coverage`

## Test Object

`src/shop-utils.js`

## Функції

- `calculateDiscount(price, percent)`
- `validateQuantity(quantity)`
- `getShippingCost(total)`

## Test Basis

| Функція | Правило |
|---|---|
| `calculateDiscount` | `price` - невід'ємне число; `percent` від 0 до 100 включно; результат = `price - price × percent / 100`; неправильні аргументи -> `Error` |
| `validateQuantity` | тільки ціле число; допустимий діапазон 1-10 включно; допустиме -> `true`, недопустиме -> `false` |
| `getShippingCost` | `total` - невід'ємне число; `total < 1000` -> 100; `total >= 1000` -> 0; неправильне значення -> `Error` |

## Test Design

### calculateDiscount

| Test Condition | price | percent | Expected |
|---|---:|---:|---|
| Типове значення знижки | 100 | 10 | 90 |
| Нижня межа знижки | 100 | 0 | 100 |
| Верхня межа знижки | 100 | 100 | 0 |
| Від'ємна ціна (invalid) | -10 | 10 | `Error: Price must be a non-negative number` |
| Знижка більша за 100 (invalid, додаткове завдання) | 100 | 101 | `Error: Discount must be between 0 and 100` |

### validateQuantity

Equivalence partitions:

| Значення | Partition | Expected |
|---|---|---|
| < 1 | Invalid | `false` |
| 1-10, ціле | Valid | `true` |
| > 10 | Invalid | `false` |
| не ціле число | Invalid | `false` |

Boundary Value Analysis (межі 1 і 10) та параметризований `test.for()`:

| quantity | Expected | Що перевіряє |
|---:|---|---|
| 0 | `false` | значення безпосередньо під нижньою межею |
| 1 | `true` | нижня межа |
| 2 | `true` | значення безпосередньо над нижньою межею |
| 9 | `true` | значення безпосередньо під верхньою межею |
| 10 | `true` | верхня межа |
| 11 | `false` | значення безпосередньо над верхньою межею |
| 1.5 | `false` | не ціле число |

### getShippingCost

| total | Expected | Гілка |
|---:|---|---|
| 999 | 100 | значення безпосередньо перед межею 1000 |
| 1000 | 0 | сама межа (`total >= 1000`) |
| -1 | `Error: Total must be a non-negative number` | invalid partition |

## Результати тестування

Фактичний запуск (`npx vitest run --reporter=verbose`):

```text
 ✓ calculateDiscount > returns 90 for price 100 and discount 10%
 ✓ calculateDiscount > returns 100 for price 100 and discount 0% (lower bound)
 ✓ calculateDiscount > returns 0 for price 100 and discount 100% (upper bound)
 ✓ calculateDiscount > throws error for negative price
 ✓ calculateDiscount > throws error for discount above 100%
 ✓ validateQuantity > validateQuantity(0) returns false
 ✓ validateQuantity > validateQuantity(1) returns true
 ✓ validateQuantity > validateQuantity(2) returns true
 ✓ validateQuantity > validateQuantity(9) returns true
 ✓ validateQuantity > validateQuantity(10) returns true
 ✓ validateQuantity > validateQuantity(11) returns false
 ✓ validateQuantity > validateQuantity(1.5) returns false
 ✓ getShippingCost > returns 100 for total below 1000
 ✓ getShippingCost > returns 0 for total equal to 1000
 ✓ getShippingCost > throws error for negative total

 Test Files  1 passed (1)
      Tests  15 passed (15)
```

| Група тестів | Кількість | Result |
|---|---:|---|
| calculateDiscount | 5 | Pass |
| validateQuantity | 7 | Pass |
| getShippingCost | 3 | Pass |
| **Разом** | **15** | **15 Pass / 0 Fail** |

Усі тести отримали результат Pass, тобто Actual Result збігається з Expected Result, визначеним у Test Basis. Тестів із результатом Fail немає, тому окремого аналізу падінь не потрібно; код у `src/shop-utils.js` не змінювався.

## Coverage

Фактичний запуск `npm run coverage` (провайдер v8):

```text
 % Coverage report from v8
No files with missing coverage.
1 file fully covered.

Statements   : 100% ( 11/11 )
Branches     : 100% ( 18/18 )
Functions    : 100% ( 3/3 )
Lines        : 100% ( 11/11 )
```

| Metric | Result |
|---|---:|
| Statements | 100% (11/11) |
| Branches | 100% (18/18) |
| Functions | 100% (3/3) |
| Lines | 100% (11/11) |

HTML-звіт формується у теці `coverage/` (файл `coverage/index.html`); тека додана до `.gitignore`.

### Аналіз

Перед додатковим завданням (без тесту `throws error for discount above 100%`, 14 тестів) фактичний запуск дав Statements 90.9% (10/11), Branches 94.44% (17/18), Functions 100% (3/3), Lines 90.9% (10/11); непокритим був рядок 13. Тести з пунктів 3-6 не виконували гілку `throw new Error('Discount must be between 0 and 100')` у `calculateDiscount()`. Додатковий тест `throws error for discount above 100%` (`price = 100`, `percent = 101`) виконує цю гілку, і після нього Statements, Branches, Functions і Lines дорівнюють 100%.

100% Coverage означає лише те, що кожен рядок і гілка коду виконувалися під час тестів. Це не доводить, що Test Data та Expected Result правильні і що враховано всі вимоги. Наприклад, значення `NaN`, `Infinity` або `percent = -1` не перевірялися окремо, хоча відповідні умови формально покриті.

## Висновок

У ході лабораторної роботи було підготовлено проєкт, встановлено залежності командою `npm ci` та створено 15 unit tests для трьох функцій модуля `src/shop-utils.js`. Тести структуровано за схемою Arrange–Act–Assert і згруповано через `describe()`. Для `calculateDiscount()` перевірено типове значення, обидві межі знижки (0 і 100) та помилкові значення `price` і `percent`. Для `validateQuantity()` застосовано Equivalence Partitioning, Boundary Value Analysis і параметризований `test.for()` із 7 наборами даних. Для `getShippingCost()` перевірено значення 999, 1000 та -1. Усі 15 тестів завершилися Pass. Coverage Report показав 100% за Statements, Branches, Functions і Lines, але це свідчить лише про виконання коду тестами, а не про відсутність дефектів.

## Контрольні питання

1. **Що таке Unit Testing?**  
   Це модульне тестування: перевірка найменших частин коду (функцій, методів) окремо від решти системи. Кожен unit test викликає функцію з певними даними і порівнює результат з очікуваним.

3. **Для чого використовується `test()` у Vitest?**  
   `test()` оголошує один окремий тестовий сценарій: приймає назву сценарію і функцію з кодом перевірки. Vitest автоматично виконує її та показує Pass або Fail.

4. **Для чого використовується `expect()`?**  
   `expect(value)` приймає фактичне значення і разом із matcher (`toBe()`, `toThrow()` тощо) утворює перевірку, що порівнює Actual Result з Expected Result.

5. **Що таке assertion?**  
   Assertion - це перевірка умови всередині тесту, наприклад `expect(result).toBe(90)`. Якщо умова хибна, тест завершується Fail.

6. **Що означає схема AAA (Arrange–Act–Assert)?**  
   Це структура тесту з трьох етапів: Arrange - підготовка даних, Act - виклик функції, Assert - перевірка результату. Вона робить тести зрозумілими й однотипними.

7. **Що відбувається на етапі Arrange?**  
   Готуються Test Data та все необхідне для виконання тесту, наприклад `const price = 100; const percent = 10;`.

8. **Що відбувається на етапі Act?**  
   Викликається функція, що тестується, і її результат зберігається як Actual Result: `const result = calculateDiscount(price, percent);`.

9. **Що відбувається на етапі Assert?**  
   Actual Result порівнюється з Expected Result за допомогою assertion, наприклад `expect(result).toBe(90);`.

10. **Для чого використовується `describe()`?**  
    `describe()` об'єднує пов'язані тести в один іменований набір, наприклад `describe('calculateDiscount', ...)`. Це структурує тести та виводить їх згрупованими у звіті.

11. **Для чого використовується `toThrow()`?**  
    `toThrow()` перевіряє, що функція згенерувала помилку (за потреби - із заданим повідомленням), наприклад `toThrow('Price must be a non-negative number')`.

12. **Чому виклик функції при використанні `toThrow()` передається всередині іншої функції?**  
    Якщо написати `expect(calculateDiscount(-10, 10))`, помилка виникне ще під час обчислення аргументу, до того як `expect()` почне роботу, і тест впаде з винятком. Коли передано `() => calculateDiscount(-10, 10)`, Vitest сам викликає цю функцію всередині `expect()` і перехоплює виняток.

13. **Для чого використовується `test.for()`?**  
    `test.for()` створює параметризовані тести: один шаблон перевірки виконується для кількох наборів даних, і для кожного набору Vitest показує окремий результат. Так не потрібно писати кілька однакових тестів, що відрізняються лише даними (у роботі - 7 наборів для `validateQuantity()`).

17. **Що показує Code Coverage?**  
    Code Coverage показує, яка частина коду виконувалася під час тестів: Statements (інструкції), Branches (гілки умов), Functions (функції) і Lines (рядки). Також він вказує, які рядки та гілки залишилися непокритими.

19. **Чому 100% Coverage не гарантує відсутність дефектів?**  
    Coverage показує лише те, що код виконувався, але не доводить, що Test Data правильні, що Expected Result правильний і що враховано всі вимоги. Тест може виконати рядок коду без належної перевірки результату або пропустити важливі вхідні значення (наприклад, `NaN` чи `Infinity`).
