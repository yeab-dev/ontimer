let totalTime = 10;

let segmentsState = JSON.parse(localStorage.getItem("segments")) || [];

const createTimerButton = document.getElementById('create-timer-button');
const segments = document.getElementById("segments");
const addSegmentButton = document.getElementById("add-segment");
const durationDisplay = document.getElementById("duration");

function saveToStorage() {
    localStorage.setItem("segments", JSON.stringify(segmentsState));
}

function renderTotal() {
    durationDisplay.textContent = ` ${totalTime} minutes`;
}

function createSegment(initialValue = 10) {
    const div = document.createElement('div');
    const id = crypto.randomUUID();

    div.dataset.id = id;
    div.className = 'segment-group';

    div.innerHTML = `
        <div class="segment-time-group">
            <input type="number" min="1" value="${initialValue}" data-old-value="${initialValue}">
            <span>min</span>
        </div>
        <div class="segment-name-group">
            <input type="text" placeholder="Topic">
        </div>
        <i class="fa-solid fa-trash-can delete"></i>
    `;

    totalTime += initialValue;
    renderTotal();

    return div;
}

/* =========================
   ADD SEGMENT
========================= */
addSegmentButton.addEventListener('click', () => {
    const allSegments = document.querySelectorAll('.segment-group');
    const lastSegment = allSegments[allSegments.length - 1];

    const durationInput = lastSegment.querySelector('input[type="number"]');
    const topicInput = lastSegment.querySelector('input[type="text"]');

    const duration = Number(durationInput.value);
    const topic = topicInput.value.trim();

    if (!duration || duration <= 0 || topic === "") {
        alert("Please fill both duration and topic before adding a new segment.");
        return;
    }

    const id = lastSegment.dataset.id;

    segmentsState.push({ id, duration, topic });

    segments.appendChild(createSegment());
});

/* =========================
   DELETE SEGMENT
========================= */
segments.addEventListener('click', (event) => {
    if (!event.target.classList.contains('delete')) return;

    const segmentEl = event.target.closest('.segment-group');
    const id = segmentEl.dataset.id;

    const input = segmentEl.querySelector('input[type="number"]');
    const value = Number(input.value);

    segmentsState = segmentsState.filter(s => s.id !== id);

    totalTime -= value;
    renderTotal();

    segmentEl.remove();
});

/* =========================
   UPDATE STATE ON INPUT CHANGE
========================= */
segments.addEventListener('change', (event) => {
    const segmentEl = event.target.closest('.segment-group');
    if (!segmentEl) return;

    const id = segmentEl.dataset.id;
    const segment = segmentsState.find(s => s.id === id);
    if (!segment) return;

    /* ---- duration update ---- */
    if (event.target.type === "number") {
        const input = event.target;

        const oldValue = Number(input.dataset.oldValue);
        const newValue = Number(input.value);

        totalTime = totalTime - oldValue + newValue;
        renderTotal();

        input.dataset.oldValue = newValue;

        segment.duration = newValue;
    }

    /* ---- topic update ---- */
    if (event.target.type === "text") {
        segment.topic = event.target.value.trim();
    }
});

/* =========================
   CREATE TIMER (SAVE FINAL STATE)
========================= */
createTimerButton.addEventListener('click', () => {

    const allSegments = document.querySelectorAll('.segment-group');

    segmentsState = [];

    for (let segment of allSegments) {
        const id = segment.dataset.id;

        const duration = Number(segment.querySelector('input[type="number"]').value);
        const topic = segment.querySelector('input[type="text"]').value.trim();

        if (!duration || duration <= 0 || topic === "") {
            alert("Please fill all segments properly before saving.");
            return;
        }

        segmentsState.push({ id, duration, topic });
    }

    saveToStorage();
});

/* =========================
   INIT
========================= */
renderTotal();