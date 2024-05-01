import { CreateUserDto } from '@/auth/dto/create_user.dto';
import { CommonUserFactory } from '@/lib/factory/user/common_user';
import { FindUserOpt } from '@/lib/repository/user/interface/find_user.interface';
import { UserRepository } from '@/lib/repository/user/user.repository';
import { User, UserDocument } from '@/models/mongodb/user.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private userFactory: CommonUserFactory,
    private userRepository: UserRepository,
  ) {}

  async saveOne(user: CreateUserDto) {
    const newUser = this.userFactory.create(user);
    return await newUser.save();
  }

  async getOneByUsername(name: string): Promise<User> {
    return this.userRepository.findOne({ name });
  }

  async getOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  async sendUserInfoToClient(user: UserDocument | FindUserOpt) {
    if (this.isUserDocument(user)) {
      user.password = undefined;
      return user;
    }

    return this.userRepository.findOne(user, { _id: 0, _v: 0, password: 0 });
  }

  private isUserDocument(user: UserDocument | FindUserOpt): user is UserDocument {
    return user['joined_date'] !== undefined;
  }
}
