import { ReportEntry, IReportEntryBaseState, getLogger } from 'model-core';

const logger = getLogger('model.server:query:report-entry');
const reports: Record<string, ReportEntry> = {};

const data = [
  { name: 'stock-prices', version: '0.0', data: { msft: 244, goog: 98, }, id: '', uuid: '' },
  { name: 'stock-beta', version: '0.0', data: { msft: 1.2, goog: 1.3, }, id: '', uuid: '' }
];

data.forEach((d) => {
  reports[ReportEntry.toKey(d.name, d.version)] = new ReportEntry(d)
});

export class ReportEntryRepository {
  public post(name: string, version: string, data: any): Promise<ReportEntry> {
    const reportEntry = new ReportEntry({ name, version, data, id: '', uuid: '' });
    logger(`posting report entry (${reportEntry}) data set ... `);
    return Promise.resolve(reports[reportEntry.id] = reportEntry);
  }

  public get(report: string, version: string): Promise<ReportEntry> {
    const key = ReportEntry.toKey(report, version);
    const reportEntry = reports[key];
    logger(`fetching report entry (${key}) data set ... `);
    return Promise.resolve(reportEntry);
  }

  public async getAllDetails(): Promise<Array<IReportEntryBaseState>> {
    return Object.keys(reports).map((key) => {
      const value = reports[key];

      return {
        id: value.id,
        uuid: value.uuid,
        name: value.name,
        version: value.version,
        description: value.description,
        tags: value.tags
      }
    });
  }

  public toString(): string {
    return JSON.stringify(Object.keys(reports));
  }
}