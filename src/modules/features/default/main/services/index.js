/**
 * Exportaciones de servicios principales
 *
 * Nota: Los servicios de pago (paymentService, paymentResponseService, transactionService)
 * se han movido a: modules/features/default/payment/common/services
 */

// Servicios de lógica de negocio
export { default as gameService } from './gameService.js';
export { default as termsService } from './termsService.js';
export { default as validationService } from './validationService.js';
export { default as taxService } from './taxService.js';

// Servicios de utilidades
export { eventService } from './eventService.js';
export { userService } from './userService.js';
export { configService } from './configService.js';
export { loggerService } from './loggerService.js';
export { notificationService } from './notificationService.js';
export { utilsService } from './utilsService.js';