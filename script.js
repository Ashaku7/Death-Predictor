const MINUTE = 60, HOUR = 3600, DAY = 86400, YEAR = 31557600;

function calculateLifeExpectancy(inputs) {
    let totalSeconds = 50 * YEAR; 
    let riskFactors = 0;

    if (inputs.age > 60) totalSeconds -= 30 * YEAR;
    if (inputs.sleep < 6) { totalSeconds -= 10 * YEAR; riskFactors++; }
    if (inputs.exercise < 2) { totalSeconds -= 12 * YEAR; riskFactors++; }

    switch (inputs.favoriteFood) {
        case 'vegan': totalSeconds += 15 * YEAR; break;
        case 'salad': totalSeconds += 10 * YEAR; break;
        case 'steak': totalSeconds -= 8 * YEAR; riskFactors++; break;
        case 'fast-food': totalSeconds -= 15 * YEAR; riskFactors++; break;
        case 'sugary-snacks': totalSeconds -= 20 * YEAR; riskFactors++; break;
    }

    if (riskFactors >= 2) totalSeconds -= (riskFactors * 10) * YEAR;
    return { totalSeconds: Math.max(1, totalSeconds) };
}

function revealFate(event) {
    event.preventDefault();
    const inputs = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        sleep: parseFloat(document.getElementById('sleep').value),
        exercise: parseInt(document.getElementById('exercise').value),
        favoriteFood: document.getElementById('favoriteFood').value
    };
    document.getElementById('loadingContainer').style.display = 'block';
    startLoadingAnimation(inputs);
}

function startLoadingAnimation(inputs) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        document.getElementById('loadingBar').style.width = Math.min(progress, 100) + '%';
        if (progress >= 100) {
            clearInterval(interval);
            document.getElementById('loadingContainer').style.display = 'none';
            const result = calculateLifeExpectancy(inputs);
            showResult(result, inputs);
            animateImages(result);
        }
    }, 100);
}

function showResult({ totalSeconds }, inputs) {
    const timeLeftEl = document.getElementById('timeLeft');
    const deathMessageEl = document.getElementById('deathMessage');
    
    if (totalSeconds < MINUTE) {
        timeLeftEl.textContent = `${Math.floor(totalSeconds)} Second`;
        deathMessageEl.textContent = `GOODBYE, ${inputs.name.toUpperCase()}`;
    } else if (totalSeconds < HOUR) {
        timeLeftEl.textContent = `${Math.floor(totalSeconds / MINUTE)} Minutes`;
        deathMessageEl.textContent = `Death is Imminent, ${inputs.name}...`;
    } else if (totalSeconds < YEAR) {
        timeLeftEl.textContent = `${Math.floor(totalSeconds / DAY)} Days`;
        deathMessageEl.textContent = `Your Time is Short, ${inputs.name}...`;
    } else {
        const yearsLeft = Math.floor(totalSeconds / YEAR);
        timeLeftEl.textContent = `${yearsLeft} Years`;
        deathMessageEl.textContent = yearsLeft > 30 ? `You have time, ${inputs.name}...` : `Time Slips Away, ${inputs.name}...`;
    }
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.style.display = 'block';
    setTimeout(() => resultDisplay.style.opacity = '1', 50);
}

function animateImages({ totalSeconds }) {
    const humanImg = document.getElementById('humanImage');
    const containerWidth = humanImg.parentElement.offsetWidth;
    const travelDistance = containerWidth * 0.8 - humanImg.width;

    if (totalSeconds < 10 * MINUTE) {
        humanImg.style.transform = `translateX(${travelDistance}px)`;
        setTimeout(() => {
            document.getElementById('coffinImage').classList.add('coffin-active');
            humanImg.style.transition = 'transform 1.5s ease-in, opacity 1.5s ease-in';
            humanImg.style.transform += ' scale(0.1)';
            humanImg.style.opacity = '0';
        }, 3500);
    } 
    else if (totalSeconds < 5 * YEAR) {
        humanImg.style.transform = `translateX(${travelDistance * 0.75}px)`;
    }
    else if (totalSeconds < 20 * YEAR) {
        humanImg.style.transform = `translateX(${travelDistance * 0.4}px)`;
    }
    else {
        humanImg.style.transform = `translateX(-${containerWidth * 0.1}px)`;
    }
}
