
const createElements = (arr)=>{
    console.log(arr);
    const htmlElemets = arr.map(el=> `<span class="btn">${el}</span>`);
    return htmlElemets.join(" ");
};


const synonyms = ["Hello", "Hi", "Konnichiwa"];
createElements(synonyms);