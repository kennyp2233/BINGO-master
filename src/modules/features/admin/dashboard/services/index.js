import { db } from 'config/firebase';
import { collection, query, where, getCountFromServer, getDocs } from 'firebase/firestore';
import { collUsers, collCards, collGames, collPayments, collIncomes } from 'store/collections';
import { genConst } from 'store/constant';

/**
 * Get dashboard statistics including total users, admins, cards, games, and incomes.
 * Uses optimized server-side counting.
 * @returns {Promise<Object>} Object containing all dashboard stats
 */
export const getDashboardStats = async () => {
    try {
        const [users, admins, cards, games, incomes] = await Promise.all([
            countUser(),
            countAdminUser(),
            countCards(),
            countGames(),
            getTotalPaidBenefit({ statusCode: 3 })
        ]);

        return {
            users,
            admins,
            cards,
            games,
            incomes: Number.parseFloat(incomes).toFixed(2)
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};

const countUser = async () => {
    const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_DEF));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

const countAdminUser = async () => {
    const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_ADM));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

const countCards = async () => {
    const snapshot = await getCountFromServer(collection(db, collCards));
    return snapshot.data().count;
};

const countGames = async () => {
    const snapshot = await getCountFromServer(collection(db, collGames));
    return snapshot.data().count;
};

const getTotalPaidBenefit = async (filter = {}) => {
    let total = 0;
    let q = collection(db, collPayments);

    if (filter.statusCode) {
        q = query(q, where('statusCode', '==', filter.statusCode));
    }

    // Note: Summing fields still requires fetching documents as Firestore doesn't support sum aggregation directly in all SDK versions yet (or we stick to getDocs for this one)
    // Optimization: We could use aggregation queries if available, but for now getDocs is safer for sums if not using extensions.
    // However, for pure performance on large datasets, an aggregation query would be better.
    // Let's stick to getDocs for sum for now as it's safer compatibility-wise, but keep the count optimizations.
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
            total += Number.parseFloat(doc.data().total);
        });
    }

    return total;
};
