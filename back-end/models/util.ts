import { Schema } from 'npm:mongoose';

const TrimmedString = { type: String, trimmed: true, required: true };

const setRequired = (
	schema: Schema, name: string, optionals: string[] = [],
) => {
	for (let field in schema.paths) {
		if (field in optionals) continue;
		schema.path(field).required(
			true,
			name + ': ' + field + ' cannot be blank',
		);
	}
};

const checkNonNegative = (
	schema: Schema, name: string, path: string,
) => {
	schema.path(path).validate(val => {
		return val >=0;
	}, name + ": " + path + ' cannot be negative',
	);
}

const foreignKey =(
	schema: Schema, oName: string, path: string, refSchema: Schema, refName: string, refPath: string,
) => {
	schema.path(path).validate(async function(value) {
		const query = {};
		query[refPath] = value;
		const test = await refSchema.findOne(query);
		if (!test) {
			throw new Error(refName + ' with ' + refPath + ' ' + value + ' does not exist.');
		}
		return true;
	}, 'Invalid ' + refName + ': ' + refName + ' referenced by ' + oName + ' does not exist',
	);
}

export { TrimmedString};
