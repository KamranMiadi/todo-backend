import { Controller, Get } from '@nestjs/common';
import { register } from 'prom-client';

@Controller('metrics')
export class PrometheusController {
  constructor() {
    // Initialize metrics collection
    // You can add more metrics here (e.g., histograms for latency)
  }

  @Get()
  async getMetrics() {
    return await register.metrics();
  }
}
