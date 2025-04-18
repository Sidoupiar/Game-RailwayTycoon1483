class StationManager {
	constructor(game) {
		this.game = game;
		this.stationDistanceBase = 720;
		this.stationDistanceRandom = 1080;
		this.stationCargoBase = 3;
		this.stationCargoRandom = 10;
		this.stationPriceMultiplierBase = 0.8
		this.stationPriceMultiplierRandom = 0.4
		this.stationAmountBase = 10
		this.stationAmountRandom = 20
		this.stationNamePrefixList = ['橡', '翡', '钢', '水', '钻', '珍', '玛', '琥', '珊', '象', '黄', '银', '红', '蓝', '黑', '白', '绿', '紫', '青'];
		this.stationNameMedfixList = ['', '翠', '铁', '金', '木', '矿', '晶', '石', '宝', '桦', '松', '铜', '珠', '瑙', '珀', '瑚', '牙'];
		this.stationNameSuffixList = ['城', '堡', '谷', '镇', '山', '湾', '港', '林', '村', '场'];
	}

	Init() {
		this.stationDataCurrent = this.GenerateStation();
		this.stationDataNext = this.GenerateStation();
	}

	LoadGame(gameData) {
		const stationData = gameData.stationData || {};
		this.stationDataCurrent = stationData.stationDataCurrent || this.GenerateStation();
		this.stationDataNext = stationData.stationDataNext || this.GenerateStation();
	}

	SaveGame(gameData) {
		gameData.stationData = {
			stationDataCurrent: this.stationDataCurrent,
			stationDataNext: this.stationDataNext,
		};
	}

	Update(deltaTime) {

	}

	UpdateUI(canvasElementContext) {

	}

	DrawStation(canvasElementContext, trainLocationBase, distanceToStationCurrent) {
		this.game.terrainManager.DrawTerrain(canvasElementContext, trainLocationBase, distanceToStationCurrent, this.stationDataNext.terrain);
		// 绘制当前车站外观
		if (this.stationDataCurrent) {
			const stationStructureCurrent = this.stationDataCurrent.structure;
			const stationLocationCurrent = this.game.MakeLocationData(trainLocationBase.x + distanceToStationCurrent, trainLocationBase.y);
			this.game.DrawStructure(canvasElementContext, stationLocationCurrent, stationStructureCurrent.structureBase);
		}
		// 绘制下一个车站外观
		if (this.stationDataNext) {
			const stationStructureNext = this.stationDataNext.structure;
			const stationLocationNext = this.game.MakeLocationData(trainLocationBase.x + distanceToStationCurrent + this.stationDataNext.distance, trainLocationBase.y);
			this.game.DrawStructure(canvasElementContext, stationLocationNext, stationStructureNext.structureBase);
		}
	}

	GenerateStation() {
		const stationName = this.stationNamePrefixList[Math.floor(Math.random() * this.stationNamePrefixList.length)]
			+ this.stationNameMedfixList[Math.floor(Math.random() * this.stationNameMedfixList.length)]
			+ this.stationNameSuffixList[Math.floor(Math.random() * this.stationNameSuffixList.length)];
		const cargoList = this.game.cargoManager.GenerateStationCargo(1, this.stationCargoBase, this.stationCargoRandom, this.stationPriceMultiplierBase, this.stationPriceMultiplierRandom, this.stationAmountBase, this.stationAmountRandom);
		const stationWidth = 100 + Math.random() * 100;
		const stationHeight = 30 + Math.random() * 80;
		const stationColor = this.game.MakeColorData(10 + Math.random() * 120, 10 + Math.random() * 120, 10 + Math.random() * 120, 255);
		const stationData = {
			stationName: stationName,
			priceBuyMultiplier: 1.0,
			priceSellMultiplier: 1.0,
			cargoList: cargoList,
			distance: Math.floor(this.stationDistanceBase + Math.random() * this.stationDistanceRandom),
			terrain: this.game.terrainManager.GenerateStationTerrain(),
			structure: {
				structureBase: this.game.MakeStructureData(-stationWidth / 2, 0, stationWidth, stationHeight, stationColor),
			},
		};
		this.RecalculateWeatherEffect(stationData);
		return stationData;
	}

	ApplyWeatherEffect() {
		this.RecalculateWeatherEffect(this.stationDataCurrent);
		this.RecalculateWeatherEffect(this.stationDataNext);
	}

	RecalculateWeatherEffect(stationData) {
		if (stationData) {
			const priceMultiplierWeather = this.game.weatherManager.GetWeatherEffectList().priceMultiplier;
			for (const cargoData of stationData.cargoList) {
				cargoData.priceBuyCurrent = Math.max(Math.floor(cargoData.priceBuyBase * stationData.priceBuyMultiplier * priceMultiplierWeather), 1);
				cargoData.priceSellCurrent = Math.max(Math.floor(cargoData.priceSellBase * stationData.priceSellMultiplier * priceMultiplierWeather), 1);
			}
		}
	}

	ChangeCurrentStationPriceBuy(priceMultiplier) {
		if (this.stationDataCurrent) {
			this.stationDataCurrent.priceBuyMultiplier = priceMultiplier;
			this.RecalculateWeatherEffect(this.stationDataCurrent);
		}
	}

	CurrentStationAppendCargo(rarityLevelMin) {
		if (this.stationDataCurrent) {
			const cargoList = this.game.cargoManager.GenerateStationCargo(rarityLevelMin, 1, 4, this.stationPriceMultiplierBase, this.stationPriceMultiplierRandom, this.stationAmountBase, this.stationAmountRandom);
			for (const cargoData of cargoList) {
				let setFlag = false;
				for (const cargoDataCurrent of this.stationDataCurrent.cargoList) {
					if (cargoData.cargoID === cargoDataCurrent.cargoID) {
						setFlag = true;
						cargoDataCurrent.isRare = true;
						cargoDataCurrent.priceBuyBase *= 1.5;
						cargoDataCurrent.priceSellBase *= 1.5;
						cargoDataCurrent.amount += cargoData.amount;
						cargoDataCurrent.amountMax += cargoData.amountMax;
					}
				}
				if (!setFlag) {
					cargoData.isRare = true;
					cargoData.priceBuyBase *= 1.5;
					cargoData.priceSellBase *= 1.5;
					this.stationDataCurrent.cargoList.push(cargoData);
				}
			}
			this.RecalculateWeatherEffect(this.stationDataCurrent);
		}
	}

	GetCurrentStationCargoList() {
		if (this.stationDataCurrent) {
			return this.stationDataCurrent.cargoList;
		} else {
			return [];
		}
	}

	GetNextStationDistance() {
		if (this.stationDataNext) {
			return this.stationDataNext.distance;
		} else {
			return 100.0;
		}
	}

	GetSwitchStationDistance(trainLocationBase) {
		if (this.stationDataCurrent) {
			return -trainLocationBase.x - this.game.GetStructureDataWidth(this.stationDataCurrent.structure.structureBase);
		} else {
			return -trainLocationBase.x;
		}
	}

	SwitchStation() {
		this.stationDataCurrent = this.stationDataNext;
		this.stationDataNext = this.GenerateStation();
	}
}