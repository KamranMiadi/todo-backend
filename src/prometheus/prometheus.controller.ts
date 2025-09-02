import { Controller, Get, Request, Res } from '@nestjs/common';
import { register } from 'prom-client';
import express from 'express';
@Controller('metrics')
export class PrometheusController {
  constructor() {
    // Initialize metrics collection
    // You can add more metrics here (e.g., histograms for latency)
  }

  @Get()
  async getMetrics(@Res() res: express.Response) {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  }
}
