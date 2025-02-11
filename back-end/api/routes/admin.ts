// api/routes/admin.ts
import {
	Middleware,
	NextFunction,
	Request,
	Response,
	Router,
	urlencoded,
} from 'express';
import mongoose from 'mongoose';
import multer, { FileFilterCallback } from 'multer';
import { dirname, fromFileUrl, join } from '@std/path';
import { parse } from 'csv-parse/sync';

import { insertTollsFromCSV } from '@/data-base_functions/inserts/toll_insert.ts';
import { insertPassesFromCSV } from '@/data-base_functions/inserts/pass_insert.ts';
import { deleteCollection } from '@/data-base_functions/deletes/delete_collection.ts';
import { insertTollOperators } from '@/data-base_functions/inserts/initialize_operators.ts';
import { ConnectionStates, die, ErrorType, get_date } from '@/api/util.ts';

import TollOperator, {
	TollOperatorInput,
	UserLevel,
} from '@/models/toll_operator.ts';
import Pass from '@/models/pass.ts';

interface UserInput {
	id: string;
	password: string;
}

const hashPassword = async (password: string): Promise<string> => {
	try {
		const encoder = new TextEncoder();
		const data = encoder.encode(password);
		const hashBuffer = await crypto.subtle.digest('SHA-512', data);
		return Array.from(new Uint8Array(hashBuffer))
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('');
	} catch (error) {
		console.error('Error hashing password:', error);
		throw error;
	}
};

const upload = multer({
	storage: multer.memoryStorage(),
	fileFilter: (_req: Request, file: multer.File, cb: FileFilterCallback) => {
		// Check if file is CSV (required by spec)
		if (file.mimetype !== 'text/csv') {
			cb(new Error('Only CSV files are allowed (mimetype: text/csv)'));
			return;
		}
		cb(null, true);
	},
});

const groupByOperatorPair = () => [
	{
		$group: {
			_id: {
				toll: '$toll.tollOperator',
				tag: '$tag.tollOperator',
			},
			passes: { $sum: 1 },
			cost: { $sum: '$charge' },
		},
	},
	{
		$project: {
			tollOperator: '$_id.toll',
			tagOperator: '$_id.tag',
			passes: '$passes',
			cost: '$cost',
			_id: 0,
		},
	},
];

