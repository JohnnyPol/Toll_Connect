import {
	Document,
	Model,
	Schema,
	SchemaType,
	SchemaTypeOptions,
} from 'npm:mongoose';
import { assert } from '@std/assert';

type validator<T> = { validator: (val: T) => boolean; message: string };

/** Makes field required.
 *
 * @param {T} type
 * @param {string} [ref=''] - Referencing collection
 * @returns object { type, required: true }
 */
function require<T>(
	type: T,
	ref: string = '',
): { type: T; ref?: string; required: boolean } {
	//assert(ref === '' || type instanceof Schema.Types.ObjectId);
	if (ref === '') {
		return { type, required: true };
	} else {
		return { type, ref, required: true };
	}
}

/**
 * Adds { trimmed: true } to object for declaring Schema field
 *
 * @param {{ type: T,... }} obj - object to be added
 * @returns extended object {type: T, trimmed: true, ...}
 */
function trim<T>(obj: SchemaTypeOptions<T>): SchemaTypeOptions<T> {
	return { ...obj, trimmed: true };
}

/**
 * Adds { unique: true } to object for declaring Schema field
 *
 * @param {{ type: T,... }} obj - object to be added
 * @returns extended object {type: T, unique: true, ...}
 */
function unique<T>(obj: SchemaTypeOptions<T>): SchemaTypeOptions<T> {
	return { ...obj, unique: true };
}

/**
 * Adds validator to check if Number field is within allowed range
 *
 * Only one of minVal - maxVal can be undefined
 *
 * @param {string} name - Name of field to use in error message
 * @param {number} [minVal]
 * @param {number} [maxVal]
 * @returns {{ validator: (val: number) => bool; message: string }}
 *
 * @example
 *
 * 	field: { type: Number, validate: range('Field', 0, 10) }
 */
function range(
	name: string,
	minVal?: number,
	maxVal?: number,
): validator<number> {
	if (typeof minVal === 'undefined') {
		assert(typeof maxVal !== 'undefined');
		return {
			validator: (val) => val <= maxVal,
			message: `${name} must be less than ${maxVal}`,
		};
	} else if (typeof maxVal === 'undefined') {
		assert(typeof minVal !== 'undefined');
		return {
			validator: (val) => val >= minVal,
			message: `${name} must be greater than ${minVal}`,
		};
	} else {
		return {
			validator: (val) => val >= minVal && val <= maxVal,
			message: `${name} must be between ${minVal} and ${maxVal}`,
		};
	}
}

/**
 * Adds validator to check if Number field has allowed number of decimal points
 *
 * Only one of minVal - maxVal can be undefined
 *
 * @param {string} name - name of field to use in error message
 * @param {number} [decimals=0] - number of decimals (0 if integer)
 * @returns {{ validator: (val: number) => bool; message: string }}
 *
 * @example
 *
 * 	cost: { type: Number, validate: precision('Cost', 2) }
 */
function precision(
	name: string,
	decimals: number = 0,
): validator<number> {
	if (decimals === 0) {
		return {
			validator: (val: number) =>
				!val.toString().includes('.'),
			message: `${name} must be integer`,
		};
	} else {return {
			validator: (val: number) => {
				const str = val.toString();
				return (!str.includes('.')) ||
					(str.split('.')[1].length <= decimals);
			},
			message: `${name} cannot have more than ${decimals} decimals`,
		};}
}

function idtype<T>(model: Model<T>): typeof SchemaType {
	const obj = model.schema.paths['_id'];
	if (obj instanceof Schema.Types.String) {
		return Schema.Types.String;
	} else {
		return Schema.Types.ObjectId;
	}
}

export { idtype, precision, range, require, trim, unique };
