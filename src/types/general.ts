export interface IFormField<T> {
  required: boolean;
  value: T;
  key?: string;
}
