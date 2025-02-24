const {SchemaTypes, SchemaTypeOptions, version} = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const schema = require('./schema');

const options = {
    definition: {
        openapi: '3.0.3',
        info:{
            title: "Swagger API Docxx - OpenAPI 3.0",
            description: "This is a sample API for city & cars list in Karnataka",
            contact:{
                name: "Nitish Mathapati",
                email: "ntshmathapati2003@gmail.com"
            },
            version: '24.2.22'
        },
        externalDocs:{
            url: "https://editor.swagger.io/",
            description: "Find out more about SwaggerEditor"
        },
        servers:[
            {
            url:"http://localhost:4000"
            },
            {
            url:"http://localhost:3000" 
            }
        ],
        tags:[
            {
                name: "Cities",
                description: "Everything about cities",
                externalDocs: {
                    description: "City",
                    url: "https://www.bankbazaar.com/pin-code/karnataka.html"
                }
            },
            {
                name: "Cars",
                description: "Everything about cars",
                externalDocs: {
                    description: "Cars",
                    url: "https://www.netcarshow.com/"
                }
            }
        ],
        paths:{
            '/city':{
                get:{
                    tags:[
                        "Cities"
                    ],
                    summary: "Welcome",
                    description: "A simple greeting message from the server",
                    responses:{
                        '200': {
                            description: "Successful Response",
                            content: {
                                'application/json':{
                                    schema:{
                                        type:'string',
                                        // example: "Hey hi..! welcome to my server"
                                    }
                                }
                            }
                        },
                        '400':{
                            content:{
                                'application/json':{
                                    schema:{
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                },
            },
            '/city/addcity':{
                post:{
                    tags:[
                        "Cities"
                    ],
                    summary: "Add city",
                    description: "Add a new city to the database",
                    operationId: "addcity",
                    requestBody:{
                        description: "Add a new city to the database through swaggerAPI",
                        content:{
                            'application/json':{
                                schema:{
                                    $ref: "#/components/schemas/cities"
                                }
                            }
                        },
                        required:true
                    },
                    responses:{
                        '200':{
                            description: "Successfully added to database",
                            content:{
                                'applicaiton/json':{
                                    schema:{
                                        $ref: "#/components/schemas/cities"
                                    }
                                }
                            }
                        },
                        '400':{
                            description: "Oopss..! Something went wrong"
                        },
                        security:{
                            Swagger_auth:[
                                'read:cities',
                                'write.cities'
                            ]
                        }
                    }
                }
            },
            '/city/getcity':{
                get:{
                    tags:[
                        "Cities"
                    ],
                    summary: "read city",
                    description: "read the city from the database",
                    operationId: "readcity",
                    responses: {
                        '200':{
                            description: "List of all cities",
                            content: {
                                'application/json':{
                                    schema:{
                                        type: "object",
                                        properties: {
                                            data: {
                                                type: 'array',
                                                items: {
                                                    $ref: "#/components/schemas/cities"
                                                }
                                            },
                                            message: {
                                                type: 'string',
                                                example: "All city details"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400':{
                            description: "Internal server error"
                        }
                    }
                }
            },
            '/city/getcitybyname/{city_name}':{
                get:{
                    tags:[
                        "Cities"
                    ],
                    summary: "Find city by name",
                    description: "Returns a single city",
                    operationId: "getCityByName",
                    parameters:[{
                        name: "city_name",
                        in: "path",
                        description: "Name of city to return",
                        required:true,
                        schema:{
                            $ref :"#/components/schemas/cities/properties/city_name"
                        }
                    }],
                    responses:{
                        '200':{
                            description: "Successful Operation",
                            content: {
                                'application/json':{
                                    schema:{
                                        $ref: "#/components/schemas/cities"
                                    }
                                }
                            }
                        },
                        '400':{
                            description: "City not found"
                        }
                    },
                    security:[
                        {
                            api_key:[]
                        },
                        {
                            Swagger_auth:[
                                'write:cities',
                                'read:cities'
                            ]
                        }
                    ]
                }
            },
            '/city/updatecitybyname/{city_name}':{
                put:{
                    tags:["Cities"],
                    summary: "Update by city",
                    description: "Updates the details of present city",
                    parameters: [{
                        name: "city_name",
                        in: "path",
                        description: "Update the city and pincode to update",
                        required:true,
                        schema:{
                            $ref: "#/components/schemas/cities/properties/city_name"
                        }
                    }],
                    requestBody:{
                        description: "Add a new city to the database through swaggerAPI",
                        content:{
                            'application/json':{
                                schema:{
                                    $ref: "#/components/schemas/cities"
                                }
                            }
                        },
                        required:true
                    },
                    responses:{
                        '200':{
                            description: "Successful Operation",
                            content: {
                                'application/json':{
                                    schema:{
                                        $ref: "#/components/schemas/cities"
                                    }
                                }
                            }
                        },
                        '400':{
                            description: "City not found"
                        }
                    }
                }
            },
            '/city/deletebyname/{city_name}':{
                delete:{
                    tags:["Cities"],
                    summary: "Delete City",
                    description: "Delete the city by its name",
                    parameters: [{
                        name: "city_name",
                        in: "path",
                        description: "Update the city and pincode to update",
                        required:true,
                        schema:{
                            $ref: "#/components/schemas/cities/properties/city_name"
                        }
                    }],
                    responses:{
                        '200':{
                            description: "Successful Operation",
                            content: {
                                'application/json':{
                                    schema:{
                                        $ref: "#/components/schemas/cities"
                                    }
                                }
                            }
                        },
                        '400':{
                            description: "City not found"
                        }
                    }
                }
            }
        },
        components:{
            schemas: {
                cities:{                   // Schema 1
                    required:[
                        "city_name",
                        "pincode"
                    ],
                    type: "object",             
                    properties:{
                        city_name:{
                            type:'string',
                            example:"Kalaburgi"
                        },
                        state:{
                            type:'string',
                            example:"Karnataka"
                        },
                        pincode:{
                            type:'number',
                            example:585105
                        }
                    }
                },
                cars:{                    // Schema 2
                    required:[
                        "category",
                        "company",
                    ],
                    type: "object",
                    properties:{
                        company:{
                            type:'string',
                            example:"Koenigsegg"
                        },
                        category:{
                            type:'string',
                            example:"Sedan"
                        },
                        model:{
                            type:'string',
                            example:"Koenigsegg CC850"
                        },
                        fuel_type:{
                            type:'string',
                            example:"Hybrid"
                        }
                    },
                }
            },
            requetBodies:{
                cities:{
                    description:"City object that needs to be added to the server",
                    content:{
                        'application/json':{
                            schema:{
                                $ref: '#/components/schemas/cities'
                            }
                        }
                    }
                },
                cars:{
                    description:"Car object that needs to be added to the server",
                    content:{
                        'application/json':{
                            schema:{
                                $ref: '#/components/schemas/cars'
                            }
                        }
                    }
                }
            },
            securitySchemes:{
                Swagger_auth:{
                    type:'oauth2',
                    flows:{
                        implicit:{
                            authorizationUrl: "http://localhost:4000/oauth/authorize",
                            tokenUrl: 'http://localhost:4000/oauth/token',
                            scopes:{
                                'read:cities': "Read city information",
                                'write:cities': "Modify city information"
                            }
                        }
                    }
                },
                api_key: {
                    type: "apiKey",             // apiKey: case sensitive (K should be uppercase)
                    name: "api_key",
                    in: "header"
                }
            }
        }
    },
    apis:['./index.js'], //Path to the file where APIs are defined
};

const swaggerDocs = swaggerJsDoc(options);
module.exports = {swaggerDocs};