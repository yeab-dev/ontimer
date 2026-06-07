export async function getSegments() {
    const result = await chrome.storage.local.get(["segments"]);
    return result.segments || [];
}

export async function saveSegments(segmentsState) {
    await chrome.storage.local.set({
        segments: segmentsState
    });
}