import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.use(
    '/proxy',
    createProxyMiddleware({
      target: process.env.API_PROXY_TARGET,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/proxy': '',
      },
    }),
  );
  await app.listen(3001);
}

bootstrap();
