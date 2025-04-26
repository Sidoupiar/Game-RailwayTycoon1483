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
				weight: 125,
				basePrice: 35,
				rarity: 'common',
				unlocked: true,
				isEmpty: false,
				WeatherEffect: null,
			},
			{
				id: 'coal',
				name: '煤炭',
				icon: '⛏️',
				weight: 125,
				basePrice: 40,
				rarity: 'common',
				unlocked: true,
				isEmpty: false,
				WeatherEffect: weatherEffect_SnowHigh,
			},
			{
				id: 'wood',
				name: '木材',
				icon: '🪵',
				weight: 96,
				basePrice: 50,
				rarity: 'common',
				unlocked: true,
				isEmpty: false,
				WeatherEffect: weatherEffect_FogHigh,
			},
			{
				id: 'steel',
				name: '钢铁',
				icon: '🏗️',
				weight: 195,
				basePrice: 80,
				rarity: 'common',
				unlocked: true,
				isEmpty: false,
				WeatherEffect: weatherEffect_SnowHigh,
			},
			{
				id: 'food',
				name: '粮食',
				icon: '🌾',
				weight: 45,
				basePrice: 86,
				rarity: 'common',
				unlocked: true,
				isEmpty: false,
				WeatherEffect: weatherEffect_RainLow,
			},
			{
				id: 'cotton',
				name: '棉花',
				icon: '🧶',
				weight: 24,
				basePrice: 45,
				rarity: 'common',
				unlocked: true,
				isEmpty: false,
				WeatherEffect: weatherEffect_RainLow,
			},
			{
				id: 'petroleum',
				name: '石油',
				icon: '🛢️',
				weight: 140,
				basePrice: 90,
				rarity: 'common',
				unlocked: true,
				isEmpty: false,
				WeatherEffect: weatherEffect_RainHigh,
			},
			{
				id: 'building_material',
				name: '建筑材料',
				icon: '🏯',
				weight: 99,
				basePrice: 60,
				rarity: 'common',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: null,
			},
			{
				id: 'food_raw_material',
				name: '食品原料',
				icon: '🥫',
				weight: 56,
				basePrice: 35,
				rarity: 'common',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_FogHigh,
			},
			{
				id: 'textile',
				name: '纺织品',
				icon: '👕',
				weight: 33,
				basePrice: 55,
				rarity: 'common',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_FogLow,
			},
			{
				id: 'furniture',
				name: '家具',
				icon: '🪑',
				weight: 62,
				basePrice: 100,
				rarity: 'advance',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: null,
			},
			{
				id: 'mechanical_part',
				name: '机械零件',
				icon: '⚙️',
				weight: 170,
				basePrice: 120,
				rarity: 'advance',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_SnowLow,
			},
			{
				id: 'electronic_product',
				name: '电子产品',
				icon: '💻',
				weight: 70,
				basePrice: 150,
				rarity: 'advance',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_SnowLow,
			},
			{
				id: 'chemical_raw_material',
				name: '化工原料',
				icon: '🧪',
				weight: 80,
				basePrice: 180,
				rarity: 'advance',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_RainHigh,
			},
			{
				id: 'coffee',
				name: '咖啡',
				icon: '☕',
				weight: 60,
				basePrice: 190,
				rarity: 'advance',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: null,
			},
			{
				id: 'cocoa',
				name: '可可',
				icon: '🍫',
				weight: 60,
				basePrice: 205,
				rarity: 'advance',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_SnowLow,
			},
			{
				id: 'medicine',
				name: '药品',
				icon: '💊',
				weight: 20,
				basePrice: 220,
				rarity: 'rare',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: null,
			},
			{
				id: 'wine',
				name: '酒',
				icon: '🍷',
				weight: 65,
				basePrice: 260,
				rarity: 'rare',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_SnowHigh,
			},
			{
				id: 'tobacco',
				name: '烟草',
				icon: '🚬',
				weight: 30,
				basePrice: 290,
				rarity: 'rare',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_FogLow,
			},
			{
				id: 'luxury',
				name: '奢侈品',
				icon: '💄',
				weight: 8,
				basePrice: 300,
				rarity: 'rare',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: null,
			},
			{
				id: 'high_technology_equipment',
				name: '高科技设备',
				icon: '📱',
				weight: 80,
				basePrice: 600,
				rarity: 'rare',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: null,
			},
			{
				id: 'vehicle_part',
				name: '汽车零件',
				icon: '🔩',
				weight: 180,
				basePrice: 250,
				rarity: 'rare',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_FogLow,
			},
			{
				id: 'gold',
				name: '黄金',
				icon: '🧈',
				weight: 260,
				basePrice: 500,
				rarity: 'epic',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: null,
			},
			{
				id: 'diamond',
				name: '钻石',
				icon: '💎',
				weight: 50,
				basePrice: 800,
				rarity: 'epic',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: null,
			},
			{
				id: 'rare_metal',
				name: '稀有金属',
				icon: '🧰',
				weight: 220,
				basePrice: 700,
				rarity: 'epic',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: null,
			},
			{
				id: 'biological_sample',
				name: '生物样本',
				icon: '☣️',
				weight: 14,
				basePrice: 900,
				rarity: 'epic',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_FogLow,
			},
			{
				id: 'spices',
				name: '香料',
				icon: '🌶️',
				weight: 18,
				basePrice: 920,
				rarity: 'epic',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_RainLow,
			},
			{
				id: 'tea',
				name: '茶叶',
				icon: '🍵',
				weight: 9,
				basePrice: 970,
				rarity: 'epic',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_RainHigh,
			},
			{
				id: 'artwork',
				name: '艺术品',
				icon: '🖼️',
				weight: 6,
				basePrice: 1000,
				rarity: 'legendary',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_FogHigh,
			},
			{
				id: 'antique',
				name: '古董',
				icon: '📜',
				weight: 18,
				basePrice: 1500,
				rarity: 'legendary',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_FogHigh,
			},
			{
				id: 'aerospace_material',
				name: '航天材料',
				icon: '📡',
				weight: 240,
				basePrice: 1200,
				rarity: 'legendary',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: null,
			},
			{
				id: 'nuclear_material',
				name: '核材料',
				icon: '☢️',
				weight: 300,
				basePrice: 2000,
				rarity: 'legendary',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: null,
			},
			{
				id: 'confidential_document',
				name: '机密文件',
				icon: '🗄️',
				weight: 5,
				basePrice: 1800,
				rarity: 'legendary',
				unlocked: false,
				isEmpty: false,
				WeatherEffect: weatherEffect_FogLow,
			},
		];
		this.cargoTypeContainer = this.game.MakeTypeContainer(this.cargoTypeList);
	}

	Init() {

	}

	FinalInit() {

	}

	LoadGame(gameData) {
		const cargoData = gameData.cargoData || {};
	}

	SaveGame(gameData) {
		gameData.cargoData = {};
	}

	Update(deltaTime) {

	}

	UpdateUI() {

	}

	GetCargoType(cargoID) {
		const cargoType = this.cargoTypeContainer[cargoID];
		if (cargoType) {
			return cargoType;
		} else {
			return {
				isEmpty: true,
			};
		}
	}

	GenerateStationCargo(rarityLevelMin, countBase, countRandom, countEmptyBase, countEmptyRandom, priceMultiplierBase, priceMultiplierRandom, amountBase, amountRandom) {
		const availableCargoList = [];
		if (rarityLevelMin > this.game.rarityManager.GetMaxRarityLevel()) {
			return availableCargoList;
		}
		const cargoCount = Math.floor(countBase + Math.random() * countRandom);
		const cargoEmptyCount = Math.floor(countEmptyBase + Math.random() * countEmptyRandom);
		let generateCargoTryCountTotal = 0;
		for (let index = 0, maxCount = cargoCount + cargoEmptyCount; index < maxCount; ++index) {
			const cargoType = this.cargoTypeList[Math.floor(Math.random() * this.cargoTypeList.length)];
			// 判断货物的稀有度等级
			if (rarityLevelMin > this.game.rarityManager.GetRarityLevel(cargoType.rarity)) {
				--index;
				++generateCargoTryCountTotal;
				if (generateCargoTryCountTotal > this.generateCargoTryCountMax) {
					break;
				} else {
					continue;
				}
			}
			// 去除重复的货物
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
			// 生成货物数据
			generateCargoTryCountTotal = 0;
			const priceMultiplier = this.CalculatePriceMultiplier(cargoType.id, priceMultiplierBase, priceMultiplierRandom);
			const priceBase = Math.floor(cargoType.basePrice * priceMultiplier * (0.9 + Math.random() * 0.5));
			let amount = Math.floor(amountBase + Math.random() * amountRandom);
			let amountMax;
			if (index < cargoCount) {
				amountMax = Math.max(amount, Math.floor(amountBase + Math.random() * amountRandom) + 2);
			} else {
				amountMax = Math.abs(amount - Math.floor(amountBase + Math.random() * amountRandom)) + 2;
				amount = 0;
			}
			availableCargoList.push({
				cargoID: cargoType.id,
				isRare: false,
				priceBuyBase: priceBase,
				priceSellBase: Math.floor(Math.min(priceBase * 0.95, cargoType.basePrice * priceMultiplier * (0.7 + Math.random() * 0.5))),
				amount: amount,
				amountMax: amountMax,
			});
		}
		this.SortCargo(availableCargoList);
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

	SortCargo(cargoList) {
		if (cargoList) {
			cargoList.sort((elementA, elementB) => {
				if (elementA.index == elementB.index) {
					return 0;
				} else if (elementA.index > elementB.index) {
					return 1;
				} else {
					return -1;
				}
			});
		}
	}
}