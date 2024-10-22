export type Resource<T> = T & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};