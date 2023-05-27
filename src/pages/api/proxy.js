
import axios from "axios";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(async (req, res, next) => {
  try {
    const response = await axios({
      url: `http://127.0.0.1:12345/${req.url}`,
      method: req.method,
      data: req.body,
      headers: req.headers,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.message);
  }
});

export default handler;
