import { Controller } from '@nestjs/common';
import { UpdatePriceService } from './update-price.service';

@Controller('update-price')
export class UpdatePriceController {
  constructor(private readonly updatePriceService: UpdatePriceService) {}
}
