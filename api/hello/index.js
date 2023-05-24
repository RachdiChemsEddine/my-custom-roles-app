module.exports = async function (context, req) {
    context.res.status(200).json({ text: "Hello from the API" });
}
