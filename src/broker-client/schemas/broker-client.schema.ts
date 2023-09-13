import * as mongoose from 'mongoose';
import { QoSLevel } from '../dtos/qosEnum.dto';
import { QoSLevelName } from '../dtos/qosName.dto';

export const BrokerClientSchema = new mongoose.Schema({
  cleansession: {
    type: Boolean,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  broker_port: {
    type: Number,
  },
  broker_host: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  version: {
    type: Number,
  },
  lastwilltopic: {
    type: String,
  },
  lastwillqos: {
    type: {
      type: Number,
      enum: QoSLevel,
      names: QoSLevelName,
    },
  },
  lastwillmessage: {
    type: String,
  },
  lastwillretain: {
    type: Boolean,
  },
  keepalive: {
    type: Number,
  },
});
