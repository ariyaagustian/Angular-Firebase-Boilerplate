import { IModel } from './model';

export interface INote extends IModel {
  Title: string;
  Note: string;
  Author: string;
}
