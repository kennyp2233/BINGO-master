import { useState, useEffect, useCallback } from 'react';
import { checkForBingoWinner, updateGame } from '../services/gameService';
import { getLetterForNumber, getTotalNumbers } from 'modules/shared/utils/bingoConfig';
import { gameTexts } from '../constants/gameTexts';

export const useBingoGame = (selectedGame, games) => {
    const [bingoNumbers, setBingoNumbers] = useState([]);
    const [currentNumber, setCurrentNumber] = useState(0);
    const [currentLetter, setCurrentLetter] = useState('');
    const [prevNumber, setPrevNumber] = useState(0);
    const [prevLetter, setPrevLetter] = useState('');
    const [resultBingo, setResultBingo] = useState('');
    const [winners, setWinners] = useState([]);
    const [quinaWinners, setQuinaWinners] = useState([]);
    const [checkingWinner, setCheckingWinner] = useState(false);
    const [cont, setCont] = useState(0);
    const [quinaRules, setQuinaRules] = useState({
        CENTER_ROW: true,
        CENTER_COL: true,
        DIAGONALS: true
    });

    // Load game state from localStorage
    useEffect(() => {
        const savedBingoNumbers = localStorage.getItem('bingoNumbers');
        if (savedBingoNumbers) {
            const parsedNumbers = JSON.parse(savedBingoNumbers);
            setBingoNumbers(parsedNumbers);
            setCont(parsedNumbers.length);

            if (parsedNumbers.length > 0) {
                const lastNum = parsedNumbers[parsedNumbers.length - 1];
                const lastLetter = getLetterForNumber(lastNum);
                setCurrentNumber(lastNum);
                setCurrentLetter(gameTexts[lastLetter.toLowerCase()]);

                if (parsedNumbers.length > 1) {
                    const prevNum = parsedNumbers[parsedNumbers.length - 2];
                    const prevLetter = getLetterForNumber(prevNum);
                    setPrevNumber(prevNum);
                    setPrevLetter(gameTexts[prevLetter.toLowerCase()]);
                }
            }

            const savedResultBingo = localStorage.getItem('resultBingo');
            if (savedResultBingo) {
                setResultBingo(savedResultBingo);
            }

            const savedQuinaRules = localStorage.getItem('quinaRules');
            if (savedQuinaRules) {
                setQuinaRules(JSON.parse(savedQuinaRules));
            }
        }
    }, []);

    // Save game state
    useEffect(() => {
        if (bingoNumbers.length > 0) {
            localStorage.setItem('bingoNumbers', JSON.stringify(bingoNumbers));
            localStorage.setItem('resultBingo', resultBingo);

            const saveToFirebase = async () => {
                try {
                    const gameDoc = games.find((g) => g.ide === selectedGame);
                    if (gameDoc && gameDoc.id) {
                        await updateGame(gameDoc.id, {
                            bingoNumbers: bingoNumbers,
                            currentNumber: currentNumber,
                            currentLetter: currentLetter,
                            lastUpdate: new Date()
                        });
                    }
                } catch (error) {
                    console.error('Error auto-saving game:', error);
                }
            };
            saveToFirebase();
        }
    }, [selectedGame, bingoNumbers, resultBingo, games, currentNumber, currentLetter]);

    // Save quinaRules to localStorage
    useEffect(() => {
        localStorage.setItem('quinaRules', JSON.stringify(quinaRules));
    }, [quinaRules]);

    // Check for winner
    useEffect(() => {
        const checkWinner = async () => {
            if (bingoNumbers.length < 4) return;

            setCheckingWinner(true);
            try {
                const { bingoWinners: newBingoWinners, quinaWinners: newQuinaWinners } = await checkForBingoWinner(selectedGame, bingoNumbers, quinaRules);

                if (newBingoWinners && newBingoWinners.length > 0) {
                    setWinners(newBingoWinners);
                }

                if (newQuinaWinners && newQuinaWinners.length > 0) {
                    // We accumulate quina winners, but here we just set them because the service returns all matches
                    // If we want to avoid duplicates or keep history, we might need to merge, 
                    // but since we re-check all cards every time, the service returns the current state of all winners.
                    setQuinaWinners(newQuinaWinners);
                }
            } catch (error) {
                console.error('Error checking winner:', error);
            } finally {
                setCheckingWinner(false);
            }
        };

        if (bingoNumbers.length > 0) {
            checkWinner();
        }
    }, [bingoNumbers, selectedGame, quinaRules]);

    const updateGameState = useCallback((num) => {
        setBingoNumbers((prev) => [...prev, num]);

        // We need to use functional updates or refs if we want to avoid dependencies, 
        // but here we are inside the hook so we can access state.
        // However, to be safe with closures in drawNumber, we should pass current values or use refs.
        // But since drawNumber depends on [currentNumber, currentLetter, cont], it's fine.
    }, []);

    const drawNumber = useCallback(() => {
        const max = getTotalNumbers();
        const min = 1;

        if (bingoNumbers.length >= max) return;

        let num;
        do {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (bingoNumbers.includes(num));

        // Update state
        if (cont > 0) {
            setPrevNumber(currentNumber);
            setPrevLetter(currentLetter);
        }

        setCurrentNumber(num);
        const letterForNum = getLetterForNumber(num);
        const letterTitle = gameTexts[letterForNum.toLowerCase()];
        setCurrentLetter(letterTitle);

        setResultBingo((prev) => prev + (prev ? '-' : '') + letterTitle + num);
        setCont((prev) => prev + 1);
        setBingoNumbers((prev) => [...prev, num]);

    }, [bingoNumbers, currentNumber, currentLetter, cont]);

    const addManualNumber = useCallback((num) => {
        const number = parseInt(num);
        if (isNaN(number) || number < 1 || number > getTotalNumbers()) {
            throw new Error(`Por favor ingrese un número válido entre 1 y ${getTotalNumbers()}`);
        }

        if (bingoNumbers.includes(number)) {
            throw new Error('Este número ya ha sido sorteado');
        }

        if (cont > 0) {
            setPrevNumber(currentNumber);
            setPrevLetter(currentLetter);
        }

        const manualNumber = number;
        const letterForNum = getLetterForNumber(manualNumber);
        const letterTitle = gameTexts[letterForNum.toLowerCase()];

        setCurrentNumber(manualNumber);
        setCurrentLetter(letterTitle);

        setResultBingo((prev) => prev + (prev ? '-' : '') + letterTitle + manualNumber);
        setCont((prev) => prev + 1);
        setBingoNumbers((prev) => [...prev, manualNumber]);
    }, [bingoNumbers, currentNumber, currentLetter, cont]);

    const resetGame = () => {
        localStorage.removeItem('bingoNumbers');
        localStorage.removeItem('resultBingo');
        localStorage.removeItem('quinaRules');
        window.location.reload();
    };

    return {
        bingoNumbers,
        currentNumber,
        currentLetter,
        prevNumber,
        prevLetter,
        resultBingo,
        winners,
        quinaWinners,
        checkingWinner,
        cont,
        drawNumber,
        addManualNumber,
        resetGame,
        quinaRules,
        setQuinaRules
    };
};
