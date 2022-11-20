import requests
from azure.identity import DefaultAzureCredential

# environments = {
#     local {
#         resource = 'http://localhost:3000/api/v1.0/query/data-viewer/{0}/{1}'
#         scopes = 'api://5c3f9ed1-652e-4684-b82d-3586ba549308/.default'
#     }
# }

environments = {
    "local": {
        "resource": 'http://localhost:3000/api/v1.0/query/data-viewer/{0}/{1}',
        "scopes": 'api://5c3f9ed1-652e-4684-b82d-3586ba549308/.default'
    }
}


def publish(environment, reportName, json, version='0.0.0.0', credential=DefaultAzureCredential()):
    config = environments[environment]
    token = credential.get_token(config['scopes']).token

    headers = {
        "Authorization": "Bearer {0}".format(token),
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'close',
        'Content-Length': '16',
        'Content-Type': 'application/json',
        'Host': 'httpbin.org',
        'User-Agent': 'python-requests/2.4.3 CPython/3.4.0',
    }

    # https://requests.readthedocs.io/en/latest/api/
    url = config['resource'].format(reportName, version)
    response = requests.post(url, data=json, headers=headers)

    if response.ok:
        print('successfully published report data. (report:={0})'.format(
            response.json()))
        return

    print('report publication failed')
