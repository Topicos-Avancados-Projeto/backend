import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UUID } from "crypto";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class Device extends Document{

    @Prop({ required: true })
    name: string

    @Prop({required: true})
    description: string

    @Prop({required: true})
    group: UUID

    @Prop({required: true})
    topics: UUID

    @Prop({required: true})
    type: UUID

    @Prop({required: true})
    attributes: Map<string, string>;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);