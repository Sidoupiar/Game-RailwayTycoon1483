class RarityManager {
	constructor(game) {
		this.game = game;
		this.maxRarityLevel = 0;
		this.rarityTypeContainer = {
			common: {
				name: "常规",
				level: 1,
				rarityEffect: function (priceMultiplier) {
					if (Math.random() < 0.04) {
						priceMultiplier *= 1.2;
					}
					if (Math.random() < 0.01) {
						priceMultiplier *= 1.8;
					}
					return priceMultiplier;
				},
			},
			advance: {
				name: "高级",
				level: 2,
				rarityEffect: function (priceMultiplier) {
					if (Math.random() < 0.08) {
						priceMultiplier *= 1.4;
					}
					if (Math.random() < 0.02) {
						priceMultiplier *= 2.1;
					}
					return priceMultiplier;
				},
			},
			rare: {
				name: "稀有",
				level: 3,
				rarityEffect: function (priceMultiplier) {
					if (Math.random() < 0.12) {
						priceMultiplier *= 1.6;
					}
					if (Math.random() < 0.03) {
						priceMultiplier *= 2.4;
					}
					return priceMultiplier;
				},
			},
			epic: {
				name: "史诗",
				level: 4,
				rarityEffect: function (priceMultiplier) {
					if (Math.random() < 0.16) {
						priceMultiplier *= 1.8;
					}
					if (Math.random() < 0.04) {
						priceMultiplier *= 2.7;
					}
					return priceMultiplier;
				},
			},
			legendary: {
				name: "传奇",
				level: 5,
				rarityEffect: function (priceMultiplier) {
					if (Math.random() < 0.20) {
						priceMultiplier *= 2.0;
					}
					if (Math.random() < 0.05) {
						priceMultiplier *= 3.0;
					}
					return priceMultiplier;
				},
			},
		}
		for (const rarityID in this.rarityTypeContainer) {
			const rarityType = this.rarityTypeContainer[rarityID];
			this.maxRarityLevel = Math.max(this.maxRarityLevel, rarityType.level);
		}
	}

	Init() {

	}

	LoadGame(gameData) {
		const rarityData = gameData.rarityData || {};
	}

	SaveGame(gameData) {
		gameData.rarityData = {};
	}

	Update(deltaTime) {

	}

	UpdateUI(canvasElementContext) {

	}

	GetRarityLevel(rarityID) {
		const rarityType = this.rarityTypeContainer[rarityID];
		if (rarityType) {
			return rarityType.level
		} else {
			return 0;
		}
	}

	CalculatePriceMultiplier(rarityID, priceMultiplier) {
		const rarityType = this.rarityTypeContainer[rarityID];
		if (rarityType) {
			return rarityType.rarityEffect(priceMultiplier);
		} else {
			return priceMultiplier;
		}
	}

	GetMaxRarityLevel() {
		return this.maxRarityLevel;
	}
}