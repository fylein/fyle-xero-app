/* tslint:disable */
// TODO: Use something for serialization / deserialization
import { Task } from './task.model';

export type TaskResponse = {
  count: number;
  next: string;
  previous: string;
  results: Task[];
};
