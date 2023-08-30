import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ unique: [true, 'CPF já existente!'] })
  @Prop({ required: true })
  cpf: string

  @Prop({ unique: [true, 'Email já existente!'] })
  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string 

  @Prop({ required: true })
  date_of_birth: string
}

export const UserSchema = SchemaFactory.createForClass(User)