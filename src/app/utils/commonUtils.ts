export function formatDateTimeNumber(num: number) {
  return String(num).length === 1 ? `0${num}` : String(num);
}

export function formatViewDateTime(dateTimeInUse: string) {
    return `${dateTimeInUse.substr(3, 2)}/${dateTimeInUse.substr(0, 2)}/${dateTimeInUse.substr(6, 4)}`;
}

export function formatThousandNumber(num: string) {
    const arr = num.split('');
    let counter = 0;
    for (let i = arr.length - 1; i > 0; i--) {
        counter++;
        if (counter === 3) {
            arr.splice(i, 0, ',');
            i++;
            counter = -1;
        }
    }
    return arr.join('');
}

export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
