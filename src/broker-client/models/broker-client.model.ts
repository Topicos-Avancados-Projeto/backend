import { Document } from 'mongoose';
import { QoSLevel } from '../dtos/qosEnum.dto';

export interface BrokerClient extends Document {
  id_client?: any;
  user_id: String;
  cleansession: boolean;
  name: string;
  description: string;
  broker_port: number;
  broker_host: string;
  username: string;
  password: string;
  version: number;
  lastwilltopic: string;
  lastwillqos: QoSLevel;
  lastwillmessage: string;
  lastwillretain: boolean;
  keepalive: number;
}
