import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Device } from 'src/device/schemas/device.schema';

@Schema({ timestamps: true })
export class DeviceGroup extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Device' })
  devices: Device;

  @Prop()
  description: string;

  @Prop()
  attributes: Map<string, string>;
}

export const DeviceGroupSchema = SchemaFactory.createForClass(DeviceGroup);
