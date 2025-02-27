import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType, check_admin } from '../../util.ts';
import Tag from '../../../models/tag.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();
	router.use(check_admin);

	/**
	 * GET /tag
	 * Retrieves all tag documents
	 */
	router.get(
		'/',
		oapi.path({
			tags: ['DB'],
			summary: 'Retrieve all tag documents',
			operationId: 'getAllTags',
			parameters: [
				{ $ref: '#/definitions/TokenHeader' },
				{ $ref: '#/definitions/Format' },
			],
			responses: {
				200: {
					description: 'Successful retrieval of tag documents',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/TagsSchema', 
								},
							},
						},
					},
				},
				400: { $ref: '#/definitions/BadRequestResponse' },
				401: { $ref: '#/definitions/UnauthorizedResponse' },
				500: { $ref: '#/definitions/InternalServerErrorResponse' },
			}
		}),
		async (_req: Request, res: Response) => {
		try {
			const tags = await Tag.find();
			res.status(200).json(tags);
		} catch (error) {
			console.error('Error fetching tags:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	/**
	 * GET /tag/:id
	 * Retrieves a specific tag document by its ID
	 */
	router.get(
		'/:id', 
		oapi.path({
			tags: ['DB'],
			summary: 'Retrieve tag document with specified id',
			operationId: 'getTagWithID',
			parameters: [
				{ $ref: '#/definitions/TokenHeader' },
				{ in: 'path', name: 'id', schema: { type: 'string' }, required: true, description: 'Tag Id' },
				{ $ref: '#/definitions/Format' },
			],
			responses: {
				200: {
					description: 'Successful retrieval of tag document',
					content: {
						'application/json': {
							schema: {
									$ref: '#/definitions/TagsSchema', 
								},
							},
						},
					},
				400: { $ref: '#/definitions/BadRequestResponse' },
				401: { $ref: '#/definitions/UnauthorizedResponse' },
				500: { $ref: '#/definitions/InternalServerErrorResponse' },
				}
		}),
		async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			const tag = await Tag.findById(id);
			if (!tag) return die(res, ErrorType.BadRequest, 'Tag not found');

			res.status(200).json(tag);
		} catch (error) {
			console.error('Error fetching tag:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	return router;
}
