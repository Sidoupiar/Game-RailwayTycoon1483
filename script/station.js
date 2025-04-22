class StationManager {
	constructor(game) {
		this.game = game;
		this.stationDistanceBase = 780;
		this.stationDistanceRandom = 1280;
		this.stationCargoBase = 3;
		this.stationCargoRandom = 10;
		this.stationPriceMultiplierBase = 0.8
		this.stationPriceMultiplierRandom = 0.4
		this.stationAmountBase = 10
		this.stationAmountRandom = 20
		this.stationNamePrefixList = ['', '钢', '橡', '马', '狼', '盐', '翡', '珍', '玛', '琥', '珊', '黑', '白', '金', '银', '灰', '红', '橙', '黄', '绿', '蓝', '紫', '青', '苍', '新', '旧', '水', '冰', '石', '晶', '钻', '东', '西', '南', '北', '中', '大', '小', '老', '陈', '三'];
		this.stationNameMedfixList = ['', '江', '河', '湖', '海', '川', '林', '田', '道', '桥', '山', '玉', '晶', '瑙', '珀', '瑚', '沙', '石', '珠', '宝', '冠', '翠', '芽', '松', '桦', '木', '霜', '花', '枝', '景', '观', '金', '银', '铁', '铜', '锡', '钢', '刺', '耀', '云', '端'];
		this.stationNameSuffixList = ['城', '堡', '场', '港', '驿', '村', '庄', '镇', '市', '关', '店', '口', '站', '头', '所', '谷', '山', '湾', '林', '滩', '中心', '基地', '枢纽', '机关', '地区'];
	}

	Init() {
		this.stationDataCurrent = this.GenerateStation();
		this.stationDataNext = this.GenerateStation();
	}

	FinalInit() {

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

	UpdateUI() {

	}

	DrawStation(trainLocationBase, distanceToStationCurrent, trainMoveDistance) {
		this.game.terrainManager.DrawTerrain(trainMoveDistance, this.stationDataNext.terrain);
		// 绘制当前车站外观
		if (this.stationDataCurrent) {
			const stationStructureCurrent = this.stationDataCurrent.structure;
			const stationLocationCurrent = this.game.structureManager.MakeLocationData(trainLocationBase.x + distanceToStationCurrent, trainLocationBase.y);
			this.game.structureManager.DrawStructure(stationLocationCurrent, stationStructureCurrent.structureBase);
			this.game.structureManager.DrawText(this.stationDataCurrent.stationName, stationLocationCurrent, this.game.structureManager.GetStructureDataHeight(stationStructureCurrent.structureBase) + 10);
		}
		// 绘制下一个车站外观
		if (this.stationDataNext) {
			const stationStructureNext = this.stationDataNext.structure;
			const stationLocationNext = this.game.structureManager.MakeLocationData(trainLocationBase.x + distanceToStationCurrent + this.stationDataNext.distance, trainLocationBase.y);
			this.game.structureManager.DrawStructure(stationLocationNext, stationStructureNext.structureBase);
			this.game.structureManager.DrawText(this.stationDataNext.stationName, stationLocationNext, this.game.structureManager.GetStructureDataHeight(stationStructureNext.structureBase) + 10);
		}
	}

	GenerateStation() {
		let stationName = this.stationNamePrefixList[Math.floor(Math.random() * this.stationNamePrefixList.length)]
			+ this.stationNameMedfixList[Math.floor(Math.random() * this.stationNameMedfixList.length)];
		while (stationName === '') {
			stationName = this.stationNamePrefixList[Math.floor(Math.random() * this.stationNamePrefixList.length)]
				+ this.stationNameMedfixList[Math.floor(Math.random() * this.stationNameMedfixList.length)];
		}
		stationName += this.stationNameSuffixList[Math.floor(Math.random() * this.stationNameSuffixList.length)];
		const cargoList = this.game.cargoManager.GenerateStationCargo(1, this.stationCargoBase, this.stationCargoRandom, this.stationPriceMultiplierBase, this.stationPriceMultiplierRandom, this.stationAmountBase, this.stationAmountRandom);
		const stationWidth = 100 + Math.random() * 100;
		const stationHeight = 30 + Math.random() * 80;
		const stationColor = this.game.structureManager.MakeColorData(10 + Math.random() * 120, 10 + Math.random() * 120, 10 + Math.random() * 120, 255);
		const stationData = {
			stationName: stationName,
			priceBuyMultiplier: 1.0,
			priceSellMultiplier: 1.0,
			cargoList: cargoList,
			distance: Math.floor(this.stationDistanceBase + Math.random() * this.stationDistanceRandom),
			terrain: this.game.terrainManager.GenerateStationTerrain(),
			structure: {
				structureBase: this.game.structureManager.MakeStructureData(-stationWidth / 2, 3, stationWidth, stationHeight, stationColor),
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

	GetCurrentStationName() {
		if (this.stationDataCurrent) {
			return this.stationDataCurrent.stationName;
		} else {
			return '未知站点';
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
			return 500.0;
		}
	}

	GetNextStationTerrainData() {
		if (this.stationDataCurrent) {
			return this.stationDataNext.terrain;
		} else {
			return {};
		}
	}

	GetSwitchStationDistance(trainLocationBase) {
		if (this.stationDataCurrent) {
			return -trainLocationBase.x - this.game.structureManager.GetStructureDataWidth(this.stationDataCurrent.structure.structureBase);
		} else {
			return -trainLocationBase.x;
		}
	}

	SwitchStation() {
		this.stationDataCurrent = this.stationDataNext;
		this.stationDataNext = this.GenerateStation();
	}
}