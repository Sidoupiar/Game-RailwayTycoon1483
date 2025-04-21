class WeatherManager {
	constructor(game) {
		this.game = game;
		this.weatherTypeList = [
			{
				id: 'clear',
				name: '晴朗',
				icon: '☀️',
				durationBase: 100,
				durationRandom: 100,
				elementEffect: '',
				effectList: {
					speedMultiplier: 1.0,
					priceMultiplier: 1.0,
				},
			},
			{
				id: 'maybe_clear',
				name: '快晴',
				icon: '⛅',
				durationBase: 100,
				durationRandom: 100,
				elementEffect: 'rain-effect',
				effectList: {
					speedMultiplier: 0.9,
					priceMultiplier: 0.9,
				},
			},
			{
				id: 'rain',
				name: '雾雨',
				icon: '🌧️',
				durationBase: 100,
				durationRandom: 100,
				elementEffect: 'rain-effect',
				effectList: {
					speedMultiplier: 0.8,
					priceMultiplier: 1.2,
				},
			},
			{
				id: 'thunder',
				name: '雷暴',
				icon: '⛈️',
				durationBase: 100,
				durationRandom: 100,
				elementEffect: 'rain-effect',
				effectList: {
					speedMultiplier: 0.6,
					priceMultiplier: 1.4,
				},
			},
			{
				id: 'snow',
				name: '大雪',
				icon: '❄️',
				durationBase: 100,
				durationRandom: 100,
				elementEffect: 'snow-effect',
				effectList: {
					speedMultiplier: 0.7,
					priceMultiplier: 1.5,
				},
			},
			{
				id: 'fog',
				name: '浓雾',
				icon: '🌫️',
				durationBase: 100,
				durationRandom: 100,
				elementEffect: 'fog-effect',
				effectList: {
					speedMultiplier: 0.5,
					priceMultiplier: 0.8,
				},
			}
		];
		this.weatherTypeContainer = this.game.MakeTypeContainer(this.weatherTypeList);
	}

	Init() {
		this.weatherDurationLeft = 0;
		this.currentWeatherID = 'clear';
		this.SetRandomWeather();
	}

	FinalInit() {

	}

	LoadGame(gameData) {
		const weatherData = gameData.weatherData || {};
		this.weatherDurationLeft = weatherData.weatherDurationLeft || 0;
		this.currentWeatherID = weatherData.currentWeatherID || 'clear';
	}

	SaveGame(gameData) {
		gameData.weatherData = {
			weatherDurationLeft: this.weatherDurationLeft,
			currentWeatherID: this.currentWeatherID,
		};
	}

	Update(deltaTime) {
		if (this.weatherDurationLeft > 0) {
			this.weatherDurationLeft -= deltaTime;
			if (this.weatherDurationLeft <= 0) {
				this.SetRandomWeather();
			}
		}
	}

	UpdateUI() {

	}

	SetRandomWeather() {
		const previousWeatherID = this.currentWeatherID;
		let weatherTypeCurrent = this.weatherTypeList[Math.floor(Math.random() * this.weatherTypeList.length)];
		let loopCount = 0;
		while (previousWeatherID === weatherTypeCurrent.id && loopCount < 10) {
			++loopCount;
			weatherTypeCurrent = this.weatherTypeList[Math.floor(Math.random() * this.weatherTypeList.length)];
		}
		this.currentWeatherID = weatherTypeCurrent.id;
		this.weatherDuration = Math.floor(weatherTypeCurrent.durationBase + Math.random() * weatherTypeCurrent.durationRandom);
		this.UpdateWeatherElement(weatherTypeCurrent.elementEffect);
	}

	UpdateWeatherElement(elementEffect) {
		const weatherElement = document.getElementById('weatherEffect');
		weatherElement.className = 'absolute inset-0 pointer-events-none';
		if (elementEffect !== '') {
			weatherElement.classList.add(elementEffect);
		}
	}

	GetWeatherType() {
		const weatherType = this.weatherTypeContainer[this.currentWeatherID];
		if (weatherType) {
			return weatherType;
		} else {
			return {};
		}
	}

	GetWeatherEffectList() {
		const weatherList = this.weatherTypeContainer[this.currentWeatherID];
		if (weatherList) {
			return weatherList.effectList;
		} else {
			return {
				speedMultiplier: 1.0,
				priceMultiplier: 1.0,
			};
		}
	}

	GetWeatherID() {
		return this.currentWeatherID;
	}
}