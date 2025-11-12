
let dev: boolean = false; //set to true during development
export function getDateToday() : number {
  if (dev) {
    return 24 //for testing
  }
  return new Date().getDate(); //for actual execution



}

export function weatherForcastRange() : string[] {
  if (dev) {
    const today = new Date();
    const dates: string[] = [];

    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Format to YYYY-MM-DD
      const formatted = date.toISOString().split('T')[0];
      dates.push(formatted);
    }

    return dates;
  }
  return ["2025-12-24", "2025-12-25", "2025-12-26"] //real values

}
