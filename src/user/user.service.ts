import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Role } from 'src/login/enum/roles.enum';
import { User } from './schemas/user.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { LoginService } from 'src/login/login.service';
import { User_post_schema } from './dto/create-user.dto';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
    private loginService: LoginService,
  ) {}

  private async isCpfUnique(cpf: string): Promise<boolean> {
    const user = await this.userModel.findOne({ cpf }).exec();
    return !user;
  }

  private async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    return !user;
  }

  public async create(user_post_schema: User_post_schema): Promise<{
    token: string;
    name: string;
    email: string;
    cpf: string;
    id: any;
    date_of_birth: string;
  }> {
    const { name, cpf, email, password, date_of_birth } = user_post_schema;
    if (cpf.length > 3 && cpf.length < 14) {
      throw new UnprocessableEntityException('CPF must be cpf');
    }
    if (
      !name ||
      !cpf ||
      !email ||
      !password ||
      !date_of_birth ||
      name.length < 3 ||
      cpf.length < 3 ||
      email.length <= 3 ||
      password.length < 6 ||
      date_of_birth.length <= 3
    ) {
      throw new UnprocessableEntityException('Validation problem');
    }
    if (!(await this.isCpfUnique(cpf))) {
      throw new ConflictException('CPF already exists!');
    }
    if (!(await this.isEmailUnique(email))) {
      throw new ConflictException('Email alread exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      cpf,
      email,
      password: hashedPassword,
      date_of_birth,
      role: Role.USER,
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const { token } = this.loginService.generateToken({
      id: user._id,
      name: user.name,
      role: user.role,
    });
    return { token, id: user._id, name, cpf, email, date_of_birth };
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  public async findById(id: string): Promise<User> {
    try {
      const body = await this.userModel.findById(id).exec();
      if (!body) {
        throw new NotFoundException(`User not found.`);
      }
      return body;
    } catch (error) {
      throw new NotFoundException(`User not found.`);
    }
  }

  async findByIndex(index: number): Promise<User | null> {
    return this.userModel
      .findOne()
      .skip(index - 1)
      .exec();
  }

  async patchByIndex(
    index: number,
    partialUpdate: Partial<User>,
  ): Promise<User | null> {
    const user = await this.userModel
      .findOne()
      .skip(index - 1)
      .exec();
    if (!user) {
      return null;
    }
    Object.assign(user, partialUpdate);
    try {
      await user.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException('Validation Problem.');
      }
      throw error;
    }
    return user;
  }

  async deleteByIndex(index: number): Promise<User | null> {
    const user = await this.userModel
      .findOne()
      .skip(index - 1)
      .exec();
    if (!user) {
      return null;
    }
    await user.deleteOne();
    return user;
  }

  public async deleteById(id: string): Promise<User> {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException(`User not found.`);
    }
    const deletedDocument = await this.userModel.findByIdAndRemove(id).exec();
    return deletedDocument;
  }

  public async patchById(
    id: string,
    partialUpdate: Partial<User>,
  ): Promise<User> {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException(`User not found.`);
    }
    Object.assign(document, partialUpdate);
    const updatedDocument = await document.save();
    return updatedDocument;
  }
}
