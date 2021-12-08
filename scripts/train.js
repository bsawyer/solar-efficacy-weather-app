import fs from 'fs';
import {parse} from 'csv-parse';
import {NeuralNetwork} from 'brain.js/dist/brain.mjs';

const weatherData = JSON.parse(fs.readFileSync('./data/weather.json')).reduce((prev, curr) => {
  // console.log(curr)
  return [
    ...prev,
    ...curr.body.locations['-34.8105,138.6112'].values
      .filter(({datetimeStr}) => {
        const d = new Date(datetimeStr.slice(0,19));
        return d.getHours() >= 11 && d.getHours() <= 13;
      })
      .map((data) => ({
        ...data,
        datetime: new Date(data.datetimeStr.slice(0,19))
      }))
  ]
}, []);

const csvData = [];

function calcPercent(val, min, max){
  return (val + (-1 * min)) / (max + (-1 * min));
}

fs.createReadStream('./data/pv.csv')
  .pipe(parse())
  .on('data', (csvrow)=>{
      csvData.push(csvrow);
  })
  .on('end',()=>{
    let minGeneratedkW = 100; // arbitrary high number
    let maxGeneratedkW = 0;
    const d = csvData.slice(2)
      .filter((columns)=>{
        return ['11:00:00 AM', '12:00:00 PM', '1:00:00 PM'].includes(columns[1]);
      })
      .map((col) => {
        const date = new Date(`${col[0]} ${col[1]}`);
        const {
          datetime,
          temp,
          cloudcover,
          precip,
          wspd,
          humidity
        } = weatherData.find(({datetime}) => datetime.getTime() === date.getTime());

        col[2] = parseFloat(col[2]);

        if(col[2] < minGeneratedkW){
          minGeneratedkW = col[2];
        }
        if(col[2] > maxGeneratedkW){
          maxGeneratedkW = col[2];
        }

        return {
          datetime,
          temp: calcPercent(temp, -128.6, 134),
          cloudcover: cloudcover / 100,
          precip: calcPercent(precip, 0, 14),
          wspd: calcPercent(wspd, 0, 254),
          humidity: humidity / 100,
          generatedkW: col[2]
        };
      })
      .map(data => {
        return {
          ...data,
          generatedkW: calcPercent(data.generatedkW, minGeneratedkW, maxGeneratedkW)
        }
      })

      fs.writeFileSync('./.tmp/data.json', JSON.stringify(d,null,2));

      const net = new NeuralNetwork();
      console.log(`trainging with ${d.length}`);
      const results = net.train(d.map(({
        temp,
        cloudcover,
        precip,
        wspd,
        humidity,
        generatedkW,
      }) => {
        return {
          input: {
            temp,
            cloudcover,
            precip,
            wspd,
            humidity,
          },
          output: {
            generatedkW
          }
        }
      }), {iterations: 80000});
      console.log(results)
      console.log({minGeneratedkW, maxGeneratedkW})
      fs.writeFileSync('./src/net.json', JSON.stringify(net));
      console.log(net.run(d[0]), d[0].generatedkW)
      console.log(net.run(d[90]), d[90].generatedkW)
      console.log(net.run(d[800]), d[800].generatedkW)
      console.log('cool')
  });
