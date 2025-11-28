import { db } from 'config/firebase';
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    doc,
    setDoc,
    updateDoc,
    getCountFromServer
} from 'firebase/firestore';
import { collPayments } from 'store/collections';

/**
 * Obtiene la lista de pagos paginada y optimizada
 * @param {number} page - Número de página (0-based)
 * @param {number} rowsPerPage - Cantidad de filas por página
 * @param {string} searchTerm - Término de búsqueda (opcional)
 * @returns {Promise<{payments: Array, totalCount: number}>}
 */
export const getPaymentsListPaginated = async (page = 0, rowsPerPage = 10, searchTerm = '') => {
    try {
        let paymentsQuery;
        let countQuery;

        // Referencia a la colección
        const paymentsRef = collection(db, collPayments);

        // Si hay un término de búsqueda, filtramos por details
        if (searchTerm && searchTerm.trim() !== '') {
            const searchLowerCase = searchTerm.toLowerCase();
            const end = searchLowerCase + '\uf8ff';

            // Búsqueda por details
            paymentsQuery = query(
                paymentsRef,
                where('details', '>=', searchLowerCase),
                where('details', '<=', end),
                orderBy('details')
            );

            // Para búsqueda, el conteo debe ser sobre la query filtrada
            countQuery = paymentsQuery;
        } else {
            // Sin búsqueda, ordenamos por fecha de creación (más recientes primero)
            paymentsQuery = query(paymentsRef, orderBy('createAt', 'desc'));
            countQuery = paymentsRef;
        }

        // Optimización: Usar getCountFromServer para el total
        // Esto es más barato y rápido que descargar todos los documentos
        const countSnapshot = await getCountFromServer(countQuery);
        const totalCount = countSnapshot.data().count;

        // Aplicamos paginación
        let paginatedQuery;

        if (page > 0) {
            // Obtener el último documento de la página anterior para usar startAfter
            // Nota: Para saltos grandes de página esto sigue siendo costoso, 
            // pero es la forma estándar en Firestore sin cursores persistentes.
            const lastVisibleDocQuery = query(paymentsQuery, limit(page * rowsPerPage));
            const lastVisibleDocSnapshot = await getDocs(lastVisibleDocQuery);

            if (!lastVisibleDocSnapshot.empty) {
                const lastDoc = lastVisibleDocSnapshot.docs[lastVisibleDocSnapshot.docs.length - 1];
                paginatedQuery = query(paymentsQuery, startAfter(lastDoc), limit(rowsPerPage));
            } else {
                return { payments: [], totalCount };
            }
        } else {
            // Primera página
            paginatedQuery = query(paymentsQuery, limit(rowsPerPage));
        }

        const snapshot = await getDocs(paginatedQuery);
        const payments = snapshot.docs.map((doc) => doc.data());

        return {
            payments,
            totalCount
        };
    } catch (error) {
        console.error('Error getting paginated payments:', error);
        return { payments: [], totalCount: 0 };
    }
};

/**
 * Calcula el beneficio total pagado
 * @param {Object} filter - Filtros opcionales
 * @returns {Promise<number>} Total calculado
 */
export async function getTotalPaidBenefit(filter = {}) {
    let total = 0;
    let q = collection(db, collPayments);

    if (filter.statusCode) {
        q = query(q, where('statusCode', '==', filter.statusCode));
    }

    // Nota: Firestore no soporta agregaciones nativas de suma en el cliente SDK web estándar de manera directa y barata
    // sin leer los documentos. Se mantiene la lectura pero se podría optimizar en el futuro con Cloud Functions
    // que mantengan un contador/total en un documento separado.
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.total) {
                total += Number.parseFloat(data.total);
            }
        });
    }

    return total;
}

/**
 * Crea un nuevo documento de pago
 */
export const createPayment = async (id, data) => {
    return setDoc(doc(db, collPayments, id), data);
};

/**
 * Actualiza un documento de pago existente
 */
export const updatePayment = async (id, data) => {
    return updateDoc(doc(db, collPayments, id), data);
};
