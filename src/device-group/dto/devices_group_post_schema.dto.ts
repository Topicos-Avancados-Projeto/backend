import { IsNotEmpty, IsString } from 'class-validator';
import { Device } from 'src/device/schemas/device.schema';

export class DeviceGroupPostSchema {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  devices: Device;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  attributes: Map<string, string>;
}
