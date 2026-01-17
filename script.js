document.addEventListener('DOMContentLoaded', () => {
    // --- App State & Data ---
    const AppState = {
        lmpDate: null,
        birthDate: null,
    };

    const BABY_SIZES = [
        "Mohnsamen", "Sesamsamen", "Leinsamen", "Heidelbeere", "Himbeere", "Kirsche", "Erdbeere", "Limette", "Zitrone",
        "Orange", "Avocado", "Mango", "Papaya", "Aubergine", "Honigmelone", "Wassermelone", "Kürbis"
    ];
    const BABY_EMOJIS = ["🌱", "🌱", "🌱", "🫐", "🍓", "🍒", "🍓", "🍋", "🍋", "🍊", "🥑", "🥭", "🥭", "🍆", "🍈", "🍉", "🎃"];

    // --- DOM Elements ---
    const mainApp = document.getElementById('main-app');

    const currentWeekEl = document.getElementById('current-week');
    const currentDayInWeekEl = document.getElementById('current-day-in-week');
    const babySizeEl = document.getElementById('baby-size');
    const countdownEl = document.getElementById('countdown');
    const progressBar = document.getElementById('progress-bar');
    const lmpDateDisplay = document.getElementById('lmp-date-display');
    const lmpDateDisplayText = document.getElementById('lmp-date-display-text');
    const dueDateDisplay = document.getElementById('due-date-display');

    const weekGrid = document.getElementById('week-grid');

    // --- Age Calculator Elements ---
    const pregnancyView = document.getElementById('pregnancy-view');
    const calculatorView = document.getElementById('calculator-view');
    const viewPregnancyBtn = document.getElementById('view-pregnancy');
    const viewCalculatorBtn = document.getElementById('view-calculator');
    const birthDateInput = document.getElementById('birth-date');
    const ageResults = document.getElementById('age-results');
    const ageTotalWeeks = document.getElementById('age-total-weeks');
    const ageYearsSpan = document.getElementById('age-years');
    const ageMonthsSpan = document.getElementById('age-months');
    const ageWeeksSpan = document.getElementById('age-weeks');
    const ageDaysSpan = document.getElementById('age-days');
    const totalWeeksValSpan = document.getElementById('total-weeks-val');


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
            if (parsedData.lmpDate) AppState.lmpDate = parsedData.lmpDate;
            if (parsedData.birthDate) AppState.birthDate = parsedData.birthDate;
            return true;
        }
        return false;
    };

    // --- Core Logic & Calculations ---
    const calculateDates = (lmp) => {
        const lmpDate = new Date(lmp);
        const dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000); // Standard 280-day pregnancy
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const daysPregnant = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
        const currentWeek = Math.floor(daysPregnant / 7) + 1;
        const dayInWeek = daysPregnant % 7;

        const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const weeksRemaining = Math.floor(daysRemaining / 7);
        const daysInWeekRemaining = daysRemaining % 7;

        const progress = Math.min(100, (daysPregnant / 280) * 100); // Standard 280-day pregnancy

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

            weekEl.className = `week-grid-item p-2 rounded-lg text-center ${trimesterClass}`;
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

            weekGrid.appendChild(weekEl);
        }
    };

    // --- Age Calculator Logic ---
    const calculateAge = (birthDate) => {
        const birth = new Date(birthDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (birth > today) {
            return { years: 0, months: 0, weeks: 0, remainingDays: 0, totalWeeks: 0 };
        }

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Weeks & remaining days of the current month
        const weeks = Math.floor(days / 7);
        const remainingDays = days % 7;

        // Total weeks
        const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);

        return { years, months, weeks, remainingDays, totalWeeks };
    };

    const updateAgeDisplay = () => {
        const bDate = AppState.birthDate;
        if (!bDate) {
            ageResults.classList.add('hidden');
            ageTotalWeeks.classList.add('hidden');
            return;
        }

        birthDateInput.value = bDate;
        const age = calculateAge(bDate);
        if (age) {
            ageYearsSpan.textContent = age.years;
            ageMonthsSpan.textContent = age.months;
            ageWeeksSpan.textContent = age.weeks;
            ageDaysSpan.textContent = age.remainingDays;
            totalWeeksValSpan.textContent = age.totalWeeks;

            ageResults.classList.remove('hidden');
            ageTotalWeeks.classList.remove('hidden');
        } else {
            ageResults.classList.add('hidden');
            ageTotalWeeks.classList.add('hidden');
        }
    };

    const switchView = (v) => {
        if (v === 'pregnancy') {
            pregnancyView.classList.remove('hidden');
            calculatorView.classList.add('hidden');
            viewPregnancyBtn.classList.add('active');
            viewPregnancyBtn.classList.remove('text-text-secondary');
            viewCalculatorBtn.classList.remove('active');
            viewCalculatorBtn.classList.add('text-text-secondary');
        } else {
            pregnancyView.classList.add('hidden');
            calculatorView.classList.remove('hidden');
            viewCalculatorBtn.classList.add('active');
            viewCalculatorBtn.classList.remove('text-text-secondary');
            viewPregnancyBtn.classList.remove('active');
            viewPregnancyBtn.classList.add('text-text-secondary');
            updateAgeDisplay();
        }
    };

    // --- Initialization ---
    const initializeApp = () => {
        if (!AppState.lmpDate) {
            AppState.lmpDate = '2025-04-10';
        }

        if (!AppState.birthDate) {
            AppState.birthDate = '2026-01-20';
        }

        updateDashboard();
        renderWeekGrid();
        updateAgeDisplay();
    };

    // --- Event Listeners ---
    lmpDateDisplay.addEventListener('change', (e) => {
        AppState.lmpDate = e.target.value;
        saveData();
        updateDashboard();
        renderWeekGrid();
    });

    viewPregnancyBtn.addEventListener('click', () => switchView('pregnancy'));
    viewCalculatorBtn.addEventListener('click', () => switchView('calculator'));

    birthDateInput.addEventListener('change', (e) => {
        AppState.birthDate = e.target.value;
        saveData();
        updateAgeDisplay();
    });

    // --- App Start ---
    loadData();
    initializeApp();
});
