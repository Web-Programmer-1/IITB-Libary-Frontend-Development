export const OVERDUE_FINE_PER_DAY = 50;

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export function getOverdueDays(dueDate: string | Date, asOf: Date = new Date()) {
  const due = dueDate instanceof Date ? dueDate : new Date(dueDate);
  return Math.max(0, Math.ceil((asOf.getTime() - due.getTime()) / DAY_IN_MS));
}

export function getEstimatedFine(dueDate: string | Date, asOf: Date = new Date()) {
  return getOverdueDays(dueDate, asOf) * OVERDUE_FINE_PER_DAY;
}
