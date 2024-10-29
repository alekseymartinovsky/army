
const PERIOD = {
    BEFORE: "BEFORE",
    IN_PROGRESS: {
        START: "START",
        KMB: "KMB",
        HALF: "HALF",
        LAST_WEEK: "LAST_WEEK",
        AFTER_HALF: "AFTER_HALF",
    },
    AFTER: "AFTER",
}

const THEME = {
    BASIC: "basic",
    EXTRA: "extra",
}

const PERIOD_TO_STATUS_ID = new Map([
    [PERIOD.BEFORE, "before"],
    [PERIOD.IN_PROGRESS.START, "start"],
    [PERIOD.IN_PROGRESS.KMB, "kmb"],
    [PERIOD.IN_PROGRESS.HALF, "half"],
    [PERIOD.IN_PROGRESS.AFTER_HALF, "afterHalf"],
    [PERIOD.IN_PROGRESS.LAST_WEEK, "lastWeek"],
    [PERIOD.AFTER, "after"],
]);

const START_DATE = new Date(2024, 9, 30, 6, 30, 0);

const countItemId = "count";
const countIdBlock = "countValue";
const themeSwitchId = "themeSwitch";

window.onload = function () {
    const nowDate = new Date();
    const period = getActualPeriod(nowDate);
    document.getElementById(PERIOD_TO_STATUS_ID.get(period)).style.display = "block";
    console.log("Понимаю, что все программисты, но не надо подсматривать, просто используй");

    document.getElementById(countIdBlock).innerHTML = getCount().toString();
    if(getTheme() === THEME.EXTRA) {
        document.getElementById(themeSwitchId).checked = false;
        setThemeClassName(true);
    }

    addThemeListener();
}

document.addEventListener('DOMContentLoaded', function() {
    // конечная дата, например 1 июля 2021
    const deadline = new Date(2025, 9, 30, 10, 0, 0)
    // id таймера
    let timerId = null;
    // склонение числительных
    function declensionNum(num, words) {
        return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
    }
    // вычисляем разницу дат и устанавливаем оставшееся времени в качестве содержимого элементов
    function countdownTimer() {
        const diff = deadline - new Date();
        if (diff <= 0) {
            clearInterval(timerId);
        }
        const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0;
        const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
        const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
        const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;
        $days.textContent = days < 10 ? '0' + days : days;
        $hours.textContent = hours < 10 ? '0' + hours : hours;
        $minutes.textContent = minutes < 10 ? '0' + minutes : minutes;
        $seconds.textContent = seconds < 10 ? '0' + seconds : seconds;
        $days.dataset.title = declensionNum(days, ['день', 'дня', 'дней']);
        $hours.dataset.title = declensionNum(hours, ['час', 'часа', 'часов']);
        $minutes.dataset.title = declensionNum(minutes, ['минута', 'минуты', 'минут']);
        $seconds.dataset.title = declensionNum(seconds, ['секунда', 'секунды', 'секунд']);
    }
    // получаем элементы, содержащие компоненты даты
    const $days = document.querySelector('.timer__days');
    const $hours = document.querySelector('.timer__hours');
    const $minutes = document.querySelector('.timer__minutes');
    const $seconds = document.querySelector('.timer__seconds');
    // вызываем функцию countdownTimer
    countdownTimer();
    // вызываем функцию countdownTimer каждую секунду
    timerId = setInterval(countdownTimer, 1000);
});

function addClick() {
    let count = getCount();
    count++;
    localStorage.setItem(countItemId, count.toString());
    document.getElementById(countIdBlock).innerHTML = count.toString();
}

function addThemeListener(){
    const checkbox = document.getElementById('themeSwitch');

    checkbox.addEventListener('change', function() {
        setThemeClassName(!checkbox.checked)
    });
}

function setThemeClassName(isExtra) {
    const root = document.getElementById("root");
    const className = THEME.EXTRA;

    if (isExtra) {
        root.classList.add(className);
        localStorage.setItem("theme", THEME.EXTRA);
    } else {
        root.classList.remove(className);
        localStorage.setItem("theme", THEME.BASIC);
    }
}

function getTheme() {
    return localStorage.getItem("theme");
}

function getCount() {
    return Number(localStorage.getItem(countItemId) ?? 0);
}

function getActualPeriod(now) {

    const days = getDaysBetween(START_DATE, now);

    if(days < 0) {
        return PERIOD.BEFORE;
    }

    if(days < 1) {
        return PERIOD.IN_PROGRESS.START;
    }

    if(days < 24) {
        return PERIOD.IN_PROGRESS.KMB;
    }

    if(days < 183) {
        return PERIOD.IN_PROGRESS.HALF;
    }

    if(days < 358) {
        return PERIOD.IN_PROGRESS.AFTER_HALF;
    }

    if(days < 365) {
        return PERIOD.IN_PROGRESS.LAST_WEEK;
    }

    return PERIOD.AFTER;
}

 function getDaysBetween(startDate, endDate) {
    const diffTime = endDate - startDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
 }
