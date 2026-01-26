import { Module, Global } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationGateway } from './notification.gateway';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Global()
@Module({
  imports: [AuthModule], // Import AuthModule to get configured JwtModule
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService],
})
export class NotificationModule {}
