const db = require("./db");
const {
    GetitemCommand
} = require("@aws-sdk/clinet-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util/dynamodb");

const getPost = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ postId: event.pathParameters.postId }),
        };
        const { Item } = await db.send(new GetitemCommand(params));

        console.log({ Item });
        response.body = JSON.stringify({
            msg: "success",
            data: (Item) ? unmarshall(Item) : {},
            rawData: Item,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            msg: "failed",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};

module.exports = {
    getPost
}