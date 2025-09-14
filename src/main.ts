import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ParteIntIdPipe } from './common/pipes/parse-int-id.pipe';
import { TimingConnectionInterceptor } from './common/interceptors/timing-connection.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not defined in DTOs
      forbidNonWhitelisted: true, // Reject requests with properties not defined in DTOs
    }),
    new ParteIntIdPipe(),
  );
  app.useGlobalInterceptors(new TimingConnectionInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
