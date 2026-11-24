# Лабораторна робота №5

## Інтеграційне тестування компонентів та зовнішніх систем

**Виконав: Ковальов Гордій**  
**Група: 6.1213-1**  
**Дата: 24.11.2026**

## Test Basis

| Test Basis | Опис |
|---|---|
| TB-01. CartService | Дозволяє додавати товари із ціною та кількістю. Загальна сума: `total = Σ price * quantity`. Метод `getFinalTotal(discountPercent)` розраховує загальну суму та застосовує до неї `calculateDiscount()` із `shop-utils.js`. |
| TB-02. Discount | `calculateDiscount(price, percent)` (з ЛР №3): `100, 10 -> 90`; `100, 0 -> 100`; `100, 100 -> 0`. Для `percent` поза діапазоном 0-100 виникає помилка `Discount must be between 0 and 100`. |
| TB-03. External Echo Gateway | `ExternalEchoGateway` надсилає до зовнішнього сервісу `orderId` та `total` через HTTP Request. Зовнішня система - Postman Echo, яка для `GET /get` повертає передані Query Parameters в об'єкті `args`. |

## Структура

```
lb5/
├── src/
│   ├── shop-utils.js              # з ЛР №3
│   ├── cart-service.js            # новий компонент
│   └── external-echo.gateway.js   # доступ до зовнішньої системи
├── tests/
│   ├── shop-utils.test.js         # Component Tests з ЛР №3
│   └── integration/
│       ├── cart-discount.integration.test.js
│       └── external-echo.system-integration.test.js
├── package.json
├── vitest.config.js
└── report.md
```

## 1. Component Integration Testing

### Test Object

`CartService <-> shop-utils`

Mock не використовується: працюють реальний `CartService` і реальна `calculateDiscount()`.

### Scenario 1 — Discount

Test Data:

- item 1: price = 100, quantity = 1;
- item 2: price = 200, quantity = 1;
- discount = 10%.

Розрахунок: `total = 100 + 200 = 300`, знижка 10%.

Expected Result:

`270`

Actual Result:

`270`

Result:

`Pass`

### Scenario 2 — Invalid Discount

Test Data:

- item: price = 100;
- discount = 110%.

Expected Result:

`Error: Discount must be between 0 and 100`

Actual Result:

`Error: Discount must be between 0 and 100`

Result:

`Pass`

Negative Test має статус Pass, оскільки Expected Result (Error) співпав з Actual Result (Error). Negative Test ≠ Failed Test.

## 2. System Integration Testing

### Test Object

`ExternalEchoGateway ↔ Internet ↔ Postman Echo`

### Test Data

- orderId = `ORD-001`;
- total = `270`.

Сформований Request: `https://postman-echo.com/get?orderId=ORD-001&total=270`

### Expected Result

```json
{
    "orderId": "ORD-001",
    "total": 270
}
```

### Actual Result

```json
{
    "orderId": "ORD-001",
    "total": 270
}
```

Result: `Pass`

Особливості тесту:

- `async / await` - тест працює з мережею, Vitest очікує завершення Promise;
- `toEqual()` замість `toBe()` - порівнюється структура та значення об'єкта, а не посилання в пам'яті;
- `10_000` - timeout 10 с замість стандартних 5 с, оскільки відповідь зовнішнього сервісу не є миттєвою;
- `Number(data.args.total)` - Echo повертає Query Parameters як String, тому виконується конвертація у число.

## 3. Загальний результат

| Файл | Рівень | Tests | Pass | Fail |
| :--- | :--- | ---: | ---: | ---: |
| `tests/shop-utils.test.js` | Component Test | 15 | 15 | 0 |
| `tests/integration/cart-discount.integration.test.js` | Component Integration | 2 | 2 | 0 |
| `tests/integration/external-echo.system-integration.test.js` | System Integration | 1 | 1 | 0 |
| **Усього** | | **18** | **18** | **0** |

Команди запуску:

- лише інтеграційні тести: `npx vitest run integration`;
- весь Test Suite: `npx vitest run`.

Нові тести не зламали тести з ЛР №3.

## 4. Експеримент: відключення мережі

| Рівень | Інтернет є | Інтернету немає |
|---|---|---|
| Component Test (`calculateDiscount`) | Pass | Pass |
| Component Integration (`CartService <-> shop-utils`) | Pass | Pass |
| System Integration (`Gateway <-> Postman Echo`) | Pass | **Fail** (`fetch failed`) |

Код не змінювався, змінилося лише Test Environment. Отже, Fail у System Integration Test ≠ автоматичний defect у власному коді: спочатку потрібен Analysis причини.

## 5. Порівняння трьох рівнів

| Ознака | Component Test | Component Integration | System Integration |
|---|---|---|---|
| Приклад | `calculateDiscount()` | `CartService <-> calculateDiscount()` | `Gateway <-> Postman Echo` |
| Межа | Один компонент | Компоненти нашої системи | Наша система + зовнішня |
| Network | Ні | Ні | Так |
| External service | Ні | Ні | Так |
| Швидкість | Висока | Висока | Залежить від мережі |
| Причин Fail | Менше | Більше | Ще більше |

