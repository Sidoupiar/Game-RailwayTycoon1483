class MainGameManager {
	constructor() {
		this.gameSaveID = 'railwayTycoonSave';
		// 用于清除存档
		//localStorage.setItem(this.gameSaveID, false);
		// 初始化数据
		this.money = 20000;
		this.gameSpeed = 1;
		this.rarityManager = new RarityManager(this);
		this.cargoManager = new CargoManager(this);
		this.weatherManager = new WeatherManager(this);
		this.eventManager = new EventManager(this);
		this.terrainManager = new TerrainManager(this);
		this.trainManager = new TrainManager(this);
		this.stationManager = new StationManager(this);
		this.Init();
		this.InitEventListeners();
		this.UpdateUI();
		this.GameLoop();
	}

	Init() {
		if (!this.LoadGame()) {
			this.rarityManager.Init();
			this.cargoManager.Init();
			this.weatherManager.Init();
			this.eventManager.Init();
			this.terrainManager.Init();
			this.stationManager.Init();
			this.trainManager.Init();
			this.SaveGame();
			this.ApplyWeatherEffect();
		}
	}

	LoadGame() {
		const savedGame = localStorage.getItem(this.gameSaveID);
		if (savedGame) {
			const gameData = JSON.parse(savedGame);
			this.money = gameData.money || 20000;
			this.gameSpeed = gameData.gameSpeed || 1;
			this.rarityManager.LoadGame(gameData)
			this.cargoManager.LoadGame(gameData);
			this.weatherManager.LoadGame(gameData);
			this.eventManager.LoadGame(gameData);
			this.terrainManager.LoadGame(gameData);
			this.stationManager.LoadGame(gameData);
			this.trainManager.LoadGame(gameData);
			return true;
		} else {
			return false;
		}
	}

	SaveGame() {
		const gameData = {
			money: this.money,
			gameSpeed: this.gameSpeed,
		};
		this.rarityManager.SaveGame(gameData);
		this.cargoManager.SaveGame(gameData);
		this.weatherManager.SaveGame(gameData);
		this.eventManager.SaveGame(gameData);
		this.terrainManager.SaveGame(gameData);
		this.stationManager.SaveGame(gameData);
		this.trainManager.SaveGame(gameData);
		localStorage.setItem(this.gameSaveID, JSON.stringify(gameData));
	}

	InitEventListeners() {
		document.getElementById('autoDriveButton').addEventListener('click', () => {
			this.trainManager.SwitchAutoDrive();
		});
		document.getElementById('autoTradeButton').addEventListener('click', () => {
			this.trainManager.SwitchAutoTrade();
		});
		document.getElementById('manualDriveButton').addEventListener('click', () => {
			this.trainManager.SwitchManualDrive();
		});
	}

	ApplyDialog(title, content, duration) {
		const dialogPanel = document.getElementById('dialog');
		if (!dialogPanel.classList.contains('hidden')) {
			return;
		}
		dialogPanel.querySelector('.dialog-title').textContent = title;
		dialogPanel.querySelector('.dialog-content').textContent = content;
		dialogPanel.classList.remove('hidden');
		const dialogHiddenFunction = function () {
			dialogPanel.classList.add('hidden');
		}
		dialogPanel.querySelector('.dialog-button').addEventListener('click', dialogHiddenFunction);
		if (duration > 1000) {
			setTimeout(() => {
				dialogPanel.classList.add('hidden');
				dialogPanel.querySelector('.dialog-title').textContent = '';
				dialogPanel.querySelector('.dialog-content').textContent = '';
				dialogPanel.querySelector('.dialog-button').removeEventListener('click', dialogHiddenFunction);
			}, duration);
		} else {
			setTimeout(() => {
				dialogPanel.classList.add('hidden');
				dialogPanel.querySelector('.dialog-title').textContent = '';
				dialogPanel.querySelector('.dialog-content').textContent = '';
				dialogPanel.querySelector('.dialog-button').removeEventListener('click', dialogHiddenFunction);
			}, 1000);
		}
	}

	ApplyNotification(title, content, duration) {
		const notificationPanel = document.getElementById('notification');
		if (notificationPanel.classList.contains('notification-show')) {
			return;
		}
		notificationPanel.querySelector('.notification-title').textContent = title;
		notificationPanel.querySelector('.notification-content').textContent = content;
		notificationPanel.classList.add('notification-show');
		if (duration > 1000) {
			setTimeout(() => {
				notificationPanel.classList.remove('notification-show');
				notificationPanel.querySelector('.notification-title').textContent = '';
				notificationPanel.querySelector('.notification-content').textContent = '';
			}, duration);
		} else {
			setTimeout(() => {
				notificationPanel.classList.remove('notification-show');
				notificationPanel.querySelector('.notification-title').textContent = '';
				notificationPanel.querySelector('.notification-content').textContent = '';
			}, 1000);
		}
	}

	ApplyWeatherEffect() {
		this.trainManager.ApplyWeatherEffect();
		this.stationManager.ApplyWeatherEffect();
	}

	Update() {
		const deltaTime = 1;
		this.rarityManager.Update(deltaTime);
		this.cargoManager.Update(deltaTime);
		this.weatherManager.Update(deltaTime);
		this.eventManager.Update(deltaTime);
		this.terrainManager.Update(deltaTime);
		this.stationManager.Update(deltaTime);
		this.trainManager.Update(deltaTime);
	}

	UpdateUI() {
		const canvasElement = document.getElementById('gameCanvas');
		const canvasElementContext = canvasElement.getContext("2d");
		canvasElementContext.clearRect(0, 0, canvasElement.width, canvasElement.height)
		this.trainManager.UpdateUI(canvasElementContext);
		this.stationManager.UpdateUI(canvasElementContext);
		this.terrainManager.UpdateUI(canvasElementContext);
		this.eventManager.UpdateUI(canvasElementContext);
		this.weatherManager.UpdateUI(canvasElementContext);
		this.cargoManager.UpdateUI(canvasElementContext);
		this.rarityManager.UpdateUI(canvasElementContext);
		// 系统界面更新
		document.getElementById('moneyDisplay').textContent = `$${this.money}`;
	}

	GameLoop() {
		// 更新数据
		this.Update();
		this.UpdateUI();
		// 继续主循环
		requestAnimationFrame(() => this.GameLoop());
	}

	MakeElement(baseElement, elementType, className, innerHTML) {
		const element = document.createElement(elementType);
		element.className = className;
		if (innerHTML !== '') {
			element.innerHTML = innerHTML;
		}
		baseElement.appendChild(element);
		return element;
	}

	MakeTypeContainer(typeList) {
		const container = {};
		for (const type of typeList) {
			container[type.id] = type;
		}
		return container;
	}

	MakeLocationData(xOffset, yOffset) {
		return {
			x: Math.floor(xOffset),
			y: Math.floor(yOffset),
		};
	}

	MakeColorData(red, green, blue, alpha) {
		return {
			red: Math.floor(red),
			green: Math.floor(green),
			blue: Math.floor(blue),
			alpha: Math.floor(alpha),
		}
	}

	MakeStructureData(xOffset, yOffset, width, height, colorData) {
		return {
			xOffset: Math.floor(xOffset),
			yOffset: Math.floor(yOffset),
			width: Math.floor(width),
			height: Math.floor(height),
			repeatCount: 1,
			repeatSpace: 0,
			repeatDirection: 1,
			color: colorData,
		};
	}

	ModifyStructureData_RepeatCount(structureData, repeatCount, repeatSpace, repeatDirection) {
		structureData.repeatCount = repeatCount;
		structureData.repeatSpace = repeatSpace;
		structureData.repeatDirection = repeatDirection;
		return structureData
	}

	MakeColorStyle(colorData) {
		return `rgba(${colorData.red}, ${colorData.green}, ${colorData.blue}, ${colorData.alpha})`;
	}

	GetStructureDataWidth(structureData) {
		return structureData.width;
	}

	DrawStructure(canvasElementContext, locationData, structureData) {
		if (structureData.repeatCount < 2) {
			canvasElementContext.fillStyle = this.MakeColorStyle(structureData.color);
			canvasElementContext.fillRect(locationData.x + structureData.xOffset, locationData.y - structureData.height + structureData.yOffset, structureData.width, structureData.height);
		} else {
			let baseX = locationData.x;
			let baseY = locationData.y;
			for (let index = 0; index < structureData.repeatCount; ++index) {
				canvasElementContext.fillStyle = this.MakeColorStyle(structureData.color);
				canvasElementContext.fillRect(baseX + structureData.xOffset, baseY - structureData.height + structureData.yOffset, structureData.width, structureData.height);
				if (structureData.repeatDirection !== 0) {
					if (Math.abs(structureData.repeatDirection) === 1) {
						baseX += structureData.repeatDirection * structureData.repeatSpace;
					} else {
						baseY += structureData.repeatDirection / Math.abs(structureData.repeatDirection) * structureData.repeatSpace;
					}
				}
			}
		}
	}
}

// 页面加载完毕后启动游戏
document.addEventListener('DOMContentLoaded', () => {
	window.game = new MainGameManager();
});