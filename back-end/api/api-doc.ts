export const tokenHeader = {
	in: 'header',
	required: true,
	name: 'x-observatory-auth',
	description: 'authentication token',
	schema: { type: 'string' },
};

const apiDoc = {
	openapi: '3.0.0',
	// swagger: '2.0',
	basePath: '/api',
	info: {
		title: 'TITLE', // TODO
		description: 'API for SoftEng 2024 NTUA course',
		version: '1.0.0',
	},
	definitions: {
		TokenHeader: {
			in: 'header',
			required: true,
			name: 'x-observatory-auth',
			description: 'authentication token',
			schema: { type: 'string' },
		},
		Format: {
			in: 'query',
			required: false,
			name: 'format',
			description: 'format specification',
			schema: { type: 'string', enum: ['json', 'csv'] },
		},
		TollOperator: {
			type: 'object',
			properties: {
				name: { type: 'string' },
				address: { type: 'string' },
				id: { type: 'string' },
			},
			required: ['name', 'address', 'id'],
		},
		Login: {
			type: 'object',
			properties: {
				username: { type: 'string' },
				password: { type: 'number' },
			},
			required: ['username', 'password'],
		},
		Token: {
			type: 'object',
			properties: {
				token: { type: 'string' },
			},
			required: ['token'],
		},
		Error: {
			type: 'object',
			properties: {
				status: { type: 'string' },
				info: { type: 'string' },
			},
			required: ['status', 'info'],
			additionalProperties: true,
		},
		SuccessResponse: {
			type: 'object',
			properties: {
				status: {
					type: 'string',
					description: 'OK',
				},
				info: {
					type: 'string',
					description: 'ok',
				},
			},
			required: ['status', 'info'],
		},
		HealthcheckResponse: {
			type: 'object',
			properties: {
				status: { type: 'string' },
				dbconnection: { type: 'string' },
				n_stations: { type: 'integer' },
				n_tags: { type: 'integer' },
				n_passes: { type: 'integer' },
			},
		},
		AdminResponse: {
			type: 'object',
			properties: {
				status: { type: 'string' },
			},
		},
		AdminErrorResponse: {
			type: 'object',
			properties: {
				status: { type: 'string' },
				dbconnection: { type: 'string' },
			},
			required: ['status', 'dbconnection'],
		},
		UnauthorizedResponse: {
			description: 'Unauthorized ',
			content: {
				'application/json': {
					schema: {
						$ref: '#/definitions/Error',
					},
				},
			},
		},
		BadRequestResponse: {
			description: 'Bad Request',
			content: {
				'application/json': {
					schema: {
						$ref: '#/definitions/Error',
					},
				},
			},
		},
		InternalServerErrorResponse: {
			description: 'Internal Server Error',
			content: {
				'application/json': {
					schema: {
						$ref: '#/definitions/Error',
					},
				},
			},
		},
		TollStationPassesResponse: {
			type: 'object',
			properties: {
				stationID: {
					type: 'string',
					description: 'The unique ID of the toll station',
				},
				stationOperator: {
					type: 'string',
					description: 'The operator of the toll station',
				},
				requestTimestamp: {
					type: 'string',
					format: 'date-time',
					description: 'Timestamp of the request',
				},
				periodFrom: {
					type: 'string',
					format: 'date',
					description: 'The requested period (from)',
				},
				periodTo: {
					type: 'string',
					format: 'date',
					description: 'The requested period (to)',
				},
				nPasses: {
					type: 'integer',
					description: 'Number of pass events in the period',
				},
				passList: {
					type: 'array',
					items: {
						$ref: '#/definitions/PassItem',
					},
				},
			},
			required: [
				'stationID',
				'stationOperator',
				'tollStationID',
				'requestTimestamp',
				'periodFrom',
				'periodTo',
				'nPasses',
				'passList',
			],
		},
		PassItem: {
			type: 'object',
			properties: {
				passIndex: {
					type: 'integer',
					description: 'Serial number (1, 2, 3, ...)',
				},
				passID: { type: 'string', description: 'ID of the pass event' },
				timestamp: {
					type: 'string',
					format: 'date-time',
					description: 'Timestamp of the pass',
				},
				tagID: {
					type: 'string',
					description: 'The ID of the pass tag',
				},
				tagProvider: {
					type: 'string',
					description: 'The provider of the pass tag',
				},
				passType: {
					type: 'string',
					enum: ['home', 'visitor'],
					description: 'Type of pass ("home" or "visitor")',
				},
				passCharge: {
					type: 'number',
					format: 'float',
					description: 'The cost of the pass',
				},
			},
			required: [
				'passIndex',
				'passID',
				'timestamp',
				'tagID',
				'tagProvider',
				'passType',
				'passCharge',
			],
		},
		PassAnalysisResponse: {
			type: 'object',
			properties: {
				stationOpID: {
					type: 'string',
					description: 'The ID of the station operator',
				},
				tagOpID: {
					type: 'string',
					description: 'The ID of the tag operator/provider',
				},
				requestTimestamp: {
					type: 'string',
					format: 'date-time',
					description: 'Request timestamp',
				},
				periodFrom: {
					type: 'string',
					format: 'date',
					description: 'Period from (YYYY-MM-DD)',
				},
				periodTo: {
					type: 'string',
					format: 'date',
					description: 'Period to (YYYY-MM-DD)',
				},
				nPasses: {
					type: 'integer',
					description: 'Number of pass events',
				},
				passList: {
					type: 'array',
					items: { $ref: '#/definitions/PassAnalysisItem' },
				},
			},
			required: [
				'stationOpID',
				'tagOpID',
				'requestTimestamp',
				'periodFrom',
				'periodTo',
				'nPasses',
				'passList',
			],
		},
		PassAnalysisItem: {
			type: 'object',
			properties: {
				passIndex: { type: 'integer', description: 'Serial number' },
				passID: { type: 'string', description: 'Pass event ID' },
				stationID: { type: 'string', description: 'Station ID' },
				timestamp: {
					type: 'string',
					format: 'date-time',
					description: 'Pass timestamp',
				},
				tagID: { type: 'string', description: 'Tag ID' },
				passCharge: {
					type: 'number',
					format: 'float',
					description: 'Pass cost',
				},
			},
			required: [
				'passIndex',
				'passID',
				'stationID',
				'timestamp',
				'tagID',
				'passCharge',
			],
		},
		PassesCostResponse: {
			type: 'object',
			properties: {
				tollOpID: {
					type: 'string',
					description: 'The ID of the toll station operator',
				},
				tagOpID: {
					type: 'string',
					description: 'The ID of the tag provider',
				},
				requestTimestamp: {
					type: 'string',
					format: 'date-time',
					description: 'Request timestamp',
				},
				periodFrom: {
					type: 'string',
					format: 'date',
					description: 'Period from (YYYYMMDD)',
				},
				periodTo: {
					type: 'string',
					format: 'date',
					description: 'Period to (YYYYMMDD)',
				},
				nPasses: {
					type: 'integer',
					description: 'Number of pass events',
				},
				passesCost: {
					type: 'number',
					format: 'float',
					description: 'Total cost of passes',
				},
			},
			required: [
				'tollOpID',
				'tagOpID',
				'requestTimestamp',
				'periodFrom',
				'periodTo',
				'nPasses',
				'passesCost',
			],
		},
		ChargesByResponse: {
			type: 'object',
			properties: {
				tollOpID: {
					type: 'string',
					description: 'The ID of the operator',
				},
				requestTimestamp: {
					type: 'string',
					format: 'date-time',
					description: 'Request timestamp',
				},
				periodFrom: {
					type: 'string',
					format: 'date',
					description: 'Period from (YYYYMMDD)',
				},
				periodTo: {
					type: 'string',
					format: 'date',
					description: 'Period to (YYYYMMDD)',
				},
				vOpList: {
					type: 'array',
					items: {
						$ref: '#/definitions/VisitingOperator', // Correct reference!
					},
					description: 'List of visiting operators',
				},
			},
			required: [
				'tollOpID',
				'requestTimestamp',
				'periodFrom',
				'periodTo',
				'vOpList',
			], // Correct required fields
		},
		VisitingOperator: {
			type: 'object',
			properties: {
				visitingOpID: {
					type: 'string',
					description: 'The ID of the visiting operator',
				},
				nPasses: {
					type: 'integer',
					description: 'Number of pass events',
				},
				passesCost: {
					type: 'number',
					format: 'float',
					description: 'Total cost',
				},
			},
			required: ['visitingOpID', 'nPasses', 'passesCost'],
		},
		GetPaymentsResponse: {
			type: 'object',
			properties: {
				total_pages: {
					type: 'integer',
					description: 'Total number of pages',
				},
				results: {
					type: 'array',
					items: {
						$ref: '#/definitions/Payment',
					},
				},
			},
			required: ['total_pages', 'results'],
		},
		Payment: {
			type: 'object',
			properties: {
				_id: { type: 'string' },
				payer: { type: 'string' },
				payee: { type: 'string' },
				dateofCharge: { type: 'string', format: 'date-time' },
				amount: {
					type: 'number',
					description: 'The amount of the payment',
				},
				dateofPayment: { type: 'string', format: 'date-time' },
				dateofValidation: { type: 'string', format: 'date-time' },
			},
			required: [
				'_id',
				'payer',
				'payee',
				'amount',
				'dateofCharge',
				'dateofPayment',
				'dateofValidation',
			], // Add other required properties
		},
		GetTollDataResponse: {
			type: 'object',
			properties: {
				toll: { type: 'object' },
				avg_passes: { type: 'number' },
				operators: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							operator: { type: 'string' },
							passes: { type: 'integer' },
						},
					},
				},
			},
		},
		TimeseriesResponse: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					date: { type: 'string', format: 'date' },
					operators: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								operator: { type: 'string' },
								passes: { type: 'integer' },
								cost: { type: 'number' },
							},
						},
					},
				},
			},
		},
		AggregatePassesResponse: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					operator: { type: 'string' },
					passes: { type: 'integer' },
					cost: { type: 'number' },
				},
			},
		},
		PassesSchema: {
			type: 'object',
			properties: {
				_id: { type: 'string', description: "Unique identifier for the pass" },
				tag: {
					type: 'object',
					description: "Details about the tag",
					properties: {
						_id: { type: 'string', description: "Unique identifier for the tag" },
						tollOperator: { type: 'string', description: "The toll operator of the tag" }
					},
					required: ['_id', 'tollOperator']
				},
				toll: {
					type: 'object',
					description: "Details about the toll location",
					properties: {
						_id: { type: 'string', description: "Unique identifier for the toll" },
						tollOperator: { type: 'string', description: "The toll operator of the toll" }
					},
					required: ['_id', 'tollOperator']
				},
				time: { type: 'string', format: 'date-time', description: "Date and time of the pass" },
				charge: { type: 'number', format: 'double', description: "The charge for the pass" },
				payment: { type: 'string', description: "ID of the payment associated with the pass" },
				__v: { type: 'integer', description: "Version number (Mongoose)" }
			},
			required: ['_id', 'tag', 'toll', 'time', 'charge', 'payment', '__v']
		},
	},
};

export default apiDoc;
