/**
 * Servicio para cálculos de impuestos y precios
 */

/**
 * Calcula los impuestos para una compra
 * @param {number} subtotal - Subtotal sin impuestos
 *  * @param {number} taxRate - Tasa de impuesto (por defecto 15%)
 * @returns {Object} Objeto con subtotal, impuesto y total
 */
export const calculateTaxes = (subtotal, taxRate = 0.15) => {
  try {
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      taxRate
    };
  } catch (error) {
    console.error('Error calculando impuestos:', error);
    return {
      subtotal: 0,
      tax: 0,
      total: 0,
      taxRate
    };
  }
};

/**
 * Calcula el precio por cartilla
 * @param {number} basePrice - Precio base por cartilla
 * @param {number} quantity - Cantidad de cartillas
 * @returns {Object} Detalles del precio
 */
export const calculateCardPrice = (basePrice = 1.0, quantity = 1) => {
  try {
    const subtotal = basePrice * quantity;
    const taxes = calculateTaxes(subtotal);

    return {
      unitPrice: basePrice,
      quantity,
      subtotal: taxes.subtotal,
      tax: taxes.tax,
      total: taxes.total
    };
  } catch (error) {
    console.error('Error calculando precio de cartillas:', error);
    return {
      unitPrice: basePrice,
      quantity,
      subtotal: 0,
      tax: 0,
      total: 0
    };
  }
};

/**
 * Calcula el precio con descuento
 * @param {number} originalPrice - Precio original
 * @param {number} discountPercent - Porcentaje de descuento
 * @returns {Object} Detalles del precio con descuento
 */
export const calculateDiscountedPrice = (originalPrice, discountPercent) => {
  try {
    const discount = originalPrice * (discountPercent / 100);
    const discountedPrice = originalPrice - discount;
    const taxes = calculateTaxes(discountedPrice);

    return {
      originalPrice,
      discountPercent,
      discount: Number(discount.toFixed(2)),
      discountedPrice: Number(discountedPrice.toFixed(2)),
      tax: taxes.tax,
      total: taxes.total
    };
  } catch (error) {
    console.error('Error calculando precio con descuento:', error);
    return {
      originalPrice,
      discountPercent,
      discount: 0,
      discountedPrice: originalPrice,
      tax: 0,
      total: originalPrice
    };
  }
};

export const taxService = {
  calculateTaxes,
  calculateCardPrice,
  calculateDiscountedPrice
};