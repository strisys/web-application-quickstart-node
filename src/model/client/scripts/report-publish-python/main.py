from report_client import publish
import pandas as pd


def compute(large):
    file = 'artist_data_large' if large else 'artist_data_small'
    return pd.read_csv('./data/{0}.csv'.format(file)).to_json()


def submit():
    publish('local', 'artists-large', compute(True), '1.0')
    publish('local', 'artists-small', compute(False), '1.0')


if (__name__ == '__main__'):
    submit()
