import { ConfigSchema } from "../schema";
import { ConfigValidation } from "../validation";

export const ConfigFactory = () => {
	const { error, value } = ConfigValidation.validate(process.env);

	if (error) throw new Error(error.message);

	return ConfigSchema(value);
};
