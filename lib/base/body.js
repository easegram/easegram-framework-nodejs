"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const co_body_1 = __importDefault(require("co-body"));
const multer_1 = __importDefault(require("multer"));
const formidable_1 = __importDefault(require("formidable"));
const symbolUnparsed = Symbol.for("unparsedBody");
function default_1(opts) {
    opts = opts || {};
    opts.onError = "onError" in opts ? opts.onError : false;
    opts.patchNode = "patchNode" in opts ? opts.patchNode : false;
    opts.patchKoa = "patchKoa" in opts ? opts.patchKoa : true;
    opts.multipart = "multipart" in opts ? opts.multipart : false;
    opts.urlencoded = "urlencoded" in opts ? opts.urlencoded : true;
    opts.json = "json" in opts ? opts.json : true;
    opts.text = "text" in opts ? opts.text : true;
    opts.encoding = "encoding" in opts ? opts.encoding : "utf-8";
    opts.jsonLimit = "jsonLimit" in opts ? opts.jsonLimit : "1mb";
    opts.jsonStrict = "jsonStrict" in opts ? opts.jsonStrict : true;
    opts.formLimit = "formLimit" in opts ? opts.formLimit : "56kb";
    opts.queryString = "queryString" in opts ? opts.queryString : null;
    opts.multer = "multer" in opts ? opts.multer : {};
    opts.formidable = 'formidable' in opts ? opts.formidable : { multiples: true };
    opts.uploadMiddleware = 'uploadMiddleware' in opts ? opts.uploadMiddleware : 'multer';
    opts.includeUnparsed =
        "includeUnparsed" in opts ? opts.includeUnparsed : false;
    opts.textLimit = "textLimit" in opts ? opts.textLimit : "56kb";
    opts.parsedMethods =
        "parsedMethods" in opts ? opts.parsedMethods : ["POST", "PUT", "PATCH"];
    return function (ctx, next) {
        let bodyPromise = getBodyPromise(ctx, opts);
        bodyPromise = bodyPromise || Promise.resolve({});
        return bodyPromise
            .catch(function (err) {
            if (typeof opts.err === "function") {
                opts.onError(err, ctx);
            }
            else {
                throw err;
            }
            return next();
        })
            .then(function (body) {
            let patch = function (req, body) {
                if (opts.multipart && ctx.is("multipart")) {
                    req.body = body.fields;
                    req.files = body.files;
                }
                else if (opts.includeUnparsed) {
                    req.body = body.parsed || {};
                    if (!ctx.is("text")) {
                        req.body[symbolUnparsed] = body.raw;
                    }
                }
                else {
                    req.body = body;
                }
            };
            if (opts.patchNode) {
                patch(ctx.req, body);
            }
            if (opts.patchKoa) {
                patch(ctx.request, body);
            }
            return next();
        });
    };
}
exports.default = default_1;
const getBodyPromise = function (ctx, opts) {
    if (opts.parsedMethods.indexOf(ctx.method.toUpperCase()) < 0) {
        return null;
    }
    if (opts.json && ctx.is("json")) {
        return co_body_1.default.json(ctx, {
            encoding: opts.encoding,
            limit: opts.jsonLimit,
            strict: opts.jsonStrict,
            returnRawBody: opts.includeUnparsed,
        });
    }
    else if (opts.urlencoded && ctx.is("urlencoded")) {
        return co_body_1.default.form(ctx, {
            encoding: opts.encoding,
            limit: opts.formLimit,
            queryString: opts.queryString,
            returnRawBody: opts.includeUnparsed,
        });
    }
    else if (opts.text && ctx.is("text")) {
        return co_body_1.default.text(ctx, {
            encoding: opts.encoding,
            limit: opts.textLimit,
            returnRawBody: opts.includeUnparsed,
        });
    }
    else if (opts.multipart && ctx.is("multipart")) {
        return createMultipartPromise(ctx, opts);
    }
    else {
        return co_body_1.default.text(ctx, {
            encoding: opts.encoding,
            limit: opts.textLimit,
            returnRawBody: opts.includeUnparsed,
        });
    }
};
const createMultipartPromise = function (ctx, opts) {
    const req = ctx.req;
    const res = ctx.res;
    req.params = ctx.params;
    return new Promise(function (resolve, reject) {
        if (opts.uploadMiddleware === 'multer') {
            const upload = (0, multer_1.default)({
                limits: opts.multer.limits,
                fileFilter: opts.multer.filter,
                storage: multer_1.default.diskStorage({
                    destination: opts.multer.destination,
                    filename: opts.multer.filename,
                }),
            });
            const middleware = opts.ignoreFiles ? upload.fields() : upload.any();
            middleware(req, res, function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve({
                    fields: req.body,
                    files: req.files,
                });
            });
        }
        if (opts.uploadMiddleware === 'formidable') {
            /**
             * encoding {string} - default 'utf-8';
             * uploadDir {string} - default os.tmpdir();
             * keepExtensions {boolean} - default false;
             * maxFileSize {number} - default 200 * 1024 * 1024 (200mb);
             * maxFields {number} - default 1000;
             * maxFieldsSize {number} - default 20 * 1024 * 1024 (20mb);
             * hash {boolean} - default false;
             * multiples {boolean} - default false;
             */
            const form = (0, formidable_1.default)(opts.formidable);
            form.parse(req, (err, fields, files) => {
                if (err) {
                    return reject(err);
                }
                return resolve({
                    fields,
                    files,
                });
            });
        }
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL2JvZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7OztBQUViLHNEQUE2QjtBQUM3QixvREFBNEI7QUFDNUIsNERBQW9DO0FBQ3BDLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFbEQsbUJBQXlCLElBQVU7SUFDakMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7SUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDOUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDMUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDOUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDaEUsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDOUMsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDOUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDN0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDOUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDaEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDL0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxhQUFhLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDbkUsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUMvRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsa0JBQWtCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUN0RixJQUFJLENBQUMsZUFBZTtRQUNsQixpQkFBaUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElB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