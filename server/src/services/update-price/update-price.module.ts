import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdatePriceService } from './update-price.service';
import { UpdatePriceController } from './update-price.controller';
import { UpdatePrice } from './entities';
import { PriceRatio } from 'src/services/price-ratio/entities';

@Module({
  imports: [TypeOrmModule.forFeature([UpdatePrice, PriceRatio])],
  controllers: [UpdatePriceController],
  providers: [UpdatePriceService],
})
export class UpdatePriceModule {}
