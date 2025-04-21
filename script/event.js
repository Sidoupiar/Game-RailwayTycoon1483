class EventManager {
	constructor(game) {
		this.game = game;
		this.eventTypeList = [
			{
				id: 'expensive',
				title: '货物价格暴涨！',
				content: '由于市场需求激增，当前站点所有货物价格上涨 50%！',
				cooldownBase: 100,
				cooldownRandom: 100,
				EventEffect: function (eventManager, hasAppend) {
					eventManager.game.stationManager.ChangeCurrentStationPriceBuy(1.5);
				},
			},
			{
				id: 'lost',
				title: '货物丢失!',
				content: '火车遭遇颠簸，部分货物从车厢掉落！',
				cooldownBase: 100,
				cooldownRandom: 100,
				EventEffect: function (eventManager, hasAppend) {
					eventManager.game.trainManager.LoseRandomCargo();
				}
			},
			{
				id: 'weatherChanged',
				title: '天气突变!',
				content: '突然的天气变化影响了火车速度和货物价格！',
				cooldownBase: 100,
				cooldownRandom: 100,
				EventEffect: function (eventManager, hasAppend) {
					eventManager.game.weatherManager.SetRandomWeather();
					eventManager.game.ApplyWeatherEffect();
				},
			},
			{
				id: 'rareCargo',
				title: '稀有货物!',
				content: '当前站点出现了一批稀有货物，不要错过机会！',
				cooldownBase: 100,
				cooldownRandom: 100,
				EventEffect: function (eventManager, hasAppend) {
					eventManager.game.stationManager.CurrentStationAppendCargo(3)
				},
			},
			{
				id: 'trainBrocken',
				title: '火车故障!',
				content: '火车出现机械故障，速度降低！',
				cooldownBase: 100,
				cooldownRandom: 100,
				EventEffect: function (eventManager, hasAppend) {
					eventManager.game.trainManager.ChangeTrainSpeed(0.5);
					if (hasAppend) {
						eventManager.cacheEventEffect.push({
							timer: 10000,
							event: 'trainFaster',
							hasAppend: false,
						});
					}
				},
			},
			{
				id: 'trainFaster',
				title: '火车超频!',
				content: '火车出现机械超频运转，速度提高！',
				cooldownBase: 100,
				cooldownRandom: 100,
				EventEffect: function (eventManager, hasAppend) {
					eventManager.game.trainManager.ChangeTrainSpeed(2.0);
					if (hasAppend) {
						eventManager.cacheEventEffect.push({
							timer: 10000,
							event: 'trainBrocken',
							hasAppend: false,
						});
					}
				},
			},
		];
		this.eventTypeContainer = this.game.MakeTypeContainer(this.eventTypeList);
	}

	Init() {
		this.eventCooldown = 0;
		this.cacheEventEffect = [];
	}

	FinalInit() {

	}

	LoadGame(gameData) {
		const eventData = gameData.eventData || {};
		this.eventCooldown = eventData.eventCooldown || 0;
		this.cacheEventEffect = eventData.cacheEventEffect || [];
	}

	SaveGame(gameData) {
		gameData.eventData = {
			eventCooldown: this.eventCooldown,
			cacheEventEffect: this.cacheEventEffect,
		};
	}

	Update(deltaTime) {
		this.eventCooldown -= deltaTime;
		for (let eventIndex = 0, eventCount = this.cacheEventEffect.length; eventIndex < eventCount; ++eventIndex) {
			const eventCacheData = this.cacheEventEffect[eventIndex];
			eventCacheData.timer -= deltaTime;
			if (eventCacheData.timer < 0) {
				this.FireEvent(eventCacheData.event, eventCacheData.hasAppend);
				this.cacheEventEffect.splice(eventIndex, 1);
				--eventIndex;
				--eventCount;
			}
		}
	}

	UpdateUI() {

	}

	TriggerEvent() {
		if (this.eventCooldown > 0) {
			return;
		}
		if (Math.random() > 0.2) {
			this.eventCooldown = Math.floor(100 + Math.random() * 100);
			return;
		}
		const eventType = this.eventTypeList[Math.floor(Math.random() * this.eventTypeList.length)];
		eventType.EventEffect(this, true);
		this.eventCooldown = Math.floor(eventType.cooldownBase + Math.random() * eventType.cooldownRandom);
		this.game.ApplyNotification(eventType.title, eventType.content, 3000);
	}

	FireEvent(eventID, hasAppend) {
		const eventType = this.eventTypeContainer[eventID];
		eventType.EventEffect(this, hasAppend);
		if (hasAppend) {
			this.game.ApplyNotification(eventType.title, eventType.content, 3000);
		}
	}
}