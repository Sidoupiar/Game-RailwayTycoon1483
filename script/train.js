class TrainManager {
	constructor(game) {
		this.game = game;
		this.startUpStationDistance = 600.0;
		this.trainUpgradeTypeContainer = {
			speed: {
				name: '速度 +10%',
				costBase: 500,
				costLevel: 100,
				GetCurrentCost: function (trainManager) {
					return 500 + trainManager.trainSpeedLevel * 100;
				},
				GetCurrentLevel: function (trainManager) {
					return trainManager.trainSpeedLevel
				},
				TrainEffect: function (trainManager) {
					++trainManager.trainSpeedLevel;
					trainManager.trainSpeedBase += 0.1;
					trainManager.ApplyWeatherEffect();
				},
			},
			cargo: {
				name: '载货量 +50',
				costBase: 800,
				costLevel: 200,
				GetCurrentCost: function (trainManager) {
					return 800 + trainManager.trainCargoLevel * 200;
				},
				GetCurrentLevel: function (trainManager) {
					return trainManager.trainCargoLevel
				},
				TrainEffect: function (trainManager) {
					++trainManager.trainCargoLevel;
					trainManager.trainCargoWeightCapacity += 50;
					trainManager.needUpdateUICargo = true;
				},
			},
			visual: {
				name: '外观更新',
				costBase: 1200,
				costLevel: 300,
				GetCurrentCost: function (trainManager) {
					return 1200 + trainManager.trainVisualLevel * 300;
				},
				GetCurrentLevel: function (trainManager) {
					return trainManager.trainVisualLevel
				},
				TrainEffect: function (trainManager) {
					++trainManager.trainVisualLevel;
					const trainStyleType = trainManager.trainStyleTypeList[trainManager.trainVisualLevel % 3];
					trainManager.trainStyleTypeID = trainStyleType.id;
				}
			}
		}
		this.trainLocationBase = this.game.structureManager.MakeLocationData(180, 210);
		this.roadStructureBase = this.game.structureManager.MakeStructureData(-180, 8, this.game.structureManager.GetScreenWidth(), 5, this.game.structureManager.MakeColorData(10, 10, 10, 255));
		this.trainStyleTypeList = [
			{
				id: 'normal',
				name: '普通',
				structureBase: this.game.structureManager.ModifyStructureData_AddSubStructureDataList(
					this.game.structureManager.ModifyStructureData_RepeatCount(
						this.game.structureManager.MakeStructureData(-45, 0, 90, 26, this.game.structureManager.MakeColorData(170, 120, 0, 255)),
						3, 93, -1
					),
					[
						this.game.structureManager.ModifyStructureData_RepeatCount(
							this.game.structureManager.MakeStructureData(14, -15, 5, 5, this.game.structureManager.MakeColorData(0, 120, 220, 255)),
							4, 19, 1
						),
						this.game.structureManager.ModifyStructureData_RepeatCount(
							this.game.structureManager.MakeStructureData(10, 2, 4, 4, this.game.structureManager.MakeColorData(20, 20, 20, 255)),
							3, 6, 1
						),
						this.game.structureManager.ModifyStructureData_RepeatCount(
							this.game.structureManager.MakeStructureData(76, 2, 4, 4, this.game.structureManager.MakeColorData(20, 20, 20, 255)),
							3, 6, -1
						),
					]
				),
			},
			{
				id: 'advanced',
				name: '高级',
				structureBase: this.game.structureManager.ModifyStructureData_AddSubStructureDataList(
					this.game.structureManager.ModifyStructureData_RepeatCount(
						this.game.structureManager.MakeStructureData(-45, 0, 90, 26, this.game.structureManager.MakeColorData(120, 0, 170, 255)),
						3, 93, -1
					),
					[
						this.game.structureManager.ModifyStructureData_RepeatCount(
							this.game.structureManager.MakeStructureData(14, -15, 5, 5, this.game.structureManager.MakeColorData(0, 120, 220, 255)),
							4, 19, 1
						),
						this.game.structureManager.ModifyStructureData_RepeatCount(
							this.game.structureManager.MakeStructureData(10, 2, 4, 4, this.game.structureManager.MakeColorData(20, 20, 20, 255)),
							3, 6, 1
						),
						this.game.structureManager.ModifyStructureData_RepeatCount(
							this.game.structureManager.MakeStructureData(76, 2, 4, 4, this.game.structureManager.MakeColorData(20, 20, 20, 255)),
							3, 6, -1
						),
					]
				),
			},
			{
				id: 'rare',
				name: '稀有',
				structureBase: this.game.structureManager.ModifyStructureData_AddSubStructureDataList(
					this.game.structureManager.ModifyStructureData_RepeatCount(
						this.game.structureManager.MakeStructureData(-45, 0, 90, 26, this.game.structureManager.MakeColorData(0, 170, 120, 255)),
						3, 93, -1
					),
					[
						this.game.structureManager.ModifyStructureData_RepeatCount(
							this.game.structureManager.MakeStructureData(14, -15, 5, 5, this.game.structureManager.MakeColorData(0, 120, 220, 255)),
							4, 19, 1
						),
						this.game.structureManager.ModifyStructureData_RepeatCount(
							this.game.structureManager.MakeStructureData(10, 2, 4, 4, this.game.structureManager.MakeColorData(20, 20, 20, 255)),
							3, 6, 1
						),
						this.game.structureManager.ModifyStructureData_RepeatCount(
							this.game.structureManager.MakeStructureData(76, 2, 4, 4, this.game.structureManager.MakeColorData(20, 20, 20, 255)),
							3, 6, -1
						),
					]
				),
			},
		];
		this.trainStyleTypeContainer = this.game.MakeTypeContainer(this.trainStyleTypeList);
	}

	Init() {
		this.isMoving = false;
		this.isInStation = false;
		this.autoDrive = false;
		this.autoTrade = false;
		this.trainSpeedBase = 1.0;
		this.trainSpeedMultiplier = 1.0;
		this.trainSpeedCurrent = 1.0;
		this.trainCargoWeightCapacity = 500;
		this.trainCargoWeightCurrent = 0;
		this.trainCargoAmountCurrent = 0;
		this.trainSpeedLevel = 0;
		this.trainCargoLevel = 0;
		this.trainVisualLevel = 0;
		this.trainStyleTypeID = 'normal';
		this.maxCargoTypeCount = 25;
		this.arrivedStationAmount = 0;
		this.distanceToStationCurrentOld = this.startUpStationDistance;
		this.distanceToStationCurrent = this.startUpStationDistance;
		this.currentCargoList = [];
		this.unlockedCargoTypeList = {};
		this.trainMoveDistance = 0.0;
	}

	FinalInit() {
		this.needUpdateUIControl = true;
		this.needUpdateUIUpgrade = true;
		this.needUpdateUICargo = true;
		this.needUpdateUIStation = true;
	}

	LoadGame(gameData) {
		const trainData = gameData.trainData || {};
		this.isMoving = trainData.isMoving || false;
		this.isInStation = trainData.isInStation || false;
		this.autoDrive = trainData.autoDrive || false;
		this.autoTrade = trainData.autoTrade || false;
		this.trainSpeedBase = trainData.trainSpeedBase || 1.0;
		this.trainSpeedMultiplier = trainData.trainSpeedMultiplier || 1.0;
		this.trainSpeedCurrent = trainData.trainSpeedCurrent || 1.0;
		this.trainCargoWeightCapacity = trainData.trainCargoWeightCapacity || 500;
		this.trainCargoWeightCurrent = trainData.trainCargoWeightCurrent || 0;
		this.trainCargoAmountCurrent = trainData.trainCargoAmountCurrent || 0;
		this.trainSpeedLevel = trainData.trainSpeedLevel || 0;
		this.trainCargoLevel = trainData.trainCargoLevel || 0;
		this.trainVisualLevel = trainData.trainVisualLevel || 0;
		this.trainStyleTypeID = trainData.trainStyleTypeID || 'normal';
		this.maxCargoTypeCount = trainData.maxCargoTypeCount || 25;
		this.arrivedStationAmount = trainData.arrivedStationAmount || 0;
		this.distanceToStationCurrentOld = trainData.distanceToStationCurrentOld || this.startUpStationDistance;
		this.distanceToStationCurrent = trainData.distanceToStationCurrent || this.startUpStationDistance;
		this.currentCargoList = trainData.currentCargoList || [];
		this.unlockedCargoTypeList = trainData.unlockedCargoTypeList || {};
		this.trainMoveDistance = trainData.trainMoveDistance || 0.0;
	}

	SaveGame(gameData) {
		gameData.trainData = {
			isMoving: this.isMoving,
			isInStation: this.isInStation,
			autoDrive: this.autoDrive,
			autoTrade: this.autoTrade,
			trainSpeedBase: this.trainSpeedBase,
			trainSpeedMultiplier: this.trainSpeedMultiplier,
			trainSpeedCurrent: this.trainSpeedCurrent,
			trainCargoWeightCapacity: this.trainCargoWeightCapacity,
			trainCargoWeightCurrent: this.trainCargoWeightCurrent,
			trainCargoAmountCurrent: this.trainCargoAmountCurrent,
			trainSpeedLevel: this.trainSpeedLevel,
			trainCargoLevel: this.trainCargoLevel,
			trainVisualLevel: this.trainVisualLevel,
			trainStyleTypeID: this.trainStyleTypeID,
			maxCargoTypeCount: this.maxCargoTypeCount,
			arrivedStationAmount: this.arrivedStationAmount,
			distanceToStationCurrentOld: this.distanceToStationCurrentOld,
			distanceToStationCurrent: this.distanceToStationCurrent,
			currentCargoList: this.currentCargoList,
			unlockedCargoTypeList: this.unlockedCargoTypeList,
			trainMoveDistance: this.trainMoveDistance,
		};
	}

	Update(deltaTime) {
		if (this.isMoving) {
			this.distanceToStationCurrentOld = this.distanceToStationCurrent;
			if (this.distanceToStationCurrent > 0 && this.distanceToStationCurrent <= this.trainSpeedCurrent) {
				this.distanceToStationCurrent = 0;
				this.trainMoveDistance = Math.abs(this.distanceToStationCurrent);
			} else {
				this.distanceToStationCurrent -= this.trainSpeedCurrent;
				this.trainMoveDistance = this.trainSpeedCurrent;
			}
			if (this.distanceToStationCurrent == 0) {
				this.ArriveAtStation();
			}
			if (this.distanceToStationCurrent <= this.game.stationManager.GetSwitchStationDistance(this.trainLocationBase)) {
				this.SwitchStation();
			}
		} else {
			this.trainMoveDistance = 0.0;
			if (this.isInStation) {
				if (this.autoTrade) {
					this.PerformAutoTrade();
					if (this.autoDrive) {
						this.StartMoving();
					}
				}
			} else {
				if (this.autoDrive) {
					this.StartMoving();
				}
			}
		}
	}

	UpdateUI() {
		this.game.stationManager.DrawStation(this.trainLocationBase, this.distanceToStationCurrent, this.trainMoveDistance);
		// 绘制火车外观
		const trainStyleType = this.trainStyleTypeContainer[this.trainStyleTypeID];
		this.game.structureManager.DrawStructure(this.trainLocationBase, trainStyleType.structureBase);
		// 绘制路面外观
		this.game.structureManager.DrawStructure(this.trainLocationBase, this.roadStructureBase);
		// 更新控件
		if (this.needUpdateUIControl) {
			this.needUpdateUIControl = false;
			document.getElementById('autoDriveButton').className = `button-control px-2 py-1 rounded-lg flex items-center justify-center ${this.autoDrive ? 'bg-green-600' : 'bg-gray-600'}`;
			document.getElementById('autoTradeButton').className = `button-control px-2 py-1 rounded-lg flex items-center justify-center ${this.autoTrade ? 'bg-green-600' : 'bg-gray-600'}`;
		}
		if (this.needUpdateUIUpgrade) {
			this.needUpdateUIUpgrade = false;
			const upgradeListElement = document.getElementById('upgradeList');
			upgradeListElement.innerHTML = '';
			for (const trainUpgradeID in this.trainUpgradeTypeContainer) {
				const trainUpgradeType = this.trainUpgradeTypeContainer[trainUpgradeID];
				const trainManager = this;
				const trainUpgradeIDLeft = trainUpgradeID;
				this.game.MakeElement(upgradeListElement, 'div', 'train-upgrade-item bg-gray-700 px-2 py-1 rounded-lg cursor-pointer', `
					<p class="font-medium">
						${trainUpgradeType.name}
					</p>
					<p class="text-xs text-gray-400">当前等级：${trainUpgradeType.GetCurrentLevel(this)}</p>
					<p class="text-xs text-gray-400">下级价格：$${trainUpgradeType.GetCurrentCost(this)}</p>
				` ).addEventListener('click', () => {
					trainManager.TrainUpgrade(trainUpgradeIDLeft);
				});
			}
		}
		if (this.needUpdateUICargo) {
			this.needUpdateUICargo = false;
			document.getElementById('cargoTitle').innerHTML = `货舱
				&nbsp;
				<span class="text-xs text-gray-400">空间：${this.trainCargoWeightCurrent}&nbsp;/&nbsp;${this.trainCargoWeightCapacity}</span>
				&nbsp;
				<span class="text-xs text-gray-400">货物：${this.trainCargoAmountCurrent}</span>`;
			const cargoListElement = document.getElementById('cargoList');
			if (this.currentCargoList.length > 0) {
				cargoListElement.innerHTML = '';
				for (const cargoData of this.currentCargoList) {
					const cargoType = this.game.cargoManager.GetCargoType(cargoData.cargoID);
					this.game.MakeElement(cargoListElement, 'div', `cargo-item ${this.game.rarityManager.GetRarityLevel(cargoType.rarity) < 2 ? 'rare-item' : ''}`, `
						<div class="flex justify-between">
							<span>${cargoType.isEmpty ? "" : cargoType.icon}&nbsp;${cargoType.isEmpty ? "丢失的数据" : cargoType.name}</span>
							<span class="px-1 text-xs">购买价格：$${cargoData.priceBuy.toFixed(2)}</span>
						</div>
						<div class="px-1 text-xs text-gray-400">库存: ${cargoData.amount}</div>
					`);
				}
			} else {
				cargoListElement.innerHTML = '<p class="text-center px-2 py-1 text-gray-400">无任何货物</p>';
			}
		}
		if (this.needUpdateUIStation) {
			this.needUpdateUIStation = false;
			const stationCargoListElement = document.getElementById('stationCargoList');
			if (this.isInStation) {
				document.getElementById('stationTrade').innerHTML = `${this.game.stationManager.GetCurrentStationName()}（车站）的货物交易`;
				stationCargoListElement.innerHTML = '';
				const stationCargoList = this.game.stationManager.GetCurrentStationCargoList();
				if (stationCargoList.length > 0) {
					for (const stationCargoData of stationCargoList) {
						const trainManager = this;
						const cargoIDLeft = stationCargoData.cargoID;
						let currentPriceBuy = null;
						for (const cargoData of this.currentCargoList) {
							if (cargoData.cargoID === stationCargoData.cargoID) {
								currentPriceBuy = cargoData.priceBuy;
								break;
							}
						}
						const cargoType = this.game.cargoManager.GetCargoType(stationCargoData.cargoID);
						const stationCargoElement = this.game.MakeElement(stationCargoListElement, 'div', `cargo-item px-1 ${this.game.rarityManager.GetRarityLevel(cargoType.rarity) < 2 ? 'rare-item' : ''}`, '');
						const stationCargoElementControl = this.game.MakeElement(stationCargoElement, 'div', 'flex justify-between gap-3', '');
						this.game.MakeElement(stationCargoElement, 'div', 'text-xs text-gray-400', `库存: ${stationCargoData.amount}&nbsp;/&nbsp;${stationCargoData.amountMax}&nbsp;&nbsp;体积: ${cargoType.isEmpty ? "0" : cargoType.weight}`);
						this.game.MakeElement(stationCargoElementControl, 'span', 'px-2 py-1 w-60 max-w-60', `${cargoType.isEmpty ? "" : cargoType.icon}&nbsp;${cargoType.isEmpty ? "丢失的数据" : cargoType.name}`);
						this.game.MakeElement(stationCargoElementControl, 'span', 'train-upgrade-item bg-green-600 px-2 py-1 rounded-lg w-60 max-w-60 text-xs', `购买：$${stationCargoData.priceBuyCurrent.toFixed(2)}&nbsp;${currentPriceBuy === null || currentPriceBuy === stationCargoData.priceBuyCurrent ? '' : currentPriceBuy < stationCargoData.priceBuyCurrent ? '↑' : '↓'}`).addEventListener('click', () => {
							trainManager.ManualTradeCargoBuy(cargoIDLeft);
						});
						this.game.MakeElement(stationCargoElementControl, 'span', 'train-upgrade-item bg-green-600 px-2 py-1 rounded-lg w-60 max-w-60 text-xs', `出售：$${stationCargoData.priceSellCurrent.toFixed(2)}&nbsp;${currentPriceBuy === null || currentPriceBuy === stationCargoData.priceSellCurrent ? '' : currentPriceBuy < stationCargoData.priceSellCurrent ? '↓' : '↑'}`).addEventListener('click', () => {
							trainManager.ManualTradeCargoSell(cargoIDLeft);
						});
					}
				} else {
					stationCargoListElement.innerHTML = '<p class="text-center px-2 py-1 text-gray-400">此站点无任何货物</p>';
				}
			} else {
				document.getElementById('stationTrade').innerHTML = '货物交易';
				stationCargoListElement.innerHTML = '<p class="text-center px-2 py-1 text-gray-400">尚未到达站点</p>';
			}
		}
	}

	GetTrainUpgradeTypeList() {
		const trainUpgradeTypeList = [];
		for (const trainUpgradeID in this.trainUpgradeTypeContainer) {
			const trainUpgradeType = this.trainUpgradeTypeContainer[trainUpgradeID];
			trainUpgradeTypeList.push({
				id: trainUpgradeID,
				name: trainUpgradeType.name,
				cost: trainUpgradeType.GetCurrentCost(this),
			});
		}
		return trainUpgradeTypeList
	}

	TrainUpgrade(trainUpgradeID) {
		const trainUpgradeType = this.trainUpgradeTypeContainer[trainUpgradeID];
		if (trainUpgradeType) {
			const currentCost = trainUpgradeType.GetCurrentCost(this);
			if (this.game.money >= currentCost) {
				this.game.money -= currentCost;
				trainUpgradeType.TrainEffect(this);
				this.needUpdateUIUpgrade = true;
			}
		}
	}

	ChangeTrainSpeed(trainSpeedMultiplierAppend) {
		this.trainSpeedMultiplier *= trainSpeedMultiplierAppend;
		this.ApplyWeatherEffect();
	}

	ApplyWeatherEffect() {
		this.trainSpeedCurrent = this.trainSpeedBase * this.trainSpeedMultiplier * this.game.weatherManager.GetWeatherEffectList().speedMultiplier;
	}

	ArriveAtStation() {
		this.distanceToStationCurrentOld = this.distanceToStationCurrent;
		this.isMoving = false;
		this.isInStation = true;
		++this.arrivedStationAmount;
		this.game.eventManager.TriggerEvent();
		this.needUpdateUICargo = true;
		this.needUpdateUIStation = true;
		if (this.autoTrade) {
			this.PerformAutoTrade();
			if (this.autoDrive) {
				this.StartMoving();
			} else {
				this.game.SaveGame();
			}
		}
	}

	PerformAutoTrade() {
		const stationCargoList = this.game.stationManager.GetCurrentStationCargoList();
		if (this.trainCargoAmountCurrent > 0) {
			for (let cargoIndex = 0, cargoCount = this.currentCargoList.length; cargoIndex < cargoCount; ++cargoIndex) {
				const cargoData = this.currentCargoList[cargoIndex];
				const cargoType = this.game.cargoManager.GetCargoType(cargoData.cargoID);
				if (cargoType.isEmpty) {
					continue;
				}
				for (const stationCargoData of stationCargoList) {
					if (cargoData.cargoID === stationCargoData.cargoID && cargoData.priceBuy < stationCargoData.priceSellCurrent) {
						const sellCount = Math.min(stationCargoData.amountMax - stationCargoData.amount, cargoData.amount);
						this.game.money += stationCargoData.priceSellCurrent * sellCount;
						this.trainCargoWeightCurrent -= sellCount * cargoType.weight;
						this.trainCargoAmountCurrent -= sellCount;
						cargoData.amount += sellCount;
						if (cargoData.amount == 0) {
							this.currentCargoList.splice(cargoIndex, 1);
							--cargoIndex;
							--cargoCount;
							this.needUpdateUICargo = true;
							this.needUpdateUIStation = true;
						}
						break;
					}
				}
			}
		}
		if (this.trainCargoWeightCurrent < this.trainCargoWeightCapacity) {
			for (const stationCargoData of stationCargoList) {
				if (stationCargoData.amount > 0) {
					if (stationCargoData.priceBuyCurrent > this.game.money) {
						continue;
					}
					const cargoType = this.game.cargoManager.GetCargoType(stationCargoData.cargoID);
					if (cargoType.isEmpty || this.trainCargoWeightCapacity - this.trainCargoWeightCurrent < cargoType.weight) {
						continue;
					}
					const buyCount = Math.floor(Math.min(this.game.money / stationCargoData.priceBuyCurrent, (this.trainCargoWeightCapacity - this.trainCargoWeightCurrent) / cargoType.weight));
					stationCargoData.amount -= buyCount;
					this.game.money -= stationCargoData.priceBuyCurrent * buyCount;
					this.trainCargoWeightCurrent += buyCount * cargoType.weight;
					this.trainCargoAmountCurrent += buyCount;
					let cargoFlag = false;
					for (const cargoData of this.currentCargoList) {
						if (cargoData.cargoID === stationCargoData.cargoID) {
							cargoFlag = true;
							if (cargoData.amount + buyCount === 0) {
								cargoData.priceBuy = 0;
							} else {
								cargoData.priceBuy = (cargoData.priceBuy * cargoData.amount + stationCargoData.priceBuyCurrent * buyCount) / (cargoData.amount + buyCount);
							}
							cargoData.amount += buyCount;
							break;
						}
					}
					if (!cargoFlag) {
						this.currentCargoList.push({
							cargoID: stationCargoData.cargoID,
							priceBuy: stationCargoData.priceBuyCurrent,
							amount: buyCount,
						});
					}
					this.needUpdateUICargo = true;
					this.needUpdateUIStation = true;
					if (this.trainCargoWeightCurrent >= this.trainCargoWeightCapacity) {
						break;
					}
				}
			}
		}
	}

	ManualTradeCargoBuy(cargoID) {
		if (this.trainCargoWeightCurrent < this.trainCargoWeightCapacity) {
			const cargoType = this.game.cargoManager.GetCargoType(cargoID);
			if (cargoType.isEmpty || this.trainCargoWeightCapacity - this.trainCargoWeightCurrent < cargoType.weight) {
				return
			}
			const stationCargoList = this.game.stationManager.GetCurrentStationCargoList();
			for (const stationCargoData of stationCargoList) {
				if (stationCargoData.amount > 0 && this.game.money >= stationCargoData.priceBuyCurrent && cargoID === stationCargoData.cargoID) {
					const buyCount = 1;
					stationCargoData.amount -= buyCount;
					this.game.money -= stationCargoData.priceBuyCurrent * buyCount;
					this.trainCargoWeightCurrent += buyCount * cargoType.weight;
					this.trainCargoAmountCurrent += buyCount;
					let cargoFlag = false;
					for (const cargoData of this.currentCargoList) {
						if (cargoID === cargoData.cargoID) {
							cargoFlag = true;
							if (cargoData.amount + buyCount === 0) {
								cargoData.priceBuy = 0;
							} else {
								cargoData.priceBuy = (cargoData.priceBuy * cargoData.amount + stationCargoData.priceBuyCurrent * buyCount) / (cargoData.amount + buyCount);
							}
							cargoData.amount += buyCount;
							break;
						}
					}
					if (!cargoFlag) {
						this.currentCargoList.push({
							cargoID: stationCargoData.cargoID,
							priceBuy: stationCargoData.priceBuyCurrent,
							amount: buyCount,
						});
					}
					this.needUpdateUICargo = true;
					this.needUpdateUIStation = true;
					break;
				}
			}
		}
	}

	ManualTradeCargoSell(cargoID) {
		if (this.trainCargoAmountCurrent > 0) {
			const cargoType = this.game.cargoManager.GetCargoType(cargoID);
			if (cargoType.isEmpty) {
				return;
			}
			const stationCargoList = this.game.stationManager.GetCurrentStationCargoList();
			for (const stationCargoData of stationCargoList) {
				if (stationCargoData.amountMax > stationCargoData.amount && cargoID === stationCargoData.cargoID) {
					const sellCount = 1;
					let cargoFlag = false;
					for (let cargoIndex = 0, cargoCount = this.currentCargoList.length; cargoIndex < cargoCount; ++cargoIndex) {
						const cargoData = this.currentCargoList[cargoIndex];
						if (cargoID === cargoData.cargoID) {
							cargoFlag = true;
							cargoData.amount -= sellCount;
							if (cargoData.amount == 0) {
								this.currentCargoList.splice(cargoIndex, 1);
							}
							break;
						}
					}
					if (cargoFlag) {
						stationCargoData.amount += sellCount;
						this.game.money += stationCargoData.priceSellCurrent * sellCount;
						this.trainCargoWeightCurrent -= sellCount * cargoType.weight;
						this.trainCargoAmountCurrent -= sellCount;
						this.needUpdateUICargo = true;
						this.needUpdateUIStation = true;
					}
				}
			}
		}
	}

	StartMoving() {
		if (this.isMoving) {
			return;
		}
		this.isMoving = true;
		this.isInStation = false;
		this.game.SaveGame();
		this.needUpdateUICargo = true;
		this.needUpdateUIStation = true;
	}

	StopMoving() {
		if (!this.isMoving) {
			return;
		}
		this.distanceToStationCurrentOld = this.distanceToStationCurrent;
		this.isMoving = false;
		this.game.SaveGame();
	}

	SwitchStation() {
		this.distanceToStationCurrent += this.game.stationManager.GetNextStationDistance();
		this.game.stationManager.SwitchStation();
	}

	LoseRandomCargo() {
		if (this.currentCargoList.length > 0) {
			const cargoCount = Math.floor(Math.random() * this.currentCargoList.length - 2);
			if (cargoCount > 0) {
				for (let index = 0; index < cargoCount; index++) {
					const cargoIndex = Math.floor(Math.random() * this.currentCargoList.length);
					const cargoData = this.currentCargoList[cargoIndex];
					const cargoLoseCount = Math.floor(Math.random() * cargoData.amount + 2);
					if (cargoLoseCount >= cargoData.amount) {
						this.currentCargoList.splice(cargoIndex, 1);
					} else {
						cargoData.amount -= cargoLoseCount;
					}
				}
			}
		}
		this.needUpdateUICargo = true;
	}

	SwitchAutoDrive() {
		this.autoDrive = !this.autoDrive;
		if (!this.autoDrive && !this.isInStation) {
			this.StopMoving();
		}
		this.needUpdateUIControl = true;
	}

	SwitchAutoTrade() {
		this.autoTrade = !this.autoTrade;
		this.needUpdateUIControl = true;
	}

	SwitchManualDrive() {
		if (!this.autoDrive) {
			if (this.isMoving) {
				this.StopMoving();
			} else {
				this.StartMoving();
			}
		}
	}
}