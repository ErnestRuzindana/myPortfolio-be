import Joi from "@hapi/joi";

const blogValidationSchema = Joi.object({
    title: Joi.string(),
    postBody: Joi.string(),
    postImage: Joi.string(),
    headerImage: Joi.string(),
    authorName: Joi.string(),
    authorImage: Joi.string(),
    dateCreated: Joi.string(),

    commentBody: Joi.string(),
    commentorName: Joi.string(),
    commentorImage: Joi.string(),
    dateCommented: Joi.string(),

    replyBody: Joi.string(),
    replierName: Joi.string(),
    replierImage: Joi.string(),
    dateReplied: Joi.string()

})


export default blogValidationSchema