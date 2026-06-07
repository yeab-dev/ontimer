export function getSegments() {
    try {
        return JSON.parse(localStorage.getItem("segments")) || [];
    } catch {
        return [];
    }
}
export function saveSegments(segmentsState) {
    localStorage.setItem("segments", JSON.stringify(segmentsState));
}