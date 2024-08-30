import { Module } from '@nestjs/common';
import { UpdatePriceService } from './update-price.service';
import { UpdatePriceController } from './update-price.controller';

@Module({
  controllers: [UpdatePriceController],
  providers: [UpdatePriceService],
})
export class UpdatePriceModule {}
