import { Module } from '@nestjs/common';
import { LogModule } from './modules/log/log.module.js';

@Module({
  imports: [LogModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
