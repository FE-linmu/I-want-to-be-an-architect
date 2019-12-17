{ 
    "./src/index.js": { 
        "yilai": {
             "./a.js": "./src/a.js", 
             "./b.js": "./src/b.js" 
            }, 
        "code": "\"use strict\";\n\nvar _a = _interopRequireDefault(require(\"./a.js\"));\n\nvar _b = _interopRequireDefault(require(\"./b.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log(_a[\"default\"] + _b[\"default\"]);" }, 
    "./src/a.js": {
         "yilai": { }, 
         "code": "\"use strict\";\n\nvar a = 10;\nmodule.exports = a;" }, 
    "./src/b.js": { 
        "yilai": { }, 
        "code": "\"use strict\";\n\nvar b = 10;\nmodule.exports = b;" 
    }
 }