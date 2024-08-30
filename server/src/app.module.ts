// src/app.module.ts
import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './services/users/users.module';
import { NgCaseModule } from './services/ng-case/ng-case.module';
import { JwtMiddleware } from './common/middlewares';
import { DefectModule } from './services/defects/defects.module';
import { PartsModule } from './services/parts/parts.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MachinesModule } from './services/machines/machines.module';
import { ProcessesModule } from './services/processes/processes.module';
import { ProductivityModule } from './services/productivity/productivity.module';
import { OperatorsModule } from './services/operators/operators.module';
import { DocumentsModule } from './services/documents/documents.module';
import { UpdatePriceModule } from './services/update-price/update-price.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '10.0.0.3',
      port: 5432,
      username: 'Backend-CoDE',
      password: '$nc.C0DE@z0z3',
      database: 'iQCS_V1_DEV',
      // database: 'iQCS_V1_PROD',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    CacheModule.register({ isGlobal: true }),
    UsersModule,
    NgCaseModule,
    DefectModule,
    PartsModule,
    MachinesModule,
    ProductivityModule,
    ProcessesModule,
    OperatorsModule,
    DocumentsModule,
    UpdatePriceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude('/users/login', '/users/gen-pass', '/users/plants')
      .forRoutes({
        path: '/users*',
        method: RequestMethod.ALL,
      });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/ng-cases*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/machines*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/processes*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/operators*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/parts*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/documents*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/update-price*',
      method: RequestMethod.ALL,
    });

    consumer
      .apply(JwtMiddleware)
      // .exclude(
      //   '/defects-logging/raw-data-by-datetime-range',
      //   '/defects-logging/summary-by-datetime-range',
      //   '/defects-logging/summary-by-date',
      //   '/defects-logging/graph-summary-by-date',
      //   '/defects-logging/top-rank-by-date',
      //   '/defects-logging/graph-summary-by-date-range',
      //   '/defects-logging/top-rank-by-date-range',
      // )
      .forRoutes({
        path: '/defects-logging*',
        method: RequestMethod.ALL,
      });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/parts*',
      method: RequestMethod.ALL,
    });

    consumer.apply(JwtMiddleware).forRoutes({
      path: '/productivity-logging*',
      method: RequestMethod.ALL,
    });
  }
}
