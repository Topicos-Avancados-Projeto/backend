import { Document } from 'mongoose';
import { QoSLevel } from '../dtos/qosEnum.dto';
import { QoSLevelName } from '../dtos/qosName.dto';

export interface BrokerClient extends Document {
  id_client?: any;
  cleansession: boolean;
  name: string;
  description: string;
  broker_port: number;
  broker_host: string;
  username: string;
  password: string;
  version: number;
  lastwilltopic: string;
  lastwillqos: {
    type: number;
    enum: QoSLevel;
    names: QoSLevelName;
  };
  lastwillmessage: string;
  lastwillretain: boolean;
  keepalive: number;
}
