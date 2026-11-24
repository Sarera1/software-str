import {
    describe,
    expect,
    test,
} from 'vitest';

import {
    calculateDiscount,
    validateQuantity,
    getShippingCost,
} from '../src/shop-utils.js';

describe('calculateDiscount', () => {
    test(
        'returns 90 for price 100 and discount 10%',
        () => {
            // Arrange
            const price = 100;
            const percent = 10;

            // Act
            const result = calculateDiscount(
                price,
                percent
            );

            // Assert
            expect(result).toBe(90);
        }
    );

    test(
        'returns 100 for price 100 and discount 0% (lower bound)',
        () => {
            // Arrange
            const price = 100;
            const percent = 0;

            // Act
            const result = calculateDiscount(
                price,
                percent
            );

            // Assert
            expect(result).toBe(100);
        }
    );

    test(
        'returns 0 for price 100 and discount 100% (upper bound)',
        () => {
            // Arrange
            const price = 100;
            const percent = 100;

            // Act
            const result = calculateDiscount(
                price,
                percent
            );

            // Assert
            expect(result).toBe(0);
        }
    );

    test(
        'throws error for negative price',
        () => {
            // Arrange
            const price = -10;
            const percent = 10;

            // Act + Assert
            expect(
                () => calculateDiscount(price, percent)
            ).toThrow(
                'Price must be a non-negative number'
            );
        }
    );

    // Додаткове завдання: покриття гілки неправильного percent
    test(
        'throws error for discount above 100%',
        () => {
            // Arrange
            const price = 100;
            const percent = 101;

            // Act + Assert
            expect(
                () => calculateDiscount(price, percent)
            ).toThrow(
                'Discount must be between 0 and 100'
            );
        }
    );
});

describe('validateQuantity', () => {
    test.for([
        { quantity: 0, expected: false },
        { quantity: 1, expected: true },
        { quantity: 2, expected: true },
        { quantity: 9, expected: true },
        { quantity: 10, expected: true },
        { quantity: 11, expected: false },
        { quantity: 1.5, expected: false },
    ])(
        'validateQuantity($quantity) returns $expected',
        ({ quantity, expected }) => {
            expect(
                validateQuantity(quantity)
            ).toBe(expected);
        }
    );
});

describe('getShippingCost', () => {
    test(
        'returns 100 for total below 1000',
        () => {
            // Arrange
            const total = 999;

            // Act
            const result = getShippingCost(total);

            // Assert
            expect(result).toBe(100);
        }
    );

    test(
        'returns 0 for total equal to 1000',
        () => {
            // Arrange
            const total = 1000;

            // Act
            const result = getShippingCost(total);

            // Assert
            expect(result).toBe(0);
        }
    );

    test(
        'throws error for negative total',
        () => {
            // Arrange
            const total = -1;

            // Act + Assert
            expect(
                () => getShippingCost(total)
            ).toThrow(
                'Total must be a non-negative number'
            );
        }
    );
});