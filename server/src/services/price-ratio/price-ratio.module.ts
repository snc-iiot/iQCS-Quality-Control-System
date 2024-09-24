import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceRatioService } from './price-ratio.service';
import { PriceRatioController } from './price-ratio.controller';
import { PriceRatio } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([PriceRatio])],
  controllers: [PriceRatioController],
  providers: [PriceRatioService],
})
export class PriceRatioModule {}
