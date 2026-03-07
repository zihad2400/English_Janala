const loadLessons=()=>{
     fetch("https://openapi.programming-hero.com/api/levels/all") // Promise of Response
     .then(res=> res.json()) // promise of json data
     .then(json => displayLesson(json.data));
};



const displayLesson = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button class="btn btn-outline btn-primary">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
            </button>
        `;
        levelContainer.append(btnDiv);
    }
};

loadLessons();