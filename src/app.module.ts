import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FirebaseMiddleware } from './firebase/firebase.middleware';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ResourceModule } from './resource/resource.module';
import { UsersController } from './users/users.controller';
import { ResourceController } from './resource/resource.controller';
import { CategoryController } from './category/category.controller';
import { ProductModule } from './product/product.module';
import { ProductController } from './product/product.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    DatabaseModule,
    CategoryModule,
    ResourceModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseMiddleware)
      .exclude(
        { path: '/v1/resource/file/:id', method: RequestMethod.GET },
        { path: '/v1/category', method: RequestMethod.GET },
        { path: '/v1/product', method: RequestMethod.GET },
      )
      .forRoutes(
        UsersController,
        ResourceController,
        CategoryController,
        ProductController,
      );
  }
}
