import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  resource,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonRadio,
  IonRadioGroup,
  IonSearchbar
} from "@ionic/angular/standalone";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CityResponse, LocationService} from "../../service/location/location.service";
import {WeatherService} from "../../service/weather/weather.service";
import * as d3 from 'd3';
import {settings} from "ionicons/icons";
import {addIcons} from "ionicons";
import {weatherForcastRange} from "../../shared/dev-date-change";

@Component({
  selector: 'app-snow-forecast',
  templateUrl: './snow-forecast.component.html',
  styleUrls: ['./snow-forecast.component.scss'],
  imports: [
    IonItem,
    IonList,
    IonLabel,
    ReactiveFormsModule,
    IonSearchbar,
    IonRadioGroup,
    IonRadio,
    IonButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonPopover
  ],
  standalone: true
})
export class SnowForecastComponent implements OnInit {
  @ViewChild('temperaturChartContainer') private temperaturChartContainer!: ElementRef;
  @ViewChild('niederschlagChartContainer') private niederschlagChartContainer!: ElementRef;
  @ViewChild('schneehoeheChartContainer') private schneehoeheChartContainer!: ElementRef;
  @ViewChild('sonnenstundenChartContainer') private sonnenstundenChartContainer!: ElementRef;

  weatherService = inject(WeatherService);
  searchCityService = inject(LocationService);
  searching: WritableSignal<boolean> = signal(false);
  formValue = signal<{ name: string, latitude: number, longitude: number, date: string }>({
    name: 'Himmelpforten',
    latitude: 53.61413,
    longitude: 9.30516,
    date: weatherForcastRange()[0]
  });
  protected readonly initalAllButtonsVisible = {
    temp: true,
    schnee: true,
    niederschlag: true,
    sonne: true
  }
  visibiltiyButtons = signal<{
    temp: boolean,
    schnee: boolean,
    niederschlag: boolean,
    sonne: boolean
  }>(this.initalAllButtonsVisible)

  wetterDataResource = resource({
    // Define a reactive computation.
    // The params value recomputes whenever any read signals change.
    params: () => ({data: this.formValue()}),
    // Define an async loader that retrieves data.
    // The resource calls this function every time the `params` value changes.
    loader: ({params}) => this.loadWeatherData(params)
  })

  //computed signal based on result of loader function
  wetterData = computed(() => {
    if (this.wetterDataResource.hasValue()) {
      return this.wetterDataResource.value()
    }
    return undefined;
  })

  cityForm: FormGroup = new FormGroup<any>({
      name: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      date: new FormControl(weatherForcastRange()[0])
    }
  )

  cities: CityResponse[] = [];
  popUpOpenFormDialog: boolean = false;

  constructor() {

    addIcons({settings});
  }

  searchForCity() {
    this.searching.set(true);
    this.searchCityService.searchByCityName(this.cityForm.value.name).subscribe({
      next: data => this.cities = data.results,
      error: err => console.error(err)
    });
  }


  selectItem(selection: CityResponse) {
    this.searching.set(false);
    this.cityForm.patchValue(selection);
  }

  auswahlUebernehmen() {
    this.formValue.set(this.cityForm.value);
    d3.select(this.temperaturChartContainer.nativeElement).selectAll("svg").remove();
    d3.select(this.schneehoeheChartContainer.nativeElement).selectAll("svg").remove();
    d3.select(this.niederschlagChartContainer.nativeElement).selectAll("svg").remove();
    d3.select(this.sonnenstundenChartContainer.nativeElement).selectAll("svg").remove();
    this.visibiltiyButtons.set(this.initalAllButtonsVisible);
    this.popUpOpenFormDialog = false;
  }

  ngOnInit() {
    this.cityForm.patchValue(this.formValue());
  }

  private loadWeatherData(params: any) {
    return this.weatherService
      .getSnowPredicionForLocation(params.data.longitude, params.data.latitude, params.data.date);
  }

  drawTemperturGraph() {
    this.visibiltiyButtons.set({...this.visibiltiyButtons(), temp: !this.visibiltiyButtons().temp,})
    let temperatureDataArray: { time: Date, value: number }[] = this.wetterData()['hourly']['time']
      .map((data: Date, i: number): { time: Date, value: number } => {
        return {time: data, value: this.wetterData()['hourly']['temperature_2m'][i]}
      });
    this.lineChartDay(temperatureDataArray, "Temperatur in 2m Höhe in °C", this.temperaturChartContainer);
  }

