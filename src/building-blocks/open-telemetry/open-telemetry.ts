import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator
} from '@opentelemetry/core';
import { OTLPLogExporter as OTLPGrpcLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { OTLPMetricExporter as OTLGrpcMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { defaultResource, resourceFromAttributes } from '@opentelemetry/resources';
import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK, metrics } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import config from '../config/config';

export class OpenTelemetry {
  static start() {
    const otelSdk = new NodeSDK({
      resource: defaultResource().merge(
        resourceFromAttributes({
          [ATTR_SERVICE_NAME]: config.opentelemetry?.serviceName || 'express-app',
          [ATTR_SERVICE_VERSION]: config.opentelemetry?.serviceVersion || '1.0.0'
        })
      ),
      instrumentations: [getNodeAutoInstrumentations()],
      traceExporter: new OTLPTraceExporter({
        url: config.opentelemetry?.collectorUrl || 'http://localhost:4317'
      }),
      metricReader: new metrics.PeriodicExportingMetricReader({
        exporter: new OTLGrpcMetricExporter({
          url: config.opentelemetry?.collectorUrl || 'http://localhost:4317'
        })
      }),
      logRecordProcessors: [
        new SimpleLogRecordProcessor(
          new OTLPGrpcLogExporter({
            url: config.opentelemetry?.collectorUrl || 'http://localhost:4317'
          })
        )
      ],
      textMapPropagator: new CompositePropagator({
        propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()]
      })
    });

    process.on('SIGTERM', () => {
      otelSdk
        .shutdown()
        .then(
          () => console.log('SDK shut down successfully'),
          (err) => console.log('Error shutting down SDK', err)
        )
        .finally(() => process.exit(0));
    });

    otelSdk.start();
    console.log('OpenTelemetry SDK started');
  }
}
