import swaggerAutogen from "swagger-autogen";

const outputFile = "./swaggerDocs.json";
const endpointsFiles = ["./routes/router.ts"];

swaggerAutogen(outputFile, endpointsFiles);