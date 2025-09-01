import { Controller, Get } from '@nestjs/common';
import { register, Counter } from 'prom-client';

@Controller('metrics')
export class PrometheusController {
  private readonly customHttpRequestsTotal = new Counter({
    name: 'http_requests_total_custom',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status'],
  });

  constructor() {
    // Initialize metrics collection
    // You can add more metrics here (e.g., histograms for latency)
  }

  @Get()
  async getMetrics() {
    return await register.metrics();
  }
}
