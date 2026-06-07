import { saveSegments, getSegments } from "./local_storage.js"
let totalTime = 0;

let segmentsState = await getSegments();

const createTimerButton = document.getElementById('create-timer-button');
const segments = document.getElementById("segments");
const addSegmentButton = document.getElementById("add-segment");
const durationDisplay = document.getElementById("duration");

function loadSegments() {
    if (segmentsState.length !== 0) {
        segmentsState.forEach(segment => {
            segments.appendChild(createSegment(segment.duration, segment.topic, false));
        });
    }
}

function renderTotal() {
    durationDisplay.textContent = ` ${totalTime} minutes`;
}
/* =========================
   CREATE SEGMENT
========================= */
function createSegment(duration = 10, topic = "", dirty = true) {
    const div = document.createElement('div');
    const id = crypto.randomUUID();

    div.dataset.id = id;
    div.className = dirty ? 'segment-group dirty' : "segment-group";

    div.innerHTML = `
        <div class="segment-time-group">
            <input type="number" min="1" value="${duration}" data-old-value="${duration}">
            <span>min</span>
        </div>
        <div class="segment-name-group">
            <input type="text" placeholder="Topic" value="${topic}">
        </div>
        <i class="fa-solid fa-trash-can delete"></i>
    `;

    totalTime += duration;
    renderTotal();

    return div;
}

/* =========================
   ADD SEGMENT
========================= */
addSegmentButton.addEventListener('click', () => {
    const allSegments = document.querySelectorAll('.segment-group');

    if (allSegments.length === 0) {
        segments.appendChild(createSegment());
        return;
    }

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
segments.addEventListener('input', (event) => {
    const segmentEl = event.target.closest('.segment-group');
    if (!segmentEl) return;

    segmentEl.classList.add('dirty');

    /* ---- duration update ---- */
    if (event.target.type === "number") {
        const input = event.target;

        const oldValue = Number(input.dataset.oldValue);
        const newValue = Number(input.value);

        totalTime = totalTime - oldValue + newValue;
        renderTotal();

        input.dataset.oldValue = newValue;

        segmentEl.duration = newValue;
    }

    /* ---- topic update ---- */
    if (event.target.type === "text") {
        segmentEl.topic = event.target.value.trim();
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
    const savedText = document.querySelector('.saved');
    savedText.style.visibility = "visible";
    setTimeout(() => {
        savedText.style.visibility = "hidden";
    }, 2000);
    saveSegments(segmentsState);
    document.querySelectorAll('.segment-group').forEach(segment => {
        segment.classList.remove('dirty');
    });
});

/* =========================
   INIT
========================= */
renderTotal();
loadSegments();

