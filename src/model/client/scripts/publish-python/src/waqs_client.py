import requests, os, platform
from azure.identity import AzureCliCredential, InteractiveBrowserCredential

environments = {
    'development': {
        'resource': '{0}://{1}/api/v1.0/query/data-viewer/',
        'scopes': 'api://5c3f9ed1-652e-4684-b82d-3586ba549308/.default',
        'viewer-url': '{0}://{1}/data-viewer/',
    }
}

def getConfig(name):
    cfg = environments['development']
    host = None
    protocol = 'https'

    if (name == 'development-local'):
        protocol = 'http'; host = 'localhost:3000'

    if (name == 'development-azure'):
        host = 'webapplicationquickstart.azurewebsites.net'

    if (host is None):
        raise ValueError('Failed to get configuration for the specified environment ({0})'.format(name))

    return {
        'authority': None,
        'tenant_id': None,
        'client_id': None,
        'redirect_uri': None,
        'resource': cfg['resource'].format(protocol, host) + '{0}/{1}',
        'scopes': cfg['scopes'],
        'viewer-url': cfg['viewer-url'].format(protocol, host),
        'host': host
    }


class PublicationClient:
    def __init__(self, environment):
        self._environment = environment
        self._config = getConfig(environment)

    def getInteractiveBrowserCredential(self):
        return InteractiveBrowserCredential()

    def showViewer(self):
        if (platform.system().lower() == 'windows'):
            os.system('start {0}'.format(self._config['viewer-url']))

    def publish(self, reportName, json, version='0.0.0.0', credential=None):
        cfg = self._config

        if (credential is None):
            credential = AzureCliCredential()

        url = cfg['resource'].format(reportName, version)
        print('getting token for resource ({0})'.format(url))
        token = credential.get_token(cfg['scopes']).token

        headers = {
            'Authorization': 'Bearer {0}'.format(token),
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'close',
            'Content-Length': '16',
            'Content-Type': 'application/json',
            'Host': cfg['host'],
            'User-Agent': 'python-requests/2.28.1 CPython/3.10',
        }

        # https://requests.readthedocs.io/en/latest/api/
        print('posting data ({0}) ...'.format(url))
        response = requests.post(url, data=json, headers=headers)

        if response.ok:
            print('successfully published report data. (report:={0})'.format(response.json()))
            return

        print('report publication failed')
