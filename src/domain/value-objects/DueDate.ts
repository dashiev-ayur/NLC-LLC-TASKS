export class DueDate {
  private readonly value: Date;
  constructor(private readonly dateString: string) {
    // Проверка строки на формат ISO 8601
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;
    if (!iso8601Regex.test(dateString)) {
      throw new Error(
        "DueDate: Неверный формат даты. Ожидается формат ISO 8601 (e.g., 2025-11-04T12:00:00Z)"
      );
    }
    const dueDate = new Date(dateString);
    if (dueDate < new Date()) {
      throw new Error(
        `Дата выполнения задачи должна быть больше текущего времени ! ${new Date().toISOString()}`
      );
    }
    this.value = dueDate;
  }

  getValue(): Date {
    return this.value;
  }

  isWithin24Hours(): boolean {
    const now = new Date();
    const diff = this.value.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);
    return hours > 0 && hours <= 24;
  }
}
