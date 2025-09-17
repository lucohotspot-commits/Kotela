
export function getYears(endYear?: number, startYear?: number) {
  const currentYear = new Date().getFullYear();
  const a = startYear || currentYear - 100;
  const b = endYear || currentYear;
  let years = [];
  for (let i = b; i >= a; i--) {
    years.push(i);
  }
  return years;
}

export function getMonths() {
  return [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
}

export function getDaysInMonth(year: number | null, month: number | null) {
  if (year === null || month === null) return Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const date = new Date(year, month + 1, 0);
  const days = date.getDate();
  return Array.from({ length: days }, (_, i) => (i + 1).toString().padStart(2, '0'));
}

    