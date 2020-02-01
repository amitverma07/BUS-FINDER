const henlow = document.querySelector('#henlowBay');

henlow.addEventListener('click', function (e) {
  e.preventDefault();
  let henlowUl = document.querySelector('#henlowList');

  let apiHttp = 'https://api.winnipegtransit.com/v3/';
  let apiKey = 'api-key=H93FmpRMyavgco8CgZ1';
  let apiStreet = 'streets.json?name=Henlow&type=Bay&';
  let apistop = 'stops.json?street=';
  let stopSchApi = 'schedule.json?&max-results-per-route=2';

  let results = [];

  const stopSchedules = stopKeys => {
    for (let key of stopKeys.stops) {

      let fetches = fetch(`${apiHttp}stops/${key.key}/${stopSchApi}&${apiKey}`).then(response => response.json());
      results.push(fetches);
    }
    return results;
  }

  const addDataToHtml = jsonData => {
    Promise.all(stopSchedules(jsonData))
      .then(response => {
        response.forEach(e => {
          henlowUl.insertAdjacentHTML('beforeend', `
<div class ='first-div'><h4>Name of the stop : ${e['stop-schedule'].stop.name}</h4> </div>
<div><b>Direction :</b> ${e['stop-schedule'].stop.direction} </div>
<div><b>Cross street name :</b> ${e['stop-schedule'].stop['cross-street'].name} </div>   
`)
          for (let route of e['stop-schedule']['route-schedules']) {
            henlowUl.insertAdjacentHTML('beforeend', `
    <div><b>Route number :</b> ${route.route.name} </div>
    `)

            for (let bus of route['scheduled-stops']) {
              henlowUl.insertAdjacentHTML("beforeend",
                `<div><b>BUS TIME :</b> ${bus.times.arrival.scheduled}</div>`
              );
            }

          }

        })
      })
  }
  fetch(`${apiHttp}${apiStreet}${apiKey}`)
    .then(response => response.json())
    .then(responseData => fetch(`${apiHttp}${apistop}${responseData.streets[0].key}&${apiKey}`))
    .then(stopsRespose => stopsRespose.json())
    .then(stopsJson => addDataToHtml(stopsJson));
})