  drawNiederschlagGraph() {
    this.visibiltiyButtons.set({...this.visibiltiyButtons(), niederschlag: !this.visibiltiyButtons().niederschlag,})
    let percipationProbDataArray: { time: Date, value: number }[] = this.wetterData()['hourly']['time']
      .map((data: Date, i: number): { time: Date, value: number } => {
        return {time: data, value: this.wetterData()['hourly']['precipitation_probability'][i]}
      });

    this.barChartDay(percipationProbDataArray, "Niederschlagswahrscheinlichkeit in Prozent", this.niederschlagChartContainer);
  }

  drawSchneehoeheChart() {
    this.visibiltiyButtons.set({...this.visibiltiyButtons(), schnee: !this.visibiltiyButtons().schnee})
    let snowFallSum: string = (this.wetterData()['daily']['snowfall_sum'][0]).toFixed(2)
    this.circleWithLabel(snowFallSum + ' cm', "Erwartete Neuschnee Höhe", '#76e4e8', this.schneehoeheChartContainer)

  }

  drawSonnestundenChart() {
    this.visibiltiyButtons.set({...this.visibiltiyButtons(), sonne: !this.visibiltiyButtons().sonne})
    let sunshineHours: string = (this.wetterData()['daily']['sunshine_duration'][0] / 60 / 60).toFixed(2)
    this.circleWithLabel(sunshineHours + ' h', "Sonnenschein Stunden", '#e8be64', this.sonnenstundenChartContainer)

  }

  private barChartDay(data: { time: Date, value: number }[], title: string, elementRef: ElementRef) {
    const element = elementRef.nativeElement;

    let width = element.offsetWidth;
    let height = element.offsetHeight;
    const marginTop = 40;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;


    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc()
      .domain([data[0].time, data[23].time])
      .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)!])
      .range([height - marginBottom, marginTop]);

    // Create the SVG container.
    const svg = d3.select(element)
      .append('svg')
      .attr("width", width)
      .attr("height", height);

    //add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20) // 100 + radius (50) + 20 for spacing
      .attr('text-anchor', 'middle')
      .attr('font-size', '1em')
      .style('fill', '#ffffff')
      .text(title);

    // Add the x-axis.
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x));

    // Add the y-axis.
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y));


    // Add a rect for each bar.
    svg.append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.time))
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => y(0) - y(d.value))
      .attr("width", 10);


  }

  private lineChartDay(data: { time: Date, value: number }[], title: string, elementRef: ElementRef) {
    const element = elementRef.nativeElement;

    let width = element.offsetWidth;
    let height = element.offsetHeight;
    const marginTop = 40;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;


    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc()
      .domain([data[0].time, data[23].time])
      .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
      .domain([d3.min(data, (d) => d.value)! - 0.5, d3.max(data, (d) => d.value)!])
      .range([height - marginBottom, marginTop]);

    // Declare the line generator.
    const line = d3.line<any>()
      .x(d => x(d.time))
      .y(d => y(d.value));

    // Create the SVG container.
    const svg = d3.select(element)
      .append('svg')
      .attr("width", width)
      .attr("height", height);

    //add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20) // 100 + radius (50) + 20 for spacing
      .attr('text-anchor', 'middle')
      .attr('font-size', '1em')
      .style('fill', '#ffffff')
      .text(title);

    // Add the x-axis.
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x));

    // Add the y-axis.
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickValues(y.ticks().filter((d, i) => i % 2 === 0))) // keep every 2nd tick)
      .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.4));


    // Append a path for the line.
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);


  }

  private circleWithLabel(centerLabel: string, belowLabel: string, colorCircle: string, elementRef: ElementRef) {
    const element = elementRef.nativeElement;
    let width = element.offsetWidth;
    let height = element.offsetHeight;

    //draw Circle with label diagram.
    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)   // explicit px width
      .attr('height', height);

    svg.append('circle')
      .attr('cx', width / 2) //center circle
      .attr('cy', (height + 10) / 2)
      .attr('r', (height) / 2 - 20)
      .attr('fill', colorCircle);

    // Center label (inside the circle)
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', (height + 10) / 2) // a little below exact center for optical balance
      .attr('text-anchor', 'middle') // center horizontally
      .attr('alignment-baseline', 'middle') // center vertically
      .attr('font-size', '1em')
      .attr('fill', '#000')
      .text(centerLabel);

    // Label above the circle
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 15) // 100 + radius (50) + 20 for spacing
      .attr('text-anchor', 'middle')
      .attr('font-size', '1em')
      .style('fill', '#ffffff')
      .text(belowLabel);

  }

  protected readonly weatherForcastRange = weatherForcastRange;
}
