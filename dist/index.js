/* yocto-express - Manage express setup for an node js app. - V1.0.0 */
"use strict";function Express(a,b){this.DEFAULT_APP_NAME=["app-#",uuid.v4(),"-",df(new Date,"yyyymd")].join(""),this.app=express(),this.logger=b,this.config=a,this.state=!1}var df=require("dateformat"),uuid=require("uuid"),_=require("lodash"),logger=require("yocto-logger"),express=require("express"),compression=require("compression"),fs=require("fs"),path=require("path"),consolidate=require("consolidate"),favicon=require("serve-favicon"),cookieParser=require("cookie-parser"),bodyParser=require("body-parser"),utils=require("yocto-utils"),session=require("express-session"),multipart=require("connect-multiparty"),lusca=require("lusca"),Q=require("q"),MongoStore=require("connect-mongo")(session),prerender=require("prerender-node"),jwt=require("yocto-jwt");Express.prototype.getSettings=function(){return this.app.settings||{}},Express.prototype.getApp=function(){return this.app},Express.prototype.processBase=function(){return this.isReady()?(this.app.set("port",this.config.get("config").port),this.logger.info(["[ Express.processBase ] - Setting port to [",this.app.get("port"),"]"].join(" ")),this.app.set("app_name",_.words(this.config.get("config").app.name.toLowerCase()).join("-")),this.logger.info(["[ Express.processBase ] - Setting app name to [",this.app.get("app_name"),"]"].join(" ")),this.app.set("env",this.config.get("config").env),this.logger.info(["[ Express.processBase ] - Setting env to [",this.app.get("env"),"]"].join(" ")),this.app.set("host",this.config.get("config").host),this.logger.info(["[ Express.processBase ] - Setting host to [",this.app.get("host"),"]"].join(" ")),!0):(this.logger.error("[ Express.processBase ] - Cannot process config. App is not ready."),!1)},Express.prototype.processStackError=function(){if(!this.isReady())return this.logger.error(["[ Express.processStackError ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.get("config").app.stackError||!0;return this.app.set("showStackError",a),this.logger.info(["[ Express.enableStackError ] -",a?"Enabling":"Disabling","showStackError"].join(" ")),!0},Express.prototype.processPrettyHTML=function(){if(!this.isReady())return this.logger.error(["[ Express.processPrettyHTML ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.get("config").express.prettyHTML||!0;return this.app.locals.pretty=a,this.logger.info(["[ Express.processPrettyHTML] -",a?"Enabling":"Disabling","pretty HTML"].join(" ")),!0},Express.prototype.processViewEngine=function(){if(!this.isReady())return this.logger.error(["[ Express.processViewEngine ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.get("config").express.viewEngine||"jade";return this.app.engine(a,consolidate.swig),this.app.set("view engine",a),this.logger.info(["[ Express.processViewEngine ] - Setting view engine to [",this.app.get("view engine"),"]"].join(" ")),!0},Express.prototype.processDirectory=function(){if(!this.isReady())return this.logger.error(["[ Express.processDirectory ] -","Cannot process config. App is not ready."].join("")),!1;var a=this.config.get("config").directory;return _.each(a,function(a){this.useDirectory(_.first(Object.keys(a)))},this),!0},Express.prototype.processFavicon=function(){if(!this.isReady())return this.logger.error(["[ Express.processFavicon ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.ICONS_DIRECTORY;path.isAbsolute(a)||(a=path.normalize([process.cwd(),a].join("/")));var b=[a,"favicon.ico"].join("/");return fs.existsSync(b)?(this.logger.info(["[ Express.useFavicon ] - Adding favicon : ",b].join(" ")),this.app.use(favicon(b,{maxAge:2592e6}))):this.logger.warning(["[ Express.useFavicon ] - Favicon doesn't exist.","Checking path [",b,"] failed"].join(" ")),!0},Express.prototype.processCompression=function(){if(!this.isReady())return this.logger.error(["[ Express.processCompression ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.get("config").express;if(!_.isUndefined(a.filter)){var b=a.filter||{};_.isString(b.rules)&&_.isString(b.by)&&_.isNumber(b.level)&&(this.logger.info(["[ Express.processCompression ] -","Setting up compression rules with filter [",b.rules,"] for [",b.by,"] at level [",_.parseInt(b.level),"]"].join(" ")),this.app.use(compression({filter:function(a,c){if(_.has(a,"headers")&&a.headers["x-no-compression"])return!1;var d=new RegExp(b.rules);return d.test(c.getHeader(b.by))},level:_.parseInt(b.level)})))}return!0},Express.prototype.processJsonCallack=function(){if(!this.isReady())return this.logger.error(["[ Express.processJsonCallack ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.get("config").express.jsonp;return this.logger[a?"info":"warning"](["[ Express.processJsonCallack ] -",a?"Enable":"Disable","JSONP for express"].join(" ")),this.app.enable("jsonp callback",a),!0},Express.prototype.processCookieParser=function(){if(!this.isReady())return this.logger.error(["[ Express.processCookieParser ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.get("config").express.cookieParser;return this.logger[a.enable?"info":"warning"](["[ Express.processCookieParser ] -",a.enable?"Enable":"Disable","cookieParser"].join(" ")),a.enable&&this.app.use(cookieParser(a.secret,a.options)),!0},Express.prototype.processBodyParser=function(){if(!this.isReady())return this.logger.error(["[ Express.processBodyParser ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=["json","urlencoded"];return _.each(a,function(a){var b=this.config.get("config").express[a];this.logger.info(["[ Express.configure.processBodyParser ] - Setting up [",a,"] parser"].join(" ")),this.logger.debug(["[ Express.configure.processBodyParser ] - Used params for [",a,"] config are :",utils.obj.inspect(b)].join(" ")),this.app.use(bodyParser[a](b))},this),!0},Express.prototype.processMethodOverride=function(){if(!this.isReady())return this.logger.error(["[ Express.processMethodOverride ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.get("config").express.methodOverride;return _.each(a,function(a){this.logger.info(["[ Express.processMethodOverride ] - Setting up methodOverride to use [",a,"] header rules"].join(" "))},this),!0},Express.prototype.processSession=function(){if(!this.isReady())return this.logger.error(["[ Express.processSession ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.get("config").express.session;if(a.enable&&a.options.genuuid){var b=function(){return uuid.v4()};delete a.options.genuuid,_.extend(a.options,{genid:b})}a.options.proxy&&(this.logger.info("[ Express.processSession ] - Enable proxy trust for current express app"),this.app.set("trust proxy",1));var c=_.clone(a.options.store);if(delete a.options.store,!_.isUndefined(c)){var d=c.instance||"mongo",e=c.type||"uri";"mongo"===d&&"uri"===e&&_.isString(c.uri)&&!_.isEmpty(c.uri)?_.extend(a.options,{store:new MongoStore({url:c.uri,mongoOptions:c.options||{}})}):this.logger.warning(["[ Express.processSession ] -","Session storage rules given is not an uri type.","Need to implement",e,"process"].join(" "))}return this.logger.info(["[ Express.processSession ] -","Setting up expression session middleware support for current express app"].join(" ")),this.logger.debug(["[ Express.processSession ] -","Config data used for session setting are : ",utils.obj.inspect(a.options)].join(" ")),"development"!==this.app.get("env")&&(a.options.cookie.secure=!0),this.app.use(session(a.options)),!0},Express.prototype.processMultipart=function(){if(!this.isReady())return this.logger.error(["[ Express.processMultipart ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.get("config").express.multipart;return a&&(this.logger.info(["[ Express.processMultipart ] -","Setting up multipart support for current express app"].join(" ")),this.app.use(multipart())),!0},Express.prototype.processSecurity=function(){if(!this.isReady())return this.logger.error(["[ Express.processSecurity ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.get("config").express.security;return _.each(Object.keys(a),function(b){_.isEmpty(b)||(this.logger.info(["[ Express.processSecurity ] - Setting up [",b.toUpperCase(),"] rules for current express app"].join(" ")),this.logger.debug(["[ Express.processSecurity ] - Config data used for",b.toUpperCase(),"setting are : ",utils.obj.inspect(a[b])].join(" ")),this.app.use(lusca[b](a[b])))},this),!0},Express.prototype.processPrerender=function(){if(!this.isReady())return this.logger.error(["[ Express.processPrerender ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.get("config").prerender,b=!1;if(_.isUndefined(a))this.logger.info("[ Express.processPrerender ] - nothing to process prerender is disabled.");else{if(_.has(a,"prerenderToken")&&(prerender.set("prerenderToken",a.prerenderToken),this.logger.debug(["[ Express.processPrerender ] - Add token :",a.prerenderToken,"for prerender service"].join(" ")),b=!0),_.has(a,"prerenderServiceUrl")&&(prerender.set("prerenderServiceUrl",a.prerenderServiceUrl),this.logger.debug(["[ Express.processPrerender ] - Add service url :",a.prerenderServiceUrl,"for prerender service"].join(" ")),b=!0),_.has(a,"blacklisted")&&(prerender.blacklisted(a.blacklisted),this.logger.debug(["[ Express.processPrerender ] - Add blacklist rules :",utils.obj.inspect(a.blacklisted),"for prerender service"].join(" "))),_.has(a,"additionalAgents")&&_.each(a.additionalAgents,function(a){prerender.crawlerUserAgents.push(a)}),!b)return this.logger.warning(["[ Express.processPrerender ] -","Setup failed. token or service url is missing"].join(" ")),!1;prerender.set("beforeRender",function(a,b){var c=utils.getCorrectHost(a);c=c.replace("http://",""),a.headers.host=c,b()}),this.logger.info("[ Express.processPrerender ] - Setting up on express."),this.app.use(prerender)}return!0},Express.prototype.processJwt=function(){if(!this.isReady())return this.logger.error(["[ Express.processJwt ] -","Cannot process config. App is not ready."].join(" ")),!1;var a=this.config.get("config").jwt;return _.isBoolean(a.enable)&&a.enable&&_.isString(a.key)&&!_.isEmpty(a.key)?(this.logger.debug("[ Express.processJwt ] - Try to process jwt key"),jwt.setKey(a.key)&&(this.app.use(jwt.isAuthorized(jwt)),this.logger.info("[ Express.processJwt ] - Check json request autorization enabled."),this.app.use(jwt.autoEncryptRequest(jwt)),this.logger.info("[ Express.processJwt ] - Auto encrypt json response enabled."),this.app.use(jwt.autoDecryptRequest(jwt)),this.logger.info("[ Express.processJwt ] - Auto decrypt json request enabled."))):this.logger.info("[ Express.processJwt ] - Nothing to process. jwt is disabled."),!0},Express.prototype.isReady=function(){return this.state&&this.config.state},Express.prototype.configure=function(){var a=this,b=Q.defer();return this.logger.banner("[ Express.configure ] - Initializing Express ..."),this.config.load().then(function(c){a.state=_.isObject(c)&&!_.isEmpty(c);try{if(!a.processBase())throw"Express base initialisation failed.";if(!a.processStackError())throw"Stack error setup failed.";if(!a.processPrettyHTML())throw"Pretty HTTML setup failed.";if(!a.processViewEngine())throw"View engine setup failed.";if(!a.processDirectory())throw"Directory setup failed.";if(!a.processFavicon())throw"Favicon setup failed.";if(!a.processCompression())throw"Compression setup failed.";if(!a.processJsonCallack())throw"JsonCallback setup failed.";if(!a.processCookieParser())throw"CookieParser setup failed.";if(!a.processBodyParser())throw"BodyParser setup failed.";if(!a.processMethodOverride())throw"MethodOverride setup failed.";if(!a.processSession())throw"Session setup failed.";if(!a.processMultipart())throw"Multipart setup failed.";if(a.logger.banner(["[ Express.configure ] - Initializing Express","> Processing security rules ..."].join(" ")),!a.processSecurity())throw"Security setup failed.";if(a.logger.banner(["[ Express.configure ] - Initializing Express","> Setting up Seo renderer system ..."].join(" ")),!a.processPrerender())throw"Prerender setup failed.";if(a.logger.banner(["[ Express.configure ] - Initializing Express","> Setting up Jwt crypt/decrypt ..."].join(" ")),!a.processJwt())throw"Jwt setup failed.";a.logger.banner("[ Express.configure ] - Setting up Router for current express app"),a.app.use(express.Router()),a.logger.info("[ Express.configure ] - Express is ready to use ...."),b.resolve(a.app)}catch(d){a.logger.error(["[ Express.configure ] -","An Error occured during express initialization.","Error is :",d,"Operation aborted !"].join(" ")),b.reject(d)}})["catch"](function(c){a.logger.error("Invalid config given. Please check your config files"),b.reject(c)}),b.promise},Express.prototype.useDirectory=function(a,b){if(_.isString(a)&&!_.isEmpty(a)){if(b=_.isString(b)&&!_.isEmpty(b)?b:this.config[[a,"DIRECTORY"].join("_").toUpperCase()]||a,path.isAbsolute(b)||(b=path.normalize([process.cwd(),b].join("/"))),fs.existsSync(b))return this.logger.info(["[ Express.useDirectory ] - Adding directory",b,"on express app"].join(" ")),"views"!==a?this.app.use(express["static"](b)):this.app.set(a,b),!0;this.logger.warning(["[ Express.useDirectory ] - Cannot add directory",a,"on express app. Directory [",b,"] does not exist"].join(" "))}return!1},Express.prototype.removeMiddleware=function(a){var b=!1,c=_.findIndex(this.app._router.stack,"name",a);return c>=0&&(this.app._router.stack.splice(c,1),b=!0),this.logger[b?"info":"warning"](["[ Express.removeMiddleware ] -","removing middleware",a,b?"success":"failed. Middleware does not exist"].join(" ")),b},Express.prototype.set=function(a,b){return _.isUndefined(a)||!_.isString(a)||_.isEmpty(a)?this.logger.warning(["[ Express.set ] - Invalid value given.","name must be a string and not empty. Operation aborted !"].join(" ")):this[a]=b,this},module.exports=function(a,b){return(_.isUndefined(b)||_.isNull(b))&&(logger.warning("[ Express.constructor ] - Invalid logger given. Use internal logger"),b=logger),(_.isUndefined(a)||_.isNull(a))&&(logger.warning("[ Express.constructor ] - Invalid config given. Use internal config"),a=require("yocto-config")(b),a.enableExpress()),new Express(a,b)};