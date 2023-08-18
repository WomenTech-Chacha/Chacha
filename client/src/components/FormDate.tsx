export function formatDate(date: any) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(date).toLocaleDateString(
    undefined,
    options as Intl.DateTimeFormatOptions
  );
}
