import { ValidationDomainError } from "../errors/DomainError";

export class DueDate {
  private readonly value: Date;
  constructor(private readonly dateString: string) {
    // Проверка строки на формат ISO 8601
    const iso8601Regex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;
    if (!iso8601Regex.test(dateString)) {
      throw new ValidationDomainError(
        "DueDate: Неверный формат даты. Ожидается формат ISO 8601 (e.g., 2025-11-04T12:00:00Z)"
      );
    }
    this.value = new Date(dateString);
  }

  getValue(): Date {
    return this.value;
  }

  checkIsFuture(): void {
    if(this.value.getTime() < new Date().getTime()){
      throw new ValidationDomainError(
        `Дата выполнения ${this.value?.toISOString()} задачи должна быть больше текущего времени ! ${new Date().toISOString()}`
      );
    }
  }

  isWithin24Hours(): boolean {
    const now = new Date();
    const diff = this.value.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);
    return hours > 0 && hours <= 24;
  }
}