## Висновки

У ході роботи створено компонент `CartService`, який використовує реальну функцію `calculateDiscount()` з ЛР №3, і компонент `ExternalEchoGateway` для взаємодії із зовнішньою системою Postman Echo через HTTP.

Розроблено три інтеграційні тести: позитивний Component Integration Test (кошик 100 + 200 зі знижкою 10% дає 270), негативний Component Integration Test (помилка валідації знижки коректно передається від `calculateDiscount()` через `CartService` до того, хто викликав метод) і System Integration Test (Gateway надсилає `orderId` та `total` до Postman Echo та отримує їх назад в об'єкті `args`). Усі тести мають статус Pass.

Практично з'ясовано відмінність між рівнями тестування. Component Test перевіряє один компонент ізольовано, Component Integration Test - зв'язку двох реальних компонентів системи без mock, System Integration Test - межу між власним кодом і незалежно розгорнутим зовнішнім сервісом. Чим ширший Test Object, тим більше можливих причин Fail і тим сильніша залежність від Test Environment: експеримент із відключенням мережі показав, що System Integration Test впав, тоді як Unit та Component Integration Tests залишилися Pass, хоча код не змінювався.

## Відповіді на контрольні питання

1. **Що таке Integration Testing?**  
   Це рівень тестування, на якому перевіряється не внутрішня логіка окремого компонента, а взаємодія між компонентами або системами: передавання даних, викликів і помилок через їхні межі (інтерфейси).

2. **Що є Test Object у Component Integration Testing?**  
   Зв'язка двох або більше реальних компонентів усередині однієї системи та інтерфейс між ними. У роботі це `CartService <-> shop-utils`, а не одна функція.

3. **Чим Component Test відрізняється від Component Integration Test?**  
   Component Test перевіряє один компонент ізольовано (наприклад, `calculateDiscount()` з ЛР №3). Component Integration Test перевіряє, чи правильно два реальні компоненти працюють разом: чи коректно `CartService` передає аргументи в `calculateDiscount()` і повертає її результат.

4. **Чому успішні Unit Tests не гарантують правильної взаємодії компонентів?**  
   Unit Tests перевіряють компоненти окремо і нічого не кажуть про їхню межу. Обидва компоненти можуть бути коректними, але з'єднані неправильно: переставлені аргументи (`calculateDiscount(percent, total)`), передана не та величина (сума без урахування `quantity`), втрачений або проігнорований результат. Такі дефекти інтеграції видно лише тоді, коли компоненти викликаються разом.

5. **Чому `calculateDiscount()` не підміняється mock-функцією?**  
   Тому що саме реальна взаємодія з нею і є Test Object. Mock замінив би компонент власною реалізацією, і тест перевіряв би зв'язок із заглушкою, а не з реальним кодом: дефект у передаванні даних між `CartService` і `shop-utils` залишився б непоміченим.

6. **Чому negative integration test може завершитися Pass?**  
   Тому що статус тесту визначається збігом Expected Result і Actual Result, а не тим, успішною чи неуспішною була операція. Якщо за Test Basis очікується помилка `Discount must be between 0 and 100` і система її генерує, тест має статус Pass. Negative Test ≠ Failed Test.

7. **Що таке System Integration Testing?**  
   Це тестування взаємодії нашої системи з іншими, незалежно розгорнутими системами та сервісами - зазвичай через мережу й публічні інтерфейси (HTTP API, черги, бази даних). У роботі це `ExternalEchoGateway <-> Internet <-> Postman Echo`.

8. **Чим System Integration Testing відрізняється від Component Integration Testing?**  
   Межею Test Object і залежністю від середовища. Component Integration залишається в межах нашої системи, виконується в пам'яті, швидко та детерміновано. System Integration виходить за межу нашої системи: задіяні мережа, DNS, TLS, доступність і версія зовнішнього сервісу, тому тест повільніший, менш стабільний і має більше можливих причин Fail, не пов'язаних із нашим кодом.

9. **Для чого Test може мати timeout?**  
   Timeout обмежує час очікування завершення тесту. Для асинхронних тестів із мережею стандартних 5 с може бути недостатньо, тому задається `10_000` мс. Водночас timeout не дає тесту висіти безкінечно, якщо зовнішня система не відповідає: тест завершується з Fail, і Test Suite продовжує роботу.

10. **Які зовнішні фактори можуть впливати на System Integration Test?**  
    Відсутність або нестабільність інтернету, помилки DNS, proxy та firewall, недоступність або технічні роботи на боці Postman Echo, затримки мережі (timeout), rate limiting і помилки 4xx/5xx, зміна контракту зовнішнього API (наприклад, інша назва поля замість `args`), проблеми з TLS-сертифікатами.
