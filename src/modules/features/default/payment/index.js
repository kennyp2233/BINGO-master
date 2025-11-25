/**
 * Punto de entrada principal del módulo de pagos
 * Estructura organizada por proveedor de pagos
 */

// Módulo común (compartido entre todos los proveedores)
export * from './common';

// Proveedor: Payphone
export * from './payphone';

// Proveedor: PayPal
export * from './paypal';

/**
 * Estructura del módulo:
 *
 * payment/
 *   ├── common/          - Componentes y servicios compartidos
 *   │   ├── components/  - PaymentResponse, TransactionTicket
 *   │   └── services/    - paymentService, transactionService, paymentResponseService
 *   ├── payphone/        - Integración con Payphone Ecuador
 *   │   ├── components/  - PayphoneButton, PayphoneBox
 *   │   └── services/    - payphoneService
 *   └── paypal/          - Integración con PayPal
 *       ├── components/  - PayPalButton
 *       └── services/    - (futuro)
 */
