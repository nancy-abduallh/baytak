import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ensureAvatarsDirExists } from './common/utils/avatar-upload.util';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  ensureAvatarsDirExists();
  // Serves uploaded technician avatars at http://localhost:<port>/uploads/avatars/<file>
  // (kept outside the api/v1 prefix since these are static files, not API routes).
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: config.get('corsOrigin'), credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = config.getOrThrow<number>('port');
  await app.listen(port);
  console.log(`Baytak API running on http://localhost:${port}/api/v1`);
}
bootstrap();