export interface BaseService<T> {
  create: (data: T) => Promise<T>;
  getList: () => Promise<T[]>;
}
