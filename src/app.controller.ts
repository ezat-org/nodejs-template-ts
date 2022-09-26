import {
  Controller,
  Get,
  Header,
  HttpCode,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.log('Hello!');
    return this.appService.getHello();
  }

  @Get('/health')
  @HttpCode(200)
  healthcheck(): string {
    return 'Success';
  }

  @Get('/cryptoapisverifydomain')
  @Header('Content-Type', 'application/json')
  @Header(
    'Content-Disposition',
    'attachment; filename="cryptoapisverifydomain.txt"',
  )
  getStaticFile(): StreamableFile {
    const filePath = join(
      process.cwd(),
      'resources/cryptoapisverifydomain.txt',
    );

    console.log(filePath);

    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }
}
