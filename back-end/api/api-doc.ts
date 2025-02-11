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
			required: ['status'],
			additionalProperties: true,
		},
		HealthcheckResponse: {
            type: 'object',
            properties: {
                status: { type: 'string' },
                dbconnection: { type: 'string' },
                n_stations: { type: 'integer' },
                n_tags: { type: 'integer' },
                n_passes: { type: 'integer' }
            }
        },
        AdminResponse: {
            type: 'object',
            properties: {
                status: { type: 'string' }
            }
        },
        AdminErrorResponse: {
            type: 'object',
            properties: {
                status: { type: 'string' },
                dbconnection: { type: 'string' }
            }
        },
        TollStationPassesResponse: {
            type: 'object',
            properties: {
                stationID: { type: 'string', description: 'The unique ID of the toll station' },
                stationOperator: { type: 'string', description: 'The operator of the toll station' },
                requestTimestamp: { type: 'string', format: 'date-time', description: 'Timestamp of the request' },
                periodFrom: { type: 'string', format: 'date', description: 'The requested period (from)' },
                periodTo: { type: 'string', format: 'date', description: 'The requested period (to)' },
                nPasses: { type: 'integer', description: 'Number of pass events in the period' },
                passList: {
                    type: 'array',
                    items: {
                        $ref: '#/definitions/PassItem'
                    }
                }
            },
            required: [
                'stationID', 'stationOperator', 'tollStationID', 'requestTimestamp',
                'periodFrom', 'periodTo', 'nPasses', 'passList'
            ]
        },
        PassItem: {
            type: 'object',
            properties: {
                passIndex: { type: 'integer', description: 'Serial number (1, 2, 3, ...)' },
                passID: { type: 'string', description: 'ID of the pass event' },
                timestamp: { type: 'string', format: 'date-time', description: 'Timestamp of the pass' },
                tagID: { type: 'string', description: 'The ID of the pass tag' },
                tagProvider: { type: 'string', description: 'The provider of the pass tag' },
                passType: {
                    type: 'string',
                    enum: ['home', 'visitor'],
                    description: 'Type of pass ("home" or "visitor")'
                },
                passCharge: { type: 'number', format: 'float', description: 'The cost of the pass' }
            },
            required: [
                'passIndex', 'passID', 'timestamp', 'tagID',
                'tagProvider', 'passType', 'passCharge'
            ]
        },
        PassAnalysisResponse: {
            type: 'object',
            properties: {
                stationOpID: { type: 'string', description: 'The ID of the station operator' },
                tagOpID: { type: 'string', description: 'The ID of the tag operator/provider' },
                requestTimestamp: { type: 'string', format: 'date-time', description: 'Request timestamp' },
                periodFrom: { type: 'string', format: 'date', description: 'Period from (YYYY-MM-DD)' },
                periodTo: { type: 'string', format: 'date', description: 'Period to (YYYY-MM-DD)' },
                nPasses: { type: 'integer', description: 'Number of pass events' },
                passList: { type: 'array', items: { $ref: '#/definitions/PassAnalysisItem' } }
            },
            required: ['stationOpID', 'tagOpID', 'requestTimestamp', 'periodFrom', 'periodTo', 'nPasses', 'passList']
        },
        PassAnalysisItem: {
          type: 'object',
          properties: {
            passIndex: { type: 'integer', description: 'Serial number' },
            passID: { type: 'string', description: 'Pass event ID' },
            stationID: { type: 'string', description: 'Station ID' },
            timestamp: { type: 'string', format: 'date-time', description: 'Pass timestamp' },
            tagID: { type: 'string', description: 'Tag ID' },
            passCharge: { type: 'number', format: 'float', description: 'Pass cost' }
          },
          required: ['passIndex', 'passID', 'stationID', 'timestamp', 'tagID', 'passCharge']
        },
        PassesCostResponse: {
            type: 'object',
            properties: {
                tollOpID: { type: 'string', description: 'The ID of the toll station operator' },
                tagOpID: { type: 'string', description: 'The ID of the tag provider' },
                requestTimestamp: { type: 'string', format: 'date-time', description: 'Request timestamp' },
                periodFrom: { type: 'string', format: 'date', description: 'Period from (YYYYMMDD)' },
                periodTo: { type: 'string', format: 'date', description: 'Period to (YYYYMMDD)' },
                nPasses: { type: 'integer', description: 'Number of pass events' },
                passesCost: { type: 'number', format: 'float', description: 'Total cost of passes' }
            },
            required: ['tollOpID', 'tagOpID', 'requestTimestamp', 'periodFrom', 'periodTo', 'nPasses', 'passesCost']
        },
        ChargesByResponse: {
            type: 'object',
            properties: {
                tollOpID: { type: 'string', description: 'The ID of the operator' },
                requestTimestamp: { type: 'string', format: 'date-time', description: 'Request timestamp' },
                periodFrom: { type: 'string', format: 'date', description: 'Period from (YYYYMMDD)' },
                periodTo: { type: 'string', format: 'date', description: 'Period to (YYYYMMDD)' },
                vOpList: {
                    type: 'array',
                    items: {
                        $ref: '#/definitions/VisitingOperator' // Correct reference!
                    },
                    description: 'List of visiting operators'
                }
            },
            required: ['tollOpID', 'requestTimestamp', 'periodFrom', 'periodTo', 'vOpList'] // Correct required fields
        },
        VisitingOperator: {
            type: 'object',
            properties: {
                visitingOpID: { type: 'string', description: 'The ID of the visiting operator' },
                nPasses: { type: 'integer', description: 'Number of pass events' },
                passesCost: { type: 'number', format: 'float', description: 'Total cost' }
            },
            required: ['visitingOpID', 'nPasses', 'passesCost']
        }
    },
    /*paths: {
        '/admin/healthcheck': {
            get: {
                tags: ['Admin'],
                summary: 'Check system health',
                responses: {
                    200: {
                        description: 'System healthy',
                        schema: { $ref: '#/definitions/HealthcheckResponse' }
                    },
                    401: {
                        description: 'System unhealthy',
                        schema: { $ref: '#/definitions/AdminErrorResponse' }
                    }
                }
            }
        },
        '/admin/resetstations': {
            post: {
                tags: ['Admin'],
                summary: 'Reset stations data',
                responses: {
                    200: {
                        description: 'Reset successful',
                        schema: { $ref: '#/definitions/AdminResponse' }
                    },
                    500: {
                        description: 'Reset failed',
                        schema: { $ref: '#/definitions/AdminErrorResponse' }
                    }
                }
            }
        },
        '/admin/resetpasses': {
            post: {
                tags: ['Admin'],
                summary: 'Reset passes data',
                responses: {
                    200: {
                        description: 'Reset successful',
                        schema: { $ref: '#/definitions/AdminResponse' }
                    },
                    500: {
                        description: 'Reset failed',
                        schema: { $ref: '#/definitions/AdminErrorResponse' }
                    }
                }
            }
        },
        '/admin/addpasses': {
            post: {
                tags: ['Admin'],
                summary: 'Add passes from CSV',
                consumes: ['multipart/form-data'],
                parameters: [
                    {
                        name: 'file',
                        in: 'formData',
                        description: 'CSV file with passes data',
                        required: true,
                        type: 'file'
                    }
                ],
                responses: {
                    200: {
                        description: 'Passes added successfully',
                        schema: { $ref: '#/definitions/AdminResponse' }
                    },
                    500: {
                        description: 'Operation failed',
                        schema: { $ref: '#/definitions/AdminErrorResponse' }
                    }
                }
            }
        }
    }
        */
};

export default apiDoc;
