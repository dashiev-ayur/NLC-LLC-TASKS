export interface IDeleteTaskUseCase {
  execute(id: number): Promise<void>;
}
