const currentDate = () => {
    const currentDate = new Date();
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekDay = weekDays[currentDate.getDay()];
    const weekend = (weekDay === "Sunday" || weekDay === "Saturday") ? "Weekend" : "Week day";

    return `<h5>Today is <b>${weekDay}</b>,
                                 ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.toLocaleString('default', { day: '2-digit' })}, 
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

module.exports = {
    currentDate,
    ifeq,
    ifnoteq,
    escape
}