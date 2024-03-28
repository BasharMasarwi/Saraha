const dataMethods = ["body", "params", "query"];
const validation = (schema) => {
    return (req, res, next) => {
        const validationArray = [];
        dataMethods.forEach((method) => {
            if (schema[method]) {
                const validationResult = schema[method].validate(req[method], {
                    abortEarly: false,
                });
                if (validationResult.error) {
                    validationArray.push(validationResult.error.details);
                }
            }
        });
        if (validationArray.length > 0) {
            return res.status(400).json({
                message: "validation error",
                errors: validationArray,
            });
        }
        next();
    };
};
export default validation;
