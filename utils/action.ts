
//配列に入っている数値を除外してランダム関数で数値を出力する関数！
export function getRandomNumberExcluding(excludeNumbers:number[], min:number, max:number) {
    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (excludeNumbers?.includes(randomNumber));
    return randomNumber;
  }

  