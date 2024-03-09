export function calcDateDifference(startDate, endDate) {
  const today = new Date();
  const endDateObj = new Date(endDate);
  const startDateObj = new Date(startDate);
  if (startDateObj.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) return 0;
  const millisecondsDifference = endDateObj - startDateObj;
  return Math.floor(millisecondsDifference / (1000 * 60 * 60 * 24));
}
