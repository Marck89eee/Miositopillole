// Funzione per sincronizzare i dati con il browser principale
function syncWithMainBrowser() {
    // Genera un ID univoco per il browser
    const browserId = localStorage.getItem('browserId') || 
        (localStorage.setItem('browserId', crypto.randomUUID()), crypto.randomUUID());

    // Se non esiste un browser principale, diventiamo il browser principale
    if (!localStorage.getItem('mainBrowserId')) {
        localStorage.setItem('mainBrowserId', browserId);
        localStorage.setItem('mainBrowserLastSync', new Date().toISOString());
        return;
    }

    // Se siamo il browser principale, non dobbiamo sincronizzare
    if (localStorage.getItem('mainBrowserId') === browserId) {
        return;
    }

    // Ogni 5 secondi, controlliamo se dobbiamo sincronizzare
    setInterval(() => {
        const mainBrowserId = localStorage.getItem('mainBrowserId');
        const mainBrowserLastSync = localStorage.getItem('mainBrowserLastSync');
        
        // Se il browser principale è inattivo da più di 10 minuti, diventiamo il nuovo browser principale
        if (mainBrowserId && mainBrowserLastSync) {
            const lastSyncTime = new Date(mainBrowserLastSync);
            const timeDiff = (new Date() - lastSyncTime) / 1000; // in secondi
            
            if (timeDiff > 600) { // 10 minuti
                localStorage.setItem('mainBrowserId', browserId);
                localStorage.setItem('mainBrowserLastSync', new Date().toISOString());
                return;
            }
        }
    }, 5000);

    // Funzione per sincronizzare i dati
    function syncData() {
        const mainBrowserId = localStorage.getItem('mainBrowserId');
        const mainBrowserLastSync = localStorage.getItem('mainBrowserLastSync');
        
        if (mainBrowserId === browserId) return;

        // Recupera i dati dal browser principale
        const mainBrowserData = localStorage.getItem('calendar_reminders');
        
        if (mainBrowserData) {
            try {
                const data = JSON.parse(mainBrowserData);
                localStorage.setItem('calendar_reminders', JSON.stringify(data));
                console.log('Dati sincronizzati dal browser principale');
            } catch (error) {
                console.error('Errore durante la sincronizzazione:', error);
            }
        }
    }

    // Sincronizza ogni 5 secondi
    setInterval(syncData, 5000);
}
