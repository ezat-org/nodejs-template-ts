/**
 * Monetary amount can have >18 digits before and after decimal point.
 * Using 50 digits before and after decimal point to ensure amount will not be out of range
 */
export const AMOUNT_PRECISION = 100;
export const AMOUNT_SCALE = 50;
