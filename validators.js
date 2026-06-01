const {z} = require('zod');
const Organization = require('./models/Organization');
const ObjectIdSchema = z.string().regex(/^[a-f0-9]{24}$/, "Invalid ObjectID");

const BoardSchema = z.object({
    title: z.string().min(1),
    organization: ObjectIdSchema
});
//signup schema
const signupSchema = z.object({
    username: z.string().min(1, "too short username").trim(),
    password: z.string().min(8, "password too short")
});

//login schema
const loginSchema = z.object({
    username: z.string().min(1, "Too short username"),
    password: z.string().min(8, "password too short")
});

//createorgSchema
const createorgSchema = z.object({
    title: z.string().min(1, "Title is Missing"),
    description: z.string().min(1, "description is missing")
})

//addMemberSchema
const addMemberSchema = z.object({
    organizationId: ObjectIdSchema,
    memberUserName: z.string().min(1,"too short Username").trim()
});

//addBoardSchema
const addBoardSchema = z.object({
    title: z.string().min(1, "Title is Missing"),
    organizationId: ObjectIdSchema
});

//addIssueSchema
const addIssueSchema = z.object({
    title: z.string().min(1, "Title is Missing"),
    description: z.string().optional(),
    boardId: ObjectIdSchema
});

// Middleware using safeParse
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      return res.status(400).json({
        err: "Validation failed",
        issues: result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    req[property] = result.data;
    next();
  };
};

module.exports = {
    signupSchema,
    loginSchema,
    createorgSchema,
    addMemberSchema,
    addBoardSchema,
    addIssueSchema,
    validateRequest
};