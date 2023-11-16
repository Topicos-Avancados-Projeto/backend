import { Document } from 'mongoose';

export interface DeviceType extends Document {
  name: string;
  description: String;
  attributes: Map<string, string>;
}
