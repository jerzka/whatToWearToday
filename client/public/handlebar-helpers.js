const currentDate = () => {
    const currentDate = new Date();
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekDay = weekDays[currentDate.getDay()];
    const weekend = (weekDay === "Sunday" || weekDay === "Saturday") ? "Weekend" : "Week day";

    return `<h5>Today is <b>${weekDay}</b>, <br class="d-md-none">
                                 ${currentDate.toLocaleString(undefined, { month: 'long' })} ${currentDate.toLocaleString(undefined, { day: '2-digit' })}, 
                                 ${currentDate.getFullYear()} | <span class="span-bg">${weekend}</span></h5>`
};

const ifeq = (a, b, options) => {
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
};

const ifnoteq = (a, b, options) => {
    if (a != b) { return options.fn(this); }
    return options.inverse(this);
};

const escape = (variable) => {
    return variable.replace(/(['"])/g, '\\$1');
};

const contains = (seasonsData, season, className) => {
   return (seasonsData.indexOf(season) > -1) ? className : '';
 };


const ratingStars = (ratingData) => {
    let starIconsDom = '';
    const ratingStarsCount = 5;
    if(ratingData === 0){
        for(let i = 0; i < ratingStarsCount; i++){
            starIconsDom += '<i class="fa fa-star-o fa-lg" aria-hidden="true"></i>\n';
        }
    }
    else if(ratingData <= ratingStarsCount){
        for(let i = 0; i < ratingData; i++){
            starIconsDom += '<i class="fa fa-star fa-lg" aria-hidden="true"></i>\n';
            }
            for(let i = 0; i < ratingStarsCount-ratingData; i++){
                starIconsDom += '<i class="fa fa-star-o fa-lg" aria-hidden="true"></i>\n';
            }
    }

    return starIconsDom;
}

const photoToken = (photo) => {
    let test = photo.split(/token=/g)[1];
    return test;
}

module.exports = {
    currentDate,
    ifeq,
    ifnoteq,
    escape,
    contains,
    ratingStars,
    photoToken
}