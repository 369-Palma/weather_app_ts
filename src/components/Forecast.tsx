import { forecastType } from "../assets/types";
import { FiSunset, FiSunrise } from "react-icons/fi";
import { FaWind, FaTemperatureLow } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";
import { GiDroplets } from "react-icons/gi";
import { WiBarometer, WiHumidity } from "react-icons/wi";

type Props = {
  data: forecastType;
};
const Degree = ({ temp }: { temp: number }): JSX.Element => (
  <span>
    {Math.round(temp - 273.15)} 
    <sup>o</sup>
  </span>
);

const getSunTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();

  if (hours.length <= 1) hours = `0${hours}`;
  if (minutes.length <= 1) minutes = `0${minutes}`;

  return `${hours}:${minutes}`;
};

const getWindDirection = (deg: number): string => {
  if (deg > 15 && deg <= 75) return "NE";
  if (deg > 76 && deg <= 105) return "E";
  if (deg > 105 && deg <= 165) return "SE";
  if (deg > 166 && deg <= 195) return "S";
  if (deg > 195 && deg <= 225) return "SW";
  if (deg > 255 && deg <= 285) return "W";
  if (deg > 285 && deg <= 345) return "NW";

  return "N";
};

const getPop = (pop: number): string => {
  if (pop <= 15) return "Low probability";
  if (pop > 15 && pop <= 55) return "Unpredictable weather";
  return "High probability";
};

const getHumidityValue = (level: number): string => {
  if (level <= 55) return "Dry and comfortable";
  if (level > 55) return "Slightly uncomfortable, sticky feeling";
  return "Lot's of moisture, uncomfortable feeling";
};

const getVisibilityValue = (number: number): string => {
  if (number <= 50) return "Dangerously foggy";
  if (number > 50 && number <= 500) return "Expect heavy fog";
  if (number > 500 && number <= 2000) return "Expect some fog";
  if (number > 2000 && number <= 9000) return "Expect some haze";
  return "Very clear day";
};

export const Forecast = ({ data }: Props): JSX.Element => {
  const today = data.list[0];

  return (
    <div
      className="search w-50 d-flex flex-column 
    justify-content-center align-items-center"
    >
      <section className="mx-auto my-4 d-flex flex-column text-center justify-content-center align-items-center ">
        <h2 className="fs-1 fw-bold ">
          {data.name}
          <span className="country">{data.country}</span>
        </h2>
        <h1 className="fs-1 bold">
          <Degree temp={Math.round(today.main.temp)} />
        </h1>
        <p>
          {today.weather[0].main} {today.weather[0].description}
        </p>
        <div className="d-flex ">
          <span className="bold"> H: </span>
          <Degree temp={Math.ceil(today.main.temp_max)} />/{" "}
          <span className="bold"> L: </span>
          <Degree temp={Math.ceil(today.main.temp_min)} />
        </div>
      </section>

      {/* SESSIONE METEO IMGS */}

      <section className="container-scroll">
        {data.list.map((item, i) => (
          <div
            className="d-flex flex-column align-items-center col-md-3"
            key={i}
          >
            <p>
              {i === 0 ? (
                <span className="bold">Now</span>
              ) : (
                new Date(item.dt * 1000).getHours()
              )}
            </p>
            <img
              className="imgs"
              src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={`weather-icon-${item.weather[0].description}`}
            />
            <p className="piccolo">
              <Degree temp={Math.round(item.main.temp)} />
            </p>
          </div>
        ))}
      </section>

      {/* SESSIONE ALBA E TRAMONTO */}

      <section className="d-flex flex-wrap align-items-center justify-content-center my-4 mx-auto">
        <div className="miniBox d-flex flex-column  m-2 justify-content-center align-items-center ">
          <FiSunrise className="fs-5 fw-bold mb-1" />{" "}
          <span className="bold"> {getSunTime(data.sunrise)}</span>
        </div>
        <div className="d-flex flex-column miniBox m-2 justify-content-center align-items-center  ">
          <FiSunset className="fs-5 fw-bold mb-1" />{" "}
          <span className="bold"> {getSunTime(data.sunset)} </span>
        </div>
      </section>

      <section className="d-flex flex-row justify-content-center flex-wrap mx-auto ">
        {/* wind */}

        <div className="tail  col-md-4  m-2">
          <div className=" d-flex flex-row justify-content-center">
            <FaWind className=" bold" />
            <p className="ps-2 fw-bold">Wind</p>
          </div>
          <div className="wind d-flex flex-row mx-auto ">
            <h3 className="my-2"> {Math.round(today.wind.speed)} Km/h</h3>
          </div>
          <p className="piccolo">{`${getWindDirection(
            Math.round(today.wind.deg)
          )}, gusts ${today.wind.gust.toFixed(1)} Km/h`}</p>
        </div>

        {/* feels like*/}
        <div className="tail  col-md-4  m-2">
          <div className=" d-flex flex-row justify-content-center">
            <FaTemperatureLow className="bold" />
            <p className="ps-2 fw-bolder">Feels like</p>
          </div>
          <div className="wind d-flex flex-row mx-auto ">
            <h3 className="my-2">
              {" "}
              <Degree temp={Math.round(today.main.feels_like)} />{" "}
            </h3>
          </div>
          <p className="piccolo">
            {`Feels ${
              Math.round(today.main.feels_like) < Math.round(today.main.temp)
                ? `colder`
                : `warmer`
            }`}{" "}
          </p>
        </div>

        {/* humidity */}
        <div className="tail  col-md-4  m-2">
          <div className="  d-flex flex-row justify-content-center">
            <WiHumidity className="bold fs-5" />
            <p className="ps-2 fw-bold">Humidity</p>
          </div>
          <div className=" d-flex flex-row mx-auto ">
            <h3 className="my-2"> {Math.round(today.main.humidity)} %</h3>
          </div>
          <p className="piccolo">{getHumidityValue(today.main.humidity)}</p>
        </div>

        {/* Pop */}
        <div className="tail  col-md-4  m-2">
          <div className=" d-flex flex-row justify-content-center">
            <GiDroplets className=" bold" />
            <p className="ps-2 fw-bold">Precipitation</p>
          </div>
          <div className=" d-flex flex-row mx-auto ">
            <h3 className="my-2"> {Math.round(today.pop) * 1000} %</h3>
          </div>
          <p className="piccolo">{`${getPop(today.pop)}, clouds at ${
            today.clouds.all
          } %`}</p>
        </div>

        {/* Pressure */}
        <div className="tail  col-md-4  m-2">
          <div className=" d-flex flex-row justify-content-center">
            <WiBarometer className="bold fs-4" />
            <p className="ps-2 fw-bold">Pressure </p>
          </div>
          <div className=" d-flex flex-row mx-auto ">
            <h3 className="my-2"> {Math.round(today.main.pressure)} hPa</h3>
          </div>
          <p className="piccolo">{` ${
            Math.round(today.main.pressure) < 1083 ? "Lower" : "Higher"
          } than standard
                  `}</p>
        </div>

        {/* Visibility */}
        <div className="tail col-md-4  m-2">
          <div className=" d-flex flex-row justify-content-center">
            <MdVisibility className="bold" />
            <p className="ps-2 fw-bold">Visibility</p>
          </div>
          <div className=" d-flex flex-row mx-auto ">
            <h3 className="my-2"> {today.visibility / 1000} Km</h3>
          </div>
          <p className="piccolo">{getVisibilityValue(today.visibility)}</p>
        </div>
      </section>
    </div>
  );
};
