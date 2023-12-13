import * as mongoose from 'mongoose';
import { DeviceType } from '../models/device-type.model';

export const DeviceTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    attributes: {
      type: Map,
      of: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        const _id = ret._id;
        delete ret._id;
        const transformed = { ...ret };
        transformed._id = _id;

        return transformed;
      },
    },
    id: false,
  },
);

export const DeviceModel = mongoose.model<DeviceType>(
  'DeviceType',
  DeviceTypeSchema,
);
