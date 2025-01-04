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
	},
	paths: {},
};

export default apiDoc;
