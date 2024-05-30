
export const getWeekRange = (date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(date.setDate(date.getDate() + 6 - date.getDay()));
    return { startOfWeek, endOfWeek };
  };
  
  export const getMonthRange = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { startOfMonth, endOfMonth };
  };
  
  export const getQuarterRange = (date) => {
    const quarter = Math.floor((date.getMonth() / 3));
    const startOfQuarter = new Date(date.getFullYear(), quarter * 3, 1);
    const endOfQuarter = new Date(date.getFullYear(), quarter * 3 + 3, 0);
    return { startOfQuarter, endOfQuarter };
  };
  
  export const getYear = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const endOfYear = new Date(date.getFullYear() + 1, 0, 0);
    return { startOfYear, endOfYear}
  }