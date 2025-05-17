import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',  // <-- FRONTEND address
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000); // <-- BACKEND listens here
}
bootstrap();
