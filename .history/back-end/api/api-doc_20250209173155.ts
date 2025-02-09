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
                info: { type: 'string' }
            }
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
