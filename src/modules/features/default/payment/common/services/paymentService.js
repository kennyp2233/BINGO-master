//Firebase
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
    updateDoc
} from 'firebase/firestore';
import {
    collPayments,
    collCards,
    collUserCards
} from 'store/collections';

export const getPaymentsList = async () => {
    const list = [];
    const querySnapshot = await getDocs(collection(db, collPayments));
    querySnapshot.forEach((doc) => {
        list.push(doc.data());
    });
    return list;
};

//Total beneficio
export async function getTotalPaidBenefit(filter = {}) {
    let total = 0;

    let q = collection(db, collPayments);

    if (filter.statusCode) {
        q = query(q, where('statusCode', '==', filter.statusCode));
    }

    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
            total = Number.parseFloat(total) + Number.parseFloat(doc.data().total);
        });
    }

    return total;
}

export const getPaymentsListPaginated = async (page = 0, rowsPerPage = 10, searchTerm = '') => {
    try {
        // Query base para pagos
        let paymentsQuery;

        // Si hay un término de búsqueda, filtramos por details
        if (searchTerm && searchTerm.trim() !== '') {
            const searchLowerCase = searchTerm.toLowerCase();
            const end = searchLowerCase + '\uf8ff';

            // Búsqueda por details (requiere índice compuesto)
            paymentsQuery = query(
                collection(db, collPayments),
                where('details', '>=', searchLowerCase),
                where('details', '<=', end),
                orderBy('details')
            );
        } else {
            // Sin búsqueda, ordenamos por fecha de creación (más recientes primero)
            paymentsQuery = query(collection(db, collPayments), orderBy('createAt', 'desc'));
        }

        // Obtenemos el total para la paginación
        const countSnapshot = await getDocs(paymentsQuery);
        const totalCount = countSnapshot.size;

        // Aplicamos paginación
        let paginatedQuery;

        if (page > 0) {
            // Si no es la primera página, necesitamos el último documento de la página anterior
            const lastVisibleDoc = await getDocs(query(paymentsQuery, limit(page * rowsPerPage)));

            if (lastVisibleDoc.docs.length > 0) {
                const lastDoc = lastVisibleDoc.docs[lastVisibleDoc.docs.length - 1];
                paginatedQuery = query(paymentsQuery, startAfter(lastDoc), limit(rowsPerPage));
            } else {
                return {
                    payments: [],
                    totalCount
                };
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
        // Enfoque alternativo en caso de error
        try {
            const simpleQuery = query(collection(db, collPayments), orderBy('createAt', 'desc'), limit(rowsPerPage));

            const snapshot = await getDocs(simpleQuery);
            return {
                payments: snapshot.docs.map((doc) => doc.data()),
                totalCount: snapshot.size
            };
        } catch (fallbackError) {
            console.error('Fallback error:', fallbackError);
            return {
                payments: [],
                totalCount: 0
            };
        }
    }
};

export const createDocument = async (collectionName, docId, data) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await setDoc(docRef, data);
    } catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
};

export const updateDocument = async (collectionName, docId, data) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, data);
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
};

// Alias para mantener compatibilidad
export const createPaymentDocument = async (docId, paymentData) => {
    return createDocument(collPayments, docId, paymentData);
};

export const updatePaymentDocument = async (docId, paymentData) => {
    return updateDocument(collPayments, docId, paymentData);
};

export const paymentService = {
    getPaymentsList,
    getTotalPaidBenefit,
    getPaymentsListPaginated,
    createDocument,
    updateDocument,
    createPaymentDocument,
    updatePaymentDocument
};