function validateCSVFile(csvContent: string): boolean {
	try {
		//const csvContent = await fs.readFile(filePath, 'utf-8');
		const records = parse(csvContent, {
			columns: true,
			skip_empty_lines: true,
		});

		// Check if the file is empty or the header row is missing
		if (records.length === 0) {
			console.error('CSV file is empty or missing header row.');
			return false;
		}

		// Define required fields based on `passes-sample.csv`
		const requiredFields = [
			'timestamp',
			'tollID',
			'tagRef',
			'tagHomeID',
			'charge',
		];

		const headerFields = Object.keys(records[0]);

		// Check if the number of fields matches the required format
		if (headerFields.length !== requiredFields.length) {
			console.error(
				'CSV header field count does not match the required format.',
			);
			return false;
		}
		for (let i = 0; i < requiredFields.length; i++) {
			if (headerFields[i] !== requiredFields[i]) {
				console.error(
					`Header field mismatch at position ${i + 1}: expected "${
						requiredFields[i]
					}", but found "${headerFields[i]}".`,
				);
				return false;
			}
		}

		return true;
	} catch (error) {
		console.error('Error validating CSV file:', error);
		return false;
	}
}

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.use((req: Request, res: Response, next: NextFunction) => {
		if (req.user.level !== UserLevel.Admin) {
			return die(res, ErrorType.BadRequest, 'Admin level required');
		}
		return next();
	});

	// Healthcheck endpoint
	router.get(
		'/healthcheck',
		oapi.path({
			tags: ['Admin'],
			summary: 'Check system health',
			operationId: 'getHealthcheck',
			parameters: [
				{ $ref: '#definitions/TokenHeader' },
			],
			responses: {
				200: {
					description: 'System healthy',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/HealthcheckResponse',
							},
						},
					},
				},
				401: {
					description: 'System unhealthy',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/AdminErrorResponse',
							},
						},
					},
				},
			},
		}),
		async (_req: Request, res: Response) => {
			try {
				if (
					mongoose.connection.readyState !==
						ConnectionStates.connected
				) {
					throw (new Error('no connected to db'));
				}
				//const db = client.db();
				//const db = mongoose.connection.db;

				const [stations, tags, passes] = await Promise.all([
					mongoose.connection.collection('toll').countDocuments(),
					mongoose.connection.collection('tag').countDocuments(),
					mongoose.connection.collection('pass').countDocuments(),
				]);

				res.status(200).json({
					status: 'OK',
					dbconnection: 'mongodb://localhost:27017/',
					n_stations: stations,
					n_tags: tags,
					n_passes: passes,
				});
			} catch (error) {
				console.error('ERR /api/admin/healthcheck', error);
				res.status(401).json({
					status: 'failed',
					dbconnection: 'mongodb://localhost:27017/',
				});
			}
		},
	);

	// Reset stations endpoint
	router.post(
		'/resetstations',
		oapi.path({
			tags: ['Admin'],
			summary: 'Reset stations data',
			operationId: 'resetStations',
			parameters: [
				{ $ref: '#definitions/TokenHeader' },
			],
			responses: {
				200: {
					description: 'Reset successful',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/AdminResponse',
							},
						},
					},
				},
				401: { $ref: '#/definitions/UnauthorizedResponse' },
				500: { $ref: '#/definitions/InternalServerErrorResponse' },	
			},
		}),
		async (_req: Request, res: Response) => {
			try {
				// Step 1: Delete all existing documents
				await deleteCollection('payment');
				await deleteCollection('pass');
				await deleteCollection('toll');

				await insertTollOperators();

				// Step 2: Construct the correct path to the CSV file
				const currentFilePath = fromFileUrl(import.meta.url);
				const currentDir = dirname(currentFilePath);
				const projectRoot = join(currentDir, '..', '..');
				const csvPath = join(
					projectRoot,
					'data-base_functions',
					'inserts',
					'tollstations2024.csv',
				);
				// Step 3: Insert new stations using the existing function
				await insertTollsFromCSV(csvPath);

				res.status(200).json({ status: 'OK' });
			} catch (error) {
				console.error('ERR in resetstations:', error);
				die(res, ErrorType.Internal, error);
			}
		},
	);

	router.post(
		'/resetpasses',
		oapi.path({
			tags: ['Admin'],
			summary: 'Reset passes data',
			operationId: 'resetPasses',
			parameters: [
				{ $ref: '#definitions/TokenHeader' },
			],
			responses: {
				200: {
					description: 'Reset successful',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/AdminResponse',
							},
						},
					},
				},
				401: { $ref: '#/definitions/UnauthorizedResponse' },
				500: { $ref: '#/definitions/InternalServerErrorResponse' },	
			},
		}),
		async (_req: Request, res: Response) => {
			try {
				// Get database connection
				//const db = client.db();

				if (mongoose.connection.readyState !== 1) {
					throw (new Error('no connected to db'));
				}

				await deleteCollection('payment');
				await deleteCollection('pass');
				await deleteCollection('tag');

				await insertTollOperators();

				const testPassword = 'freepasses4all';

				const newPassword = await hashPassword(testPassword);

				await TollOperator.updateOne({ _id: 'admin' }, {
					passwordHash: newPassword,
				});

				res.status(200).json({ status: 'OK' });
			} catch (error) {
				console.error('ERR in resetpasses:', error);
				die(res, ErrorType.Internal, error);
			}
		},
	);

	router.post(
		'/addpasses',
		oapi.path({
			tags: ['Admin'],
			summary: 'Add passes from CSV',
			operationId: 'addPasses',
			parameters: [
				{ $ref: '#definitions/TokenHeader' },
				{
					in: 'formData',
					name: 'file',
					required: true,
					type: 'file',
					description: 'CSV file with passes data',
				},
			],
			responses: {
				200: {
					description: 'Passes added successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/AdminResponse',
							},
						},
					},
				},
				401: { $ref: '#/definitions/UnauthorizedResponse' },
				500: { $ref: '#/definitions/InternalServerErrorResponse' },	
			},
		}),
		upload.single('file'),
		async (req: Request, res: Response) => {
			try {
				console.log(
					'Received request to upload passes',
				);
				console.log('req.body:', req.body);
				console.log('req.file:', req.file);

				if (!req.file) {
					console.error('No file uploaded');
					throw new Error('No file uploaded');
				}

				console.log(
					`File received: ${req.file.originalname}`,
				);
				console.log(`Stored at: ${req.file.buffer}`);

				// Validate and process the file
				const csvContent = req.file.buffer.toString('utf-8');
				const isValid = await validateCSVFile(csvContent);
				if (!isValid) {
					throw new Error(
						'Invalid CSV format. Please upload a valid file.',
					);
				}

				await insertPassesFromCSV(csvContent, false);
				console.log(
					'Successfully inserted passes from CSV.',
				);

				res.status(200).json({ status: 'OK' });
			} catch (error) {
				console.error('ERR in /addpasses:', error);
				die(res, ErrorType.Internal, error);
			}
		},
	);

	router.get(
		'/allpasses/:date_from/:date_to',
		/**
		 * Returns all aggregated pass data in range between all pair of operators
		 * in both directions.
		 *
		 * Return: {
		 * 		tollOperator: string,
		 * 		tagOperator: string,
		 * 		passes: number,
		 * 		cost: number
		 * }[]
		 */
		async (req: Request, res: Response) => {
			const date_from = get_date(req.params.date_from);
			const date_to = get_date(req.params.date_to);

			try {
				const response = await Pass.aggregate([
					{ $match: { time: { $gte: date_from, $lte: date_to } } },
					...groupByOperatorPair(),
				]);

				res.status(200).json(response);
			} catch (err) {
				console.error('error:', err);
				die(res, ErrorType.Internal, err);
			}
		},
	);

	router.post(
		'/addadmin',
		urlencoded({ extended: false }),
		async (req: Request, res: Response) => {
			if (req.body.id == null) {
				return die(res, ErrorType.BadRequest, 'Username required');
			}
			if (req.body.password == null) {
				return die(res, ErrorType.BadRequest, 'Username required');
			}
			const { id, password }: UserInput = req.body;

			try {
				const existing = await TollOperator.findById(id);
				let info: string;

				if (existing != null) {
					existing.passwordHash = password;
					await existing.save();
					info = 'updated';
				} else {
					await TollOperator.create<TollOperatorInput>({
						_id: id,
						passwordHash: password,
						userLevel: UserLevel.Admin,
					});
					info = 'created';
				}

				return res.status(200).json({ status: 'OK', info });
			} catch (err) {
				console.error('Internal error:', err);
				die(res, ErrorType.Internal, err);
			}
		},
	);

	return router;
}
