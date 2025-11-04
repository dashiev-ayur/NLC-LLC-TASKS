export class DueDate {
  constructor(private readonly value: Date) {
    if (value < new Date()) {
      throw new Error(
        "Дата выполнения задачи должна быть больше текущего времени !"
      );
    }
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
