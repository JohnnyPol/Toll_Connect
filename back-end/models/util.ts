import { Schema } from 'npm:mongoose';

const TrimmedString = { type: String, trimmed: true };

const setRequired = (
	schema: Schema, name: string, optionals: string[] = [],
) => {
	for (let field in tollOperatorSchema.paths) {
		if (field in optionals) continue;
		tollOperatorSchema.path(field).required(
			true,
			'Toll Operator: ' + field + ' cannot be blank',
		);
	}
};

export { TrimmedString, setRequired };
