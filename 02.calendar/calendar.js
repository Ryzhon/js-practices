import { format, getDaysInMonth, startOfMonth } from "date-fns";
import { ja } from "date-fns/locale";
import parseArgs from "minimist";

const argv = parseArgs(process.argv.slice(2));

const year = argv.y || new Date().getFullYear();
const month = argv.m ? argv.m - 1 : new Date().getMonth();

const firstDayOfMonth = startOfMonth(new Date(year, month));

const headerWidth = 20;
const monthYearString = format(firstDayOfMonth, "MMMM yyyy", { locale: ja });

const paddingLength = Math.max((headerWidth - monthYearString.length) / 2, 0);
const padding = " ".repeat(paddingLength);

console.log(`${padding}${monthYearString}`);
console.log("日 月 火 水 木 金 土");

let dayOfWeek = firstDayOfMonth.getDay();
let daysString = "   ".repeat(dayOfWeek);

const daysInMonth = getDaysInMonth(firstDayOfMonth);

for (let day = 1; day <= daysInMonth; day++) {
  daysString += `${day.toString().padStart(2, " ")} `;

  if ((day + dayOfWeek) % 7 === 0 || day === daysInMonth) {
    console.log(daysString);
    daysString = "";
  }
}
