require('handlebars');

Handlebars.registerHelper('currentDate', function () {
    const currentDate = new Date(); 
    const weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let weekDay = weekDays[currentDate.getDay()];
    let weekend = (weekDay === "Sunday" || weekDay === "Saturday") ? "Weekend" : "Week day";

    return `<h5>Today is <b>${weekDay}</b>,
             ${currentDate.getMonth()} ${currentDate.getDay()} , 
             ${currentDate.getFullYear()} | <span class="span-bg">${weekend}</span></h5>`;
});

