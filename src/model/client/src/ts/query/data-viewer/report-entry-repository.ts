import { tryExecGetJson, execPostJson, getApiPath } from '../../shared';
import { ReportEntry, IReportEntryState, IReportEntryBaseState, getLogger } from 'model-core';
import { transform } from '../../shared/data-transform';

const logger = getLogger('model.client:query:report-entry');

const getUrlBase = (): string => {
  return getApiPath('query/data-viewer');
}

const getUrl = (reportName: string, version: string): string => {
  return `${getUrlBase()}/${reportName}/${version}`;
}

export class ReportEntryRepository {
  private hydrate(state: IReportEntryState): ReportEntry {
    state.data = transform(state.data);
    return new ReportEntry(state);
  }

  public async post(reportName: string, version: string, data: any): Promise<ReportEntry> {
    const reportEntry = new ReportEntry({ name: reportName, version, data, uuid: '' });
    const url = getUrl(reportName, version);
    logger(`posting report entry (${reportEntry}) data set to ${url} ... `);
    return this.hydrate((await execPostJson(url, reportEntry.state)));
  }

  public async get(reportName: string, version: string): Promise<ReportEntry> {
    const url = getUrl(reportName, version);
    logger(`executing client call to get data-viewer data results (url:=${url}) ...`);
    return this.hydrate(await tryExecGetJson(url));
  }

  public async getDetails(): Promise<Array<IReportEntryBaseState>> {
    const url = `${getUrlBase()}/details`;
    logger(`executing client call to get data-viewer data details (url:=${url}) ...`);
    return await tryExecGetJson(url);
  }
}