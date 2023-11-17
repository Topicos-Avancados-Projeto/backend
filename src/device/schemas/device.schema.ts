import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UUID } from "crypto";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class Device extends Document{

    @Prop({ required: true })
    name: string

    @Prop()
    description: string

    @Prop()
    group: UUID

    @Prop()
    topics: UUID

    @Prop()
    type: UUID
}

export const DeviceSchema = SchemaFactory.createForClass(Device);