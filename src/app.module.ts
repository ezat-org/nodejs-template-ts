import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvStore } from './model/env-store';
import { CommonModule } from './modules/common/common.module';
import { DevModule } from './modules/dev/dev.module';

const logModule = LoggerModule.forRoot({
  pinoHttp: {
    redact: ['headers["x-api-key"]'],
  },
});

@Module({
  imports: [CommonModule, DevModule],
  controllers: [AppController],
  providers: [AppService, EnvStore],
})
export class AppModule {}
