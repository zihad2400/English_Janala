// ---------------- GLOBAL VARIABLES ----------------
let lessonsData = [];
let activeLessonId = null;

// ---------------- SPINNER FUNCTIONS ----------------
const showSpinner = () => document.getElementById("global-spinner").classList.remove("hidden");
const hideSpinner = () => document.getElementById("global-spinner").classList.add("hidden");

// ---------------- LOAD LESSONS ----------------
const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => {
            lessonsData = json.data;
            displayLesson(lessonsData);
        });
};

// ---------------- DISPLAY LESSON BUTTONS ----------------
const displayLesson = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
            </button>
        `;
        levelContainer.append(btnDiv);
    }

    const lesson7Btn = document.getElementById(`lesson-btn-7`);
    if(lesson7Btn) lesson7Btn.classList.add("btn-active");

    activeLessonId = 7;
    loadLevelWord(7);
};

// ---------------- LOAD WORDS ----------------
const loadLevelWord = (id) => {
    showSpinner();

    if(activeLessonId !== null){
        const prevBtn = document.getElementById(`lesson-btn-${activeLessonId}`);
        if(prevBtn) prevBtn.classList.remove("btn-active");
    }

    const clickedBtn = document.getElementById(`lesson-btn-${id}`);
    if(clickedBtn) clickedBtn.classList.add("btn-active");

    activeLessonId = id;

    fetch(`https://openapi.programming-hero.com/api/level/${id}`)
        .then(res => res.json())
        .then(data => {
            displayLevelWord(data.data || []);
            hideSpinner();
        })
        .catch(() => hideSpinner());
};

// ---------------- DISPLAY WORD CARDS ----------------
const displayLevelWord = (words) => {

    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.length === 0){
        wordContainer.innerHTML = `
        <div class="text-center col-span-full rounded-xl py-10 space-y-6 font-bangla">
            <img class="mx-auto" src="./assets/alert-error.png">
            <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
        </div>`;
        return;
    }

    words.forEach(word => {

        const card = document.createElement("div");

        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">

            <h2 class="font-bold text-2xl">${word.word || "শব্দ পাওয়া যাইনি"}</h2>

            <p class="font-semibold">Meaning / Pronunciation</p>

            <div class="text-2xl font-medium font-bangla">
            ${word.meaning || "অর্থ পাওয়া যায়নি"} /
            ${word.pronunciation || "Pronunciation পাওয়া যায়নি"}
            </div>

            <div class="flex justify-between items-center">

                <button onclick="loadWordDetail(${word.id})"
                class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">

                <i class="fa-solid fa-circle-info"></i>

                </button>



                <button onclick="pronounceWord('${word.word}')" 
                class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
                <i class="fa-solid fa-volume-high"></i>
               </button>





            </div>

        </div>
        `;

        wordContainer.append(card);

    });

};

// ---------------- WORD DETAIL API ----------------
const loadWordDetail = async (id) => {

    const res = await fetch(`https://openapi.programming-hero.com/api/word/${id}`);

    const data = await res.json();

    displayWordDetails(data.data);

};

// ---------------- SHOW MODAL ----------------
const displayWordDetails = (word) => {

    const detailsBox = document.getElementById("details-container");

    detailsBox.innerHTML = `
    
    <div>

        <h2 class="text-2xl font-bold">

        ${word.word}

        (<i class="fa-solid fa-microphone-lines"></i>: ${word.pronunciation})

        </h2>

    </div>

    <div>

        <h2 class="font-bold">Meaning</h2>

        <p>${word.meaning}</p>

    </div>

    <div>

        <h2 class="font-bold">Example</h2>

        <p>${word.sentence}</p>

    </div>

    <div>

        <h2 class="font-bold">সমার্থক শব্দ</h2>

        <div>${createElements(word.synonyms || [])}</div>

    </div>

    `;

    document.getElementById("word_modal").showModal();

};

// ---------------- SYNONYMS ----------------
const createElements = (arr) => {

    return arr.map(el => `<span class="btn btn-sm">${el}</span>`).join(" ");

};

// ---------------- SEARCH ----------------
document.getElementById("lesson-search-btn").addEventListener("click", async () => {

    const keyword = document.getElementById("lesson-search-input").value.toLowerCase().trim();

    if(!keyword) return;

    let foundLesson = null;

    for (let lesson of lessonsData) {

        const res = await fetch(`https://openapi.programming-hero.com/api/level/${lesson.level_no}`);

        const data = await res.json();

        const words = data.data || [];

        if(words.some(w => w.word.toLowerCase().includes(keyword))) {

            foundLesson = lesson.level_no;

            break;

        }

    }

    if(foundLesson){

        const lessonBtn = document.getElementById(`lesson-btn-${foundLesson}`);

        lessonBtn.scrollIntoView({behavior:"smooth",block:"center"});

        lessonBtn.click();

    }

    else{

        alert(`No lesson found containing "${keyword}"`);

    }

});

// ---------------- START ----------------
loadLessons();








function pronounceWord(word){

    const speech = new SpeechSynthesisUtterance(word);

    speech.lang = "en-US";

    const voices = speechSynthesis.getVoices();

    const maleVoice = voices.find(voice =>
        voice.name.toLowerCase().includes("male") ||
        voice.name.toLowerCase().includes("david") ||
        voice.name.toLowerCase().includes("mark")
    );

    if(maleVoice){
        speech.voice = maleVoice;
    }

    speech.rate = 0.9;
    speech.pitch = 0.8;

    speechSynthesis.speak(speech);

}