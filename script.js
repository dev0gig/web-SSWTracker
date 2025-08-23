document.addEventListener('DOMContentLoaded', () => {
    // --- App State & Data ---
    const AppState = {
        lmpDate: null,
    };
    
    const BABY_SIZES = [
        "Mohnsamen", "Sesamsamen", "Leinsamen", "Heidelbeere", "Himbeere", "Kirsche", "Erdbeere", "Limette", "Zitrone",
        "Orange", "Avocado", "Mango", "Papaya", "Aubergine", "Honigmelone", "Wassermelone", "Kürbis"
    ];
    const BABY_EMOJIS = ["🌱", "🌱", "🌱", "🫐", "🍓", "🍒", "🍓", "🍋", "🍋", "🍊", "🥑", "🥭", "🥭", "🍆", "🍈", "🍉", "🎃"];

    const WEEK_INFO = {
        // Fülle mit echten Daten für jede Woche
        5: { title: "5. SSW: Ein kleiner Punkt", baby: "Das Herz deines Babys beginnt zu schlagen. Es ist winzig, etwa so groß wie ein Sesamsamen.", mom: "Du fühlst dich vielleicht müde und deine Brüste könnten spannen. Achte auf eine gesunde Ernährung." },
        10: { title: "10. SSW: Ein kleiner Mensch", baby: "Alle wichtigen Organe sind angelegt. Dein Baby kann jetzt seine Gliedmaßen bewegen und ist so groß wie eine Limette.", mom: "Morgenübelkeit kann jetzt ihren Höhepunkt erreichen. Kleine, häufige Mahlzeiten können helfen." },
        20: { title: "20. SSW: Halbzeit!", baby: "Dein Baby kann hören! Es ist jetzt etwa so groß wie eine Mango. Du könntest die ersten Kindsbewegungen spüren.", mom: "Die Halbzeit ist erreicht! Dein Bauch wächst sichtlich. Zeit für den großen Ultraschall." },
        30: { title: "30. SSW: Endspurt in Sicht", baby: "Das Baby nimmt kräftig zu und das Gehirn entwickelt sich rasant. Es ist so groß wie eine Aubergine.", mom: "Dein Körper bereitet sich auf die Geburt vor. Sodbrennen und Kurzatmigkeit können häufiger auftreten." },
        40: { title: "40. SSW: Bereit für die Welt", baby: "Dein Baby ist voll entwickelt und bereit für die Geburt. Es ist ungefähr so groß wie ein kleiner Kürbis.", mom: "Die Aufregung steigt! Achte auf die Anzeichen der Geburt. Ruhe dich viel aus." },
    };

    // --- DOM Elements ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainApp = document.getElementById('main-app');
    const lmpDateInput = document.getElementById('lmp-date');
    const startBtn = document.getElementById('start-btn');
    
    const currentWeekEl = document.getElementById('current-week');
    const currentDayInWeekEl = document.getElementById('current-day-in-week');
    const babySizeEl = document.getElementById('baby-size');
    const countdownEl = document.getElementById('countdown');
    const progressBar = document.getElementById('progress-bar');
    const lmpDateDisplay = document.getElementById('lmp-date-display');
    const lmpDateDisplayText = document.getElementById('lmp-date-display-text');
    const dueDateDisplay = document.getElementById('due-date-display');
    
    const weekGrid = document.getElementById('week-grid');
    const weekDetailView = document.getElementById('week-detail-view');
    const backToGridBtn = document.getElementById('back-to-grid');
    const weekDetailTitle = document.getElementById('week-detail-title');
    const weekDetailContent = document.getElementById('week-detail-content');

    // --- Data Persistence ---
    const saveData = () => {
        try {
            localStorage.setItem('pregnancyCompanionData', JSON.stringify(AppState));
        } catch (error) {
            console.error("Fehler beim Speichern der Daten:", error);
        }
    };

    const loadData = () => {
        const data = localStorage.getItem('pregnancyCompanionData');
        if (data) {
            const parsedData = JSON.parse(data);
            if (parsedData.lmpDate) {
                AppState.lmpDate = parsedData.lmpDate;
            }
            return true;
        }
        return false;
    };

    // --- Core Logic & Calculations ---
    const calculateDates = (lmp) => {
        const lmpDate = new Date(lmp);
        const dueDate = new Date(lmpDate.getTime() + 277 * 24 * 60 * 60 * 1000); // Adjusted for doctor's date
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const daysPregnant = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
        const currentWeek = Math.floor(daysPregnant / 7) + 1;
        const dayInWeek = daysPregnant % 7;
        
        const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const weeksRemaining = Math.floor(daysRemaining / 7);
        const daysInWeekRemaining = daysRemaining % 7;

        const progress = Math.min(100, (daysPregnant / 277) * 100); // Adjusted for doctor's date

        return {
            dueDate,
            daysPregnant,
            currentWeek,
            dayInWeek,
            daysRemaining,
            weeksRemaining,
            daysInWeekRemaining,
            progress
        };
    };
    
    const formatDateForInput = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- UI Update Functions ---
    const updateDashboard = () => {
        if (!AppState.lmpDate) return;

        const { currentWeek, dayInWeek, progress, dueDate, weeksRemaining, daysInWeekRemaining } = calculateDates(AppState.lmpDate);
        
        currentWeekEl.textContent = `${currentWeek}. SSW`;
        currentDayInWeekEl.textContent = `(${currentWeek - 1}+${dayInWeek})`;
        
        const sizeIndex = Math.min(BABY_SIZES.length - 1, Math.floor((currentWeek - 4) / 2));
        babySizeEl.innerHTML = `<span class="text-4xl">${BABY_EMOJIS[sizeIndex]}</span> ${BABY_SIZES[sizeIndex]}`;
        
        countdownEl.textContent = `Noch ${weeksRemaining} Wo. & ${daysInWeekRemaining} Tg.`;
        
        // Aktualisiere den Fortschrittsbalken und die Prozentanzeige
        const roundedProgress = Math.round(progress);
        progressBar.style.width = `${roundedProgress}%`;
        progressBar.innerHTML = ''; // Remove inner text
        
        // Füge die Prozentanzeige außerhalb des Balkens hinzu
        const progressText = document.getElementById('progress-text');
        progressText.textContent = `${roundedProgress}%`;
        
        lmpDateDisplay.value = formatDateForInput(AppState.lmpDate);
        lmpDateDisplayText.textContent = new Date(AppState.lmpDate).toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });
        dueDateDisplay.textContent = dueDate.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const renderWeekGrid = () => {
        weekGrid.innerHTML = '';
        const { currentWeek } = calculateDates(AppState.lmpDate);
        for (let i = 1; i <= 42; i++) {
            const weekEl = document.createElement('div');
            let trimesterClass = 'trimester-1';
            if (i > 13) trimesterClass = 'trimester-2';
            if (i > 27) trimesterClass = 'trimester-3';
            
            weekEl.className = `week-grid-item p-2 rounded-lg text-center cursor-pointer ${trimesterClass}`;
            if (i === currentWeek) {
                weekEl.classList.add('current');
            }
            weekEl.dataset.week = i;
            
            let month;
            if (i <= 4) month = 1;
            else if (i <= 8) month = 2;
            else if (i <= 13) month = 3;
            else if (i <= 17) month = 4;
            else if (i <= 22) month = 5;
            else if (i <= 26) month = 6;
            else if (i <= 31) month = 7;
            else if (i <= 35) month = 8;
            else if (i <= 40) month = 9;
            else month = 10;
            
            weekEl.innerHTML = `
                <div class="font-bold">${i}</div>
                <div class="text-xs opacity-70">${month}. Monat</div>
            `;
            weekEl.addEventListener('click', () => showWeekDetail(i));
            weekGrid.appendChild(weekEl);
        }
    };

    const showWeekDetail = (week) => {
        const info = WEEK_INFO[week] || { title: `${week}. SSW`, baby: "Für diese Woche liegen leider keine Detailinformationen vor.", mom: "Bitte schaue in einer späteren Version der App noch einmal nach." };
        weekDetailTitle.textContent = info.title;
        weekDetailContent.innerHTML = `
            <h4 class="font-bold text-sky-400 mb-2">Dein Baby</h4>
            <p class="mb-4 text-text-secondary">${info.baby}</p>
            <h4 class="font-bold text-sky-400 mb-2">Tipps für dich</h4>
            <p class="text-text-secondary">${info.mom}</p>
        `;
        weekGrid.parentElement.classList.add('hidden');
        weekDetailView.classList.remove('hidden');
    };
    
    // --- Event Handlers ---
    const handleStart = () => {
        const lmp = lmpDateInput.value;
        if (lmp) {
            AppState.lmpDate = lmp;
            saveData();
            initializeApp();
        }
    };

    // --- Initialization ---
    const initializeApp = () => {
        welcomeScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        
        updateDashboard();
        renderWeekGrid();
    };

    // --- Event Listeners ---
    startBtn.addEventListener('click', handleStart);
    lmpDateDisplay.addEventListener('change', (e) => {
        AppState.lmpDate = e.target.value;
        saveData();
        updateDashboard();
        renderWeekGrid();
    });
    
    backToGridBtn.addEventListener('click', () => {
        weekDetailView.classList.add('hidden');
        weekGrid.parentElement.classList.remove('hidden');
    });
    
    // --- App Start ---
    if (loadData() && AppState.lmpDate) {
        initializeApp();
    } else {
        welcomeScreen.classList.remove('hidden');
        mainApp.classList.add('hidden');
    }
});
