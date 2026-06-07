console.log("EXTENSION LOADED");

/* =========================
   STORAGE
========================= */

async function getSegments() {
    const result = await chrome.storage.local.get(["segments"]);
    return result.segments || [];
}

/* =========================
   STATE
========================= */

let segments = [];

let currentSegmentIndex = 0;
let remainingSeconds = 0;

let intervalId = null;
let isPlaying = false;

/* =========================
   UI REFS
========================= */

const ui = {
    topic: null,
    timer: null,
    progressBar: null,
    playButton: null,
    previousButton: null,
    nextButton: null,
};

/* =========================
   TIMER DISPLAY
========================= */

function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    ui.timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/* =========================
   RENDER SEGMENT
========================= */

function renderSegment() {
    const segment = segments[currentSegmentIndex];
    if (!segment) return;

    ui.topic.textContent = segment.topic;

    remainingSeconds = segment.duration * 60;

    updateTimerDisplay();
    resetProgressBar(segment.duration);
}

/* =========================
   TIMER LOGIC
========================= */

function startTimer() {
    if (intervalId) return;

    isPlaying = true;

    const segment = segments[currentSegmentIndex];
    if (!segment) return;

    startProgressBar(segment.duration);

    intervalId = setInterval(() => {
        remainingSeconds--;

        updateTimerDisplay();

        if (remainingSeconds <= 0) {
            nextSegment(true);
        }
    }, 1000);
}

function pauseTimer() {
    isPlaying = false;

    clearInterval(intervalId);
    intervalId = null;
}

/* =========================
   NAVIGATION
========================= */

function nextSegment(auto = false) {
    pauseTimer();

    currentSegmentIndex++;

    if (currentSegmentIndex >= segments.length) {
        alert("Meeting complete!");
        return;
    }

    renderSegment();

    if (isPlaying || auto) {
        startTimer();
    }
}

function previousSegment() {
    if (currentSegmentIndex === 0) return;

    pauseTimer();

    currentSegmentIndex--;

    renderSegment();

    if (isPlaying) {
        startTimer();
    }
}

/* =========================
   PROGRESS BAR
========================= */

function resetProgressBar() {
    ui.progressBar.style.transition = "none";
    ui.progressBar.style.width = "100%";

    void ui.progressBar.offsetWidth;
}

function startProgressBar(durationMinutes) {
    ui.progressBar.style.transition =
        `width ${durationMinutes * 60}s linear`;

    setTimeout(() => {
        ui.progressBar.style.width = "0%";
    }, 50);
}

/* =========================
   UI CREATION
========================= */

function createUI() {
    const meetingControllerCard = document.createElement("div");

    meetingControllerCard.style.position = "fixed";
    meetingControllerCard.style.top = "20px";
    meetingControllerCard.style.left = "50%";
    meetingControllerCard.style.transform = "translateX(-50%)";
    meetingControllerCard.style.zIndex = "999999";
    meetingControllerCard.style.display = "flex";
    meetingControllerCard.style.flexDirection = "column";
    meetingControllerCard.style.alignItems = "center";
    meetingControllerCard.style.gap = "10px";

    /* ---------- Main Card ---------- */

    const container = document.createElement("div");
    container.style.height = "10vh";
    container.style.width = "22.5vw";
    container.style.backgroundColor = "#FFF9F9";
    container.style.borderRadius = "20px";
    container.style.padding = "0 15px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center";

    const topic = document.createElement("div");
    topic.style.fontWeight = "bold";
    topic.style.color = "#910000";
    topic.style.fontSize = "17px";
    topic.style.marginBottom = "5px";

    const timerRow = document.createElement("div");
    timerRow.style.display = "flex";
    timerRow.style.justifyContent = "space-between";
    timerRow.style.alignItems = "center";

    const progressBarContainer = document.createElement("div");
    progressBarContainer.style.height = "2.5vh";
    progressBarContainer.style.width = "15vw";
    progressBarContainer.style.border = "2px solid #2A0000";
    progressBarContainer.style.borderRadius = "7px";
    progressBarContainer.style.overflow = "hidden";

    const progressBar = document.createElement("div");
    progressBar.style.height = "100%";
    progressBar.style.width = "100%";
    progressBar.style.backgroundColor = "#910000";

    progressBarContainer.appendChild(progressBar);

    const timer = document.createElement("div");
    timer.style.fontWeight = "bold";
    timer.style.fontSize = "17px";
    timer.style.height = "3vh";
    timer.style.width = "3vw";
    timer.style.lineHeight = "3vh";
    timer.style.backgroundColor = "#910000";
    timer.style.color = "#FFF9F9";
    timer.style.textAlign = "center";
    timer.style.borderRadius = "5px";

    timerRow.appendChild(progressBarContainer);
    timerRow.appendChild(timer);

    container.appendChild(topic);
    container.appendChild(timerRow);

    /* ---------- Controls ---------- */

    const controls = document.createElement("div");

    controls.style.height = "6vh";
    controls.style.width = "7vw";
    controls.style.backgroundColor = "#FFF9F9";
    controls.style.borderRadius = "20px";
    controls.style.padding = "0 15px";
    controls.style.display = "flex";
    controls.style.justifyContent = "space-evenly";
    controls.style.alignItems = "center";

    const previousButton = document.createElement("i");
    previousButton.className = "fa-solid fa-circle-chevron-left";
    previousButton.classList.add("control-icon")
    previousButton.style.cursor = "pointer";
    previousButton.style.fontSize = "25px";


    const playButton = document.createElement("i");
    playButton.className = "fa-solid fa-circle-play";
    playButton.classList.add("control-icon")
    playButton.style.cursor = "pointer";
    playButton.style.fontSize = "25px";

    const nextButton = document.createElement("i");
    nextButton.className = "fa-solid fa-circle-chevron-right";
    nextButton.classList.add("control-icon")
    nextButton.style.cursor = "pointer";
    nextButton.style.fontSize = "25px";

    /* ---------- Events ---------- */

    playButton.addEventListener("click", () => {
        if (isPlaying) {
            pauseTimer();
            playButton.classList.remove("fa-circle-pause");
            playButton.classList.add("fa-circle-play");
        } else {
            playButton.classList.remove("fa-circle-play");
            playButton.classList.add("fa-circle-pause");
            startTimer();
        }
    });

    previousButton.addEventListener("click", previousSegment);
    nextButton.addEventListener("click", nextSegment);

    controls.appendChild(previousButton);
    controls.appendChild(playButton);
    controls.appendChild(nextButton);

    meetingControllerCard.appendChild(container);
    meetingControllerCard.appendChild(controls);

    document.body.appendChild(meetingControllerCard);

    /* ---------- Store UI refs ---------- */

    ui.topic = topic;
    ui.timer = timer;
    ui.progressBar = progressBar;

    ui.playButton = playButton;
    ui.previousButton = previousButton;
    ui.nextButton = nextButton;
}

/* =========================
   INIT
========================= */

async function init() {
    segments = await getSegments();

    console.log("Loaded segments:", segments);

    if (!segments.length) return;

    createUI();
    renderSegment();
}

const link = document.createElement("link");
link.rel = "stylesheet";
link.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";

document.head.appendChild(link);

init();