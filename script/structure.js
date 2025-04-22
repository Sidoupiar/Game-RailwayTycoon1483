class StructureManager {
	constructor(game) {
		this.game = game;
		this.canvasElement = document.getElementById('gameCanvas');
		this.canvasElementContext = this.canvasElement.getContext("2d");
		this.fontBackground = this.MakeColorStyle(this.MakeColorData(10, 10, 10, 100));
		this.fontForeground = this.MakeColorStyle(this.MakeColorData(240, 240, 240, 255));
		this.structureDrawTypeContainer = {
			square: {
				name: '矩形',
				Draw: function (structureManager, locationData, structureData) {
					const innerContent = structureManager.canvasElementContext;
					if (structureData.repeatCount < 2) {
						innerContent.fillStyle = structureData.color;
						innerContent.fillRect(locationData.x + structureData.xOffset, locationData.y + structureData.yOffset - structureData.height, structureData.width, structureData.height);
						if (structureData.subStructureList) {
							const subLocationData = structureManager.MakeLocationData(locationData.x + structureData.xOffset, locationData.y + structureData.yOffset);
							for (const subStructureData of structureData.subStructureList) {
								structureManager.DrawStructure(subLocationData, subStructureData);
							}
						}
					} else {
						let baseX = locationData.x;
						let baseY = locationData.y;
						for (let index = 0; index < structureData.repeatCount; ++index) {
							innerContent.fillStyle = structureData.color;
							innerContent.fillRect(baseX + structureData.xOffset, baseY + structureData.yOffset - structureData.height, structureData.width, structureData.height);
							if (structureData.subStructureList) {
								const subLocationData = structureManager.MakeLocationData(baseX + structureData.xOffset, baseY + structureData.yOffset);
								for (const subStructureData of structureData.subStructureList) {
									structureManager.DrawStructure(subLocationData, subStructureData);
								}
							}
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
			},
			sin: {
				name: '正弦',
				Draw: function (structureManager, locationData, structureData) {
					const innerContent = structureManager.canvasElementContext;
					if (structureData.repeatCount < 2) {
						const stepX = structureData.width / 100.0;
						const pi_1_100 = Math.PI / 100.0;
						const baseX = locationData.x + structureData.xOffset;
						const baseY = locationData.y + structureData.yOffset;
						const maxX = baseX + structureData.width;
						innerContent.beginPath();
						innerContent.moveTo(baseX, baseY);
						for (let currentX = baseX, frequency = 0; currentX < maxX; currentX += stepX, frequency += pi_1_100) {
							const currentY = baseY - structureData.height * Math.sin(frequency);
							innerContent.lineTo(currentX, currentY);
						}
						innerContent.lineTo(maxX, baseY);
						//innerContent.lineTo(baseX, baseY); // 封底
						innerContent.fillStyle = structureData.color;
						innerContent.fill();
						innerContent.lineWidth = 1;
						innerContent.strokeStyle = structureData.colorDark;
						innerContent.stroke();
						innerContent.closePath();
						if (structureData.subStructureList) {
							const subLocationData = structureManager.MakeLocationData(baseX, baseY);
							for (const subStructureData of structureData.subStructureList) {
								structureManager.DrawStructure(subLocationData, subStructureData);
							}
						}
					} else {
						const stepX = structureData.width / 100.0;
						const pi_1_100 = Math.PI / 100.0;
						let baseX = locationData.x + structureData.xOffset;
						let baseY = locationData.y + structureData.yOffset;
						let maxX = baseX + structureData.width;
						for (let index = 0; index < structureData.repeatCount; ++index) {
							innerContent.beginPath();
							innerContent.moveTo(baseX, baseY);
							for (let currentX = baseX, frequency = 0; currentX < maxX; currentX += stepX, frequency += pi_1_100) {
								const currentY = baseY - structureData.height * Math.sin(frequency);
								innerContent.lineTo(currentX, currentY);
							}
							innerContent.lineTo(maxX, baseY);
							//innerContent.lineTo(baseX, baseY); // 封底
							innerContent.fillStyle = structureData.color;
							innerContent.fill();
							innerContent.lineWidth = 1;
							innerContent.strokeStyle = structureData.colorDark;
							innerContent.stroke();
							innerContent.closePath();
							if (structureData.subStructureList) {
								const subLocationData = structureManager.MakeLocationData(baseX, baseY);
								for (const subStructureData of structureData.subStructureList) {
									structureManager.DrawStructure(subLocationData, subStructureData);
								}
							}
							if (structureData.repeatDirection !== 0) {
								if (Math.abs(structureData.repeatDirection) === 1) {
									const extendX = structureData.repeatDirection * structureData.repeatSpace;
									baseX += extendX;
									maxX += extendX;
								} else {
									baseY += structureData.repeatDirection / Math.abs(structureData.repeatDirection) * structureData.repeatSpace;
								}
							}
						}
					}
				},
			},
		};
	}

	Init() {

	}

	FinalInit() {

	}

	LoadGame(gameData) {
		const structureData = gameData.structureData || {};
	}

	SaveGame(gameData) {
		gameData.structureData = {};
	}

	Update(deltaTime) {

	}

	UpdateUI() {
		this.ClearContent();
	}

	GetScreenWidth() {
		return this.canvasElement.width;
	}

	ClearContent() {
		this.canvasElementContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
	}

	MakeLocationData(xOffset, yOffset) {
		return {
			x: xOffset, // Math.floor(xOffset),
			y: yOffset, // Math.floor(yOffset),
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

	MakeColorData_Drak(colorData, darkness) {
		const colorMultiplier = Math.max(Math.min(1.0 - darkness, 1.0), 0.0);
		return {
			red: Math.floor(colorData.red * colorMultiplier),
			green: Math.floor(colorData.green * colorMultiplier),
			blue: Math.floor(colorData.blue * colorMultiplier),
			alpha: colorData.alpha,
		}
	}

	MakeStructureData(xOffset, yOffset, width, height, colorData) {
		return {
			drawType: 'square',
			xOffset: xOffset, // Math.floor(xOffset),
			yOffset: yOffset, // Math.floor(yOffset),
			width: width, // Math.floor(width),
			height: height, // Math.floor(height),
			color: this.MakeColorStyle(colorData),
			colorDark: this.MakeColorStyle(this.MakeColorData_Drak(colorData, 0.4)),
			// xMerged: 0.0,
			// yMerged: 0.0,
			repeatCount: 1,
			repeatSpace: 0,
			repeatDirection: 1,
			subStructureList: null,
		};
	}

	ModifyStructureData_DrawType_Square(structureData) {
		structureData.drawType = 'square';
		return structureData;
	}

	ModifyStructureData_DrawType_Sin(structureData) {
		structureData.drawType = 'sin';
		return structureData;
	}

	ModifyStructureData_RepeatCount(structureData, repeatCount, repeatSpace, repeatDirection) {
		structureData.repeatCount = repeatCount;
		structureData.repeatSpace = repeatSpace; // Math.floor(repeatSpace);
		structureData.repeatDirection = repeatDirection;
		return structureData;
	}

	ModifyStructureData_MoveX(structureData, xMerged) {
		structureData.xOffset += xMerged;
		// structureData.xMerged += xMerged;
		// if (Math.floor(Math.abs(structureData.xMerged)) > 0) {
		// 	const xOffset = Math.floor(structureData.xMerged);
		// 	structureData.xOffset += xOffset;
		// 	structureData.xMerged -= xOffset;
		// }
		return structureData;
	}

	ModifyStructureData_MoveY(structureData, yMerged) {
		structureData.yOffset += yMerged;
		// structureData.yMerged += yMerged;
		// if (Math.floor(Math.abs(structureData.yMerged)) > 0) {
		// 	const yOffset = Math.floor(structureData.yMerged);
		// 	structureData.yOffset += yOffset;
		// 	structureData.yMerged -= yOffset;
		// }
		return structureData;
	}

	ModifyStructureData_MakeSubStructureData(structureData, xOffset, yOffset, width, height, colorData) {
		if (structureData.subStructureList) {
			structureData.subStructureList.push(this.MakeStructureData(xOffset, yOffset, width, height, colorData));
		} else {
			structureData.subStructureList = [
				this.MakeStructureData(xOffset, yOffset, width, height, colorData),
			];
		}
		return structureData;
	}

	ModifyStructureData_AddSubStructureData(structureData, subStructureData) {
		if (structureData.subStructureList) {
			structureData.subStructureList.push(subStructureData);
		} else {
			structureData.subStructureList = [
				subStructureData,
			];
		}
		return structureData;
	}

	ModifyStructureData_AddSubStructureDataList(structureData, subStructureDataList) {
		for (const subStructureData of subStructureDataList) {
			this.ModifyStructureData_AddSubStructureData(structureData, subStructureData);
		}
		return structureData;
	}

	MakeColorStyle(colorData) {
		return `rgba(${colorData.red}, ${colorData.green}, ${colorData.blue}, ${colorData.alpha / 255.0})`;
	}

	GetStructureDataWidth(structureData) {
		return structureData.width;
	}

	GetStructureDataHeight(structureData) {
		return structureData.height;
	}

	IsStructureOutOfScreen(structureData, locationData) {
		return structureData.xOffset + structureData.width < -locationData.x;
	}

	DrawStructure(locationData, structureData) {
		const structureDrawType = this.structureDrawTypeContainer[structureData.drawType];
		if (structureDrawType) {
			structureDrawType.Draw(this, locationData, structureData);
		}
	}

	DrawText(text, locationData, yOffset) {
		const innerContent = this.canvasElementContext;
		innerContent.font = "20px serif";
		const textDrawObject = innerContent.measureText(text);
		if (textDrawObject) {
			const fontWidth = textDrawObject.width;
			const fontHeight = textDrawObject.fontBoundingBoxAscent + textDrawObject.fontBoundingBoxDescent;
			const baseX = locationData.x - fontWidth / 2; // Math.floor(locationData.x - fontWidth / 2);
			const baseY = locationData.y - yOffset;
			innerContent.fillStyle = this.fontBackground;
			innerContent.fillRect(baseX - 5, baseY - fontHeight - 2, fontWidth + 10, fontHeight + 4);
			innerContent.fillStyle = this.fontForeground;
			innerContent.fillText(text, baseX, baseY - textDrawObject.fontBoundingBoxDescent);
		}
	}
}