let intervalId;

const root = document.documentElement;
const rootFontSize = parseFloat(getComputedStyle(root).fontSize);
root.style.setProperty("--root-font-size", rootFontSize);
root.style.setProperty("--progress-animation-duration", "4380ms");

const carouselCont = document.querySelector(".carousel-container");
const carousel = document.querySelector(".carousel");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const indicatorCont = document.createElement("div");
const passField = document.querySelector("#password-field");
const passBtn = document.querySelector("#password-gen");
const smallLetterString = "abcdefghijklmnopqrstuvwxyz";
const bigLetterString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberString = "0123456789";
const spCharString = "!@#$%^&*";

function carouselCode() {

    let currentIndex = 0;
    const totalSlides = document.querySelectorAll(".carousel-item").length;

    for (let i = 0; i < totalSlides; i++) {
        var tempIndicator = document.createElement("div");
        tempIndicator.setAttribute("data-index", i);
        i == currentIndex
            ? tempIndicator.classList.add("indicator", "active")
            : tempIndicator.classList.add("indicator");
        indicatorCont.append(tempIndicator);
    }
    carouselCont.append(indicatorCont);
    indicatorCont.classList.add("carousel-indicators");

    const indicators = document.querySelectorAll(".indicator");
    const carouselItemProgressBars = document.querySelectorAll(".progress-bar");

    if (currentIndex + 1 >= totalSlides) {
        nextBtn.style.display = "none";
    } else {
        nextBtn.style.removeProperty("display");
    }
    if (currentIndex == 0) {
        prevBtn.style.display = "none";
    } else {
        prevBtn.style.removeProperty("display");
    }

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 101}%)`;

        if (currentIndex + 1 == totalSlides) {
            nextBtn.style.display = "none";
        } else {
            nextBtn.style.removeProperty("display");
        }
        if (currentIndex == 0) {
            prevBtn.style.display = "none";
        } else {
            prevBtn.style.removeProperty("display");
        }

        indicators.forEach((indicator, index) => {
            // sets 'active' class on indicator whenever index === currentIndex, removes otherwise
            indicator.classList.toggle("active", index === currentIndex);
        });

        carouselItemProgressBars.forEach((progressBar, index) => {
            progressBar.classList.toggle("timer", index === currentIndex);
        });
    }

    function autoChange() {
        intervalId = setInterval(function () {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }, 5000);
    }
    autoChange();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearInterval(intervalId);
        else {
            carouselItemProgressBars.forEach((progressBar, index) => {
                if (index === currentIndex) {
                    // current paint cycle
                    progressBar.classList.remove("timer");
                    
                    // schedule execution of argument for next browser paint cycle (with 'timer' removed)
                    requestAnimationFrame(() => {
                        // 1 browser paint completed/passed without 'timer' class on progressbar (animation reset)

                        // schedule execution of argument for next browser paint cycle
                        requestAnimationFrame(() => {
                            // add animation class back before next paint 'cuz callback is executed before next paint
                            progressBar.classList.toggle("timer", index === currentIndex);
                        });
                    });
                }
            });
            autoChange();
        }
    });

    nextBtn.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % totalSlides;
        clearInterval(intervalId);
        updateCarousel();
        autoChange();
    });

    prevBtn.addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        clearInterval(intervalId);
        updateCarousel();
        autoChange();
    });

    indicators.forEach((indicator) => {
        indicator.addEventListener("click", function () {
            currentIndex = parseInt(this.getAttribute("data-index"));
            clearInterval(intervalId);
            updateCarousel();
            autoChange();
        });
    });
}

function passGen() {
    const sourceArray = [
        smallLetterString,
        bigLetterString,
        numberString,
        spCharString,
    ];
    let smallLetterCount = 3, bigLetterCount = 3, numberCount = 3, spCharCount = 3;

    let countArray = [
            smallLetterCount,
            bigLetterCount,
            numberCount,
            spCharCount,
        ],
        partArray = [];

    for (let i = 0; i < 4; i++) {
        var tempString = "";

        for (let index = 0; index < countArray[i]; index++) {
            let randomIndex = Math.floor(Math.random() * sourceArray[i].length);
            tempString += sourceArray[i].charAt(randomIndex);
        }

        partArray.push(tempString);
    }

    let finalStr = shuffle(partArray.join(""));

    passField.value = finalStr;
}

// Fisher-Yates Shuffle
function shuffle(str) {
    const splitStr = str.split("");

    for (let i = splitStr.length - 1; i > 0; i--) {
        // for each index, swap it's value with that of a random previous index
        const j = Math.floor(Math.random() * (i + 1));
        // swapping array elements using array destructuring
        // right side [] is a new temporary anonymous array, left side [] is just the destructuring syntax
        [splitStr[i], splitStr[j]] = [splitStr[j], splitStr[i]];
    }

    return splitStr.join("");
}

carouselCode();
passBtn.addEventListener("click", passGen);

// document.addEventListener("load", scriptCode);
