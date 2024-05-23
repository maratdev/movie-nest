import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserModel } from '../user/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async login(userAuth: AuthDto) {
    const user = await this.validateUser(userAuth);
    const tokens = await this.issueTokenPair(user._id);
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async getNewToken({ refreshToken }: TokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sign in');
    const payload = await this.jwtService.verifyAsync(refreshToken);
    if (!payload) throw new UnauthorizedException('Invalid token');

    const user = await this.userModel.findById(payload._id);
    const tokens = await this.issueTokenPair(user._id);
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async register(userAuth: AuthDto) {
    const salt = await genSalt(10);
    const user = await this.userModel.findOne(
      { email: userAuth.email },
      'email',
    );
    if (user) throw new ConflictException('User already exists');

    const newUser = new this.userModel({
      email: userAuth.email,
      password: await hash(userAuth.password, salt),
    });
    const addedUser = await newUser.save();
    const tokens = await this.issueTokenPair(addedUser._id);
    return {
      user: this.returnUserFields(addedUser),
      ...tokens,
    };
  }

  async validateUser(userAuth: AuthDto): Promise<UserModel> {
    const user = await this.userModel.findOne({ email: userAuth.email });
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await compare(userAuth.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
    return user;
  }

  async issueTokenPair(userId: string) {
    const data = { _id: userId };
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '7d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });
    return { refreshToken, accessToken };
  }

  returnUserFields(user: UserModel) {
    return {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
  }
}
