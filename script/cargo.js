class CargoManager {
	constructor(game) {
		this.game = game;
		this.generateCargoTryCountMax = 20;
		const weatherEffect_RainLow = function (weatherID, priceMultiplier) {
			if (weatherID === 'rain') {
				return priceMultiplier * 0.8;
			} else {
				return priceMultiplier;
			}
		}
		const weatherEffect_RainHigh = function (weatherID, priceMultiplier) {
			if (weatherID === 'rain') {
				return priceMultiplier * 1.3;
			} else {
				return priceMultiplier;
			}
		}
		const weatherEffect_SnowLow = function (weatherID, priceMultiplier) {
			if (weatherID === 'rain') {
				return priceMultiplier * 0.7;
			} else {
				return priceMultiplier;
			}
		}
		const weatherEffect_SnowHigh = function (weatherID, priceMultiplier) {
			if (weatherID === 'rain') {
				return priceMultiplier * 1.4;
			} else {
				return priceMultiplier;
			}
		}
		const weatherEffect_FogLow = function (weatherID, priceMultiplier) {
			if (weatherID === 'rain') {
				return priceMultiplier * 0.5;
			} else {
				return priceMultiplier;
			}
		}
		const weatherEffect_FogHigh = function (weatherID, priceMultiplier) {
			if (weatherID === 'rain') {
				return priceMultiplier * 1.6;
			} else {
				return priceMultiplier;
			}
		}
		this.cargoTypeList = [
			{
				id: 'stone',
				name: '石头',
				icon: '🪨',
				basePrice: 35,
				rarity: 'common',
				unlocked: true,
				WeatherEffect: null,
			},
			{
				id: 'coal',
				name: '煤炭',
				icon: '⛏️',
				basePrice: 40,
				rarity: 'common',
				unlocked: true,
				WeatherEffect: weatherEffect_SnowHigh,
			},
			{
				id: 'wood',
				name: '木材',
				icon: '🪵',
				basePrice: 50,
				rarity: 'common',
				unlocked: true,
				WeatherEffect: weatherEffect_FogHigh,
			},
			{
				id: 'steel',
				name: '钢铁',
				icon: '🏗️',
				basePrice: 80,
				rarity: 'common',
				unlocked: true,
				WeatherEffect: weatherEffect_SnowHigh,
			},
			{
				id: 'food',
				name: '粮食',
				icon: '🌾',
				basePrice: 86,
				rarity: 'common',
				unlocked: true,
				WeatherEffect: weatherEffect_RainLow,
			},
			{
				id: 'cotton',
				name: '棉花',
				icon: '🧶',
				basePrice: 45,
				rarity: 'common',
				unlocked: true,
				WeatherEffect: weatherEffect_RainLow,
			},
			{
				id: 'petroleum',
				name: '石油',
				icon: '🛢️',
				basePrice: 90,
				rarity: 'common',
				unlocked: true,
				WeatherEffect: weatherEffect_RainHigh,
			},
			{
				id: 'building_material',
				name: '建筑材料',
				icon: '🏯',
				basePrice: 60,
				rarity: 'common',
				unlocked: false,
				WeatherEffect: null,
			},
			{
				id: 'food_raw_material',
				name: '食品原料',
				icon: '🥫',
				basePrice: 35,
				rarity: 'common',
				unlocked: false,
				WeatherEffect: weatherEffect_FogHigh,
			},
			{
				id: 'textile',
				name: '纺织品',
				icon: '👕',
				basePrice: 55,
				rarity: 'common',
				unlocked: false,
				WeatherEffect: weatherEffect_FogLow,
			},
			{
				id: 'furniture',
				name: '家具',
				icon: '🪑',
				basePrice: 100,
				rarity: 'advance',
				unlocked: false,
				WeatherEffect: null,
			},
			{
				id: 'mechanical_part',
				name: '机械零件',
				icon: '⚙️',
				basePrice: 120,
				rarity: 'advance',
				unlocked: false,
				WeatherEffect: weatherEffect_SnowLow,
			},
			{
				id: 'electronic_product',
				name: '电子产品',
				icon: '💻',
				basePrice: 150,
				rarity: 'advance',
				unlocked: false,
				WeatherEffect: weatherEffect_SnowLow,
			},
			{
				id: 'chemical_raw_material',
				name: '化工原料',
				icon: '🧪',
				basePrice: 180,
				rarity: 'advance',
				unlocked: false,
				WeatherEffect: weatherEffect_RainHigh,
			},
			{
				id: 'coffee',
				name: '咖啡',
				icon: '☕',
				basePrice: 190,
				rarity: 'advance',
				unlocked: false,
			},
			{
				id: 'cocoa',
				name: '可可',
				icon: '🍫',
				basePrice: 205,
				rarity: 'advance',
				unlocked: false,
				WeatherEffect: weatherEffect_SnowLow,
			},
			{
				id: 'medicine',
				name: '药品',
				icon: '💊',
				basePrice: 220,
				rarity: 'rare',
				unlocked: false,
				WeatherEffect: null,
			},
			{
				id: 'wine',
				name: '酒',
				icon: '🍷',
				basePrice: 260,
				rarity: 'rare',
				unlocked: false,
				WeatherEffect: weatherEffect_SnowHigh,
			},
			{
				id: 'tobacco',
				name: '烟草',
				icon: '🚬',
				basePrice: 290,
				rarity: 'rare',
				unlocked: false,
				WeatherEffect: weatherEffect_FogLow,
			},
			{
				id: 'luxury',
				name: '奢侈品',
				icon: '💄',
				basePrice: 300,
				rarity: 'rare',
				unlocked: false,
				WeatherEffect: null,
			},
			{
				id: 'high_technology_equipment',
				name: '高科技设备',
				icon: '📱',
				basePrice: 600,
				rarity: 'rare',
				unlocked: false,
				WeatherEffect: null,
			},
			{
				id: 'vehicle_part',
				name: '汽车零件',
				icon: '🔩',
				basePrice: 250,
				rarity: 'rare',
				unlocked: false,
				WeatherEffect: weatherEffect_FogLow,
			},
			{
				id: 'gold',
				name: '黄金',
				icon: '🧈',
				basePrice: 500,
				rarity: 'epic',
				unlocked: false,
				WeatherEffect: null,
			},
			{
				id: 'diamond',
				name: '钻石',
				icon: '💎',
				basePrice: 800,
				rarity: 'epic',
				unlocked: false,
				WeatherEffect: null,
			},
			{
				id: 'rare_metal',
				name: '稀有金属',
				icon: '🧰',
				basePrice: 700,
				rarity: 'epic',
				unlocked: false,
				WeatherEffect: null,
			},
			{
				id: 'biological_sample',
				name: '生物样本',
				icon: '☣️',
				basePrice: 900,
				rarity: 'epic',
				unlocked: false,
				WeatherEffect: weatherEffect_FogLow,
			},
			{
				id: 'spices',
				name: '香料',
				icon: '🌶️',
				basePrice: 920,
				rarity: 'epic',
				unlocked: false,
				WeatherEffect: weatherEffect_RainLow,
			},
			{
				id: 'tea',
				name: '茶叶',
				icon: '🍵',
				basePrice: 970,
				rarity: 'epic',
				unlocked: false,
				WeatherEffect: weatherEffect_RainHigh,
			},
			{
				id: 'artwork',
				name: '艺术品',
				icon: '🖼️',
				basePrice: 1000,
				rarity: 'legendary',
				unlocked: false,
				WeatherEffect: weatherEffect_FogHigh,
			},
			{
				id: 'antique',
				name: '古董',
				icon: '📜',
				basePrice: 1500,
				rarity: 'legendary',
				unlocked: false,
				WeatherEffect: weatherEffect_FogHigh,
			},
			{
				id: 'aerospace_material',
				name: '航天材料',
				icon: '📡',
				basePrice: 1200,
				rarity: 'legendary',
				unlocked: false,
				WeatherEffect: null,
			},
			{
				id: 'nuclear_material',
				name: '核材料',
				icon: '☢️',
				basePrice: 2000,
				rarity: 'legendary',
				unlocked: false,
				WeatherEffect: null,
			},
			{
				id: 'confidential_document',
				name: '机密文件',
				icon: '🗄️',
				basePrice: 1800,
				rarity: 'legendary',
				unlocked: false,
				WeatherEffect: weatherEffect_FogLow,
			},
		];
		this.cargoTypeContainer = this.game.MakeTypeContainer(this.cargoTypeList);
	}

	Init() {

	}

	LoadGame(gameData) {
		const cargoData = gameData.cargoData || {};
	}

	SaveGame(gameData) {
		gameData.cargoData = {};
	}

	Update(deltaTime) {

	}

	UpdateUI(canvasElementContext) {

	}

	GetCargoType(cargoID) {
		const cargoType = this.cargoTypeContainer[cargoID];
		if (cargoType) {
			return cargoType;
		} else {
			return {};
		}
	}

	GenerateStationCargo(rarityLevelMin, countBase, countRandom, priceMultiplierBase, priceMultiplierRandom, amountBase, amountRandom) {
		const availableCargoList = [];
		if (rarityLevelMin > this.game.rarityManager.GetMaxRarityLevel()) {
			return availableCargoList;
		}
		const cargoCount = Math.floor(countBase + Math.random() * countRandom);
		let generateCargoTryCountTotal = 0;
		for (let index = 0; index < cargoCount; ++index) {
			const cargoType = this.cargoTypeList[Math.floor(Math.random() * this.cargoTypeList.length)];
			// 判断稀有度等级
			if (rarityLevelMin > this.game.rarityManager.GetRarityLevel(cargoType.rarity)) {
				--index;
				++generateCargoTryCountTotal;
				if (generateCargoTryCountTotal > this.generateCargoTryCountMax) {
					break;
				} else {
					continue;
				}
			}
			// 去除重复货物
			let cargoSameFlag = false;
			for (const stationCargoData of availableCargoList) {
				if (cargoType.id === stationCargoData.cargoID) {
					cargoSameFlag = true;
					break;
				}
			}
			if (cargoSameFlag) {
				--index;
				++generateCargoTryCountTotal;
				if (generateCargoTryCountTotal > this.generateCargoTryCountMax) {
					break;
				} else {
					continue;
				}
			}
			const priceMultiplier = this.CalculatePriceMultiplier(cargoType.id, priceMultiplierBase, priceMultiplierRandom);
			const priceBase = Math.floor(cargoType.basePrice * priceMultiplier * (0.9 + Math.random() * 0.5));
			const amount = Math.floor(amountBase + Math.random() * amountRandom);
			availableCargoList.push({
				cargoID: cargoType.id,
				isRare: false,
				priceBuyBase: priceBase,
				priceSellBase: Math.floor(Math.min(priceBase * 0.95, cargoType.basePrice * priceMultiplier * (0.7 + Math.random() * 0.5))),
				amount: amount,
				amountMax: Math.max(amount, Math.floor(amountBase + Math.random() * amountRandom) + 2),
			});
		}
		return availableCargoList;
	}

	CalculatePriceMultiplier(cargoID, priceMultiplierBase, priceMultiplierRandom) {
		const cargoType = this.cargoTypeContainer[cargoID];
		let multiplier = priceMultiplierBase + Math.random() * priceMultiplierRandom;
		// 天气影响
		if (cargoType.WeatherEffect) {
			multiplier = cargoType.WeatherEffect(this.game.weatherManager.GetWeatherID(), multiplier)
		}
		// 稀有度带来的价格影响
		this.game.rarityManager.CalculatePriceMultiplier(cargoType.rarity, multiplier);
		return multiplier;
	}
}