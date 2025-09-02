import { Controller, Get, Request, Res } from '@nestjs/common';
import { register } from 'prom-client';
import type { Response } from 'express';
@Controller('metrics')
export class PrometheusController {
  constructor() {
    // Initialize metrics collection
    // You can add more metrics here (e.g., histograms for latency)
  }

  @Get()
  async getMetrics(@Res() res: Response) {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  }
}
