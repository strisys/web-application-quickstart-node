import { expect } from 'chai';
import { transform } from './../../shared/data-transform';
import { KVStore, KV } from 'model-core';

KVStore.current('model-client').isTesting = true;

describe('data-transform', () => {
  describe('columnar data', async function () {
    it('should return a verbose javascript object with columns repeated given a object of keys and arrays', async () => {
      // Assemble
      const sourceData = {
        "id": { "0": 10093, "1": 0, "2": 2756, "3": 1, "4": 622, "5": 2606, "6": 9550, "7": 623, "8": 624 },
        "name": { "0": "Abakanowicz, Magdalena", "1": "Abbey, Edwin Austin", "2": "Abbott, Berenice", "3": "Abbott, Lemuel Francis", "4": "Abrahams, Ivor", "5": "Absalon", "6": "Abts, Tomma", "7": "Acconci, Vito", "8": "Ackling, Roger" },
        "gender": { "0": "Female", "1": "Male", "2": "Female", "3": "Male", "4": "Male", "5": "Male", "6": "Female", "7": "Male", "8": "Male" },
        "dates": { "0": "born 1930", "1": "1852–1911", "2": "1898–1991", "3": "1760–1803", "4": "born 1935", "5": "1964–1993", "6": "born 1967", "7": "born 1940", "8": "1947–2014" },
        "yearOfBirth": { "0": 1930, "1": 1852, "2": 1898, "3": 1760, "4": 1935, "5": 1964, "6": 1967, "7": 1940, "8": 1947 },
        "yearOfDeath": { "0": null, "1": 1911, "2": 1991, "3": 1803, "4": null, "5": 1993, "6": null, "7": null, "8": 2014 },
        "placeOfBirth": { "0": "Polska", "1": "Philadelphia, United States", "2": "Springfield, United States", "3": "Leicestershire, United Kingdom", "4": "Wigan, United Kingdom", "5": "Tel Aviv-Yafo, Yisra'el", "6": "Kiel, Deutschland", "7": "New York, United States", "8": "Isleworth, United Kingdom" },
        "placeOfDeath": { "0": null, "1": "London, United Kingdom", "2": "Monson, United States", "3": "London, United Kingdom", "4": null, "5": "Paris, France", "6": null, "7": null, "8": null },
        "url": { "0": "http://www.tate.org.uk/art/artists/magdalena-abakanowicz-10093", "1": "http://www.tate.org.uk/art/artists/edwin-austin-abbey-0", "2": "http://www.tate.org.uk/art/artists/berenice-abbott-2756", "3": "http://www.tate.org.uk/art/artists/lemuel-francis-abbott-1", "4": "http://www.tate.org.uk/art/artists/ivor-abrahams-622", "5": "http://www.tate.org.uk/art/artists/absalon-2606", "6": "http://www.tate.org.uk/art/artists/tomma-abts-9550", "7": "http://www.tate.org.uk/art/artists/vito-acconci-623", "8": "http://www.tate.org.uk/art/artists/roger-ackling-624" }
      };

      // Act
      const transformed = transform(sourceData);
      console.log(JSON.stringify(transformed));

    });
  });
});