import Joi from "@hapi/joi";

const projectsValidationSchema = Joi.object({
    
    projectTitle: Joi.string().required().messages({
        "string.empty": "The title field can not be empty"
    }),

    projectImage: Joi.string(),

    projectLink: Joi.string().required().regex(/^https?:\/\//).messages({
        "string.pattern.base": "Invalid project URL",
        "string.empty": "The project link is required"
    })

})


export default projectsValidationSchema