/**
 * Optional application-owned OpenTelemetry Metrics API bootstrap.
 *
 * The starter has no OpenTelemetry SDK dependency by default. To opt in, add
 * `@opentelemetry/api` and `@opentelemetry/sdk-metrics`, then run the app with
 * `PURISTA_TELEMETRY=otel`. Replace the console reader with an OTLP reader when
 * your deployment provides a collector or exporter.
 */
type OTelApiModule = {
	metrics: { setGlobalMeterProvider(provider: unknown): boolean }
}

type OTelMetricsSdkModule = {
	ConsoleMetricExporter: new () => unknown
	PeriodicExportingMetricReader: new (options: { exporter: unknown }) => unknown
	MeterProvider: new (options: { readers: unknown[] }) => { shutdown(): Promise<void> }
}

export const initializeTelemetry = async (): Promise<{ name: string; destroy: () => Promise<void> } | undefined> => {
	if (process.env.PURISTA_TELEMETRY !== 'otel') {
		return undefined
	}

	const runtimeImport = new Function('moduleName', 'return import(moduleName)') as (
		moduleName: string,
	) => Promise<unknown>
	const [apiModule, metricsSdkModule] = (await Promise.all([
		runtimeImport('@opentelemetry/api'),
		runtimeImport('@opentelemetry/sdk-metrics'),
	])) as [OTelApiModule, OTelMetricsSdkModule]
	const { metrics } = apiModule
	const { ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader } = metricsSdkModule
	const meterProvider = new MeterProvider({
		readers: [new PeriodicExportingMetricReader({ exporter: new ConsoleMetricExporter() })],
	})
	metrics.setGlobalMeterProvider(meterProvider)

	return {
		name: 'OpenTelemetry metrics',
		destroy: async () => meterProvider.shutdown(),
	}
}
