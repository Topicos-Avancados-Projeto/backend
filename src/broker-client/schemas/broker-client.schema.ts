import * as mongoose from 'mongoose';
import { QoSLevel } from '../dtos/qosEnum.dto';
import { QoSLevelName } from '../dtos/qosName.dto';

export const BrokerClientSchema = new mongoose.Schema({
  cleansession: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  broker_port: {
    type: Number,
    required: true,
  },
  broker_host: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  version: {
    type: Number,
    required: false,
  },
  lastwilltopic: {
    type: String,
    required: true,
  },
  lastwillqos: {
    type: {
      type: Number,
      enum: QoSLevel,
      names: QoSLevelName,
      required: true,
    },
  },
  lastwillmessage: {
    type: String,
    required: true,
  },
  lastwillretain: {
    type: Boolean,
    required: true,
  },
  keepalive: {
    type: Number,
    required: true,
  },
});
