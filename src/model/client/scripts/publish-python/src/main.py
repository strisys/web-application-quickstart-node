from waqs_client import PublicationClient
import pandas as pd


def compute(large):
    file = 'artist_data_large' if large else 'artist_data_small'
    return pd.read_csv('./data/{0}.csv'.format(file)).to_json()


def submit():
    environment = 'development-local'

    client = PublicationClient(environment)
    credential = client.getInteractiveBrowserCredential()
    client.publish('artists-large', compute(True), '1.0', credential)
    client.publish('artists-small', compute(False), '1.0', credential)
    client.showViewer()


if (__name__ == '__main__'):
    submit()
