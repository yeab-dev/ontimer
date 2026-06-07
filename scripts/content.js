function showProgressIndicator() {
    const meetingControllerCard = document.createElement('div');
    meetingControllerCard.style.position = "fixed";
    meetingControllerCard.style.top = "20px";
    meetingControllerCard.style.left = "50%";
    meetingControllerCard.style.transform = "translateX(-50%)";
    meetingControllerCard.style.zIndex = "999999";
    meetingControllerCard.style.display = "flex";
    meetingControllerCard.style.flexDirection = "column";
    meetingControllerCard.style.alignItems = "center";
    meetingControllerCard.style.gap = "10px";

    // Main card
    const container = document.createElement('div');
    container.style.height = "10vh";
    container.style.width = "22.5vw";
    container.style.backgroundColor = "#FFF9F9";
    container.style.borderRadius = "20px";
    container.style.padding = "0 15px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center";

    const topic = document.createElement('div');
    topic.textContent = "Introduction";
    topic.style.fontWeight = "bold";
    topic.style.color = "#910000";
    topic.style.fontSize = "17px";
    topic.style.marginBottom = "5px";

    const timerRow = document.createElement('div');
    timerRow.style.display = "flex";
    timerRow.style.justifyContent = "space-between";
    timerRow.style.alignItems = "center";

    const progressBarContainer = document.createElement('div');
    progressBarContainer.style.height = "2.5vh";
    progressBarContainer.style.width = "15vw";
    progressBarContainer.style.border = "2px solid #2A0000";
    progressBarContainer.style.borderRadius = "7px";
    progressBarContainer.style.overflow = "hidden";

    const meetingTimerContainer = document.createElement('div');
    meetingTimerContainer.textContent = "00:15";
    meetingTimerContainer.style.fontWeight = "bold";
    meetingTimerContainer.style.fontSize = "17px";
    meetingTimerContainer.style.height = "3vh";
    meetingTimerContainer.style.width = "3vw";
    meetingTimerContainer.style.lineHeight = "3vh";
    meetingTimerContainer.style.backgroundColor = "#910000";
    meetingTimerContainer.style.color = "#FFF9F9";
    meetingTimerContainer.style.textAlign = "center";
    meetingTimerContainer.style.borderRadius = "5px";

    timerRow.appendChild(progressBarContainer);
    timerRow.appendChild(meetingTimerContainer);

    container.appendChild(topic);
    container.appendChild(timerRow);

    // Controller card
    const controllerContainer = document.createElement('div');
    controllerContainer.style.height = "6vh";
    controllerContainer.style.width = "7vw";
    controllerContainer.style.backgroundColor = "#FFF9F9";
    controllerContainer.style.borderRadius = "20px";
    controllerContainer.style.padding = "0 15px";
    controllerContainer.style.display = "flex";
    controllerContainer.style.justifyContent = "space-evenly";
    controllerContainer.style.alignItems = "center";

    const previousIcon = document.createElement('i');
    previousIcon.className = "fa-solid fa-circle-chevron-left";
    previousIcon.style.fontSize = "25px"
    previousIcon.style.color = "#2A0000"

    const playIcon = document.createElement('i');
    playIcon.className = "fa-solid fa-circle-play";
    playIcon.style.fontSize = "25px"
    playIcon.style.color = "#910000"

    const nextIcon = document.createElement('i');
    nextIcon.className = "fa-solid fa-circle-chevron-right";
    nextIcon.style.fontSize = "25px"
    nextIcon.style.color = "#2A0000"

    controllerContainer.appendChild(previousIcon);
    controllerContainer.appendChild(playIcon);
    controllerContainer.appendChild(nextIcon);

    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.style.height = "100%";
    progressBar.style.width = "100%";
    progressBar.style.backgroundColor = "#910000";
    progressBar.style.transition = "width 60s linear";

    progressBarContainer.appendChild(progressBar);

    // Assemble
    meetingControllerCard.appendChild(container);
    meetingControllerCard.appendChild(controllerContainer);

    document.body.appendChild(meetingControllerCard);

    setTimeout(() => {
        progressBar.style.width = "0%";
    }, 100);
}

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
document.head.appendChild(link);

showProgressIndicator();