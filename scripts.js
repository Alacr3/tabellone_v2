let currentPhrase = [];
let revealedLetters = [];
let usedLetters = []; // Array per tenere traccia delle lettere già inviate

function toggleVisibility() {
    const phraseInput = document.getElementById('input-field');
    const toggleButton = document.querySelector('button i');

    if (phraseInput.type === 'password') {
        phraseInput.type = 'text'; // Mostra la frase
        toggleButton.classList.remove('fa-eye');
        toggleButton.classList.add('fa-eye-slash'); // Cambia l'icona a "occhio sbarrato"
    } else {
        phraseInput.type = 'password'; // Nasconde la frase
        toggleButton.classList.remove('fa-eye-slash');
        toggleButton.classList.add('fa-eye'); // Ripristina l'icona dell'occhio
    }
}

// Mostra la ruota nella pagina 2 quando viene generato il tabellone
function generateBoard() {
    const phraseInput = document.getElementById('input-field').value.toUpperCase();
    if (!phraseInput) {
        showCustomAlert("Inserisci una frase!");
        return;
    }

    // Nascondi la frase e il tasto
    document.getElementById('input-field').classList.add('input-hidden');
    document.querySelector('button').style.display = 'none';

    currentPhrase = [...phraseInput]; // Memorizza la frase originale (con lettere e spazi)
    revealedLetters = new Array(phraseInput.length).fill('_'); // Inizializza i box come "_"

    const board = document.getElementById('board');
    board.innerHTML = ''; // Pulisce il tabellone prima di ricaricarlo

    let currentWord = ''; // Variabile per accumulare parole
    let currentIndex = 0; // Variabile per tenere traccia degli indici originali

    currentPhrase.forEach((char, index) => {
        // Se è uno spazio o la fine della parola, aggiungi la parola
        if (char === ' ') {
            if (currentWord.length > 0) {
                const wordContainer = document.createElement('div');
                wordContainer.classList.add('word-container');
                currentWord.split('').forEach(letter => {
                    const box = document.createElement('div');
                    box.className = 'box';
                    box.textContent = '_';
                    box.setAttribute('data-index', currentIndex); // Assegna l'indice originale
                    wordContainer.appendChild(box);
                    currentIndex++; // Incrementa l'indice
                });
                board.appendChild(wordContainer); // Aggiungi la parola al tabellone
                currentWord = ''; // Resetta la variabile per la parola
            }

            // Aggiungi il box per lo spazio
            const spaceBox = document.createElement('div');
            spaceBox.classList.add('box', 'space');
            spaceBox.textContent = ' ';
            spaceBox.setAttribute('data-index', currentIndex); // Assegna l'indice originale per lo spazio
            board.appendChild(spaceBox);
            currentIndex++; // Incrementa l'indice per lo spazio
        } else {
            currentWord += char; // Aggiungi il carattere alla parola in corso
        }
    });

    // Gestisci l'ultima parola se presente
    if (currentWord.length > 0) {
        const wordContainer = document.createElement('div');
        wordContainer.classList.add('word-container');
        currentWord.split('').forEach(letter => {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = '_';
            box.setAttribute('data-index', currentIndex); // Assegna l'indice originale
            wordContainer.appendChild(box);
            currentIndex++; // Incrementa l'indice
        });
        board.appendChild(wordContainer);
    }

    // Passa alla seconda pagina
    document.getElementById('page-1').classList.add('hidden');
    document.getElementById('page-2').classList.remove('hidden');
}

// Funzione per controllare la lettera
function checkLetter() {
    const letterInput = document.getElementById('letter-input').value.toUpperCase();
    if (letterInput.length !== 1) {
        showCustomAlert("Inserisci una sola lettera!");
        return;
    }

    if (usedLetters.includes(letterInput)) {
        showCustomAlert("Questa lettera è già stata chiamata!");
        return;
    }

    usedLetters.push(letterInput);

    let found = false; // Flag per verificare se la lettera è nella frase
    const normalizedLetterInput = letterInput.normalize("NFD").replace(/[\u0300-\u036f]/g, ''); // Normalizza la lettera senza accento

    // Scorri il tabellone e controlla se la lettera è presente
    const boxes = document.querySelectorAll('.box');
    boxes.forEach((box, index) => {
        const boxLetter = currentPhrase[box.getAttribute('data-index')];
        const normalizedBoxLetter = boxLetter.normalize("NFD").replace(/[\u0300-\u036f]/g, ''); // Normalizza anche la lettera nel box

        if (normalizedBoxLetter === normalizedLetterInput) {
            // Manteniamo la lettera accentata per la visualizzazione
            box.textContent = boxLetter; // Mostra la lettera corretta, mantenendo l'accento
            revealedLetters[box.getAttribute('data-index')] = boxLetter;
            found = true; // La lettera è stata trovata
        }
    });

    if (!found) {
        showCustomAlert("Questa lettera non c'è nella frase!"); // Messaggio per lettera non presente nella frase
    }

    document.getElementById('letter-input').value = ''; // Resetta l'input
}

// Funzione per confermare il tabellone
function confirmBoard() {
    const revealedPhrase = currentPhrase.join(''); // Mostra la frase originale, non quella rivelata
    showCustomAlert(`Soluzione: ${revealedPhrase}`);
}


// Funzione per resettare il gioco
function resetGame() {
    currentPhrase = [];
    revealedLetters = [];
    usedLetters = [];
    document.getElementById('input-field').value = '';
    document.getElementById('letter-input').value = '';
    document.getElementById('board').innerHTML = '';

    // Torna alla prima pagina
    document.getElementById('input-field').classList.remove('input-hidden');
    document.querySelector('button').style.display = 'inline-block';
    document.getElementById('page-1').classList.remove('hidden');
    document.getElementById('page-2').classList.add('hidden');
}

// Funzione per mostrare l'alert personalizzato
function showCustomAlert(message) {
    console.log('Alert triggered');
    document.getElementById('alert-message').textContent = message;
    const alert = document.getElementById('custom-alert');
    alert.classList.remove('hidden');
}

function closeAlert() {
    console.log('Alert closed');
    const alert = document.getElementById('custom-alert');
    alert.classList.add('hidden');
}


// Aggiungi l'evento per il tasto invio
document.getElementById('letter-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Impedisce il comportamento predefinito del tasto invio (ad esempio il submit di un form)
        checkLetter(); // Chiama la funzione per inviare la lettera
    }
});