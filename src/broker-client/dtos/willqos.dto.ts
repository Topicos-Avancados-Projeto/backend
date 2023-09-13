import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { QoSLevel } from './qosEnum.dto';
import { QoSLevelName } from './qosName.dto';

export class QoS {
  @IsNotEmpty()
  @IsNumber()
  type: number;

  @IsNotEmpty()
  @IsEnum(QoSLevel)
  qosEnum: QoSLevel;

  @IsNotEmpty()
  @IsEnum(QoSLevelName)
  names: QoSLevelName;
}
