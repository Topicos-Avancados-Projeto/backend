import * as mongoose from 'mongoose';

const reverseQoSLevel = {
  0: 'AT_MOST_ONCE',
  1: 'AT_LEAST_ONCE',
  2: 'EXACTLY_ONCE',
};

export const BrokerClientSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      trim: true,
    },
    cleansession: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
    },
    broker_port: {
      type: Number,
      required: true,
    },
    broker_host: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    version: {
      type: Number,
      required: false,
    },
    lastwilltopic: {
      type: String,
      trim: true,
    },
    lastwillqos: {
      type: Number,
      enum: [0, 1, 2],
    },
    lastwillmessage: {
      type: String,
      trim: true,
    },
    lastwillretain: {
      type: Boolean,
      required: true,
    },
    keepalive: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id_client = ret._id.toString();
        ret.version = ret.__v;
        delete ret._id;
        delete ret.__v;

        if (ret.lastwillqos !== undefined) {
          ret.lastwillqos = {
            value: ret.lastwillqos,
            name: reverseQoSLevel[ret.lastwillqos],
          };
        }
      },
    },
    id: false,
  },
);
